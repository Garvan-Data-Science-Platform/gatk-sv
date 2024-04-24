version 1.0

import "MainVcfQc.wdl" as qc
import "Structs.wdl"
import "RecalibrateGq.wdl" as recalibrate_gq
import "TasksMakeCohortVcf.wdl" as tasks_cohort

workflow FilterGenotypes {

  input {
    File vcf  # Cleaned GATK-formatted vcf
    String? output_prefix
    File ploidy_table

    Float no_call_rate_cutoff = 0.05  # Set to 1 to disable NCR filtering

    String sl_filter_args  # Explicitly set SL cutoffs. See apply_sl_filter.py for arguments.

    Int filter_vcf_records_per_shard = 20000

    RuntimeAttr? runtime_attr_recalibrate_scatter
    RuntimeAttr? runtime_attr_recalibrate_gq
    RuntimeAttr? runtime_attr_recalibrate_concat

    RuntimeAttr? runtime_attr_scatter_for_optim
    RuntimeAttr? runtime_attr_make_vcf_table
    RuntimeAttr? runtime_attr_merge_tables
    RuntimeAttr? runtime_attr_optim_cutoffs

    RuntimeAttr? runtime_attr_scatter_for_filter
    RuntimeAttr? runtime_attr_filter
    RuntimeAttr? runtime_attr_filter_concat

    # For MainVcfQc
    File primary_contigs_fai
    File? ped_file
    Array[Array[String]]? site_level_comparison_datasets    # Array of two-element arrays, one per dataset, each of format [prefix, gs:// path to directory with one BED per population]
    Array[Array[String]]? sample_level_comparison_datasets  # Array of two-element arrays, one per dataset, each of format [prefix, gs:// path to per-sample tarballs]
    File? sample_renaming_tsv # File with mapping to rename per-sample benchmark sample IDs for compatibility with cohort
    Boolean run_qc = true
    String qc_bcftools_preprocessing_options = "-e 'FILTER~\"UNRESOLVED\" || FILTER~\"HIGH_NCR\"'"
    Int qc_sv_per_shard = 2500
    Int qc_samples_per_shard = 600
    RuntimeAttr? runtime_override_plot_qc_per_family
    RuntimeAttr? runtime_override_per_sample_benchmark_plot

    String linux_docker
    String gatk_docker
    String sv_base_mini_docker
    String sv_pipeline_docker
  }

  String output_prefix_ = if defined(output_prefix) then select_first([output_prefix]) else basename(vcf, ".vcf.gz")

  call tasks_cohort.ScatterVcf as ScatterForFilter {
    input:
      vcf=vcf,
      records_per_shard=filter_vcf_records_per_shard,
      prefix="~{output_prefix_}.filter_genotypes_scatter",
      sv_pipeline_docker=sv_pipeline_docker,
      runtime_attr_override=runtime_attr_scatter_for_filter
  }

  scatter ( i in range(length(ScatterForFilter.shards)) ) {
    call FixMEDels {
      input:
        vcf=ScatterForFilter.shards[i],
        prefix="~{output_prefix}.shard_~{i}",
        sv_pipeline_docker=sv_pipeline_docker

    }
    # Applies genotype and NCR filtering as specified by sl_filter_args
    call FilterVcf {
      input:
        vcf=FixMEDels.out,
        ploidy_table=ploidy_table,
        args=sl_filter_args + " --ncr-threshold ~{no_call_rate_cutoff}",
        output_prefix="~{output_prefix_}.filter_genotypes.shard_~{i}",
        sv_pipeline_docker=sv_pipeline_docker,
        runtime_attr_override=runtime_attr_filter
    }
  }

  call tasks_cohort.ConcatVcfs {
    input:
      vcfs=FilterVcf.out,
      naive=true,
      outfile_prefix="~{output_prefix_}.filter_genotypes",
      sv_base_mini_docker=sv_base_mini_docker,
      runtime_attr_override=runtime_attr_filter_concat
  }

  if (run_qc) {
    call qc.MainVcfQc {
      input:
        vcfs=[ConcatVcfs.concat_vcf],
        prefix="~{output_prefix_}.filter_genotypes",
        ped_file=ped_file,
        bcftools_preprocessing_options=qc_bcftools_preprocessing_options,
        primary_contigs_fai=primary_contigs_fai,
        site_level_comparison_datasets=site_level_comparison_datasets,
        sample_level_comparison_datasets=sample_level_comparison_datasets,
        sample_renaming_tsv=sample_renaming_tsv,
        sv_per_shard=qc_sv_per_shard,
        runtime_override_per_sample_benchmark_plot=runtime_override_per_sample_benchmark_plot,
        runtime_override_plot_qc_per_family=runtime_override_plot_qc_per_family,
        samples_per_shard=qc_samples_per_shard,
        sv_pipeline_qc_docker=sv_pipeline_docker,
        sv_base_mini_docker=sv_base_mini_docker,
        sv_pipeline_docker=sv_pipeline_docker
    }
  }

  output {
    File filtered_vcf = ConcatVcfs.concat_vcf
    File filtered_vcf_index = ConcatVcfs.concat_vcf_idx
    File? filter_genotypes_main_vcf_qc_tarball = MainVcfQc.sv_vcf_qc_output
  }
}


