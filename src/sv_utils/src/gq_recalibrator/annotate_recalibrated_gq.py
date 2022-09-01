#!/usr/bin/env python
import sys
from pathlib import Path
import tempfile
import argparse
from tqdm.auto import tqdm as tqdm
import time
import pysam
import dask
import dask.dataframe
from sv_utils import common, genomics_io
from gq_recalibrator import tarred_properties_to_parquet
from typing import Optional
tqdm.monitor_interval = 0


class Keys:
    id = tarred_properties_to_parquet.Keys.id
    gq = genomics_io.Keys.gq
    ogq = genomics_io.Keys.ogq
    sl = genomics_io.Keys.sl
    property = genomics_io.Keys.property


class VcfKeys:
    gq = genomics_io.VcfKeys.gq
    ogq = genomics_io.VcfKeys.ogq
    sl = genomics_io.VcfKeys.sl


class Default:
    temp_dir = Path(tempfile.gettempdir())
    parquet_original_gq_field = Keys.ogq
    vcf_original_gq_field = VcfKeys.ogq
    parquet_scaled_logits_field = Keys.sl
    vcf_scaled_logits_field = VcfKeys.sl
    num_processes = common.num_physical_cpus
    remove_input_tar = False


def __parse_arguments(argv: list[str]) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Predict likelihood each genotype is good using trained neural network and "
                    "extracted VCF properties and update VCF with recalibrated qualities",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
        prog=argv[0]
    )
    parser.add_argument("--input-vcf", "-i", type=Path, required=True,
                        help="path to input VCF to be recalibrated")
    parser.add_argument("--annotations", "-a", type=Path, required=True,
                        help="path to tarred parquet folder with GQ recalibration annotations")
    parser.add_argument("--output-vcf", "-o", type=Path, required=True,
                        help="path to output VCF with recalibrated GQs/SLs")
    parser.add_argument("--temp-dir", type=Path, default=Default.temp_dir,
                        help="preferred path to folder for temporary files")
    parser.add_argument("--parquet-original-gq-field", type=str,
                        default=Default.parquet_original_gq_field,
                        help="Name for FORMAT field with original GQ values in parquet")
    parser.add_argument("--vcf-original-gq-field", type=str,
                        default=Default.vcf_original_gq_field,
                        help="Name for FORMAT field with original GQ values in output VCF")
    parser.add_argument("--parquet_scaled-logits-field", type=str,
                        default=Default.parquet_scaled_logits_field,
                        help="Name for FORMAT field with scaled logit values")
    parser.add_argument("--vcf_scaled-logits-field", type=str,
                        default=Default.vcf_scaled_logits_field,
                        help="Name for FORMAT field with scaled logit values")
    parser.add_argument(
        "--num-processes", type=int, default=Default.num_processes,
        help="Number of cpu processes to use for data decompression"
    )
    parser.add_argument(
        "--remove-annotations-tar", type=bool, default=Default.remove_input_tar,
        help="Save disk space by removing annotations tar file after unarchiving"
    )
    return parser.parse_args(argv[1:] if len(argv) > 1 else ["--help"])


def main(argv: Optional[list[str]] = None):
    args = __parse_arguments(sys.argv if argv is None else argv)

    annotate_recalibrated_gq(
        input_vcf=args.input_vcf,
        annotations_path=args.annotations,
        output_vcf=args.output_vcf,
        temp_dir=args.temp_dir,
        parquet_original_gq_field=args.parquet_original_gq_field,
        vcf_original_gq_field=args.vcf_original_gq_field,
        parquet_scaled_logits_field=args.parquet_scaled_logits_field,
        vcf_scaled_logits_field=args.vcf_scaled_logits_field,
        num_processes=args.num_processes,
        remove_input_tar=args.remove_annotations_tar
    )


