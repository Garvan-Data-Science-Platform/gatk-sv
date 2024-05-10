"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[7945],{5680:(e,r,t)=>{t.d(r,{xA:()=>c,yg:()=>g});var n=t(6540);function a(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function o(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);r&&(n=n.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,n)}return t}function i(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?o(Object(t),!0).forEach((function(r){a(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function l(e,r){if(null==e)return{};var t,n,a=function(e,r){if(null==e)return{};var t,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||(a[t]=e[t]);return a}(e,r);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)t=o[n],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var s=n.createContext({}),p=function(e){var r=n.useContext(s),t=r;return e&&(t="function"==typeof e?e(r):i(i({},r),e)),t},c=function(e){var r=p(e.components);return n.createElement(s.Provider,{value:r},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return n.createElement(n.Fragment,{},r)}},m=n.forwardRef((function(e,r){var t=e.components,a=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),u=p(t),m=a,g=u["".concat(s,".").concat(m)]||u[m]||d[m]||o;return t?n.createElement(g,i(i({ref:r},c),{},{components:t})):n.createElement(g,i({ref:r},c))}));function g(e,r){var t=arguments,a=r&&r.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=m;var l={};for(var s in r)hasOwnProperty.call(r,s)&&(l[s]=r[s]);l.originalType=e,l[u]="string"==typeof e?e:a,i[1]=l;for(var p=2;p<o;p++)i[p]=t[p];return n.createElement.apply(null,i)}return n.createElement.apply(null,t)}m.displayName="MDXCreateElement"},4633:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>s,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var n=t(8168),a=(t(6540),t(5680));const o={title:"Overview",description:"Overview",sidebar_position:1,slug:"overview"},i=void 0,l={unversionedId:"run/overview",id:"run/overview",title:"Overview",description:"Overview",source:"@site/docs/run/overview.md",sourceDirName:"run",slug:"/run/overview",permalink:"/gatk-sv/docs/run/overview",draft:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/run/overview.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Overview",description:"Overview",sidebar_position:1,slug:"overview"},sidebar:"tutorialSidebar",previous:{title:"Run",permalink:"/gatk-sv/docs/category/run"},next:{title:"Single-sample",permalink:"/gatk-sv/docs/run/single"}},s={},p=[],c={toc:p},u="wrapper";function d(e){let{components:r,...t}=e;return(0,a.yg)(u,(0,n.A)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,a.yg)("p",null,"There are two factors to consider when deciding how to run GATK-SV. "),(0,a.yg)("ol",null,(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("strong",{parentName:"p"},"Variant calling modes: single-sample and cohort-based calling."),"\nGATK-SV offers two distinct pipeline configurations for detecting\nstructural variations (SVs), each tailored for different research needs:"),(0,a.yg)("ul",{parentName:"li"},(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("strong",{parentName:"p"},"Single-sample analysis:"),"\nThis configuration is ideal for examining SVs in individual samples,\nfocusing exclusively on data from that single sample. Running this mode is less complex,\ninvolving just one workflow per sample.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("strong",{parentName:"p"},"Joint calling:"),"\nThis configuration is designed for more extensive studies, such as those\ninvolving population genetics or disease association studies.\nIt analyzes SVs across a cohort by collectively assessing data from all samples.\nHowever, this comes with increased complexity compared to the single-sample mode,\nrequiring the execution of multiple workflows and involves data preparation steps\n(e.g., batching files from the cohort)."))))),(0,a.yg)("ol",{start:2},(0,a.yg)("li",{parentName:"ol"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("strong",{parentName:"p"},"Which platform you would like to use for running GATK-SV?"),"\nYou may run GATK-SV on the following platforms. "),(0,a.yg)("ul",{parentName:"li"},(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("a",{parentName:"p",href:"https://terra.bio"},"Terra.bio"),": A user-friendly cloud-native platform for scalable data analysis.\nThe primary focus of this documentation is on supporting the execution of GATK-SV within the Terra platform.")),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("p",{parentName:"li"},(0,a.yg)("a",{parentName:"p",href:"https://github.com/broadinstitute/cromwell"},"Cromwell"),":\nYou may run GATK-SV on a self-hosted and managed cromwell instance, which is ideal for\npower-users and developers. We provide guidelines for this option in the\n",(0,a.yg)("a",{parentName:"p",href:"/docs/advanced/development/cromwell"},(0,a.yg)("em",{parentName:"a"},"advanced guides"))," section."))))),(0,a.yg)("p",null,"Your decision regarding the execution modes and platform should be guided by\nthe objectives of your study, the size of your cohort, data access needs,\nand the trade-off between a straightforward interface (Terra)\nand more detailed customization options (self-managed Cromwell server).\nPlease refer to the following documentation on running GATK-SV within the Terra platform."),(0,a.yg)("ul",null,(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/gatk-sv/docs/run/single"},"Single-sample on Terra"),";"),(0,a.yg)("li",{parentName:"ul"},(0,a.yg)("a",{parentName:"li",href:"/gatk-sv/docs/run/joint"},"Joint calling on Terra"),".")))}d.isMDXComponent=!0}}]);