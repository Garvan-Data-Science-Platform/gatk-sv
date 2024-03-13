#!/bin/python

import argparse
import sys
import logging
from collections import defaultdict
from typing import List, Text, Optional
from itertools import groupby
from operator import attrgetter
from collections.abc import Iterable

from intervaltree import IntervalTree
import pysam

SEX_MALE = "M"
SEX_FEMALE = "F"
SEX_UNKNOWN = "U"

# Delimiter suffix appended to the end of interval IDs before the index, e.g. "intervalA__0", "intervalA__1", ...
INDEX_DELIMITER = "__"

RESET_PESR_FORMATS_DICT = {
    "SR_GT": 0,
    "SR_GQ": 99,
    "PE_GT": 0,
    "PE_GQ": 99
}

RESET_RD_GQ_VALUE = 99

_gt_sum_map = dict()
_gt_set_hom_ref_map = dict()


def _cache_gt_sum(gt):
    if gt is None:
        return 0
    s = _gt_sum_map.get(gt, None)
    if s is None:
        s = sum([1 for a in gt if a is not None and a > 0])
        _gt_sum_map[gt] = s
    return s


def _cache_gt_set_hom_ref(gt):
    s = _gt_set_hom_ref_map.get(gt, None)
    if s is None:
        s = tuple(0 for _ in gt)
        _gt_set_hom_ref_map[gt] = s
    return s


# Creates dictionary of trees[sv_type][contig] from bed file
def create_trees_from_bed_records_by_type(bed_path):
    trees = defaultdict(dict)
    variant_types = ["DEL", "DUP"]
    for svtype in variant_types:
        trees[svtype] = defaultdict(IntervalTree)
    del_ids = set()
    dup_ids = set()
    with open(bed_path) as f:
        for line in f:
            record = line.strip().split('\t')
            contig = record[0]
            start = int(record[1])
            stop = int(record[2])
            name = record[3]
            svtype = record[4]
            if svtype not in trees:
                raise ValueError("Unexpected SVTYPE in bed file: %s" % type)
            if svtype == "DEL":
                del_ids.add(name)
            elif svtype == "DUP":
                dup_ids.add(name)
            trees[svtype][contig].addi(start, stop, name)
    return trees, del_ids, dup_ids


def create_trees_from_bed_records(bed_path):
    trees = defaultdict(IntervalTree)
    with open(bed_path) as f:
        for line in f:
            record = line.strip().split('\t')
            contig = record[0]
            start = int(record[1])
            stop = int(record[2])
            trees[contig].addi(start, stop)
    return trees


def overlap_size(interval_a, interval_b):
    return max(0, min(interval_a[1], interval_b[1]) - max(interval_a[0], interval_b[0]))


class GDRMatch:

    def __init__(self, name, chrom, pos, end, sample, overlapping_region_intervals, valid_region_intervals,
                 supporting_intervals, region, n_region_subdivisions):
        self.name = name
        self.chrom = chrom
        self.pos = pos
        self.end = end
        self.sample = sample
        self.overlapping_region_intervals = overlapping_region_intervals
        self.valid_region_intervals = valid_region_intervals
        self.supporting_intervals = supporting_intervals
        self.region = region
        self.n_region_subdivisions = n_region_subdivisions

    def __repr__(self):
        return self.__str__()

    def __str__(self):
        return "(" + ", ".join(str(x) for x in [self.name, self.chrom, self.pos, self.end, self.sample, self.region,
                                                len(self.supporting_intervals), len(self.valid_region_intervals),
                                                len(self.overlapping_region_intervals),
                                                self.n_region_subdivisions]) + ")"


def get_base_name_and_index(interval_id):
    tokens = interval_id.split(INDEX_DELIMITER)
    if len(tokens) != 2:
        raise ValueError(f"Expected to find \"{INDEX_DELIMITER}\" in interval name: {interval_id}")
    return tokens[0], int(tokens[1])


