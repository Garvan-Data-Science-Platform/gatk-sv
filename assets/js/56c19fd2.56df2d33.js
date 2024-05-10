"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[949],{5680:(e,t,r)=>{r.d(t,{xA:()=>c,yg:()=>m});var n=r(6540);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),u=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return n.createElement(s.Provider,{value:t},e.children)},p="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(r),f=o,m=p["".concat(s,".").concat(f)]||p[f]||d[f]||a;return r?n.createElement(m,i(i({ref:t},c),{},{components:r})):n.createElement(m,i({ref:t},c))}));function m(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=f;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[p]="string"==typeof e?e:o,i[1]=l;for(var u=2;u<a;u++)i[u]=r[u];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5143:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>a,metadata:()=>l,toc:()=>u});var n=r(8168),o=(r(6540),r(5680));const a={title:"FAQ",slug:"faq"},i=void 0,l={unversionedId:"troubleshooting/faq",id:"troubleshooting/faq",title:"FAQ",description:"VM runs out of memory or disk",source:"@site/docs/troubleshooting/faq.md",sourceDirName:"troubleshooting",slug:"/troubleshooting/faq",permalink:"/gatk-sv/docs/troubleshooting/faq",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/troubleshooting/faq.md",tags:[],version:"current",frontMatter:{title:"FAQ",slug:"faq"},sidebar:"tutorialSidebar",previous:{title:"Troubleshooting",permalink:"/gatk-sv/docs/category/troubleshooting"},next:{title:"Modules",permalink:"/gatk-sv/docs/category/modules"}},s={},u=[{value:"VM runs out of memory or disk",id:"vm-runs-out-of-memory-or-disk",level:3},{value:"Calculated read length causes error in MELT workflow",id:"calculated-read-length-causes-error-in-melt-workflow",level:3}],c={toc:u},p="wrapper";function d(e){let{components:t,...r}=e;return(0,o.yg)(p,(0,n.A)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,o.yg)("h3",{id:"vm-runs-out-of-memory-or-disk"},"VM runs out of memory or disk"),(0,o.yg)("ul",null,(0,o.yg)("li",{parentName:"ul"},(0,o.yg)("p",{parentName:"li"},"Default pipeline settings are tuned for batches of 100 samples.\nLarger batches or cohorts may require additional VM resources.\nMost runtime attributes can be modified through\nthe RuntimeAttr inputs. These are formatted like this in the json:"),(0,o.yg)("pre",{parentName:"li"},(0,o.yg)("code",{parentName:"pre",className:"language-json"},'"MyWorkflow.runtime_attr_override": {\n  "disk_gb": 100,\n  "mem_gb": 16\n},\n')),(0,o.yg)("p",{parentName:"li"},"Note that a subset of the struct attributes can be specified.\nSee ",(0,o.yg)("inlineCode",{parentName:"p"},"wdl/Structs.wdl")," for available attributes."))),(0,o.yg)("h3",{id:"calculated-read-length-causes-error-in-melt-workflow"},"Calculated read length causes error in MELT workflow"),(0,o.yg)("p",null,"Example error message from ",(0,o.yg)("inlineCode",{parentName:"p"},"GatherSampleEvidence.MELT.GetWgsMetrics"),":"),(0,o.yg)("blockquote",null,(0,o.yg)("p",{parentName:"blockquote"},'Exception in thread "main" java.lang.ArrayIndexOutOfBoundsException:\nThe requested index 701766 is out of counter bounds.\nPossible cause of exception can be wrong READ_LENGTH\nparameter (much smaller than actual read length)')),(0,o.yg)("p",null,"This error message was observed for a sample with an average\nread length of 117, but for which half the reads were of length\n90 and half were of length 151. As a workaround, override the\ncalculated read length by providing a ",(0,o.yg)("inlineCode",{parentName:"p"},"read_length")," input of 151\n(or the expected read length for the sample in question) to ",(0,o.yg)("inlineCode",{parentName:"p"},"GatherSampleEvidence"),"."))}d.isMDXComponent=!0}}]);