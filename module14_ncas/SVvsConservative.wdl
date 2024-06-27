version 1.0

import "Structs.wdl"

workflow SV_vs_Conservative {

    input{
        File SV_file
        File contig_file
        String ncas_docker
        String sv_base_mini_docker

    }

    call SVvsConservative{
        input:
            SV_file = SV_file,
            ncas_docker = ncas_docker
    }


    Array[Array[String]] contigs=read_tsv(contig_file)
    scatter(contig in contigs){
        call SVvsConservativebyContig{
            input:
                SV_file = SV_file,
                contig = contig[0],
                ncas_docker = ncas_docker
        }
    }

    call ConcatComparisons as concat_SV_vs_phyloP100way{
        input:
            SV_file = SV_file,
            SV_comparison_list = SVvsConservativebyContig.SV_vs_phyloP100way,
            appendix = "vs.hg38.phyloP100way.bed",
            sv_base_mini_docker = sv_base_mini_docker
    }

    call ConcatComparisons as concat_SV_vs_phastCons100way{
        input:
            SV_file = SV_file,
            SV_comparison_list = SVvsConservativebyContig.SV_vs_phastCons100way,
            appendix = "vs.hg38.phastCons100way.bed",
            sv_base_mini_docker = sv_base_mini_docker
    }

    call IntegrateConserveAnno{
        input:
            SV_file = SV_file,
            SV_vs_DHS_mamm = SVvsConservative.SV_vs_DHS_mamm,
            SV_vs_DHS_prim = SVvsConservative.SV_vs_DHS_prim,
            SV_vs_footprint_mamm = SVvsConservative.SV_vs_footprint_mamm,
            SV_vs_footprint_prim = SVvsConservative.SV_vs_footprint_prim,
            SV_vs_UCE = SVvsConservative.SV_vs_UCE,
            SV_vs_Z_over_2 = SVvsConservative.SV_vs_Z_over_2,
            SV_vs_Z_over_4 = SVvsConservative.SV_vs_Z_over_4,
            SV_vs_phyloP100way = concat_SV_vs_phyloP100way.Concat_file,
            SV_vs_phastCons100way = concat_SV_vs_phastCons100way.Concat_file,
            ncas_docker = ncas_docker
    }

    output{
        File SV_vs_conserved = IntegrateConserveAnno.SV_vs_conserved_elements
    }
}


task SVvsConservative{
    input{
        File SV_file
        String ncas_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 15, 
        disk_gb: 20,
        boot_disk_gb: 10,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

    output{
        File SV_vs_DHS_mamm = "~{filebase}.vs.239prim.DHS.constrained.mamm.bed.gz"
        File SV_vs_DHS_prim = "~{filebase}.vs.239prim.DHS.constrained.prim.bed.gz"
        File SV_vs_footprint_mamm = "~{filebase}.vs.239prim.footprint.mamm.bed.gz"
        File SV_vs_footprint_prim = "~{filebase}.vs.239prim.footprint.prim.bed.gz"
        File SV_vs_UCE = "~{filebase}.vs.239prim.uce.bed.gz"
        File SV_vs_Z_score = "~{filebase}.vs.constraint_z_genome_1kb.tsv.gz"
        File SV_vs_Z_over_2 = "~{filebase}.vs.constraint_z_genome_1kb.z_over_2.tsv.gz"
        File SV_vs_Z_over_4 = "~{filebase}.vs.constraint_z_genome_1kb.z_over_4.tsv.gz"
    }

    String filebase = basename(SV_file,".gz")

    command <<<
        set -Eeuo pipefail

            bedtools coverage -wo -a ~{SV_file} -b conserve_element/239prim.DHS.constrained.mamm.bed.gz | bgzip >  ~{filebase}.vs.239prim.DHS.constrained.mamm.bed.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/239prim.DHS.constrained.prim.bed.gz | bgzip >  ~{filebase}.vs.239prim.DHS.constrained.prim.bed.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/239prim.footprint.mamm.bed.gz | bgzip >  ~{filebase}.vs.239prim.footprint.mamm.bed.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/239prim.footprint.prim.bed.gz | bgzip >  ~{filebase}.vs.239prim.footprint.prim.bed.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/239prim.uce.bed.gz | bgzip >  ~{filebase}.vs.239prim.uce.bed.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/constraint_z_genome_1kb.tsv.gz | bgzip >  ~{filebase}.vs.constraint_z_genome_1kb.tsv.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/constraint_z_genome_1kb.z_over_2.tsv.gz | bgzip >  ~{filebase}.vs.constraint_z_genome_1kb.z_over_2.tsv.gz
            bedtools coverage -wo -a ~{SV_file} -b conserve_element/constraint_z_genome_1kb.z_over_4.tsv.gz | bgzip >  ~{filebase}.vs.constraint_z_genome_1kb.z_over_4.tsv.gz
    >>>

    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: ncas_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }
}

