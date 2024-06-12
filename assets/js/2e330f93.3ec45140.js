"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[9156],{7657:(e,s,n)=>{n.r(s),n.d(s,{assets:()=>d,contentTitle:()=>l,default:()=>h,frontMatter:()=>r,metadata:()=>a,toc:()=>o});var i=n(4848),t=n(8453);const r={title:"Input Data",description:"Supported input and reference data.",sidebar_position:5,slug:"./inputs"},l=void 0,a={id:"gs/input_files",title:"Input Data",description:"Supported input and reference data.",source:"@site/docs/gs/input_files.md",sourceDirName:"gs",slug:"/gs/inputs",permalink:"/gatk-sv/docs/gs/inputs",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/gs/input_files.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{title:"Input Data",description:"Supported input and reference data.",sidebar_position:5,slug:"./inputs"},sidebar:"tutorialSidebar",previous:{title:"Quick Start",permalink:"/gatk-sv/docs/gs/qs"},next:{title:"Runtime Environments",permalink:"/gatk-sv/docs/gs/runtime-env"}},d={},o=[{value:"PED file format",id:"ped-format",level:3},{value:"Sample Exclusion",id:"sample-exclusion",level:3},{value:"Sample ID requirements",id:"sampleids",level:3},{value:"Sample IDs must",id:"sample-ids-must",level:4},{value:"Sample IDs should not",id:"sample-ids-should-not",level:4}];function c(e){const s={a:"a",code:"code",h3:"h3",h4:"h4",li:"li",p:"p",ul:"ul",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(s.p,{children:"GATK-SV requires the following input data:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Illumina short-read whole-genome CRAMs or BAMs, aligned to hg38 with ",(0,i.jsx)(s.a,{href:"https://github.com/lh3/bwa",children:"bwa-mem"}),".\nBAMs must also be indexed."]}),"\n"]}),"\n",(0,i.jsxs)(s.li,{children:["\n",(0,i.jsxs)(s.p,{children:["Family structure definitions file in\n",(0,i.jsx)(s.a,{href:"/docs/gs/inputs#ped-format",children:"PED format"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"ped-format",children:"PED file format"}),"\n",(0,i.jsxs)(s.p,{children:["The PED file format is described ",(0,i.jsx)(s.a,{href:"https://gatk.broadinstitute.org/hc/en-us/articles/360035531972-PED-Pedigree-format",children:"here"}),". Note that GATK-SV imposes additional requirements:"]}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"The file must be tab-delimited."}),"\n",(0,i.jsxs)(s.li,{children:["The sex column must only contain 0, 1, or 2: 1=Male, 2=Female, 0=Other/Unknown. Sex chromosome aneuploidies (detected in ",(0,i.jsx)(s.a,{href:"/docs/modules/eqc",children:"EvidenceQC"}),") should be entered as sex = 0."]}),"\n",(0,i.jsxs)(s.li,{children:["All family, individual, and parental IDs must conform to the ",(0,i.jsx)(s.a,{href:"/docs/gs/inputs#sampleids",children:"sample ID requirements"}),"."]}),"\n",(0,i.jsx)(s.li,{children:"Missing parental IDs should be entered as 0."}),"\n",(0,i.jsxs)(s.li,{children:["Header lines are allowed if they begin with a # character.\nTo validate the PED file, you may use ",(0,i.jsx)(s.code,{children:"src/sv-pipeline/scripts/validate_ped.py -p pedigree.ped -s samples.list"}),"."]}),"\n"]}),"\n",(0,i.jsx)(s.h3,{id:"sample-exclusion",children:"Sample Exclusion"}),"\n",(0,i.jsxs)(s.p,{children:["We recommend filtering out samples with a high percentage\nof improperly paired reads (>10% or an outlier for your data)\nas technical outliers prior to running ",(0,i.jsx)(s.a,{href:"/docs/modules/gse",children:"GatherSampleEvidence"}),".\nA high percentage of improperly paired reads may indicate issues\nwith library prep, degradation, or contamination. Artifactual\nimproperly paired reads could cause incorrect SV calls, and\nthese samples have been observed to have longer runtimes and\nhigher compute costs for ",(0,i.jsx)(s.a,{href:"/docs/modules/gse",children:"GatherSampleEvidence"}),"."]}),"\n",(0,i.jsx)(s.h3,{id:"sampleids",children:"Sample ID requirements"}),"\n",(0,i.jsx)(s.h4,{id:"sample-ids-must",children:"Sample IDs must"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Be unique within the cohort"}),"\n",(0,i.jsx)(s.li,{children:"Contain only alphanumeric characters and underscores (no dashes, whitespace, or special characters)"}),"\n"]}),"\n",(0,i.jsx)(s.h4,{id:"sample-ids-should-not",children:"Sample IDs should not"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsx)(s.li,{children:"Contain only numeric characters"}),"\n",(0,i.jsx)(s.li,{children:"Be a substring of another sample ID in the same cohort"}),"\n",(0,i.jsxs)(s.li,{children:["Contain any of the following substrings: ",(0,i.jsx)(s.code,{children:"chr"}),", ",(0,i.jsx)(s.code,{children:"name"}),", ",(0,i.jsx)(s.code,{children:"DEL"}),", ",(0,i.jsx)(s.code,{children:"DUP"}),", ",(0,i.jsx)(s.code,{children:"CPX"}),", ",(0,i.jsx)(s.code,{children:"CHROM"})]}),"\n"]}),"\n",(0,i.jsx)(s.p,{children:"The same requirements apply to family IDs in the PED file,\nas well as batch IDs and the cohort ID provided as workflow inputs."}),"\n",(0,i.jsxs)(s.p,{children:["Sample IDs are provided to GatherSampleEvidence directly and\nneed not match sample names from the BAM/CRAM headers.\n",(0,i.jsx)(s.code,{children:"GetSampleID.wdl"})," can be used to fetch BAM sample IDs and\nalso generates a set of alternate IDs that are considered\nsafe for this pipeline; alternatively, ",(0,i.jsx)(s.a,{href:"https://github.com/talkowski-lab/gnomad_sv_v3/blob/master/sample_id/convert_sample_ids.py",children:"this script"}),"\ntransforms a list of sample IDs to fit these requirements.\nCurrently, sample IDs can be replaced again in ",(0,i.jsx)(s.a,{href:"/docs/modules/gbe",children:"GatherBatchEvidence"}),"."]}),"\n",(0,i.jsx)(s.p,{children:"The following inputs will need to be updated with the transformed sample IDs:"}),"\n",(0,i.jsxs)(s.ul,{children:["\n",(0,i.jsxs)(s.li,{children:["Sample ID list for ",(0,i.jsx)(s.a,{href:"/docs/modules/gse",children:"GatherSampleEvidence"})," or ",(0,i.jsx)(s.a,{href:"/docs/modules/gbe",children:"GatherBatchEvidence"})]}),"\n",(0,i.jsx)(s.li,{children:"PED file"}),"\n"]})]})}function h(e={}){const{wrapper:s}={...(0,t.R)(),...e.components};return s?(0,i.jsx)(s,{...e,children:(0,i.jsx)(c,{...e})}):c(e)}},8453:(e,s,n)=>{n.d(s,{R:()=>l,x:()=>a});var i=n(6540);const t={},r=i.createContext(t);function l(e){const s=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function a(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:l(e.components),i.createElement(r.Provider,{value:s},e.children)}}}]);