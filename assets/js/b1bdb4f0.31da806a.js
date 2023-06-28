"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[5337],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var n=r(7294);function l(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){l(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function o(e,t){if(null==e)return{};var r,n,l=function(e,t){if(null==e)return{};var r,n,l={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(l[r]=e[r]);return l}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(l[r]=e[r])}return l}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,l=e.mdxType,i=e.originalType,s=e.parentName,c=o(e,["components","mdxType","originalType","parentName"]),p=u(r),d=l,m=p["".concat(s,".").concat(d)]||p[d]||f[d]||i;return r?n.createElement(m,a(a({ref:t},c),{},{components:r})):n.createElement(m,a({ref:t},c))}));function m(e,t){var r=arguments,l=t&&t.mdxType;if("string"==typeof e||l){var i=r.length,a=new Array(i);a[0]=d;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o[p]="string"==typeof e?e:l,a[1]=o;for(var u=2;u<i;u++)a[u]=r[u];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},6410:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>a,default:()=>f,frontMatter:()=>i,metadata:()=>o,toc:()=>u});var n=r(7462),l=(r(7294),r(3905));const i={title:"FilterBatch",description:"Filter Batch",sidebar_position:7,slug:"fb"},a=void 0,o={unversionedId:"modules/filter_batch",id:"modules/filter_batch",title:"FilterBatch",description:"Filter Batch",source:"@site/docs/modules/filter_batch.md",sourceDirName:"modules",slug:"/modules/fb",permalink:"/gatk-sv/docs/modules/fb",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/filter_batch.md",tags:[],version:"current",sidebarPosition:7,frontMatter:{title:"FilterBatch",description:"Filter Batch",sidebar_position:7,slug:"fb"},sidebar:"tutorialSidebar",previous:{title:"GenerateBatchMetrics",permalink:"/gatk-sv/docs/modules/gbm"},next:{title:"MergeBatchSites",permalink:"/gatk-sv/docs/modules/msites"}},s={},u=[{value:"Prerequisites",id:"prerequisites",level:3},{value:"Inputs",id:"inputs",level:3},{value:"Outputs",id:"outputs",level:3}],c={toc:u},p="wrapper";function f(e){let{components:t,...r}=e;return(0,l.kt)(p,(0,n.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,l.kt)("p",null,"Filters poor quality variants and filters outlier samples.\nThis workflow can be run all at once with the WDL at wdl/FilterBatch.wdl,\nor it can be run in three steps to enable tuning of outlier\nfiltration cutoffs. The three subworkflows are:"),(0,l.kt)("ol",null,(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"FilterBatchSites: Per-batch variant filtration")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"PlotSVCountsPerSample: Visualize SV counts per\nsample per type to help choose an IQR cutoff for\noutlier filtering, and preview outlier samples for a given cutoff")),(0,l.kt)("li",{parentName:"ol"},(0,l.kt)("p",{parentName:"li"},"FilterBatchSamples: Per-batch outlier sample filtration;\nprovide an appropriate outlier_cutoff_nIQR based on the\nSV count plots and outlier previews from step 2. Note\nthat not removing high outliers can result in increased\ncompute cost and a higher false positive rate in later steps."))),(0,l.kt)("h3",{id:"prerequisites"},"Prerequisites"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Generate Batch Metrics")),(0,l.kt)("h3",{id:"inputs"},"Inputs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},"Batch PED file"),(0,l.kt)("li",{parentName:"ul"},"Metrics file (GenerateBatchMetrics)"),(0,l.kt)("li",{parentName:"ul"},"Clustered SV and depth-only call VCFs (ClusterBatch)")),(0,l.kt)("h3",{id:"outputs"},"Outputs"),(0,l.kt)("ul",null,(0,l.kt)("li",{parentName:"ul"},'Filtered SV (non-depth-only a.k.a. "PESR") VCF with outlier samples excluded'),(0,l.kt)("li",{parentName:"ul"},"Filtered depth-only call VCF with outlier samples excluded"),(0,l.kt)("li",{parentName:"ul"},"Random forest cutoffs file"),(0,l.kt)("li",{parentName:"ul"},"PED file with outlier samples excluded")))}f.isMDXComponent=!0}}]);