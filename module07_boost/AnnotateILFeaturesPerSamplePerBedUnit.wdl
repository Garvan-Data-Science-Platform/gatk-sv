##########################################################################################

## Github commit: talkowski-lab/gatk-sv-v1:<ENTER HASH HERE IN FIRECLOUD>

##########################################################################################

## Copyright Broad Institute, 2020
## 
## This WDL pipeline implements Duphold 
##
##
## LICENSING : 
## This script is released under the WDL source code license (BSD-3) (see LICENSE in 
## https://github.com/broadinstitute/wdl). Note however that the programs it calls may 
## be subject to different licenses. Users are responsible for checking that they are
## authorized to run all programs before running this script. Please see the docker 
## page at https://hub.docker.com/r/broadinstitute/genomes-in-the-cloud/ for detailed
## licensing information pertaining to the included programs.

version 1.0

import "Structs.wdl"
import "TasksBenchmark.wdl" as mini_tasks

workflow AnnoILFeaturesPerSample{
    input{
        File bed_file
        String sample
        File? ref_fasta
        File? ref_fai
        File? ref_dict

        File? pacbio_seq

        # input for duphold
        String? il_bam
        String? il_bam_bai

        #input for rd pe sr annotation
        File? pe_matrix
        File? pe_index
        File? sr_matrix
        File? sr_index
        File? rd_matrix
        File? rd_index

        #input for genomic context annotation
        File? ref_SegDup
        File? ref_SimpRep
        File? ref_RepMask

        # input for raw algorithms support annotation
        File raw_manta
        File raw_wham
        File raw_melt
        File raw_depth

        File? hgsv_query
        File? pacbio_query
        File? bionano_query
        File? array_query

        Boolean requester_pays_crams = false
        Boolean run_genomic_context_anno = false
        Boolean run_extract_algo_evi = false
        Boolean run_duphold = false
        Boolean run_vapor = false
        Boolean run_rdpesr_anno = false
        Boolean run_extract_gt_gq = true
        Boolean run_versus_raw_vcf = true

        String sv_benchmark_docker
        String duphold_docker
        String? vapor_docker
        String sv_base_mini_docker
        String sv_pipeline_docker

        RuntimeAttr? runtime_attr_duphold
        RuntimeAttr? runtime_attr_rdpesr
        RuntimeAttr? runtime_attr_bcf2vcf
        RuntimeAttr? runtime_attr_vapor
        RuntimeAttr? runtime_attr_LocalizeCram
        RuntimeAttr? runtime_attr_vcf2bed
        RuntimeAttr? runtime_attr_SplitVcf
        RuntimeAttr? runtime_attr_ConcatBeds
        RuntimeAttr? runtime_attr_ConcatVcfs
    }


    if (defined(hgsv_query)){
        call mini_tasks.BedComparison as BedComparison_vs_hgsv{
            input:
                query = hgsv_query,
                ref = bed_file,
                prefix = "${sample}.vs.hgsv",
                sv_benchmark_docker=sv_benchmark_docker
        }
    }

    if (defined(pacbio_query)){
        call mini_tasks.BedComparison as BedComparison_vs_pacbio{
            input:
                query = pacbio_query,
                ref = bed_file,
                prefix = "${sample}.vs.pacbio",
                sv_benchmark_docker=sv_base_mini_docker
        }
    }
    
    if (defined(bionano_query)){
        call mini_tasks.BedComparison as BedComparison_vs_bionano{
            input:
                query = bionano_query,
                ref = bed_file,
                prefix = "${sample}.vs.bionano",
                sv_benchmark_docker=sv_benchmark_docker
        }
    }

    if (defined(array_query)){
        call mini_tasks.BedComparison as BedComparison_vs_array{
            input:
                query = array_query,
                ref = bed_file,
                prefix = "${sample}.vs.array",
                sv_benchmark_docker=sv_benchmark_docker
        }
    }

    if(run_genomic_context_anno){
        call mini_tasks.RunGenomicContextAnnotation{
            input:
                bed = bed_file,
                prefix = sample,
                ref_SegDup = ref_SegDup,
                ref_SimpRep = ref_SimpRep,
                ref_RepMask = ref_RepMask,
                sv_benchmark_docker = sv_benchmark_docker,
                runtime_attr_override = runtime_attr_rdpesr
        }
    }

    call BedComparisons{
        input:
            raw_manta = raw_manta,
            raw_wham = raw_wham,
            raw_melt = raw_melt,
            raw_depth = raw_depth,
            ref = bed_file,
            prefix = "${sample}.vs",
            sv_benchmark_docker=sv_benchmark_docker
    }



    if(run_rdpesr_anno){
        call mini_tasks.RunRdPeSrAnnotation{
            input:
                prefix = sample,
                bed = bed_file,
                pe_matrix = pe_matrix,
                pe_index = pe_index,
                sr_matrix = sr_matrix,
                sr_index = sr_index,
                rd_matrix = rd_matrix,
                rd_index = rd_index,
                sv_benchmark_docker = sv_benchmark_docker,
                runtime_attr_override = runtime_attr_rdpesr
        }
    }
    
    output{
        File bed = bed_file

        File? PesrAnno  = RunRdPeSrAnnotation.pesr_anno
        File? RdAnno    = RunRdPeSrAnnotation.cov
        File? RdAnno_le = RunRdPeSrAnnotation.cov_le_flank 
        File? RdAnno_ri = RunRdPeSrAnnotation.cov_ri_flank

        File? GCAnno = RunGenomicContextAnnotation.anno_bed

        File? vs_hgsv = BedComparison_vs_hgsv.comparison
        File? vs_pacbio = BedComparison_vs_pacbio.comparison
        File? vs_bionano = BedComparison_vs_bionano.comparison
        File? vs_array = BedComparison_vs_array.comparison
        File? vs_manta = BedComparisons.vs_manta
        File? vs_wham = BedComparisons.vs_wham
        File? vs_melt = BedComparisons.vs_melt
        File? vs_depth = BedComparisons.vs_depth

        }
    }
 
