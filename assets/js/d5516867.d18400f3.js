"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[1811],{5392:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>r,contentTitle:()=>i,default:()=>u,frontMatter:()=>s,metadata:()=>a,toc:()=>l});var o=t(4848),c=t(8453);const s={title:"SVConcordance",description:"Annotates concordance with raw calls",sidebar_position:18,slug:"svc"},i=void 0,a={id:"modules/concordance",title:"SVConcordance",description:"Annotates concordance with raw calls",source:"@site/docs/modules/concordance.md",sourceDirName:"modules",slug:"/modules/svc",permalink:"/gatk-sv/docs/modules/svc",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/concordance.md",tags:[],version:"current",sidebarPosition:18,frontMatter:{title:"SVConcordance",description:"Annotates concordance with raw calls",sidebar_position:18,slug:"svc"},sidebar:"tutorialSidebar",previous:{title:"JoinRawCalls",permalink:"/gatk-sv/docs/modules/jrc"},next:{title:"FilterGenotypes",permalink:"/gatk-sv/docs/modules/fg"}},r={},l=[{value:"Inputs",id:"inputs",level:3},{value:"<code>output_prefix</code>",id:"output_prefix",level:4},{value:"<code>eval_vcf</code>",id:"eval_vcf",level:4},{value:"<code>truth_vcf</code>",id:"truth_vcf",level:4},{value:"Outputs",id:"outputs",level:3},{value:"<code>concordance_vcf</code>",id:"concordance_vcf",level:4}];function d(e){const n={a:"a",code:"code",h3:"h3",h4:"h4",mermaid:"mermaid",p:"p",...(0,c.R)(),...e.components};return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(n.p,{children:(0,o.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/wdl/SVConcordance.wdl",children:"WDL source code"})}),"\n",(0,o.jsxs)(n.p,{children:["Annotates variants with genotype concordance against another SV call set. This is a general-purpose workflow that can\nbe applied to any pair of VCFs containing the same sample set. This is also a prerequisite step for genotype filtering\nin the recommended pipeline: genotypes are compared to calls emitted by raw callers, where low concordance can be indicative\nof poor quality variants. See\n",(0,o.jsx)(n.a,{href:"https://gatk.broadinstitute.org/hc/en-us/articles/27007917991707-SVConcordance-BETA",children:"GATK-SVConcordance"})," for more\ninformation on methods."]}),"\n",(0,o.jsx)(n.p,{children:"The following diagram illustrates the recommended invocation order:"}),"\n",(0,o.jsx)(n.mermaid,{value:"\nstateDiagram\n  direction LR\n  \n  classDef inModules stroke-width:0px,fill:#caf0f8,color:#00509d\n  classDef thisModule font-weight:bold,stroke-width:0px,fill:#ff9900,color:white\n  classDef outModules stroke-width:0px,fill:#caf0f8,color:#00509d\n\n  amvf: ApplyManualVariantFilter\n  jrc: JoinRawCalls\n  svc: SVConcordance\n  fg: FilterGenotypes\n  amvf --\x3e svc\n  jrc --\x3e svc\n  svc --\x3e fg\n  \n  class svc thisModule\n  class amvf inModules\n  class jrc inModules\n  class fg outModules"}),"\n",(0,o.jsx)(n.h3,{id:"inputs",children:"Inputs"}),"\n",(0,o.jsx)(n.h4,{id:"output_prefix",children:(0,o.jsx)(n.code,{children:"output_prefix"})}),"\n",(0,o.jsx)(n.p,{children:"Prefix for the output VCF, such as the cohort name. May be alphanumeric with underscores."}),"\n",(0,o.jsx)(n.h4,{id:"eval_vcf",children:(0,o.jsx)(n.code,{children:"eval_vcf"})}),"\n",(0,o.jsxs)(n.p,{children:["VCF to annotate. In the recommended pipeline, this is generated in ",(0,o.jsx)(n.a,{href:"./amvf",children:"ApplyManualVariantFilter"}),"."]}),"\n",(0,o.jsx)(n.h4,{id:"truth_vcf",children:(0,o.jsx)(n.code,{children:"truth_vcf"})}),"\n",(0,o.jsxs)(n.p,{children:["VCF to compare against. This should contain the same samples as ",(0,o.jsx)(n.code,{children:"eval_vcf"}),". In the recommended pipeline, this is\ngenerated in ",(0,o.jsx)(n.a,{href:"./jrc",children:"JoinRawCalls"}),"."]}),"\n",(0,o.jsx)(n.h3,{id:"outputs",children:"Outputs"}),"\n",(0,o.jsx)(n.h4,{id:"concordance_vcf",children:(0,o.jsx)(n.code,{children:"concordance_vcf"})}),"\n",(0,o.jsx)(n.p,{children:'"Eval" VCF annotated with genotype concordance.'})]})}function u(e={}){const{wrapper:n}={...(0,c.R)(),...e.components};return n?(0,o.jsx)(n,{...e,children:(0,o.jsx)(d,{...e})}):d(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>i,x:()=>a});var o=t(6540);const c={},s=o.createContext(c);function i(e){const n=o.useContext(s);return o.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function a(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),o.createElement(s.Provider,{value:n},e.children)}}}]);