def get_overlapping_samples_vcf(vcf_path, intervals, medians, median_vids, cutoff, vcf_min_size, min_rdtest_support,
                                min_region_overlap):

    interval_subdivision_counts = dict()
    unique_subdivision_names = set()
    for svtype in intervals:
        for chrom in intervals[svtype]:
            for interval in intervals[svtype][chrom]:
                if interval.data in unique_subdivision_names:
                    raise ValueError(f"Encountered duplicate interval id: {interval.data}")
                unique_subdivision_names.add(interval.data)
                name, _ = get_base_name_and_index(interval.data)
                if name not in interval_subdivision_counts:
                    interval_subdivision_counts[name] = 0
                interval_subdivision_counts[name] += 1

    vcf_overlappers = dict()
    vcf_vids = set()
    with pysam.VariantFile(vcf_path) as vcf:
        for record in vcf:
            chrom = record.chrom
            pos = record.pos
            stop = record.stop
            name = record.id
            if name in vcf_vids:
                raise ValueError(f"All variant ids in the input vcf must be unique; encountered duplicate: {name}")
            vcf_vids.add(name)
            svtype = record.info.get("SVTYPE", "")
            if svtype not in intervals.keys():
                continue
            if record.info.get("SVLEN", 0) < vcf_min_size:
                continue
            if record.chrom not in intervals[svtype]:
                continue
            carriers = [s for s in record.samples if _cache_gt_sum(record.samples[s]["GT"]) > 0]
            intersect = intervals[svtype][chrom].overlap(pos, stop)
            valid_intersect = [interval for interval in intersect
                               if overlap_size((pos, stop), interval) / (interval[1] - interval[0]) >= cutoff]
            if len(valid_intersect) == 0:
                continue
            distinct_regions = set()
            for interval in valid_intersect:
                base_name, _ = get_base_name_and_index(interval.data)
                distinct_regions.add(base_name)
            for region in distinct_regions:
                overlapping_region_intervals = [interval for interval in intersect
                                    if get_base_name_and_index(interval.data)[0] == region]
                valid_region_intersect = [interval for interval in valid_intersect
                                          if get_base_name_and_index(interval.data)[0] == region]
                num_region_subdivisions = interval_subdivision_counts[region]
                # Require sufficient fraction of subdivisions in the region to overlap
                if len(valid_region_intersect) / num_region_subdivisions < min_region_overlap:
                    continue
                for sample in carriers:
                    supported_intersect = list()
                    for interval in valid_region_intersect:
                        interval_name = interval.data
                        if interval_name not in median_vids:
                            raise ValueError(f"Interval {interval_name} not found in median_geno file")
                        if sample in medians and interval_name in medians[sample]:
                            supported_intersect.append(interval)
                    frac_intervals_with_rdtest_support = len(supported_intersect) / len(valid_region_intersect)
                    # Load FPs only
                    if frac_intervals_with_rdtest_support < min_rdtest_support:
                        if svtype not in vcf_overlappers:
                            vcf_overlappers[svtype] = dict()
                        if sample not in vcf_overlappers[svtype]:
                            vcf_overlappers[svtype][sample] = dict()
                        if name not in vcf_overlappers[svtype][sample]:
                            vcf_overlappers[svtype][sample][name] = list()
                        vcf_overlappers[svtype][sample][name].append(
                            GDRMatch(name=name, chrom=chrom, pos=pos, end=stop, sample=sample,
                                     overlapping_region_intervals=overlapping_region_intervals,
                                     valid_region_intervals=valid_region_intersect,
                                     supporting_intervals=supported_intersect,
                                     region=region,
                                     n_region_subdivisions=num_region_subdivisions)
                        )
    return vcf_overlappers


def read_ped_file(path):
    with open(path) as f:
        data = dict()
        for line in f:
            record = line.strip().split('\t')
            sample = record[1]
            x_ploidy = record[4]
            if x_ploidy == "1":
                data[sample] = SEX_MALE
            elif x_ploidy == "2":
                data[sample] = SEX_FEMALE
            else:
                data[sample] = SEX_UNKNOWN
    return data


