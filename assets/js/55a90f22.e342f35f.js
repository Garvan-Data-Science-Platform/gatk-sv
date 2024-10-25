"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[4293],{4747:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>u,frontMatter:()=>s,metadata:()=>o,toc:()=>c});var i=t(4848),a=t(8453);t(1470),t(9365);const s={title:"Docker Images Hierarchy",description:"Docker Image Dependencies",sidebar_position:1},r=void 0,o={id:"advanced/docker/images",title:"Docker Images Hierarchy",description:"Docker Image Dependencies",source:"@site/docs/advanced/docker/images.md",sourceDirName:"advanced/docker",slug:"/advanced/docker/images",permalink:"/gatk-sv/docs/advanced/docker/images",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/advanced/docker/images.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Docker Images Hierarchy",description:"Docker Image Dependencies",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/gatk-sv/docs/advanced/docker/"},next:{title:"Automated Deployment",permalink:"/gatk-sv/docs/advanced/docker/automated"}},l={},c=[{value:"Incremental publishing",id:"incremental",level:2},{value:"Determining modified files",id:"determining-modified-files",level:3},{value:"Identifying Images Requiring Rebuilding from Changed Files",id:"identifying-images-requiring-rebuilding-from-changed-files",level:2}];function d(e){const n={a:"a",admonition:"admonition",code:"code",h2:"h2",h3:"h3",li:"li",mermaid:"mermaid",ol:"ol",p:"p",ul:"ul",...(0,a.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.admonition,{type:"info",children:(0,i.jsxs)(n.p,{children:["This page provides a detailed explanation of Docker\nimages and their hierarchy. For information on the process\nof building these images, please refer to the\n",(0,i.jsx)(n.a,{href:"/docs/advanced/docker/automated",children:"automated"})," or\n",(0,i.jsx)(n.a,{href:"/docs/advanced/docker/manual",children:"manual"})," builds sections."]})}),"\n",(0,i.jsx)(n.p,{children:"GATK-SV organizes the tools, scripts, and their dependencies and configurations\ninto multiple Docker images. Each Docker image is built for a specific purpose,\nand images have a hierarchical dependency.\nThis modular design has the following key advantages."}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"It results in focused and more straightforward instructions in Dockerfiles,\nfacilitating their development, maintenance, and extensibility."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"It results in smaller Docker images, as each image contains only\nthe related tools and scripts. Smaller images reduce storage costs on container\nregistries and are transferred faster to virtual machines, resulting in shorter start-up."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"The modular design reduces duplication in Dockerfiles and ensures configuration\nconsistency across different Docker images."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["This architecture significantly lowers the maintenance cost as it\nnecessitates updating only the affected Docker images throughout the development\n(discussed in details in the ",(0,i.jsx)(n.a,{href:"#incremental",children:"following section"}),")."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The following figure illustrates the hierarchical relationship between GATK-SV Docker images.\nThe arrows indicate the flow from a base to a derived image, where the derived image\nextends or modifies the tools and configuration it inherits from the base image."}),"\n",(0,i.jsx)(n.mermaid,{value:"flowchart TD\n    ubuntu2204[Ubuntu 22.04] --\x3e svbasemini[sv-base-mini] & samtoolsenv[samtools-cloud-virtual-env] & svbaseenv[sv-base-virtual-env]\n    svbasemini & samtoolsenv & svbaseenv --\x3e svpipelineenv[sv-pipeline-virtual-env]\n    samtoolsenv --\x3e samtoolscloud[samtools-cloud] & svutilsenv[sv-utils-env]\n    svbasemini --\x3e samtoolscloud\n    svutilsenv --\x3e svutils[sv-utils]\n    samtoolscloud --\x3e svutils & svbase[sv-base]\n    svpipelineenv & svbase --\x3e svpipeline[sv-pipeline]\n    svbaseenv --\x3e cnmopsenv[cnmpos-virtual-env]\n    svbase & cnmopsenv --\x3e cnmpos[cnmops]\n\n    ubuntu1804[Ubuntu 18.04] --\x3e melt[MELT] & wham[Wham]\n    samtoolscloud --\x3e wham\n    ubuntu2210[Ubuntu 22.10] --\x3e str[STR]\n    ubuntu2204 --\x3e scramble[Scramble] & manta[Manta]"}),"\n",(0,i.jsxs)(n.p,{children:["The list of the Docker images and their latest builds\nare available in ",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/inputs/values/dockers.json",children:(0,i.jsx)(n.code,{children:"dockers.json"})}),"\nand ",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/inputs/values/dockers_azure.json",children:(0,i.jsx)(n.code,{children:"dockers_azure.json"})}),"\nfor images hosted on Google Container Registry (GCR) and Azure Container Registry (ACR), respectively."]}),"\n",(0,i.jsx)(n.h2,{id:"incremental",children:"Incremental publishing"}),"\n",(0,i.jsx)(n.p,{children:"The hierarchical and modular architecture of GATK-SV Docker images has a significant advantage:\nnot every image is affected by every change to the codebase;\nhence, not all Docker images need to be rebuilt and published with every pull request.\nThis strategy is particularly beneficial considering the build time and the size of Docker images."}),"\n",(0,i.jsx)(n.p,{children:"This strategy is implemented in the build_docker.py script, and it has two main steps as follows."}),"\n",(0,i.jsx)(n.h3,{id:"determining-modified-files",children:"Determining modified files"}),"\n",(0,i.jsxs)(n.p,{children:["The incremental build strategy relies on identifying the list of files changed between two\n",(0,i.jsx)(n.code,{children:"git"})," commits and mapping it to the list of Docker images. The\n",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/scripts/docker/build_docker.py",children:(0,i.jsx)(n.code,{children:"build_docker"})}),"\nextracts the list of changed files from the diff between two\n",(0,i.jsxs)(n.a,{href:"https://docs.github.com/en/pull-requests/committing-changes-to-your-project/creating-and-editing-commits/about-commits",children:[(0,i.jsx)(n.code,{children:"git"})," commit SHAs"]}),":"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"BASE_SHA"}),": the reference commit (e.g., ",(0,i.jsx)(n.code,{children:"HEAD"})," of the ",(0,i.jsx)(n.code,{children:"main"})," branch);"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"HEAD_SHA"}),": the target commit (e.g., the latest commit on the feature branch)."]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The user provides these commit SHAs (or references the images specifically)\nwhen building the images manually.\nHowever, the automated CI/CD builds determine the commit SHAs automatically as the following example."}),"\n",(0,i.jsx)(n.mermaid,{value:'%%{init: { \n            \'logLevel\': \'debug\',\n            \'gitGraph\': {\'rotateCommitLabel\': false}, \n            \'themeVariables\': { \'commitLabelFontSize\': \'22px\' } \n         } \n   }%%\ngitGraph\n   commit id: "A"\n   commit id: "B"\n   branch feature\n   checkout feature\n   commit id: "X"\n   checkout main\n   commit id: "C"\n   checkout feature\n   commit id: "Y"\n   checkout main\n   commit id: "D"\n   checkout feature\n   commit id: "Z"\n   checkout main\n   merge feature id: "E"\n   commit id: "F"'}),"\n",(0,i.jsxs)(n.p,{children:["In this example, ",(0,i.jsx)(n.code,{children:"BASE_SHA=B"}),", ",(0,i.jsx)(n.code,{children:"HEAD_SHA=Z"}),", and ",(0,i.jsx)(n.code,{children:"E"})," is the merge commit."]}),"\n",(0,i.jsx)(n.h2,{id:"identifying-images-requiring-rebuilding-from-changed-files",children:"Identifying Images Requiring Rebuilding from Changed Files"}),"\n",(0,i.jsxs)(n.p,{children:["The ",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/blob/main/scripts/docker/build_docker.py",children:(0,i.jsx)(n.code,{children:"build_docker"})}),"\nscript determines the list of docker images\nthat need to be rebuilt based on the following conditions."]}),"\n",(0,i.jsxs)(n.ol,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"It determines the list of directly impacted images by checking the\nlist of files each image depends on, and rebuilds the image if any of the files have changed."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"It builds any image if its base image is rebuilt."}),"\n"]}),"\n"]})]})}function u(e={}){const{wrapper:n}={...(0,a.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(d,{...e})}):d(e)}},9365:(e,n,t)=>{t.d(n,{A:()=>r});t(6540);var i=t(4164);const a={tabItem:"tabItem_Ymn6"};var s=t(4848);function r(e){let{children:n,hidden:t,className:r}=e;return(0,s.jsx)("div",{role:"tabpanel",className:(0,i.A)(a.tabItem,r),hidden:t,children:n})}},1470:(e,n,t)=>{t.d(n,{A:()=>y});var i=t(6540),a=t(4164),s=t(3104),r=t(6347),o=t(205),l=t(7485),c=t(1682),d=t(679);function u(e){return i.Children.toArray(e).filter((e=>"\n"!==e)).map((e=>{if(!e||(0,i.isValidElement)(e)&&function(e){const{props:n}=e;return!!n&&"object"==typeof n&&"value"in n}(e))return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)}))?.filter(Boolean)??[]}function h(e){const{values:n,children:t}=e;return(0,i.useMemo)((()=>{const e=n??function(e){return u(e).map((e=>{let{props:{value:n,label:t,attributes:i,default:a}}=e;return{value:n,label:t,attributes:i,default:a}}))}(t);return function(e){const n=(0,c.XI)(e,((e,n)=>e.value===n.value));if(n.length>0)throw new Error(`Docusaurus error: Duplicate values "${n.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`)}(e),e}),[n,t])}function m(e){let{value:n,tabValues:t}=e;return t.some((e=>e.value===n))}function f(e){let{queryString:n=!1,groupId:t}=e;const a=(0,r.W6)(),s=function(e){let{queryString:n=!1,groupId:t}=e;if("string"==typeof n)return n;if(!1===n)return null;if(!0===n&&!t)throw new Error('Docusaurus error: The <Tabs> component groupId prop is required if queryString=true, because this value is used as the search param name. You can also provide an explicit value such as queryString="my-search-param".');return t??null}({queryString:n,groupId:t});return[(0,l.aZ)(s),(0,i.useCallback)((e=>{if(!s)return;const n=new URLSearchParams(a.location.search);n.set(s,e),a.replace({...a.location,search:n.toString()})}),[s,a])]}function g(e){const{defaultValue:n,queryString:t=!1,groupId:a}=e,s=h(e),[r,l]=(0,i.useState)((()=>function(e){let{defaultValue:n,tabValues:t}=e;if(0===t.length)throw new Error("Docusaurus error: the <Tabs> component requires at least one <TabItem> children component");if(n){if(!m({value:n,tabValues:t}))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${n}" but none of its children has the corresponding value. Available values are: ${t.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);return n}const i=t.find((e=>e.default))??t[0];if(!i)throw new Error("Unexpected error: 0 tabValues");return i.value}({defaultValue:n,tabValues:s}))),[c,u]=f({queryString:t,groupId:a}),[g,p]=function(e){let{groupId:n}=e;const t=function(e){return e?`docusaurus.tab.${e}`:null}(n),[a,s]=(0,d.Dv)(t);return[a,(0,i.useCallback)((e=>{t&&s.set(e)}),[t,s])]}({groupId:a}),b=(()=>{const e=c??g;return m({value:e,tabValues:s})?e:null})();(0,o.A)((()=>{b&&l(b)}),[b]);return{selectedValue:r,selectValue:(0,i.useCallback)((e=>{if(!m({value:e,tabValues:s}))throw new Error(`Can't select invalid tab value=${e}`);l(e),u(e),p(e)}),[u,p,s]),tabValues:s}}var p=t(2303);const b={tabList:"tabList__CuJ",tabItem:"tabItem_LNqP"};var v=t(4848);function x(e){let{className:n,block:t,selectedValue:i,selectValue:r,tabValues:o}=e;const l=[],{blockElementScrollPositionUntilNextRender:c}=(0,s.a_)(),d=e=>{const n=e.currentTarget,t=l.indexOf(n),a=o[t].value;a!==i&&(c(n),r(a))},u=e=>{let n=null;switch(e.key){case"Enter":d(e);break;case"ArrowRight":{const t=l.indexOf(e.currentTarget)+1;n=l[t]??l[0];break}case"ArrowLeft":{const t=l.indexOf(e.currentTarget)-1;n=l[t]??l[l.length-1];break}}n?.focus()};return(0,v.jsx)("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,a.A)("tabs",{"tabs--block":t},n),children:o.map((e=>{let{value:n,label:t,attributes:s}=e;return(0,v.jsx)("li",{role:"tab",tabIndex:i===n?0:-1,"aria-selected":i===n,ref:e=>l.push(e),onKeyDown:u,onClick:d,...s,className:(0,a.A)("tabs__item",b.tabItem,s?.className,{"tabs__item--active":i===n}),children:t??n},n)}))})}function k(e){let{lazy:n,children:t,selectedValue:s}=e;const r=(Array.isArray(t)?t:[t]).filter(Boolean);if(n){const e=r.find((e=>e.props.value===s));return e?(0,i.cloneElement)(e,{className:(0,a.A)("margin-top--md",e.props.className)}):null}return(0,v.jsx)("div",{className:"margin-top--md",children:r.map(((e,n)=>(0,i.cloneElement)(e,{key:n,hidden:e.props.value!==s})))})}function j(e){const n=g(e);return(0,v.jsxs)("div",{className:(0,a.A)("tabs-container",b.tabList),children:[(0,v.jsx)(x,{...n,...e}),(0,v.jsx)(k,{...n,...e})]})}function y(e){const n=(0,p.A)();return(0,v.jsx)(j,{...e,children:u(e.children)},String(n))}},8453:(e,n,t)=>{t.d(n,{R:()=>r,x:()=>o});var i=t(6540);const a={},s=i.createContext(a);function r(e){const n=i.useContext(s);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:r(e.components),i.createElement(s.Provider,{value:n},e.children)}}}]);