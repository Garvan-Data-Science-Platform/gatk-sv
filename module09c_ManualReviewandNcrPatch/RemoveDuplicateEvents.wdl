version 1.0

import "Structs.wdl"

workflow RemoveDuplicateEvents {
  input {
    File vcf
    File? vcf_index
    String prefix

    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_remove_duplicate_events_task
  }

  call RemoveDuplicateEventsTask {
    input:
      vcf = vcf,
      vcf_index = select_first([vcf_index, "~{vcf}.tbi"]),
      prefix = prefix,
      sv_pipeline_docker = sv_pipeline_docker,
      runtime_attr_override = runtime_attr_remove_duplicate_events_task
  }

  output {
    File deduplicated_vcf = RemoveDuplicateEventsTask.deduplicated_vcf
    File deduplicated_vcf_index = RemoveDuplicateEventsTask.deduplicated_vcf_index
    File duplicated_events_table = RemoveDuplicateEventsTask.duplicated_events_table
  }
}


task RemoveDuplicateEventsTask {
  input {
    File vcf
    File vcf_index
    String prefix

    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  String output_vcf = "~{prefix}.duplicates_removed.vcf.gz"
  String output_table = "~{prefix}.duplicated_events.tsv"

  # Disk must be scaled proportionally to the size of the VCF
  Float input_size = size(vcf, "GiB")
  RuntimeAttr default_attr = object {
    mem_gb: 3.75,
    disk_gb: ceil(10.0 + (input_size * 2)),
    cpu_cores: 1,
    preemptible_tries: 3,
    max_retries: 1,
    boot_disk_gb: 10
  }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  command <<<
    set -euo pipefail

    python /opt/sv-pipeline/scripts/remove_duplicates.py \
        ~{vcf} \
        -o ~{output_vcf} \
        -t ~{output_table}

    tabix ~{output_vcf}
  >>>

  output {
    File deduplicated_vcf = "~{output_vcf}"
    File deduplicated_vcf_index = "~{output_vcf}.tbi"
    File duplicated_events_table = "~{output_table}"
  }

  runtime {
    cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
    memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
    disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
    bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
    docker: sv_pipeline_docker
    preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
    maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
  }
}

task RemoveDuplicateEventsTaskV2 {
  input {
    File vcf
    File vcf_index
    String prefix

    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  String output_vcf = "~{prefix}.duplicates_removed.vcf.gz"
  String output_table = "~{prefix}.duplicated_events.tsv"

  # Disk must be scaled proportionally to the size of the VCF
  Float input_size = size(vcf, "GiB")
  RuntimeAttr default_attr = object {
    mem_gb: 3.75,
    disk_gb: ceil(10.0 + (input_size * 2)),
    cpu_cores: 1,
    preemptible_tries: 3,
    max_retries: 1,
    boot_disk_gb: 10
  }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  command <<<
    set -euo pipefail
    python3 <<CODE

    import pysam
    import argparse


    def records_match(record, other):
      """
      Test if two records are same SV: check chromosome, position, stop, SVTYPE, SVLEN (for insertions),
      STRANDS (for BNDS and INVs), CPX_TYPE and CPX_INTERVALS (for CPX), and CHR2/END2 (for multi-chromosomal events)
      """
      return (record.chrom == other.chrom and
          record.pos == other.pos and
          record.stop == other.stop and
          record.info['SVTYPE'] == other.info['SVTYPE'] and
          record.info['SVLEN'] == other.info['SVLEN'] and
          (('CPX_TYPE' not in record.info and 'CPX_TYPE' not in other.info) or ('CPX_TYPE' in record.info and 'CPX_TYPE' in other.info and record.info['CPX_TYPE'] == other.info['CPX_TYPE'])) and
          (('CPX_INTERVALS' not in record.info and 'CPX_INTERVALS' not in other.info) or ('CPX_INTERVALS' in record.info and 'CPX_INTERVALS' in other.info and record.info['CPX_INTERVALS'] == other.info['CPX_INTERVALS'])) and
          (('STRANDS' not in record.info and 'STRANDS' not in other.info) or ('STRANDS' in record.info and 'STRANDS' in other.info and record.info['STRANDS'] == other.info['STRANDS'])) and
          (('CHR2' not in record.info and 'CHR2' not in other.info) or ('CHR2' in record.info and 'CHR2' in other.info and record.info['CHR2'] == other.info['CHR2'])) and
          (('END2' not in record.info and 'END2' not in other.info) or ('END2' in record.info and 'END2' in other.info and record.info['END2'] == other.info['END2'])))


    def merge_filters(record, other):
      filter_precedence = ['PASS', 'UNRESOLVED', 'PESR_GT_OVERDISPERSION', 'BOTHSIDES_SUPPORT']
      filter_set = set(record.filter.keys()).union(set(other.filter.keys()))
      record.filter.clear()
      set_status = False
      for status in filter_precedence:
        if status in filter_set:
          record.filter.add(status)
          set_status = True
          break
      if not set_status:
        for status in filter_set:
          record.filter.add(status)


    def merge_info_list_field(record, other, info_field):
      record.info[info_field] = tuple(set([x for x in record.info[info_field] if x is not None] +
                        [x for x in other.info[info_field] if x is not None]))


    def is_non_ref(format_fields):
      gt = format_fields.get('GT', None)
      is_carrier = gt is not None and any(a is not None and a > 0 for a in gt)
      return is_carrier


    def is_ref(format_fields):
      gt = format_fields.get('GT', None)
      is_hom_ref = gt is not None and all(a is not None and a == 0 for a in gt)
      return is_hom_ref


    def is_null(format_fields):
      gt = format_fields.get('GT', None)
      is_null_gt = gt is None or any(a is None for a in gt)
      return is_null_gt


    def merge_genotypes(record, other):
      mismatch_counter = 0
      if len(record.samples) != len(other.samples):
        raise ValueError("Records cannot be merged because they have different numbers of samples")
      for i in range(len(record.samples)):
        if record.samples[i]['GT'] != other.samples[i]['GT']:
          mismatch_counter += 1
          # keep GT info of highest GQ non-ref GT
          if (is_null(other.samples[i]) and not is_null(record.samples[i])) or \
              (is_non_ref(other.samples[i]) and is_ref(record.samples[i])) or \
              (is_non_ref(other.samples[i]) and is_non_ref(record.samples[i]) and other.samples[i]['GQ'] > record.samples[i]['GQ']):
            for format_field in record.samples[i]:
              if format_field in other.samples[i].keys():
                record.samples[i][format_field] = other.samples[i][format_field]
      return mismatch_counter



    def merge_records(record, other, out):
      # merge genotypes
      mismatch_counter = merge_genotypes(record, other)
      # merge other fields
      combined_filters = list(record.filter.keys()) + list(other.filter.keys())
      merge_filters(record, other)
      merge_info_list_field(record, other, 'EVIDENCE')
      merge_info_list_field(record, other, 'ALGORITHMS')
      gts_match = "same_GTs"
      if mismatch_counter > 0:
        gts_match = "diff_GTs"
      event = f"{record.chrom}_{record.pos}_{record.stop}_{record.info['SVTYPE']}"
      out.write(f"{event}\t{record.id}\t{other.id}\t{','.join(combined_filters)}\t{gts_match}\t{mismatch_counter}\n")


    def increment_dup_dict(dup_dict, sv_type):
      if sv_type in dup_dict:
        dup_dict[sv_type] += 1
      else:
        dup_dict[sv_type] = 1


    def check_for_matching_records(record, same_pos, dup_dict, dups):
      found_match = False
      for i, comp in enumerate(same_pos):
        if records_match(record, comp):
          increment_dup_dict(dup_dict, record.info['SVTYPE'])
          merge_records(comp, record, dups)
          found_match = True
          break  # only one match possible because only unique records are added to same_pos list
      if not found_match:
        same_pos.append(record)
      return 1 if found_match else 0

    same_pos = []
    last_pos = None
    dup_counter = 0
    all_counter = 0
    dup_dict = {}
    with pysam.VariantFile("~{vcf}", 'r') as f_in, \
        pysam.VariantFile("~{output_vcf}", 'w', header=f_in.header) as f_out, \
        open("~{output_table}", 'w') as dups:
      dups.write("SV\tSVID_1\tSVID_2\tFILTERS\tGTs\tGT_mismatches\n")
      for record in f_in:
        all_counter += 1
        if record.start == last_pos:
          dup_counter += check_for_matching_records(record, same_pos, dup_dict, dups)
        else:
          for rec in same_pos:
            f_out.write(rec)
          last_pos = record.start  # start over for new pos
          same_pos = [record]
      for rec in same_pos:
        f_out.write(rec)

    print(f"Found {dup_counter} duplicated variants out of {all_counter}")
    print(dup_dict)


    CODE
    tabix ~{output_vcf}
  >>>

  output {
    File deduplicated_vcf = "~{output_vcf}"
    File deduplicated_vcf_index = "~{output_vcf}.tbi"
    File duplicated_events_table = "~{output_table}"
  }

  runtime {
    cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
    memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
    disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
    bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
    docker: sv_pipeline_docker
    preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
    maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
  }
}