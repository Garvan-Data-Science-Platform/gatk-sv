"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[9418],{5680:(e,t,n)=>{n.d(t,{xA:()=>p,yg:()=>g});var r=n(6540);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},i=Object.keys(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(r=0;r<i.length;r++)n=i[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),c=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},p=function(e){var t=c(e.components);return r.createElement(s.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,i=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=c(n),m=o,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||i;return n?r.createElement(g,a(a({ref:t},p),{},{components:n})):r.createElement(g,a({ref:t},p))}));function g(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=n.length,a=new Array(i);a[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:o,a[1]=l;for(var c=2;c<i;c++)a[c]=n[c];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},1100:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var r=n(8168),o=(n(6540),n(5680));const i={title:"Joint-calling",description:"Run the pipeline on a cohort",sidebar_position:4,slug:"joint"},a=void 0,l={unversionedId:"run/joint",id:"run/joint",title:"Joint-calling",description:"Run the pipeline on a cohort",source:"@site/docs/run/joint.md",sourceDirName:"run",slug:"/run/joint",permalink:"/gatk-sv/docs/run/joint",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/run/joint.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{title:"Joint-calling",description:"Run the pipeline on a cohort",sidebar_position:4,slug:"joint"},sidebar:"tutorialSidebar",previous:{title:"Single-sample",permalink:"/gatk-sv/docs/run/single"},next:{title:"Troubleshooting",permalink:"/gatk-sv/docs/category/troubleshooting"}},s={},c=[{value:"Batching",id:"batching",level:2}],p={toc:c},u="wrapper";function d(e){let{components:t,...n}=e;return(0,o.yg)(u,(0,r.A)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("admonition",{type:"info"},(0,o.yg)("p",{parentName:"admonition"},"This documentation page is incomplete, and we are actively working on improving it with comprehensive information.")),(0,o.yg)("h2",{id:"batching"},"Batching"),(0,o.yg)("p",null,"For larger cohorts, samples should be split up into batches of about 100-500\nsamples with similar characteristics. We recommend batching based on overall\ncoverage and dosage score (WGD), which can be generated in ",(0,o.yg)("a",{parentName:"p",href:"/docs/modules/eqc"},"EvidenceQC"),".\nAn example batching process is outlined below:"),(0,o.yg)("ol",null,(0,o.yg)("li",{parentName:"ol"},"Divide the cohort into PCR+ and PCR- samples"),(0,o.yg)("li",{parentName:"ol"},"Partition the samples by median coverage from ",(0,o.yg)("a",{parentName:"li",href:"/docs/modules/eqc"},"EvidenceQC"),",\ngrouping samples with similar median coverage together. The end goal is to\ndivide the cohort into roughly equal-sized batches of about 100-500 samples;\nif your partitions based on coverage are larger or uneven, you can partition\nthe cohort further in the next step to obtain the final batches. "),(0,o.yg)("li",{parentName:"ol"},"Optionally, divide the samples further by dosage score (WGD) from\n",(0,o.yg)("a",{parentName:"li",href:"/docs/modules/eqc"},"EvidenceQC"),", grouping samples with similar WGD score\ntogether, to obtain roughly equal-sized batches of about 100-500 samples"),(0,o.yg)("li",{parentName:"ol"},"Maintain a roughly equal sex balance within each batch, based on sex\nassignments from ",(0,o.yg)("a",{parentName:"li",href:"/docs/modules/eqc"},"EvidenceQC"))))}d.isMDXComponent=!0}}]);