def is_in_par_region(chrom, pos, stop, par_trees, cutoff):
    length = stop - pos
    if chrom in par_trees:
        par_overlaps = par_trees[chrom].overlap(pos, stop)
        for overlap in par_overlaps:
            if overlap_size(overlap, (pos, stop)) / length >= cutoff:
                return True
    return False


def get_expected_cn(chrom, sample_sex, chr_x, chr_y, is_par=False):
    if sample_sex == SEX_MALE:
        # Expect CN 2 in pseudoautosomal regions
        if (chrom != chr_x and chrom != chr_y) or is_par:
            return 2
        else:
            # non-par x or y
            return 1
    elif sample_sex == SEX_FEMALE:
        if chrom != chr_y:
            return 2
        else:
            return 0
    elif sample_sex == SEX_UNKNOWN:
        return 0
    else:
        raise ValueError(f"Unknown sex assignment {sample_sex} (bug)")


def read_median_geno(list_path, del_ids, dup_ids, del_cutoff, dup_cutoff, sample_sex_dict, par_trees, chr_x, chr_y,
                     min_par_overlap):
    with open(list_path) as f:
        file_paths = [line.strip() for line in f]
    data = defaultdict(dict)
    vids = set()
    for path in file_paths:
        with open(path) as f:
            header = f.readline().strip().split('\t')
            samples = header[4:]
            for line in f:
                record = line.strip().split('\t')
                chrom = record[0]
                pos = int(record[1])
                stop = int(record[2])
                vid = record[3]
                vids.add(vid)
                if vid in del_ids:
                    is_del = True
                elif vid in dup_ids:
                    is_del = False
                else:
                    continue
                is_par = is_in_par_region(chrom=chrom, pos=pos, stop=stop, par_trees=par_trees, cutoff=min_par_overlap)
                for i, median in enumerate(record[4:]):
                    median = float(median)
                    if is_del:
                        cutoff = del_cutoff
                    else:
                        cutoff = dup_cutoff
                    sample = samples[i]
                    expected_cn = get_expected_cn(chrom, sample_sex_dict[sample], chr_x, chr_y, is_par=is_par)
                    cutoff = max(cutoff - 0.5 * (2 - expected_cn), 0)
                    if vid.startswith("GD_X-SHOX_DEL_chrX_499823_793142") and sample == "A517720545":
                        print(f"{sample}")
                        print(f"{sample_sex_dict[sample]}")
                        print(f"{expected_cn}")
                        print(f"{cutoff}")
                        print(f"{is_del}")
                        print(f"{median}")
                    if is_del and median >= cutoff:
                        continue
                    elif (not is_del) and median <= cutoff:
                        continue
                    data[sample][vid] = median
    return data, vids


def reset_format_if_exists(gt, key, value):
    if key in gt:
        gt[key] = value


def get_interval_indices_dict_by_region(intervals):
    result = defaultdict(set)
    for interval in intervals:
        region, index = get_base_name_and_index(interval.data)
        result[region].add(index)
    return result


def get_flanking_intervals_to_remove(sample_overlappers, invalidated_intervals, region):
    region_sample_overlappers = [overlapper for overlapper in sample_overlappers if overlapper.region == region]
    invalidated_interval_ids = set(interval.data for interval in invalidated_intervals)
    sufficiently_overlapping_interval_ids = set(interval.data for ov in region_sample_overlappers
                                                for interval in ov.valid_region_intervals)
    region_overlapping_intervals = [interval for ov in region_sample_overlappers
                                    for interval in ov.overlapping_region_intervals]
    region_overlapping_intervals = sorted(region_overlapping_intervals, key=attrgetter('begin'))
    flanking_intervals_to_remove = list()
    for i in range(len(region_overlapping_intervals)):
        if i > 0 and \
                region_overlapping_intervals[i].data in invalidated_interval_ids and \
                region_overlapping_intervals[i - 1].data not in sufficiently_overlapping_interval_ids:
            flanking_intervals_to_remove.append(region_overlapping_intervals[i - 1])
        if i < len(region_overlapping_intervals) - 1 and \
                region_overlapping_intervals[i].data in invalidated_interval_ids and \
                region_overlapping_intervals[i + 1].data not in sufficiently_overlapping_interval_ids:
            flanking_intervals_to_remove.append(region_overlapping_intervals[i + 1])
    return flanking_intervals_to_remove


