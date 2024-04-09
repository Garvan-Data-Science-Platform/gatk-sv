#!/bin/python

import argparse
import gzip
import logging
import sys

from collections import defaultdict
from typing import List, Text, Optional

import pysam

RESET_RD_GQ_VALUE = 99
RESET_GQ_VALUE = 99

_gt_set_hom_ref_map = dict()
_gt_set_het_map = dict()
_gt_set_hom_var_map = dict()


def _cache_gt_set_hom_ref(gt):
    s = _gt_set_hom_ref_map.get(gt, None)
    if s is None:
        s = tuple(0 for _ in gt)
        _gt_set_hom_ref_map[gt] = s
    return s


def _cache_gt_set_het(gt):
    s = _gt_set_het_map.get(gt, None)
    if s is None:
        s = list(0 for _ in gt)
        if len(s) > 0:
            s[-1] = 1
        _gt_set_het_map[gt] = s
    return s


def _cache_gt_set_hom_var(gt):
    s = _gt_set_hom_var_map.get(gt, None)
    if s is None:
        s = tuple(1 for _ in gt)
        _gt_set_hom_var_map[gt] = s
    return s


def read_gzip_text_mode(path):
    return gzip.open(path, mode="rt")


def read_tsv(path):
    if path is None:
        return dict()
    open_func = read_gzip_text_mode if path.endswith(".gz") else open
    with open_func(path) as f:
        data_sets = defaultdict(set)
        for line in f:
            tokens = line.strip().split("\t")
            if len(tokens) != 4:
                raise ValueError(f"Encountered record without 4 columns: {tokens}")
            vid = tokens[1]
            sample = tokens[2]
            genotype = int(tokens[3])
            data_sets[vid].add((sample, genotype))
        return {key: list(val) for key, val in data_sets.items()}


def get_expected_cn(chrom, sample, ploidy_table_dict, is_par=False):
    if is_par:
        return 2
    else:
        if sample not in ploidy_table_dict:
            raise ValueError(f"Sample {sample} not defined in ploidy table")
        if chrom not in ploidy_table_dict[sample]:
            raise ValueError(f"Contig {chrom} not defined in ploidy table")
        return ploidy_table_dict[sample][chrom]


def reset_format_fields(gt, sample, chrom, ploidy_table_dict, n_alt_alleles=None):
    # Note we do not take PAR into account here to match the rest of the pipeline
    ecn = get_expected_cn(chrom=chrom, sample=sample, ploidy_table_dict=ploidy_table_dict)
    # Add in case it's not there
    gt["ECN"] = ecn
    if ecn == 0:
        # Should already be empty
        return
    gt["GQ"] = RESET_GQ_VALUE
    gt["RD_CN"] = ecn
    gt["RD_GQ"] = RESET_RD_GQ_VALUE
    if n_alt_alleles is None:
        return
    elif any(a is None for a in gt["GT"]):
        raise ValueError(f"Attempted to reset a no-call genotype")
    if n_alt_alleles == 0:
        gt["GT"] = _cache_gt_set_hom_ref(gt["GT"])
    elif n_alt_alleles == 1:
        gt["GT"] = _cache_gt_set_het(gt["GT"])
    elif n_alt_alleles == 2:
        gt["GT"] = _cache_gt_set_hom_var(gt["GT"])
    else:
        raise ValueError("Unsupported genotype code " + n_alt_alleles + ", must be in {0, 1, 2}")


def set_genotypes(in_path, out_path, genotype_data, reset_all_format_fields, ploidy_table_dict):
    with pysam.VariantFile(in_path) as fin:
        # Propagate header and add ECN in case it doesn't exist
        header = fin.header
        header.add_line('##FORMAT=<ID=ECN,Number=1,Type=Integer,Description="Expected copy number for ref genotype">')
        with pysam.VariantFile(out_path, mode="w", header=header) as fout:
            current_chrom = None
            for record in fin:
                if record.chrom != current_chrom:
                    current_chrom = record.chrom
                    logging.info(f"  {record.chrom}")
                if record.id in genotype_data:
                    svtype = record.info.get("SVTYPE", "None")
                    if svtype != "DEL" and svtype != "DUP":
                        raise ValueError(f"Record {record.id} has SVTYPE {svtype} but must be DEL or DUP")
                    for sample, n_alt_alleles in genotype_data[record.id]:
                        if sample not in record.samples:
                            raise ValueError(f"Sample {sample} not found in the vcf")
                        gt = record.samples[sample]
                        reset_format_fields(gt=gt, sample=sample, chrom=record.chrom,
                                            ploidy_table_dict=ploidy_table_dict, n_alt_alleles=n_alt_alleles)
                elif reset_all_format_fields:
                    for sample, gt in record.samples.items():
                        reset_format_fields(gt=gt, sample=sample, chrom=record.chrom,
                                            ploidy_table_dict=ploidy_table_dict)
                fout.write(record)


def read_ploidy_table(path):
    ploidy_dict = dict()
    with open(path, 'r') as f:
        header = f.readline().strip().split('\t')
        for line in f:
            tokens = line.strip().split('\t')
            sample = tokens[0]
            ploidy_dict[sample] = {header[i]: int(tokens[i]) for i in range(1, len(header))}
    return ploidy_dict


def _parse_arguments(argv: List[Text]) -> argparse.Namespace:
    # noinspection PyTypeChecker
    parser = argparse.ArgumentParser(
        description="Resets DEL/DUP genotypes to homozygous-reference",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('--vcf', type=str, required=True, help='Input vcf')
    parser.add_argument('--genotype-tsv', type=str, required=False,
                        help='If provided, genotypes to reset. Headerless, with chrom, variant, and sample ID columns '
                             '(.tsv or .tsv.gz)')
    parser.add_argument('--reset-format-fields', required=False, action='store_true',
                        help='Reset GQ and all RD format fields to ref in all variants (unless in genotype-tsv)')
    parser.add_argument('--out', type=str, required=True, help='Output vcf')
    parser.add_argument('--ploidy-table', type=str, required=True, help='Sample ploidy table')
    if len(argv) <= 1:
        parser.parse_args(["--help"])
        sys.exit(0)
    parsed_arguments = parser.parse_args(argv[1:])
    return parsed_arguments


def main(argv: Optional[List[Text]] = None):
    if argv is None:
        argv = sys.argv
    args = _parse_arguments(argv)
    logging.basicConfig(format='%(asctime)s - %(message)s', level=logging.INFO)

    logging.info("Reading bed file...")
    genotype_data = read_tsv(args.genotype_tsv)

    logging.info("Reading ploidy table file...")
    ploidy_table_dict = read_ploidy_table(args.ploidy_table)

    logging.info("Processing vcf...")
    set_genotypes(in_path=args.vcf, out_path=args.out, genotype_data=genotype_data,
                  reset_all_format_fields=args.reset_format_fields, ploidy_table_dict=ploidy_table_dict)
    pysam.tabix_index(args.out, preset="vcf", force=True)


if __name__ == "__main__":
    main()
