"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[5277],{6222:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>a,contentTitle:()=>o,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>c});var s=t(4848),i=t(8453);const r={title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},o=void 0,l={id:"modules/evidence_qc",title:"EvidenceQC",description:"Evidence QC",source:"@site/docs/modules/evidence_qc.md",sourceDirName:"modules",slug:"/modules/eqc",permalink:"/gatk-sv/docs/modules/eqc",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/evidence_qc.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},sidebar:"tutorialSidebar",previous:{title:"GatherSampleEvidence",permalink:"/gatk-sv/docs/modules/gse"},next:{title:"TrainGCNV",permalink:"/gatk-sv/docs/modules/gcnv"}},a={},c=[{value:"Prerequisites",id:"prerequisites",level:3},{value:"Inputs",id:"inputs",level:3},{value:"Outputs",id:"outputs",level:3},{value:"Preliminary Sample QC",id:"preliminary-sample-qc",level:2}];function d(e){const n={a:"a",h2:"h2",h3:"h3",li:"li",p:"p",ul:"ul",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"Runs ploidy estimation, dosage scoring, and optionally VCF QC.\nThe results from this module can be used for QC and batching."}),"\n",(0,s.jsxs)(n.p,{children:["For large cohorts, this workflow can be run on arbitrary cohort\npartitions of up to about 500 samples. Afterwards, we recommend\nusing the results to divide samples into smaller batches (~100-500 samples)\nwith ~1:1 male",":female"," ratio. Refer to the ",(0,s.jsx)(n.a,{href:"/docs/run/joint#batching",children:"Batching"})," section\nfor further guidance on creating batches."]}),"\n",(0,s.jsx)(n.p,{children:"We also recommend using sex assignments generated from the ploidy\nestimates and incorporating them into the PED file, with sex = 0 for sex aneuploidies."}),"\n",(0,s.jsx)(n.h3,{id:"prerequisites",children:"Prerequisites"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"./gse",children:"Gather Sample Evidence"})}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"inputs",children:"Inputs"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Read count files (GatherSampleEvidence)"}),"\n",(0,s.jsx)(n.li,{children:"(Optional) SV call VCFs (GatherSampleEvidence)"}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"outputs",children:"Outputs"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"Per-sample dosage scores with plots"}),"\n",(0,s.jsx)(n.li,{children:"Median coverage per sample"}),"\n",(0,s.jsx)(n.li,{children:"Ploidy estimates, sex assignments, with plots"}),"\n",(0,s.jsx)(n.li,{children:"(Optional) Outlier samples detected by call counts"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"preliminary-sample-qc",children:"Preliminary Sample QC"}),"\n",(0,s.jsx)(n.p,{children:"The purpose of sample filtering at this stage after EvidenceQC is to\nprevent very poor quality samples from interfering with the results for\nthe rest of the callset. In general, samples that are borderline are\nokay to leave in, but you should choose filtering thresholds to suit\nthe needs of your cohort and study. There will be future opportunities\n(as part of FilterBatch) for filtering before the joint genotyping\nstage if necessary. Here are a few of the basic QC checks that we recommend:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Look at the X and Y ploidy plots, and check that sex assignments\nmatch your expectations. If there are discrepancies, check for\nsample swaps and update your PED file before proceeding."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Look at the dosage score (WGD) distribution and check that\nit is centered around 0 (the distribution of WGD for PCR-\nsamples is expected to be slightly lower than 0, and the distribution\nof WGD for PCR+ samples is expected to be slightly greater than 0.\nRefer to the gnomAD-SV paper for more information on WGD score).\nOptionally filter outliers."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Look at the low outliers for each SV caller (samples with\nmuch lower than typical numbers of SV calls per contig for\neach caller). An empty low outlier file means there were\nno outliers below the median and no filtering is necessary.\nCheck that no samples had zero calls."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Look at the high outliers for each SV caller and optionally\nfilter outliers; samples with many more SV calls than average may be poor quality."}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:["\n",(0,s.jsx)(n.p,{children:"Remove samples with autosomal aneuploidies based on\nthe per-batch binned coverage plots of each chromosome."}),"\n"]}),"\n"]})]})}function h(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>o,x:()=>l});var s=t(6540);const i={},r=s.createContext(i);function o(e){const n=s.useContext(r);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:o(e.components),s.createElement(r.Provider,{value:n},e.children)}}}]);