def remap_overlapper_dict(overlappers_dict):
    # make dictionary: vid -> list of GDR overlap records, for fast lookup as we traverse the vcf
    result = defaultdict(list)
    for _, svtype_dict in overlappers_dict.items():
        for _, sample_dict in svtype_dict.items():
            for record_name, record_list in sample_dict.items():
                result[record_name].extend(record_list)
    return result


def subtract_vcf(fin, fsub, forig, vid_overlappers_dict, sample_sex_dict, chr_x, chr_y):
    # Pull out invalidated records and reset their genotypes
    for record in fin:
        if record.id in vid_overlappers_dict:
            # Write record for review
            forig.write(record)
            gdr_records = vid_overlappers_dict[record.id]
            samples = [r.sample for r in gdr_records]
            # Reset genotypes to hom-ref for invalidated samples
            for s in samples:
                gt = record.samples[s]
                gt["GT"] = _cache_gt_set_hom_ref(gt["GT"])
                # Reset RD genotyping fields but not PESR since we did not re-examine that evidence
                # Note we do not take PAR into account here to match the rest of the pipeline
                reset_format_if_exists(gt, "RD_CN", get_expected_cn(record.chrom, sample_sex_dict[s], chr_x, chr_y))
                reset_format_if_exists(gt, "RD_GQ", RESET_RD_GQ_VALUE)
        fsub.write(record)


def get_revised_intervals(sample_overlappers, regions, pos, stop, dangling_fraction):
    tree = IntervalTree()
    tree.addi(pos, stop)
    # Remove overlapping intervals
    supported_interval_ids = set(interval.data for ov in sample_overlappers for interval in ov.supporting_intervals)
    # Remove intervals that failed genotyping. Also removes flanking GDR subdivisions that partially
    # overlap the variant and are adjacent to a failed interval.
    for region in regions:
        invalidated_intervals = [interval for ov in sample_overlappers
                                 for interval in ov.valid_region_intervals
                                 if interval.data not in supported_interval_ids and ov.region == region]
        flanking_intervals_to_remove = get_flanking_intervals_to_remove(sample_overlappers=sample_overlappers,
                                                                        invalidated_intervals=invalidated_intervals,
                                                                        region=region)
        for ov in invalidated_intervals + flanking_intervals_to_remove:
            tree.chop(ov.begin, ov.end)

    # Clean up small leftover fragments
    for interval in list(tree):
        if (interval.end - interval.begin) / (stop - pos) < dangling_fraction:
            tree.remove(interval)
    return sorted(tree)


def retain_values_if_present(data_dict, key, values_list):
    value = data_dict.get(key, list())
    if isinstance(value, Iterable):
        return [ev for ev in data_dict.get(key, list()) if ev in values_list]
    else:
        return value


def write_revised_record(frev, interval, index, vcf_record, vid, sample, original_gt, sample_sex_dict, chr_x, chr_y):
    # Write out new revised records. Note that these are not sorted.
    vcf_record.id = f"{vid}_GDR_{sample}_{index}"
    vcf_record.pos = interval.begin
    vcf_record.stop = interval.end
    vcf_record.info["EVIDENCE"] = retain_values_if_present(vcf_record.info, "EVIDENCE", ["RD", "BAF"])
    # Reset all other samples to hom-ref
    # TODO this is a bit wasteful since it's mostly repeated if there are many intervals/samples
    for s, gt in vcf_record.samples.items():
        gt["GT"] = _cache_gt_set_hom_ref(gt["GT"])
        gt["EV"] = retain_values_if_present(gt, "EV", ["RD"])
        reset_format_if_exists(gt, "RD_CN", get_expected_cn(vcf_record.chrom, sample_sex_dict[s], chr_x, chr_y))
        reset_format_if_exists(gt, "RD_GQ", RESET_RD_GQ_VALUE)
        for key, val in RESET_PESR_FORMATS_DICT.items():
            reset_format_if_exists(gt, key, val)
    # Restore carrier's original GT and RD genotype data
    sample_gt = vcf_record.samples[sample]
    sample_gt["GT"] = original_gt[sample][0]
    sample_gt["RD_CN"] = original_gt[sample][1]
    sample_gt["RD_GQ"] = original_gt[sample][2]
    frev.write(vcf_record)