task SVvsConservativebyContig{
    input{
        File SV_file
        String contig
        String ncas_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 15, 
        disk_gb: 20,
        boot_disk_gb: 10,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

    output{
        File SV_vs_phyloP100way    = "~{filebase}.~{contig}.vs.hg38.phyloP100way.bed.gz"
        File SV_vs_phastCons100way = "~{filebase}.~{contig}.vs.hg38.phastCons100way.bed.gz"
    }

    String filebase = basename(SV_file,".gz")

    command <<<
        set -Eeuo pipefail

            zcat ~{SV_file} | awk '{if ($1=="~{contig}") print}' > input_SVs.bed
            zcat conserve_element/hg38.phyloP100way.removeless2.autosomes.sorted.bed.gz | awk '{if ($1=="~{contig}") print}' > phyloP100way.bed
            zcat conserve_element/hg38.phastCons100way.removeless0.2.autosomes.sorted.bed.gz | awk '{if ($1=="~{contig}") print}' > phastCons100way.bed

            bedtools bedtools coverage -wo -a input_SVs.bed -b phyloP100way.bed | bgzip > ~{filebase}.~{contig}.vs.hg38.phyloP100way.bed.gz
            bedtools bedtools coverage -wo -a input_SVs.bed -b phastCons100way.bed | bgzip > ~{filebase}.~{contig}.vs.hg38.phastCons100way.bed.gz
    >>>

    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: ncas_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }    
}

task ConcatComparisons {
    input {
        File SV_file
        Array[File] SV_comparison_list
        String appendix
        Boolean? index_output
        String sv_base_mini_docker
        RuntimeAttr? runtime_attr_override
    } 
    
    Boolean call_tabix = select_first([index_output, true])
    String filebase = basename(SV_file,".gz")
    
    # when filtering/sorting/etc, memory usage will likely go up (much of the data will have to
    # be held in memory or disk while working, potentially in a form that takes up more space)
    Float input_size = size(SV_comparison_list, "GB")
    RuntimeAttr runtime_default = object {
        mem_gb: 2.0,
        disk_gb: ceil(10.0 + input_size * 7.0),
        cpu_cores: 1,
        preemptible_tries: 3,
        max_retries: 1,
        boot_disk_gb: 10
    }
    RuntimeAttr runtime_override = select_first([runtime_attr_override, runtime_default])
    runtime {
        memory: select_first([runtime_override.mem_gb, runtime_default.mem_gb]) + " GB"
        disks: "local-disk " + select_first([runtime_override.disk_gb, runtime_default.disk_gb]) + " HDD"
        cpu: select_first([runtime_override.cpu_cores, runtime_default.cpu_cores])
        preemptible: select_first([runtime_override.preemptible_tries, runtime_default.preemptible_tries])
        maxRetries: select_first([runtime_override.max_retries, runtime_default.max_retries])
        docker: sv_base_mini_docker
        bootDiskSizeGb: select_first([runtime_override.boot_disk_gb, runtime_default.boot_disk_gb])
    }

    command <<<
        set -eux

        set -o pipefail

        while read SPLIT; do
          zcat $SPLIT
        done < ~{write_lines(SV_comparison_list)} \
          | (grep -Ev "^#" || printf "") \
          | sort -Vk1,1 -k2,2n -k3,3n \
          | bgzip -c \
          > ~{filebase}.~{appendix}.gz

    >>>

  output {
    File Concat_file = "~{filebase}.~{appendix}.gz"
  }
}

task IntegrateConserveAnno {
    input {
        File SV_file
        File SV_vs_DHS_mamm
        File SV_vs_DHS_prim
        File SV_vs_footprint_mamm
        File SV_vs_footprint_prim
        File SV_vs_UCE
        File SV_vs_Z_over_2
        File SV_vs_Z_over_4
        File SV_vs_phyloP100way
        File SV_vs_phastCons100way
        String ncas_docker
        RuntimeAttr? runtime_attr_override
    } 
    
    String filebase = basename(SV_file,".gz")
    
    # when filtering/sorting/etc, memory usage will likely go up (much of the data will have to
    # be held in memory or disk while working, potentially in a form that takes up more space)
    Float input_size = size(SV_file, "GB")
    RuntimeAttr runtime_default = object {
        mem_gb: 2.0,
        disk_gb: ceil(10.0 + input_size * 15.0),
        cpu_cores: 1,
        preemptible_tries: 3,
        max_retries: 1,
        boot_disk_gb: 10
    }
    RuntimeAttr runtime_override = select_first([runtime_attr_override, runtime_default])
    runtime {
        memory: select_first([runtime_override.mem_gb, runtime_default.mem_gb]) + " GB"
        disks: "local-disk " + select_first([runtime_override.disk_gb, runtime_default.disk_gb]) + " HDD"
        cpu: select_first([runtime_override.cpu_cores, runtime_default.cpu_cores])
        preemptible: select_first([runtime_override.preemptible_tries, runtime_default.preemptible_tries])
        maxRetries: select_first([runtime_override.max_retries, runtime_default.max_retries])
        docker: ncas_docker
        bootDiskSizeGb: select_first([runtime_override.boot_disk_gb, runtime_default.boot_disk_gb])
    }

  command <<<
    set -eux

    set -o pipefail

    Rscript src/reorganize_sv_vs_conservative.R \
            --sv_vs_DHS_mamm ~{SV_vs_DHS_mamm} \
            --sv_vs_DHS_prim ~{SV_vs_DHS_prim} \
            --sv_vs_footprint_mamm ~{SV_vs_footprint_mamm} \
            --sv_vs_footprint_prim ~{SV_vs_footprint_prim} \
            --sv_vs_UCE ~{SV_vs_UCE} \
            --sv_vs_phastCons100way ~{SV_vs_phastCons100way} \
            --sv_vs_phyloP100way ~{SV_vs_phyloP100way} \
            --sv_vs_z_over_2 ~{SV_vs_Z_over_2} \
            --sv_vs_z_over_4 ~{SV_vs_Z_over_4} \
            --output ~{filebase}.vs.conservative.integrated

    bgzip ~{filebase}.vs.conservative.integrated

  >>>

  output {
    File SV_vs_conserved_elements = "~{filebase}.vs.conservative.integrated.gz"
  }
}



