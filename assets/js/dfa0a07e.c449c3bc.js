"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[5277],{1113:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>r,default:()=>p,frontMatter:()=>o,metadata:()=>a,toc:()=>d});var s=i(4848),l=i(8453),t=i(1944);const o={title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},r=void 0,a={id:"modules/evidence_qc",title:"EvidenceQC",description:"Evidence QC",source:"@site/docs/modules/evidence_qc.md",sourceDirName:"modules",slug:"/modules/eqc",permalink:"/gatk-sv/docs/modules/eqc",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/evidence_qc.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},sidebar:"tutorialSidebar",previous:{title:"GatherSampleEvidence",permalink:"/gatk-sv/docs/modules/gse"},next:{title:"TrainGCNV",permalink:"/gatk-sv/docs/modules/gcnv"}},c={},d=[{value:"Preliminary Sample QC",id:"preliminary-sample-qc",level:3},{value:"Batching",id:"batching",level:3},{value:"Inputs",id:"inputs",level:3},{value:"<code>batch</code>",id:"batch",level:4},{value:"<code>samples</code>",id:"samples",level:4},{value:"<code>counts</code>",id:"counts",level:4},{value:"<code>*_vcfs</code>",id:"_vcfs",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>run_vcf_qc</code>",id:"optional-run_vcf_qc",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>run_ploidy</code>",id:"optional-run_ploidy",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>melt_insert_size</code>",id:"optional-melt_insert_size",level:4},{value:"Outputs",id:"outputs",level:3},{value:"<code>WGD_*</code>",id:"wgd_",level:4},{value:"<code>bincov_median</code>",id:"bincov_median",level:4},{value:"<code>bincov_matrix</code>",id:"bincov_matrix",level:4},{value:"<code>ploidy_*</code>",id:"ploidy_",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>*_qc_low</code>, <code>*_qc_high</code>",id:"optional-_qc_low-_qc_high",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>qc_table</code>",id:"optional-qc_table",level:4}];function h(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",li:"li",mermaid:"mermaid",ol:"ol",p:"p",ul:"ul",...(0,l.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/wdl/EvidenceQC.wdl",children:"WDL source code"})}),"\n",(0,s.jsxs)(n.p,{children:["Runs ploidy estimation, dosage scoring, and optionally VCF QC.\nThe results from this module can be used for ",(0,s.jsx)(n.a,{href:"#preliminary-sample-qc",children:"QC"})," and ",(0,s.jsx)(n.a,{href:"#batching",children:"batching"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"We also recommend using sex assignments generated from the ploidy\nestimates and incorporating them into the PED file, with sex = 0 for sex aneuploidies."}),"\n",(0,s.jsx)(n.p,{children:"The following diagram illustrates the recommended invocation order:"}),"\n",(0,s.jsx)(n.mermaid,{value:"\nstateDiagram\n  direction LR\n  \n  classDef inModules stroke-width:0px,fill:#caf0f8,color:#00509d\n  classDef thisModule font-weight:bold,stroke-width:0px,fill:#ff9900,color:white\n  classDef outModules stroke-width:0px,fill:#caf0f8,color:#00509d\n\n  gse: GatherSampleEvidence\n  eqc: EvidenceQC\n  batching: Batching, sample QC, and sex assignment\n  \n  gse --\x3e eqc\n  eqc --\x3e batching\n  \n  class eqc thisModule\n  class gse inModules\n  class batching outModules"}),"\n",(0,s.jsx)(n.h3,{id:"preliminary-sample-qc",children:"Preliminary Sample QC"}),"\n",(0,s.jsxs)(n.p,{children:["The purpose of sample filtering at this stage after EvidenceQC is to\nprevent very poor quality samples from interfering with the results for\nthe rest of the callset. In general, samples that are borderline are\nokay to leave in, but you should choose filtering thresholds to suit\nthe needs of your cohort and study. There will be future opportunities\n(as part of ",(0,s.jsx)(n.a,{href:"/docs/modules/fb",children:"FilterBatch"}),") for filtering before the joint genotyping\nstage if necessary. Here are a few of the basic QC checks that we recommend:"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Chromosome X and Y ploidy plots: check that sex assignments\nmatch your expectations. If there are discrepancies, check for\nsample swaps and update your PED file before proceeding."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Whole-genome dosage score (WGD): examine distribution and check that\nit is centered around 0 (the distribution of WGD for PCR-\nsamples is expected to be slightly lower than 0, and the distribution\nof WGD for PCR+ samples is expected to be slightly greater than 0.\nRefer to the gnomAD-SV paper for more information on WGD score).\nOptionally filter outliers."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Low outliers for each SV caller: these are samples with\nmuch lower than typical numbers of SV calls per contig for\neach caller. An empty low outlier file means there were\nno outliers below the median and no filtering is necessary.\nCheck that no samples had zero calls."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"High outliers for each SV caller: optionally\nfilter outliers; samples with many more SV calls than average may be poor quality."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Remove samples with autosomal aneuploidies based on\nthe per-batch binned coverage plots of each chromosome."}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["In the joint calling mode Terra workspace, we provide a Jupyter notebook ",(0,s.jsx)(n.code,{children:"SampleQC.ipynb"}),"\nfor sample QC and filtering."]}),"\n",(0,s.jsx)(n.h3,{id:"batching",children:"Batching"}),"\n",(0,s.jsx)(n.p,{children:"For larger cohorts, samples should be split up into batches of about 100-500\nsamples with similar characteristics. We recommend batching based on overall\ncoverage and dosage score (WGD), which is generated in EvidenceQC.\nYou may also wish to batch samples based on other characteristics that could\nimpact SV calling, such as mean insert size or PCR status.\nAn example batching process is outlined below:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsx)(n.li,{children:"Divide the cohort by chromosome X ploidy (less than 2, greater than or equal to 2)\nbased on copy ratio estimates from EvidenceQC. In this way, males and females will be\nbatched separately before being merged back together for batches with equal sex balance"}),"\n",(0,s.jsx)(n.li,{children:"Partition the samples by median coverage from EvidenceQC,\ngrouping samples with similar median coverage together"}),"\n",(0,s.jsx)(n.li,{children:"Partition the samples further by dosage score (WGD) from\nEvidenceQC, grouping samples with similar WGD score together"}),"\n",(0,s.jsx)(n.li,{children:"Optionally, partition the samples further by mean insert size if available,\ngrouping samples with similar mean insert size together"}),"\n",(0,s.jsx)(n.li,{children:"Merge corresponding male and female partitions together to generate\nroughly equally sized batches of 100-500 samples with roughly equal sex balance"}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["In the joint calling mode Terra workspace, we provide a Jupyter notebook ",(0,s.jsx)(n.code,{children:"Batching.ipynb"}),"\nfor batch creation."]}),"\n",(0,s.jsx)(n.h3,{id:"inputs",children:"Inputs"}),"\n",(0,s.jsxs)(n.p,{children:["All array inputs of sample data must match in order. For example, the order of the ",(0,s.jsx)(n.code,{children:"samples"})," array should match that\nof the ",(0,s.jsx)(n.code,{children:"counts"})," array."]}),"\n",(0,s.jsx)(n.h4,{id:"batch",children:(0,s.jsx)(n.code,{children:"batch"})}),"\n",(0,s.jsx)(n.p,{children:"A name for the batch of samples being run. Can be alphanumeric with underscores."}),"\n",(0,s.jsx)(n.h4,{id:"samples",children:(0,s.jsx)(n.code,{children:"samples"})}),"\n",(0,s.jsxs)(n.p,{children:["Sample IDs. Must match those used in ",(0,s.jsx)(n.a,{href:"./gse#outputs",children:"GatherSampleEvidence"}),"."]}),"\n",(0,s.jsx)(n.h4,{id:"counts",children:(0,s.jsx)(n.code,{children:"counts"})}),"\n",(0,s.jsxs)(n.p,{children:["Binned read counts (",(0,s.jsx)(n.code,{children:".counts.tsv.gz"}),") from ",(0,s.jsx)(n.a,{href:"./gse#outputs",children:"GatherSampleEvidence"})]}),"\n",(0,s.jsx)(n.h4,{id:"_vcfs",children:(0,s.jsx)(n.code,{children:"*_vcfs"})}),"\n",(0,s.jsxs)(n.p,{children:["Raw SV call VCFs (",(0,s.jsx)(n.code,{children:".vcf.gz"}),") from ",(0,s.jsx)(n.a,{href:"./gse#outputs",children:"GatherSampleEvidence"}),". May be omitted in case a caller was not run."]}),"\n",(0,s.jsxs)(n.h4,{id:"optional-run_vcf_qc",children:[(0,s.jsx)(t.$,{children:"Optional"})," ",(0,s.jsx)(n.code,{children:"run_vcf_qc"})]}),"\n",(0,s.jsxs)(n.p,{children:["Default: ",(0,s.jsx)(n.code,{children:"false"}),". Run raw call VCF QC analysis."]}),"\n",(0,s.jsxs)(n.h4,{id:"optional-run_ploidy",children:[(0,s.jsx)(t.$,{children:"Optional"})," ",(0,s.jsx)(n.code,{children:"run_ploidy"})]}),"\n",(0,s.jsxs)(n.p,{children:["Default: ",(0,s.jsx)(n.code,{children:"true"}),". Run ploidy estimation."]}),"\n",(0,s.jsxs)(n.h4,{id:"optional-melt_insert_size",children:[(0,s.jsx)(t.$,{children:"Optional"})," ",(0,s.jsx)(n.code,{children:"melt_insert_size"})]}),"\n",(0,s.jsx)(n.p,{children:"Mean insert size for each sample. Produces QC tables and plots if available."}),"\n",(0,s.jsx)(n.h3,{id:"outputs",children:"Outputs"}),"\n",(0,s.jsx)(n.h4,{id:"wgd_",children:(0,s.jsx)(n.code,{children:"WGD_*"})}),"\n",(0,s.jsx)(n.p,{children:"Per-sample whole-genome dosage scores with plots"}),"\n",(0,s.jsx)(n.h4,{id:"bincov_median",children:(0,s.jsx)(n.code,{children:"bincov_median"})}),"\n",(0,s.jsx)(n.p,{children:"Median coverage per sample"}),"\n",(0,s.jsx)(n.h4,{id:"bincov_matrix",children:(0,s.jsx)(n.code,{children:"bincov_matrix"})}),"\n",(0,s.jsx)(n.p,{children:"Binned read depth matrix for the submitted batch"}),"\n",(0,s.jsx)(n.h4,{id:"ploidy_",children:(0,s.jsx)(n.code,{children:"ploidy_*"})}),"\n",(0,s.jsx)(n.p,{children:"Ploidy estimates, sex assignments, with plots"}),"\n",(0,s.jsxs)(n.h4,{id:"optional-_qc_low-_qc_high",children:[(0,s.jsx)(t.$,{children:"Optional"})," ",(0,s.jsx)(n.code,{children:"*_qc_low"}),", ",(0,s.jsx)(n.code,{children:"*_qc_high"})]}),"\n",(0,s.jsx)(n.p,{children:"Outlier samples detected by call counts."}),"\n",(0,s.jsxs)(n.h4,{id:"optional-qc_table",children:[(0,s.jsx)(t.$,{children:"Optional"})," ",(0,s.jsx)(n.code,{children:"qc_table"})]}),"\n",(0,s.jsxs)(n.p,{children:["QC summary table. Enable with ",(0,s.jsx)(n.a,{href:"#optional-run_ploidy",children:"run_ploidy"}),"."]})]})}function p(e={}){const{wrapper:n}={...(0,l.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(h,{...e})}):h(e)}},1944:(e,n,i)=>{i.d(n,{$:()=>l});var s=i(4848);const l=e=>{let{children:n}=e;return(0,s.jsx)("span",{style:{backgroundColor:"var(--highlight-optional-arg-background-color)",borderRadius:"2px",color:"var(--highlight-optional-arg-text-color)",padding:"0.2rem"},children:n})}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>r});var s=i(6540);const l={},t=s.createContext(l);function o(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function r(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(l):e.components||l:o(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);