def get_record_key(record):
    return record.pos, record.chrom, record.stop, record.info.get("SVTYPE", "")


def revise_variants(forig, frev, vid_overlappers_dict, sample_sex_dict, chr_x, chr_y, dangling_fraction):
    revised_variants = defaultdict()
    for vcf_record in forig:
        vid = vcf_record.id
        pos = vcf_record.pos
        stop = vcf_record.stop
        overlappers = vid_overlappers_dict[vid]
        regions = list(set(overlapper.region for overlapper in overlappers))
        if len(overlappers) == 0:
            raise ValueError(f"Should have found variant {vid} in overlap record set (bug)")
        # Store original GT and RD genotype data, since we'll be modifying the vcf record in place
        overlapper_samples = set(overlapper.sample for overlapper in overlappers)
        original_gt = {sample: (vcf_record.samples[sample]["GT"], vcf_record.samples[sample]["RD_CN"],
                                vcf_record.samples[sample]["RD_GQ"]) for sample in overlapper_samples}
        # Iterate over samples, subtracting invalidated intervals and creating new records from the result
        for sample, sample_overlappers in groupby(overlappers, key=attrgetter("sample")):
            # copy iterable to permanent list
            sample_overlappers = list(sample_overlappers)
            new_intervals = get_revised_intervals(sample_overlappers=sample_overlappers, regions=regions,
                                                  pos=pos, stop=stop, dangling_fraction=dangling_fraction)
            for i, interval in enumerate(new_intervals):
                write_revised_record(frev=frev, interval=interval, index=i, vcf_record=vcf_record, vid=vid,
                                     sample=sample, original_gt=original_gt, sample_sex_dict=sample_sex_dict,
                                     chr_x=chr_x, chr_y=chr_y)


def subtract_and_revise_vcf(input_vcf_path, subtracted_vcf_path, original_records_vcf_path,
                 new_revised_records_vcf_path, vcf_overlappers, sample_sex_dict, chr_x, chr_y, dangling_fraction):
    vid_overlappers_dict = remap_overlapper_dict(vcf_overlappers)
    # Pull out invalidated records and reset their genotypes
    with pysam.VariantFile(input_vcf_path) as fin, \
            pysam.VariantFile(subtracted_vcf_path, mode="w", header=fin.header) as fsub, \
            pysam.VariantFile(original_records_vcf_path, mode="w", header=fin.header) as forig:
        subtract_vcf(fin=fin, fsub=fsub, forig=forig, vid_overlappers_dict=vid_overlappers_dict,
                     sample_sex_dict=sample_sex_dict, chr_x=chr_x, chr_y=chr_y)
    # Revise invalidated records
    with pysam.VariantFile(original_records_vcf_path) as forig, \
            pysam.VariantFile(new_revised_records_vcf_path, mode="w", header=forig.header) as frev:
        revise_variants(forig=forig, frev=frev, vid_overlappers_dict=vid_overlappers_dict,
                        sample_sex_dict=sample_sex_dict, chr_x=chr_x, chr_y=chr_y,
                        dangling_fraction=dangling_fraction)


