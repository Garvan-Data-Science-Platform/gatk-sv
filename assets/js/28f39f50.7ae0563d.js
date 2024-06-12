"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[9766],{7622:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>c,contentTitle:()=>o,default:()=>h,frontMatter:()=>a,metadata:()=>s,toc:()=>d});var r=i(4848),t=i(8453);const a={title:"Overview",description:"Docker Concepts and Execution Overview",sidebar_position:0},o=void 0,s={id:"advanced/docker/index",title:"Overview",description:"Docker Concepts and Execution Overview",source:"@site/docs/advanced/docker/index.md",sourceDirName:"advanced/docker",slug:"/advanced/docker/",permalink:"/gatk-sv/docs/advanced/docker/",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/advanced/docker/index.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{title:"Overview",description:"Docker Concepts and Execution Overview",sidebar_position:0},sidebar:"tutorialSidebar",previous:{title:"Docker Images",permalink:"/gatk-sv/docs/category/docker-images"},next:{title:"Docker Images Hierarchy",permalink:"/gatk-sv/docs/advanced/docker/images"}},c={},d=[{value:"Docker Primer",id:"docker-primer",level:2}];function l(e){const n={a:"a",admonition:"admonition",h2:"h2",li:"li",mermaid:"mermaid",p:"p",strong:"strong",ul:"ul",...(0,t.R)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.p,{children:"GATK-SV is a cloud-native pipeline, making it scalable and reproducible.\nAll of the tools, scripts, and settings required to run the pipeline are\npackaged in multiple Docker images, which are built and hosted\non container registries and are ready to use in Terra workspaces."}),"\n",(0,r.jsx)(n.p,{children:"There are two options for building, testing, and publishing GATK-SV\ndocker images: fully automated and manual.\nGATK-SV Docker images are maintained through the automated approach,\nwhich is built into CI/CD and builds, tests, and publishes images to\nGoogle Container Registry (GCR) and Azure Container Registry (ACR).\nHowever, if you are working on extending or improving the GATK-SV Docker images,\nyou may need to build them locally\nfor testing or storing them on an alternative container registry.\nIn this section, we provide detailed guidelines on both approaches.\nSpecifically, this section covers the following topics:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"#docker-primer",children:"Docker primer"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"./images",children:"GATK-SV Docker images"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"./automated",children:"Automatic deployment"})}),"\n",(0,r.jsx)(n.li,{children:(0,r.jsx)(n.a,{href:"./manual",children:"Manual deployment"})}),"\n"]}),"\n",(0,r.jsx)(n.h2,{id:"docker-primer",children:"Docker Primer"}),"\n",(0,r.jsx)(n.p,{children:"Docker technology enables creating a reproducible environment for data analysis.\nIt enables defining an environment with all the tools, scripts,\nand their dependencies installed and configured as needed to run a data analysis pipeline.\nThe following are the key components to define and run in this environment:"}),"\n",(0,r.jsxs)(n.ul,{children:["\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Dockerfile"}),"; a text file with instructions on installing and configuring tools,\nscripts, and their dependencies. It is mainly used to create reproducible Docker images."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Docker image"}),"; is a template generated from a Dockerfile and contains all\nthe tools and scripts installed and configured as defined in a Dockerfile."]}),"\n"]}),"\n",(0,r.jsxs)(n.li,{children:["\n",(0,r.jsxs)(n.p,{children:[(0,r.jsx)(n.strong,{children:"Docker container"}),"; is an isolated runtime environment created based on a Docker image,\nwhich runs on a host machine (e.g., laptop or a virtual machine on the cloud) and can execute scripts."]}),"\n"]}),"\n"]}),"\n",(0,r.jsx)(n.p,{children:"The following figure illustrates the relationship between Dockerfiles, Docker images, and Docker containers:"}),"\n",(0,r.jsx)(n.mermaid,{value:"\nflowchart LR\n    dockerfile[Dockerfile] -- Build --\x3e acr_image[Docker Image] & gcp_image[Docker Image]\n    \n    subgraph Microsoft Azure\n        subgraph ACR\n        acr_image\n        end\n    \n        subgraph Azure VM\n        acr_image -- Run  --\x3e az_container[Container]\n        end\n    end\n    \n    subgraph Google Cloud Platform\n        subgraph GCR\n        gcp_image\n        end\n    \n        subgraph GCP VM\n        gcp_image -- Run --\x3e gcp_container[Container]\n        end\n    end\n    "}),"\n",(0,r.jsxs)(n.p,{children:["Dockerfiles are text files, and GATK-SV stores them on\n",(0,r.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv/tree/main/dockerfiles",children:"GitHub"}),"\nfor accessibility and version control.\nDocker images are larger files (e.g., 1GiB) and should be hosted on container registries\naccessible to runtime environments. GATK-SV stores images on Google Container Registry (GCR)\nand Azure Container Registry (ACR) so they are accessible to the\nworkflow execution environment on the Terra platform.\nDocker containers are ephemeral runtime environments, created on\nvirtual machines when the analysis starts, and are \u201cpurged\u201d when the analysis finishes."]}),"\n",(0,r.jsx)(n.admonition,{title:"Images hosted on ACR and GCR are identical",type:"tip",children:(0,r.jsx)(n.p,{children:"The GATK-SV images hosted on GCR and ACR are identical.\nWe maintain these mirrored repositories to enable running GATK-SV on Terra\nwith both GCP and Azure (WIP) backends."})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>o,x:()=>s});var r=i(6540);const t={},a=r.createContext(t);function o(e){const n=r.useContext(a);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function s(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:o(e.components),r.createElement(a.Provider,{value:n},e.children)}}}]);