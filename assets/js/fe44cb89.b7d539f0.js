"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[9318],{1626:(e,s,l)=>{l.r(s),l.d(s,{assets:()=>d,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>t,toc:()=>a});var n=l(4848),o=l(8453),i=l(1944);const r={title:"CleanVcf",description:"VCF cleaning",sidebar_position:14,slug:"cvcf"},c=void 0,t={id:"modules/clean_vcf",title:"CleanVcf",description:"VCF cleaning",source:"@site/docs/modules/clean_vcf.md",sourceDirName:"modules",slug:"/modules/cvcf",permalink:"/gatk-sv/docs/modules/cvcf",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/clean_vcf.md",tags:[],version:"current",sidebarPosition:14,frontMatter:{title:"CleanVcf",description:"VCF cleaning",sidebar_position:14,slug:"cvcf"},sidebar:"tutorialSidebar",previous:{title:"GenotypeComplexVariants",permalink:"/gatk-sv/docs/modules/gcv"},next:{title:"RefineComplexVariants",permalink:"/gatk-sv/docs/modules/refcv"}},d={},a=[{value:"Inputs",id:"inputs",level:3},{value:"<code>cohort_name</code>",id:"cohort_name",level:4},{value:"<code>complex_genotype_vcfs</code>",id:"complex_genotype_vcfs",level:4},{value:"<code>complex_resolve_bothside_pass_list</code>",id:"complex_resolve_bothside_pass_list",level:4},{value:"<code>complex_resolve_background_fail_list</code>",id:"complex_resolve_background_fail_list",level:4},{value:"<code>ped_file</code>",id:"ped_file",level:4},{value:"<code>max_shards_per_chrom_step1</code>, <code>min_records_per_shard_step1</code>, <code>samples_per_step2_shard</code>, <code>max_samples_per_shard_step3</code>, <code>clean_vcf1b_records_per_shard</code>, <code>clean_vcf5_records_per_shard</code>",id:"max_shards_per_chrom_step1-min_records_per_shard_step1-samples_per_step2_shard-max_samples_per_shard_step3-clean_vcf1b_records_per_shard-clean_vcf5_records_per_shard",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg>  <code>outlier_samples_list</code>",id:"optional--outlier_samples_list",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>use_hail</code>",id:"optional-use_hail",level:4},{value:"<HighlightOptionalArg>Optional</HighlightOptionalArg> <code>gcs_project</code>",id:"optional-gcs_project",level:4},{value:"Outputs",id:"outputs",level:3},{value:"<code>cleaned_vcf</code>",id:"cleaned_vcf",level:4}];function p(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",li:"li",mermaid:"mermaid",p:"p",ul:"ul",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(s.p,{children:(0,n.jsx)(s.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/wdl/CleanVcf.wdl",children:"WDL source code"})}),"\n",(0,n.jsx)(s.p,{children:"Performs various VCF clean-up steps including:"}),"\n",(0,n.jsxs)(s.ul,{children:["\n",(0,n.jsx)(s.li,{children:"Adjusting genotypes on allosomal contigs"}),"\n",(0,n.jsx)(s.li,{children:"Collapsing overlapping CNVs into multi-allelic CNVs"}),"\n",(0,n.jsx)(s.li,{children:"Revising genotypes in overlapping CNVs"}),"\n",(0,n.jsx)(s.li,{children:"Removing redundant CNVs"}),"\n",(0,n.jsx)(s.li,{children:"Stitching large CNVs"}),"\n",(0,n.jsx)(s.li,{children:"VCF formatting clean-up"}),"\n"]}),"\n",(0,n.jsx)(s.p,{children:"The following diagram illustrates the recommended invocation order:"}),"\n",(0,n.jsx)(s.mermaid,{value:"\nstateDiagram\n  direction LR\n  \n  classDef inModules stroke-width:0px,fill:#caf0f8,color:#00509d\n  classDef thisModule font-weight:bold,stroke-width:0px,fill:#ff9900,color:white\n  classDef outModules stroke-width:0px,fill:#caf0f8,color:#00509d\n\n  gcv: GenotypeComplexVariants\n  cvcf: CleanVcf\n  refcv: RefineComplexVariants\n  \n  gcv --\x3e cvcf\n  cvcf --\x3e refcv\n  \n  class cvcf thisModule\n  class gcv inModules\n  class refcv outModules"}),"\n",(0,n.jsx)(s.h3,{id:"inputs",children:"Inputs"}),"\n",(0,n.jsx)(s.h4,{id:"cohort_name",children:(0,n.jsx)(s.code,{children:"cohort_name"})}),"\n",(0,n.jsxs)(s.p,{children:["Cohort name. The guidelines outlined in the ",(0,n.jsx)(s.a,{href:"/docs/gs/inputs#sampleids",children:"sample ID requirements"})," section apply here."]}),"\n",(0,n.jsx)(s.h4,{id:"complex_genotype_vcfs",children:(0,n.jsx)(s.code,{children:"complex_genotype_vcfs"})}),"\n",(0,n.jsxs)(s.p,{children:["Array of contig-sharded VCFs containing genotyped complex variants, generated in ",(0,n.jsx)(s.a,{href:"./gcv#complex_genotype_vcfs",children:"GenotypeComplexVariants"}),"."]}),"\n",(0,n.jsx)(s.h4,{id:"complex_resolve_bothside_pass_list",children:(0,n.jsx)(s.code,{children:"complex_resolve_bothside_pass_list"})}),"\n",(0,n.jsxs)(s.p,{children:["Array of variant lists with bothside SR support for all batches, generated in ",(0,n.jsx)(s.a,{href:"./rcv#complex_resolve_bothside_pass_list",children:"ResolveComplexVariants"}),"."]}),"\n",(0,n.jsx)(s.h4,{id:"complex_resolve_background_fail_list",children:(0,n.jsx)(s.code,{children:"complex_resolve_background_fail_list"})}),"\n",(0,n.jsxs)(s.p,{children:["Array of variant lists with low SR signal-to-noise ratio for all batches, generated in ",(0,n.jsx)(s.a,{href:"./rcv#complex_resolve_background_fail_list",children:"ResolveComplexVariants"}),"."]}),"\n",(0,n.jsx)(s.h4,{id:"ped_file",children:(0,n.jsx)(s.code,{children:"ped_file"})}),"\n",(0,n.jsxs)(s.p,{children:["Family structures and sex assignments determined in ",(0,n.jsx)(s.a,{href:"./eqc",children:"EvidenceQC"}),". See ",(0,n.jsx)(s.a,{href:"/docs/gs/inputs#ped-format",children:"PED file format"}),"."]}),"\n",(0,n.jsxs)(s.h4,{id:"max_shards_per_chrom_step1-min_records_per_shard_step1-samples_per_step2_shard-max_samples_per_shard_step3-clean_vcf1b_records_per_shard-clean_vcf5_records_per_shard",children:[(0,n.jsx)(s.code,{children:"max_shards_per_chrom_step1"}),", ",(0,n.jsx)(s.code,{children:"min_records_per_shard_step1"}),", ",(0,n.jsx)(s.code,{children:"samples_per_step2_shard"}),", ",(0,n.jsx)(s.code,{children:"max_samples_per_shard_step3"}),", ",(0,n.jsx)(s.code,{children:"clean_vcf1b_records_per_shard"}),", ",(0,n.jsx)(s.code,{children:"clean_vcf5_records_per_shard"})]}),"\n",(0,n.jsxs)(s.p,{children:["These parameters control parallelism in scattered tasks. Please examine the\n",(0,n.jsx)(s.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/wdl/CleanVcf.wdl",children:"WDL source code"})," to see how each is used."]}),"\n",(0,n.jsxs)(s.h4,{id:"optional--outlier_samples_list",children:[(0,n.jsx)(i.$,{children:"Optional"}),"  ",(0,n.jsx)(s.code,{children:"outlier_samples_list"})]}),"\n",(0,n.jsx)(s.p,{children:"Text file of samples IDs to exclude when identifying multi-allelic CNVs. Most users do not need this feature unless\nexcessive multi-allelic CNVs driven by low-quality samples are observed."}),"\n",(0,n.jsxs)(s.h4,{id:"optional-use_hail",children:[(0,n.jsx)(i.$,{children:"Optional"})," ",(0,n.jsx)(s.code,{children:"use_hail"})]}),"\n",(0,n.jsxs)(s.p,{children:["Default: ",(0,n.jsx)(s.code,{children:"false"}),". Use Hail for VCF concatenation. This should only be used for projects with over 50k samples. If enabled, the\n",(0,n.jsx)(s.a,{href:"#optional-gcs_project",children:"gcs_project"})," must also be provided. Does not work on Terra."]}),"\n",(0,n.jsxs)(s.h4,{id:"optional-gcs_project",children:[(0,n.jsx)(i.$,{children:"Optional"})," ",(0,n.jsx)(s.code,{children:"gcs_project"})]}),"\n",(0,n.jsxs)(s.p,{children:["Google Cloud project ID. Required only if enabling ",(0,n.jsx)(s.a,{href:"#optional-use_hail",children:"use_hail"}),"."]}),"\n",(0,n.jsx)(s.h3,{id:"outputs",children:"Outputs"}),"\n",(0,n.jsx)(s.h4,{id:"cleaned_vcf",children:(0,n.jsx)(s.code,{children:"cleaned_vcf"})}),"\n",(0,n.jsx)(s.p,{children:"Genome-wide VCF of output."})]})}function h(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(p,{...e})}):p(e)}},1944:(e,s,l)=>{l.d(s,{$:()=>o});var n=l(4848);const o=e=>{let{children:s}=e;return(0,n.jsx)("span",{style:{backgroundColor:"var(--highlight-optional-arg-background-color)",borderRadius:"2px",color:"var(--highlight-optional-arg-text-color)",padding:"0.2rem"},children:s})}},8453:(e,s,l)=>{l.d(s,{R:()=>r,x:()=>c});var n=l(6540);const o={},i=n.createContext(o);function r(e){const s=n.useContext(i);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function c(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),n.createElement(i.Provider,{value:s},e.children)}}}]);