def _parse_arguments(argv: List[Text]) -> argparse.Namespace:
    # noinspection PyTypeChecker
    parser = argparse.ArgumentParser(
        description="Cleans up biallelic DEL/DUP variants in genomic disorder regions",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter
    )
    parser.add_argument('--vcf', type=str, required=True, help='Final vcf')
    parser.add_argument('--region-bed', type=str, required=True, help='Preprocessed genomic disorder regions bed')
    parser.add_argument('--par-bed', type=str, required=True, help='PAR region bed')
    parser.add_argument('--median-geno-list', type=str, required=True,
                        help='List of paths to RDTest ".median_geno" files')
    parser.add_argument('--ped-file', type=str, required=True, help='Ped file')
    parser.add_argument('--out', type=str, required=True, help='Output base path')
    parser.add_argument('--overlap', type=float, default=0.9, help='Subdivision overlap fraction cutoff')
    parser.add_argument('--del-median', type=float, default=0.6, help='DEL RDTest median cutoff')
    parser.add_argument('--dup-median', type=float, default=1.4, help='DUP RDTest median cutoff')
    parser.add_argument('--vcf-min-size', type=int, default=1000, help='Min size of vcf variants')
    parser.add_argument('--min-frac-supporting-genotypes', type=float, default=0.7,
                        help='Min fraction of sufficiently overlapping genotyped intervals that support the call')
    parser.add_argument('--min-region-overlap', type=float, default=0.2,
                        help='Min fraction of sufficiently overlapping genotyped intervals in the GD region')
    parser.add_argument('--min-dangling-frac', type=float, default=0.05,
                        help='Min interval fraction of variant size for removing leftover fragments')
    parser.add_argument('--min-par-overlap', type=float, default=0.5,
                        help='Min overlap fraction for an interval to be treated as PAR')
    parser.add_argument('--chr-x', type=str, default="chrX", help='Chromosome X identifier')
    parser.add_argument('--chr-y', type=str, default="chrY", help='Chromosome Y identifier')
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

    logging.info("Reading ped file...")
    sample_sex_dict = read_ped_file(args.ped_file)
    logging.info("Reading genomic disorder regions bed file...")
    gdr_trees, gdr_del_ids, gdr_dup_ids = create_trees_from_bed_records_by_type(args.region_bed)
    logging.info("Reading PAR bed file...")
    par_trees = create_trees_from_bed_records(args.par_bed)
    logging.info("Reading \"median_geno\" file...")
    medians, median_vids = read_median_geno(list_path=args.median_geno_list, del_ids=gdr_del_ids, dup_ids=gdr_dup_ids,
                                            del_cutoff=args.del_median, dup_cutoff=args.dup_median,
                                            sample_sex_dict=sample_sex_dict, par_trees=par_trees,
                                            chr_x=args.chr_x, chr_y=args.chr_y, min_par_overlap=args.min_par_overlap)
    logging.info("Parsing VCF for variants overlapping genomic disorder regions...")
    vcf_overlappers = get_overlapping_samples_vcf(vcf_path=args.vcf, intervals=gdr_trees,
                                                  medians=medians, median_vids=median_vids, cutoff=args.overlap,
                                                  vcf_min_size=args.vcf_min_size,
                                                  min_rdtest_support=args.min_frac_supporting_genotypes,
                                                  min_region_overlap=args.min_region_overlap)
    subtracted_vcf_path = f"{args.out}.subtracted.vcf.gz"
    original_records_vcf_path = f"{args.out}.original_revised_records.vcf.gz"
    new_revised_records_vcf_path = f"{args.out}.new_revised_records.unsorted.vcf.gz"
    logging.info("Subtracting and revising variants...")
    subtract_and_revise_vcf(input_vcf_path=args.vcf,
                            subtracted_vcf_path=subtracted_vcf_path,
                            original_records_vcf_path=original_records_vcf_path,
                            new_revised_records_vcf_path=new_revised_records_vcf_path,
                            vcf_overlappers=vcf_overlappers,
                            sample_sex_dict=sample_sex_dict, chr_x=args.chr_x, chr_y=args.chr_y,
                            dangling_fraction=args.min_dangling_frac)


if __name__ == "__main__":
    main()