task BedComparisons{
    input{
        File? raw_manta
        File? raw_wham
        File? raw_melt
        File? raw_depth
        File? ref
        String prefix
        String sv_benchmark_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 3, 
        disk_gb: 10,
        boot_disk_gb: 10,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

    output{
        File vs_manta = "~{prefix}.manta.bed"
        File vs_wham = "~{prefix}.wham.bed"
        File vs_melt = "~{prefix}.melt.bed"
        File vs_depth = "~{prefix}.depth.bed"
    }

    command <<<
        bash /src/compare_callsets_V2.sh -O ~{prefix}.manta.bed -p ~{prefix}.manta ~{raw_manta} ~{ref}
        bash /src/compare_callsets_V2.sh -O ~{prefix}.wham.bed -p ~{prefix}.wham ~{raw_wham} ~{ref}
        bash /src/compare_callsets_V2.sh -O ~{prefix}.melt.bed -p ~{prefix}.melt ~{raw_melt} ~{ref}
        bash /src/compare_callsets_V2.sh -O ~{prefix}.depth.bed -p ~{prefix}.depth ~{raw_depth} ~{ref}
    >>>

    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: sv_benchmark_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }
}

task RunDuphold{
    input{
        String prefix
        File? bam_or_cram_file
        File? bam_or_cram_index
        File vcf_file
        File? ref_fasta
        File? ref_fai
        File? ref_dict
        String sv_benchmark_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 3.75, 
        disk_gb: 10,
        boot_disk_gb: 2,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

    output{
        File bcf = "~{prefix}.bcf"
    }

    command <<<

        set -Eeuo pipefail
        
        duphold -t 4 \
        -v ~{vcf_file} \
        -b ~{bam_or_cram_file} \
        -f ~{ref_fasta} \
        -o ~{prefix}.bcf
    >>>

    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: sv_benchmark_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }
}

task RunDupholdPerContig{
    input{
        String prefix
        String contig
        File? bam_or_cram_file
        File? bam_or_cram_index
        File vcf_file
        File vcf_index
        File vcf_le_file
        File vcf_le_index
        File vcf_ri_file
        File vcf_ri_index
        File? ref_fasta
        File? ref_fai
        File? ref_dict
        String sv_benchmark_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 3.75, 
        disk_gb: 10,
        boot_disk_gb: 10,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])


    output {
        File bcf = "~{prefix}.~{contig}.bcf"
        File bcf_le = "~{prefix}.~{contig}.le_flank.bcf"
        File bcf_ri = "~{prefix}.~{contig}.ri_flank.bcf"
    }
    command <<<

        set -Eeuo pipefail
        
        duphold -t 4 \
        -v ~{vcf_file} \
        -b ~{bam_or_cram_file} \
        -f ~{ref_fasta} \
        -o ~{prefix}.~{contig}.bcf

        duphold -t 4 \
        -v ~{vcf_le_file} \
        -b ~{bam_or_cram_file} \
        -f ~{ref_fasta} \
        -o ~{prefix}.~{contig}.le_flank.bcf

        duphold -t 4 \
        -v ~{vcf_ri_file} \
        -b ~{bam_or_cram_file} \
        -f ~{ref_fasta} \
        -o ~{prefix}.~{contig}.ri_flank.bcf

    >>>
    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: sv_benchmark_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }
}

task ShiftVcfForDuphold{
    input{
        String prefix
        File vcf_file
        File vcf_index
        File ref_fai
        String sv_benchmark_docker
        RuntimeAttr? runtime_attr_override
    }

    RuntimeAttr default_attr = object {
        cpu_cores: 1, 
        mem_gb: 7.5, 
        disk_gb: 10,
        boot_disk_gb: 10,
        preemptible_tries: 1,
        max_retries: 1
    }

    RuntimeAttr runtime_attr = select_first([runtime_attr_override, default_attr])

    output{
        File le_flank = "~{prefix}.le_flank.vcf.gz"
        File ri_flank = "~{prefix}.ri_flank.vcf.gz"
        File le_flank_index = "~{prefix}.le_flank.vcf.gz.tbi"
        File ri_flank_index = "~{prefix}.ri_flank.vcf.gz.tbi"
    }

    command <<<
        python3 /src/Modify_vcf_by_steps.py ~{vcf_file} ~{prefix}.ri_flank.vcf -s 1000 -c ~{ref_fai}
        python3 /src/Modify_vcf_by_steps.py ~{vcf_file} ~{prefix}.le_flank.vcf -s -1000 -c    ~{ref_fai}

        bgzip ~{prefix}.ri_flank.vcf
        bgzip ~{prefix}.le_flank.vcf

        tabix -p vcf ~{prefix}.ri_flank.vcf.gz
        tabix -p vcf ~{prefix}.le_flank.vcf.gz
    >>>

    runtime {
        cpu: select_first([runtime_attr.cpu_cores, default_attr.cpu_cores])
        memory: select_first([runtime_attr.mem_gb, default_attr.mem_gb]) + " GiB"
        disks: "local-disk " + select_first([runtime_attr.disk_gb, default_attr.disk_gb]) + " HDD"
        bootDiskSizeGb: select_first([runtime_attr.boot_disk_gb, default_attr.boot_disk_gb])
        docker: sv_benchmark_docker
        preemptible: select_first([runtime_attr.preemptible_tries, default_attr.preemptible_tries])
        maxRetries: select_first([runtime_attr.max_retries, default_attr.max_retries])
    }
}
