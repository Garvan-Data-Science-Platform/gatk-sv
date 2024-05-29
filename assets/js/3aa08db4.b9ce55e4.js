"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[6030],{4588:(n,e,i)=>{i.r(e),i.d(e,{assets:()=>c,contentTitle:()=>r,default:()=>h,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var t=i(4848),s=i(8453);const o={title:"Overview",description:"Overview of the constituting components",sidebar_position:0},r=void 0,l={id:"modules/index",title:"Overview",description:"Overview of the constituting components",source:"@site/docs/modules/index.md",sourceDirName:"modules",slug:"/modules/",permalink:"/gatk-sv/docs/modules/",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/index.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{title:"Overview",description:"Overview of the constituting components",sidebar_position:0},sidebar:"tutorialSidebar",previous:{title:"Modules",permalink:"/gatk-sv/docs/category/modules"},next:{title:"GatherSampleEvidence",permalink:"/gatk-sv/docs/modules/gse"}},c={},d=[];function a(n){const e={a:"a",code:"code",li:"li",p:"p",strong:"strong",ul:"ul",...(0,s.R)(),...n.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsxs)(e.p,{children:["The pipeline is written in ",(0,t.jsx)(e.a,{href:"https://openwdl.org",children:"Workflow Description Language (WDL)"}),",\nconsisting of multiple modules to be executed in the following order."]}),"\n",(0,t.jsxs)(e.ul,{children:["\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"GatherSampleEvidence"})," SV evidence collection, including calls from a configurable set of\nalgorithms (Manta, MELT, and Wham), read depth (RD), split read positions (SR),\nand discordant pair positions (PE)."]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"EvidenceQC"})," Dosage bias scoring and ploidy estimation."]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"GatherBatchEvidence"})," Copy number variant calling using\n",(0,t.jsx)(e.code,{children:"cn.MOPS"})," and ",(0,t.jsx)(e.code,{children:"GATK gCNV"}),"; B-allele frequency (BAF) generation;\ncall and evidence aggregation."]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"ClusterBatch"})," Variant clustering"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"GenerateBatchMetrics"})," Variant filtering metric generation"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"FilterBatch"})," Variant filtering; outlier exclusion"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"GenotypeBatch"})," Genotyping"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"MakeCohortVcf"})," Cross-batch integration; complex variant resolution and re-genotyping; vcf cleanup"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"Module 07 (in development)"})," Downstream filtering, including minGQ, batch effect check,\noutlier samples removal and final recalibration;"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"AnnotateVCF"})," Annotations, including functional annotation,\nallele frequency (AF) annotation and AF annotation with external population callsets;"]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsxs)(e.p,{children:[(0,t.jsx)(e.strong,{children:"Module 09 (in development)"})," Visualization, including scripts that generates IGV screenshots and rd plots."]}),"\n"]}),"\n",(0,t.jsxs)(e.li,{children:["\n",(0,t.jsx)(e.p,{children:"Additional modules to be added: de novo and mosaic scripts"}),"\n"]}),"\n"]})]})}function h(n={}){const{wrapper:e}={...(0,s.R)(),...n.components};return e?(0,t.jsx)(e,{...n,children:(0,t.jsx)(a,{...n})}):a(n)}},8453:(n,e,i)=>{i.d(e,{R:()=>r,x:()=>l});var t=i(6540);const s={},o=t.createContext(s);function r(n){const e=t.useContext(o);return t.useMemo((function(){return"function"==typeof n?n(e):{...e,...n}}),[e,n])}function l(n){let e;return e=n.disableParentContext?"function"==typeof n.components?n.components(s):n.components||s:r(n.components),t.createElement(o.Provider,{value:e},n.children)}}}]);