task MergeCompressedHeaderedTables {
  input {
    Array[File] tables
    String output_prefix
    String linux_docker
    RuntimeAttr? runtime_attr_override
  }

  RuntimeAttr default_attr = object {
                               cpu_cores: 1,
                               mem_gb: 1,
                               disk_gb: ceil(10 + 2 * size(tables, "GB")),
                               boot_disk_gb: 10,
                               preemptible_tries: 1,
                               max_retries: 1
                             }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  output {
    File out = "~{output_prefix}.tsv.gz"
  }
  command <<<
    set -euo pipefail
    OUT_FILE="~{output_prefix}.tsv.gz"
    i=0
    while read path; do
      if [ $i == 0 ]; then
        # Get header from first line of first file
        zcat $path | awk 'NR==1' - | gzip > $OUT_FILE
      fi
      # Get data from each file, skipping header line
      zcat $path | awk 'NR>1' - | gzip >> $OUT_FILE
      i=$((i+1))
    done < ~{write_lines(tables)}
  >>>
  runtime {
    cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
    memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
    disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
    bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
    docker: linux_docker
    preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
    maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
  }
}

task MakeVcfTable {
  input {
    File vcf
    File truth_json
    File? script
    String? args
    String output_prefix
    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  RuntimeAttr default_attr = object {
                               cpu_cores: 1,
                               mem_gb: 3.75,
                               disk_gb: ceil(10 + size(vcf, "GB") * 2 + size(truth_json, "GB")),
                               boot_disk_gb: 10,
                               preemptible_tries: 3,
                               max_retries: 1
                             }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  output {
    File out = "~{output_prefix}.tsv.gz"
  }
  command <<<
    set -euo pipefail
    python ~{default="/opt/sv-pipeline/scripts/make_sl_table.py" script} \
      --vcf ~{vcf} \
      --truth-json ~{truth_json} \
      --out ~{output_prefix}.tsv.gz \
      ~{args}
  >>>
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

task OptimizeCutoffs {
  input {
    File table
    File? script
    Float fmax_beta
    String? args
    String output_prefix
    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  RuntimeAttr default_attr = object {
                               cpu_cores: 1,
                               mem_gb: 3.75,
                               disk_gb: ceil(100 + size(table, "GB")),
                               boot_disk_gb: 10,
                               preemptible_tries: 3,
                               max_retries: 1
                             }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  output {
    File out = "~{output_prefix}.tar.gz"
    String filter_args = read_lines("~{output_prefix}/~{output_prefix}.filter_args.txt")[0]
  }
  command <<<
    set -euo pipefail

    mkdir ~{output_prefix}
    python ~{default="/opt/sv-pipeline/scripts/optimize_sl_cutoffs.py" script} \
      --table ~{table} \
      --out-dir ~{output_prefix} \
      --out-name ~{output_prefix} \
      --beta ~{fmax_beta} \
      ~{args}

    tar czf ~{output_prefix}.tar.gz -C ~{output_prefix}/ .
  >>>
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


task FixMEDels {
  input {
    File vcf
    String prefix
    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  RuntimeAttr default_attr = object {
                               cpu_cores: 1,
                               mem_gb: 3.75,
                               disk_gb: ceil(100 + size(vcf, "GB") * 2),
                               boot_disk_gb: 10,
                               preemptible_tries: 3,
                               max_retries: 1
                             }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  output {
    File out = "~{prefix}.fixed_me_dels.vcf.gz"
    File out_index = "~{prefix}.fixed_me_dels.vcf.gz.tbi"
  }

  command <<<
  set -euo pipefail

  python <<CODE
import pysam
vcf = pysam.VariantFile("~{vcf}", 'r')
out = pysam.VariantFile("~{prefix}.fixed_me_dels.vcf.gz", 'w', header=vcf.header)
for record in vcf:
  # add SVLEN to ME DELs
  if record.info['SVTYPE'] == 'DEL' and '_BND_' in record.id:
    record.info['SVLEN'] = record.info['END2'] - record.start
    record.stop = record.info['END2']
    record.info.pop('END2')
    record.info.pop('CHR2')
  out.write(record)
vcf.close()
out.close()
CODE

  tabix ~{prefix}.fixed_me_dels.vcf.gz
  >>>

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


task FilterVcf {
  input {
    File vcf
    File ploidy_table
    File? script
    String? args
    String output_prefix
    String sv_pipeline_docker
    RuntimeAttr? runtime_attr_override
  }

  RuntimeAttr default_attr = object {
                               cpu_cores: 1,
                               mem_gb: 3.75,
                               disk_gb: ceil(100 + size(vcf, "GB") * 2),
                               boot_disk_gb: 10,
                               preemptible_tries: 3,
                               max_retries: 1
                             }
  RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

  output {
    File out = "~{output_prefix}.vcf.gz"
    File out_index = "~{output_prefix}.vcf.gz.tbi"
  }
  command <<<
    set -euo pipefail

    # Convert format
    python ~{default="/opt/sv-pipeline/scripts/apply_sl_filter.py" script} \
      --vcf ~{vcf} \
      --out tmp.vcf.gz \
      --ploidy-table ~{ploidy_table} \
      ~{args}

    bcftools +fill-tags tmp.vcf.gz -- -t AC,AN,AF \
      | bcftools view --no-update -i 'SVTYPE=="CNV" || AC>0' -Oz -o ~{output_prefix}.vcf.gz
    tabix ~{output_prefix}.vcf.gz
  >>>
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