def annotate_recalibrated_gq(
        input_vcf: Path,
        annotations_path: Path,
        output_vcf: Path,
        temp_dir: Path,
        parquet_original_gq_field: str = Default.parquet_original_gq_field,
        vcf_original_gq_field: str = Default.vcf_original_gq_field,
        parquet_scaled_logits_field: str = Default.parquet_scaled_logits_field,
        vcf_scaled_logits_field: str = Default.vcf_scaled_logits_field,
        num_processes: int = Default.num_processes,
        remove_input_tar: bool = Default.remove_input_tar
):
    t0 = time.time()
    # open input and output VCFs, and set the dask config
    with (
        dask.config.set(
            temporary_directory=temp_dir, scheduler="processes", num_workers=num_processes
        ),
        pysam.VariantFile(f"{input_vcf}", mode='r', threads=num_processes) as vcf_in,
        pysam.VariantFile(
            f"{output_vcf}",
            mode='w',
            threads=num_processes,
            header=_get_output_header(
                input_header=vcf_in.header,
                original_gq_field=vcf_original_gq_field,
                scaled_logits_field=vcf_scaled_logits_field
            )
        ) as vcf_out
    ):
        # load dask dataframe with the variant IDs and annotation properties
        annotations_df = tarred_properties_to_parquet.parquet_to_df(
            input_path=annotations_path, remove_input_tar=remove_input_tar,
        )
        # get the properties as individual dask dataframes with the samples in the same order as
        # the VCF records
        sample_ids = list(vcf_in.header.samples)
        variant_ids = annotations_df.loc[:, (None, Keys.id)]
        variant_ids.columns = [Keys.id]
        recalibrated_gqs = _get_property_dataframe_in_order(
            annotations_df=annotations_df, property_name=Keys.gq, sample_ids=sample_ids
        )
        original_gqs = _get_property_dataframe_in_order(
            annotations_df=annotations_df,
            property_name=parquet_original_gq_field,
            sample_ids=sample_ids
        )
        scaled_logits = _get_property_dataframe_in_order(
            annotations_df=annotations_df,
            property_name=parquet_scaled_logits_field,
            sample_ids=sample_ids
        )
        # loop over records in input VCF and annotation properties
        num_variants = len(variant_ids)
        for vcf_in_record, variant_id, record_gqs, record_ogqs, record_sls in tqdm(
            zip(
                vcf_in,
                variant_ids,
                recalibrated_gqs.itertuples(index=False),
                original_gqs.itertuples(index=False),
                scaled_logits.itertuples(index=False)
            ),
            desc="variant", mininterval=0.5, maxinterval=float('inf'),
            smoothing=0, total=num_variants
        ):
            # the VCF variant ID and the annotation variant ID should be the same
            assert vcf_in_record.id == variant_id
            # transfer the annotation properties to the output record
            transfer_annotation(
                vcf_in_record=vcf_in_record,
                record_gqs=record_gqs,
                record_original_gqs=record_ogqs,
                record_sls=record_sls,
                vcf_out=vcf_out,
                original_gq_field=vcf_original_gq_field,
                scaled_logits_field=vcf_scaled_logits_field,
            )

    t1 = time.time()
    print(f"Annotated {num_variants} in {common.elapsed_time(t1 - t0, seconds_precision=0)}")
    pysam.tabix_index(f"{output_vcf}", preset="vcf", force=True)
    t2 = time.time()
    print(f"Indexed {output_vcf} in {common.elapsed_time(t2 - t1, seconds_precision=1)}")


def _get_output_header(
        input_header: pysam.VariantHeader,
        original_gq_field: str,
        scaled_logits_field: str
) -> pysam.VariantHeader:
    """Get output header for VCF by adding header fields. Note this actually adds fields to the
    input header too: this is necessary because otherwise we'd have to build a new output record
    from scratch rather than copying over the old one.
    """
    output_header = input_header
    output_header.formats.add(id=original_gq_field, number=1, type="Integer",
                              description="GQ values from original unrecalibrated VCF")
    output_header.formats.add(id=scaled_logits_field, number=1, type="Integer",
                              description="Scaled logits based on recalibrated probabilities")

    return output_header


def _get_property_dataframe_in_order(
        annotations_df: dask.dataframe.DataFrame,
        property_name: str,
        sample_ids: list[str]
) -> dask.dataframe.DataFrame:
    property_df = annotations_df.loc[:, (sample_ids, property_name)]
    property_df.columns = property_df.columns.droplevel(Keys.property)
    return property_df


def transfer_annotation(
        vcf_in_record: pysam.VariantRecord,
        record_gqs: tuple,
        record_original_gqs: tuple,
        record_sls: tuple,
        vcf_out: pysam.VariantFile,
        original_gq_field: str,
        scaled_logits_field: str
):
    # make a new record to output
    vcf_out_record = vcf_in_record.copy()
    # pysam calls these values "extreme" and sets them to missing. It's better to promote
    # them to one higher than to have that missing value to deal with:
    bad_values_map = {-2**7 + 1: -2**7 + 2, -2**15 + 1: -2**15 + 2}
    for out_sample, gq, original_gq, sl in zip(
        vcf_out_record.samples.values(), record_gqs, record_original_gqs, record_sls
    ):
        # for each genotype field, add/update the scores
        out_sample[VcfKeys.gq] = bad_values_map.get(gq, gq)
        out_sample[original_gq_field] = bad_values_map.get(original_gq, original_gq)
        out_sample[scaled_logits_field] = bad_values_map.get(sl, sl)
    # write out the annotated record
    vcf_out.write(vcf_out_record)


if __name__ == "__main__":
    main()
