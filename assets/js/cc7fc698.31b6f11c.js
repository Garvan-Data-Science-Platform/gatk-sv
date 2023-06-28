"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[9359],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),p=c(r),d=a,f=p["".concat(s,".").concat(d)]||p[d]||m[d]||i;return r?n.createElement(f,o(o({ref:t},u),{},{components:r})):n.createElement(f,o({ref:t},u))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=d;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:a,o[1]=l;for(var c=2;c<i;c++)o[c]=r[c];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},2722:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>o,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>c});var n=r(7462),a=(r(7294),r(3905));const i={title:"GenerateBatchMetrics",description:"Generate Batch Metrics",sidebar_position:6,slug:"gbm"},o=void 0,l={unversionedId:"modules/generate_batch_metrics",id:"modules/generate_batch_metrics",title:"GenerateBatchMetrics",description:"Generate Batch Metrics",source:"@site/docs/modules/generate_batch_metrics.md",sourceDirName:"modules",slug:"/modules/gbm",permalink:"/gatk-sv/docs/modules/gbm",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/modules/generate_batch_metrics.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{title:"GenerateBatchMetrics",description:"Generate Batch Metrics",sidebar_position:6,slug:"gbm"},sidebar:"tutorialSidebar",previous:{title:"ClusterBatch",permalink:"/gatk-sv/docs/modules/cb"},next:{title:"FilterBatch",permalink:"/gatk-sv/docs/modules/fb"}},s={},c=[{value:"Prerequisites",id:"prerequisites",level:3},{value:"Inputs",id:"inputs",level:3},{value:"Outputs",id:"outputs",level:3}],u={toc:c},p="wrapper";function m(e){let{components:t,...r}=e;return(0,a.kt)(p,(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,"Generates variant metrics for filtering."),(0,a.kt)("h3",{id:"prerequisites"},"Prerequisites"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Cluster batch")),(0,a.kt)("h3",{id:"inputs"},"Inputs"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Combined read count matrix, SR, PE, and BAF files (GatherBatchEvidence)"),(0,a.kt)("li",{parentName:"ul"},"Per-sample median coverage estimates (GatherBatchEvidence)"),(0,a.kt)("li",{parentName:"ul"},"Clustered SV VCFs (ClusterBatch)"),(0,a.kt)("li",{parentName:"ul"},"Clustered depth-only call VCF (ClusterBatch)")),(0,a.kt)("h3",{id:"outputs"},"Outputs"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"Metrics file")))}m.isMDXComponent=!0}}]);