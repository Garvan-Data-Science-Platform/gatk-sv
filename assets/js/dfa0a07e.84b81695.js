"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[5277],{5680:(e,t,r)=>{r.d(t,{xA:()=>p,yg:()=>h});var n=r(6540);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(r),d=a,h=u["".concat(s,".").concat(d)]||u[d]||m[d]||o;return r?n.createElement(h,i(i({ref:t},p),{},{components:r})):n.createElement(h,i({ref:t},p))}));function h(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},4058:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>m,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var n=r(8168),a=(r(6540),r(5680));const o={title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},i=void 0,l={unversionedId:"modules/evidence_qc",id:"modules/evidence_qc",title:"EvidenceQC",description:"Evidence QC",source:"@site/docs/modules/evidence_qc.md",sourceDirName:"modules",slug:"/modules/eqc",permalink:"/gatk-sv/docs/modules/eqc",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/evidence_qc.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"EvidenceQC",description:"Evidence QC",sidebar_position:2,slug:"eqc"},sidebar:"tutorialSidebar",previous:{title:"GatherSampleEvidence",permalink:"/gatk-sv/docs/modules/gse"},next:{title:"TrainGCNV",permalink:"/gatk-sv/docs/modules/gcnv"}},s={},c=[{value:"Prerequisites",id:"prerequisites",level:3},{value:"Inputs",id:"inputs",level:3},{value:"Outputs",id:"outputs",level:3},{value:"Preliminary Sample QC",id:"preliminary-sample-qc",level:2}],p={toc:c},u="wrapper";function m(e){let{components:t,...r}=e;return(0,a.yg)(u,(0,n.A)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.yg)("p",null,"Runs ploidy estimation, dosage scoring, and optionally VCF QC.\nThe results from this module can be used for QC and batching."),(0,a.yg)("p",null,"For large cohorts, this workflow can be run on arbitrary cohort\npartitions of up to about 500 samples. Afterwards, we recommend\nusing the results to divide samples into smaller batches (~100-500 samples)\nwith ~1:1 male:female ratio. Refer to the ",(0,a.yg)("a",{parentName:"p",href:"/docs/run/joint#batching"},"Batching")," section\nfor further guidance on creating batches."),(0,a.yg)("p",null,"We also recommend using sex assignments generated from the ploidy\nestimates and incorporating them into the PED file, with sex = 0 for sex aneuploidies."),(0,a.yg)("h3",{id:"prerequisites"},"Prerequisites"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"./gse"},"Gather Sample Evidence"))),(0,a.yg)("h3",{id:"inputs"},"Inputs"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Read count files (GatherSampleEvidence)"),(0,a.yg)("li",{parentName:"ul"},"(Optional) SV call VCFs (GatherSampleEvidence)")),(0,a.yg)("h3",{id:"outputs"},"Outputs"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},"Per-sample dosage scores with plots"),(0,a.yg)("li",{parentName:"ul"},"Median coverage per sample"),(0,a.yg)("li",{parentName:"ul"},"Ploidy estimates, sex assignments, with plots"),(0,a.yg)("li",{parentName:"ul"},"(Optional) Outlier samples detected by call counts")),(0,a.yg)("h2",{id:"preliminary-sample-qc"},"Preliminary Sample QC"),(0,a.yg)("p",null,"The purpose of sample filtering at this stage after EvidenceQC is to\nprevent very poor quality samples from interfering with the results for\nthe rest of the callset. In general, samples that are borderline are\nokay to leave in, but you should choose filtering thresholds to suit\nthe needs of your cohort and study. There will be future opportunities\n(as part of FilterBatch) for filtering before the joint genotyping\nstage if necessary. Here are a few of the basic QC checks that we recommend:"),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Look at the X and Y ploidy plots, and check that sex assignments\nmatch your expectations. If there are discrepancies, check for\nsample swaps and update your PED file before proceeding.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Look at the dosage score (WGD) distribution and check that\nit is centered around 0 (the distribution of WGD for PCR-\nsamples is expected to be slightly lower than 0, and the distribution\nof WGD for PCR+ samples is expected to be slightly greater than 0.\nRefer to the gnomAD-SV paper for more information on WGD score).\nOptionally filter outliers.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Look at the low outliers for each SV caller (samples with\nmuch lower than typical numbers of SV calls per contig for\neach caller). An empty low outlier file means there were\nno outliers below the median and no filtering is necessary.\nCheck that no samples had zero calls.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Look at the high outliers for each SV caller and optionally\nfilter outliers; samples with many more SV calls than average may be poor quality.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},"Remove samples with autosomal aneuploidies based on\nthe per-batch binned coverage plots of each chromosome."))))}m.isMDXComponent=!0}}]);