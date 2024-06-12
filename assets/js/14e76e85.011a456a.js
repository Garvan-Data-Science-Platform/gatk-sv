"use strict";(self.webpackChunkGATK_SV=self.webpackChunkGATK_SV||[]).push([[3458],{4089:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>r,metadata:()=>o,toc:()=>d});var i=t(4848),s=t(8453);const r={title:"Quick Start",description:"Run the pipeline on demo data.",sidebar_position:1,slug:"./qs"},l="Quick Start on Cromwell",o={id:"gs/quick_start",title:"Quick Start",description:"Run the pipeline on demo data.",source:"@site/docs/gs/quick_start.md",sourceDirName:"gs",slug:"/gs/qs",permalink:"/gatk-sv/docs/gs/qs",draft:!1,unlisted:!1,editUrl:"https://github.com/broadinstitute/gatk-sv/tree/master/website/docs/gs/quick_start.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Quick Start",description:"Run the pipeline on demo data.",sidebar_position:1,slug:"./qs"},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/gatk-sv/docs/gs/overview"},next:{title:"Input Data",permalink:"/gatk-sv/docs/gs/inputs"}},c={},d=[{value:"Setup Environment",id:"setup-environment",level:3},{value:"Build Inputs",id:"build-inputs",level:3},{value:"MELT",id:"melt",level:3},{value:"Execution",id:"execution",level:3}];function a(e){const n={a:"a",code:"code",h1:"h1",h3:"h3",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.p,{children:"This page provides steps for running the pipeline using demo data."}),"\n",(0,i.jsx)(n.h1,{id:"quick-start-on-cromwell",children:"Quick Start on Cromwell"}),"\n",(0,i.jsx)(n.p,{children:"This section walks you through the steps of running pipeline using\ndemo data on a managed Cromwell server."}),"\n",(0,i.jsx)(n.h3,{id:"setup-environment",children:"Setup Environment"}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsx)(n.p,{children:"A running instance of a Cromwell server."}),"\n"]}),"\n",(0,i.jsxs)(n.li,{children:["\n",(0,i.jsxs)(n.p,{children:["Install Cromshell and configure it to connect with the Cromwell server you are using.\nYou may refer to the documentation on ",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/cromshell",children:"Cromshell README"}),"."]}),"\n"]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"build-inputs",children:"Build Inputs"}),"\n",(0,i.jsxs)(n.p,{children:["We provide options for building example inputs that you may use as a reference\nto configure a Terra workspace or Cromwell submissions (advanced) with your own data.\nPlease refer to ",(0,i.jsx)(n.a,{href:"/docs/advanced/build_inputs",children:"this page"})," for instructions on how to build these inputs."]}),"\n",(0,i.jsx)(n.h3,{id:"melt",children:"MELT"}),"\n",(0,i.jsxs)(n.p,{children:["Important: The example input files contain MELT inputs that are NOT public\n(see ",(0,i.jsx)(n.a,{href:"https://github.com/broadinstitute/gatk-sv#requirements",children:"Requirements"}),"). These include:"]}),"\n",(0,i.jsxs)(n.ul,{children:["\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"GATKSVPipelineSingleSample.melt_docker"})," and ",(0,i.jsx)(n.code,{children:"GATKSVPipelineBatch.melt_docker"})," - MELT docker URI\n(see ",(0,i.jsx)(n.a,{href:"https://github.com/talkowski-lab/gatk-sv-v1/blob/master/dockerfiles/README.md",children:"Docker readme"}),")"]}),"\n",(0,i.jsxs)(n.li,{children:[(0,i.jsx)(n.code,{children:"GATKSVPipelineSingleSample.ref_std_melt_vcfs"})," - Standardized MELT VCFs (",(0,i.jsx)(n.a,{href:"/docs/modules/gbe",children:"GatherBatchEvidence"}),")\nThe input values are provided only as an example and are not publicly accessible."]}),"\n",(0,i.jsxs)(n.li,{children:["In order to include MELT, these values must be provided by the user. MELT can be\ndisabled by deleting these inputs and setting ",(0,i.jsx)(n.code,{children:"GATKSVPipelineBatch.use_melt"})," to false."]}),"\n"]}),"\n",(0,i.jsx)(n.h3,{id:"execution",children:"Execution"}),"\n",(0,i.jsx)(n.pre,{children:(0,i.jsx)(n.code,{className:"language-shell",children:'> mkdir gatksv_run && cd gatksv_run\n> mkdir wdl && cd wdl\n> cp $GATK_SV_ROOT/wdl/*.wdl .\n> zip dep.zip *.wdl\n> cd ..\n> echo \'{ "google_project_id": "my-google-project-id", "terra_billing_project_id": "my-terra-billing-project" }\' > inputs/values/google_cloud.my_project.json\n> bash scripts/inputs/build_default_inputs.sh -d $GATK_SV_ROOT -c google_cloud.my_project\n> cp $GATK_SV_ROOT/inputs/build/ref_panel_1kg/test/GATKSVPipelineBatch/GATKSVPipelineBatch.json GATKSVPipelineBatch.my_run.json\n> cromshell submit wdl/GATKSVPipelineBatch.wdl GATKSVPipelineBatch.my_run.json cromwell_config.json wdl/dep.zip\n'})}),"\n",(0,i.jsxs)(n.p,{children:["where ",(0,i.jsx)(n.code,{children:"cromwell_config.json"})," is a Cromwell\n",(0,i.jsx)(n.a,{href:"https://cromwell.readthedocs.io/en/stable/wf_options/Overview/",children:"workflow options file"}),".\nNote users will need to re-populate batch/sample-specific parameters (e.g. BAMs and sample IDs)."]})]})}function u(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(a,{...e})}):a(e)}},8453:(e,n,t)=>{t.d(n,{R:()=>l,x:()=>o});var i=t(6540);const s={},r=i.createContext(s);function l(e){const n=i.useContext(r);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function o(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:l(e.components),i.createElement(r.Provider,{value:n},e.children)}}}]);