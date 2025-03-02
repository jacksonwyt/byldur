"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[571],{1571:(e,t,a)=>{a.r(t),a.d(t,{default:()=>B});var r=a(9950),o=a(8429),i=a(4752),s=a(9179),n=a(911),c=a.n(n),l=a(4017),d=a.n(l),u=a(3507),g=a(1419),h=a(1444),p=a(3097),f=a(339),m=(a(9988),a(9056)),b=a(4414);const v=i.Ay.div`
  height: 100%;
  overflow: hidden;
`,y=i.Ay.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  z-index: 1000;
  box-shadow: var(--shadow-md);
  opacity: ${e=>e.visible?1:0};
  transform: translateY(${e=>e.visible?"0":"20px"});
  transition: opacity 0.3s ease, transform 0.3s ease;
  background-color: ${e=>{switch(e.type){case"success":default:return"var(--color-success)";case"error":return"var(--color-danger)";case"info":return"var(--color-info)";case"warning":return"var(--color-warning)"}}};
  color: white;
  max-width: 350px;
  display: flex;
  align-items: center;
`,x=i.Ay.span`
  flex: 1;
`,j=i.Ay.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 999;
  
  p {
    margin-top: 1rem;
    font-weight: 500;
    color: var(--text-color);
  }
`,w=(e,t)=>{let a;return function(){for(var r=arguments.length,o=new Array(r),i=0;i<r;i++)o[i]=arguments[i];clearTimeout(a),a=setTimeout((()=>{clearTimeout(a),e(...o)}),t)}},k=(0,r.forwardRef)(((e,t)=>{let{onReady:a}=e;const i=(0,r.useRef)(null),[n,l]=(0,r.useState)({visible:!1,message:"",type:"success"}),[k,C]=(0,r.useState)(!1),[A,E]=(0,r.useState)(!0),[T,I]=(0,r.useState)("Loading editor..."),{projectId:L}=(0,o.g)(),P=(0,o.Zp)(),{isAuthenticated:S,user:B}=(0,u.A)(),{currentProject:D,fetchProject:M,loading:H}=(0,s.Y)(),{credits:R,loading:$}=(0,g.O)(),{editor:z,registerEditor:_,saveCurrentState:N,getHtmlContent:F,getCssContent:O,loadContent:U,setIsDirty:Y}=(0,h.h)(),W=(0,p.s)(),Z=function(e){let t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:3e3;l({visible:!0,message:e,type:arguments.length>1&&void 0!==arguments[1]?arguments[1]:"success"}),setTimeout((()=>{l((e=>({...e,visible:!1})))}),t)};(0,r.useEffect)((()=>{if(i.current&&!z){E(!0),I("Initializing editor...");const e=c().init({container:i.current,height:"100%",width:"auto",storageManager:!1,plugins:[d()],pluginsOpts:{gjsPresetWebpage:{}},deviceManager:{devices:[{name:"Desktop",width:""},{name:"Tablet",width:"768px",widthMedia:"992px"},{name:"Mobile",width:"320px",widthMedia:"480px"}]},blockManager:{appendTo:"#blocks-container",blocks:[{id:"section",label:"Section",category:"Basic",content:'<section class="section"><div class="container"></div></section>',attributes:{class:"gjs-block-section"}},{id:"heading",label:"Heading",category:"Basic",content:"<h2>Insert your heading here</h2>",attributes:{class:"fa fa-heading"}},{id:"paragraph",label:"Paragraph",category:"Basic",content:"<p>Insert your text here</p>",attributes:{class:"fa fa-paragraph"}},{id:"image",label:"Image",category:"Basic",content:{type:"image"},attributes:{class:"fa fa-image"}},{id:"link",label:"Link",category:"Basic",content:'<a href="#">Link</a>',attributes:{class:"fa fa-link"}},{id:"list",label:"List",category:"Advanced",content:"<ul><li>List Item 1</li><li>List Item 2</li><li>List Item 3</li></ul>",attributes:{class:"fa fa-list"}},{id:"table",label:"Table",category:"Advanced",content:'<table class="table"><thead><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr></thead><tbody><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr></tbody></table>',attributes:{class:"fa fa-table"}},{id:"button",label:"Button",category:"Basic",content:'<button class="button">Click me</button>',attributes:{class:"fa fa-square"}},{id:"custom-html",label:"Custom HTML",category:"Advanced",content:{type:"text",content:"<div>Custom HTML</div>"},attributes:{class:"fa fa-code"}}]},panels:{defaults:[{id:"panel-devices",el:".panel__devices",buttons:[{id:"device-desktop",label:'<i class="fa fa-desktop"></i>',command:"set-device-desktop",active:!0,togglable:!1},{id:"device-tablet",label:'<i class="fa fa-tablet"></i>',command:"set-device-tablet",togglable:!1},{id:"device-mobile",label:'<i class="fa fa-mobile"></i>',command:"set-device-mobile",togglable:!1}]}]}});e.Commands.add("set-device-desktop",{run:e=>e.setDevice("Desktop")}),e.Commands.add("set-device-tablet",{run:e=>e.setDevice("Tablet")}),e.Commands.add("set-device-mobile",{run:e=>e.setDevice("Mobile")}),e.Commands.add("add-section",{run:e=>{const t=document.createElement("section");t.innerHTML='<div class="container"></div>',t.className="section",e.DomComponents.addComponent({type:"default",tagName:"section",attributes:{class:"section"},components:[{type:"default",tagName:"div",attributes:{class:"container"}}]})}}),e.on("component:update",w((()=>{G(),Y(!0)}),1e3)),e.on("style:update",w((()=>{G(),Y(!0)}),1e3)),_(e),"function"===typeof a&&a(e)}}),[i,z,_,a]),(0,r.useEffect)((()=>{(async()=>{if(L&&S){E(!0),I("Loading project...");try{if(D&&D.id===L||await M(L),z)if(D&&D.content){z.DomComponents.clear();const{html:e,css:t}=D.content;U(e,t),Z("Project loaded successfully","success"),Y(!1)}else Z("New project created","info")}catch(e){console.error("Error loading project:",e),Z(`Error loading project: ${e.message||"Unknown error"}`,"error",5e3),setTimeout((()=>{P("/dashboard")}),3e3)}finally{E(!1)}}else E(!1)})()}),[L,z,S,D,M,P,U,Y]);const q=async function(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];if(L&&S&&z){C(!0),e||(I("Saving project..."),Z("Saving project...","info"));try{const t=F(),a=O(),r=performance.now();await(0,m.I6)(L,t,a);const o=performance.now()-r;return W.trackContentSaved(L,{contentSize:((null===t||void 0===t?void 0:t.length)||0)+((null===a||void 0===a?void 0:a.length)||0)}),W.trackTiming("content_save",o,{projectId:L}),await N(),e||Z("Project saved successfully","success"),Y(!1),!0}catch(t){return console.error("Failed to save project:",t),W.trackError("project_save",`Failed to save project: ${t.message||"Unknown error"}`),Z(`Error saving project: ${t.message||"Unknown error"}`,"error",5e3),!1}finally{C(!1)}}},G=w((async()=>{await q(!0)}),2e3);return(0,r.useEffect)((()=>{t&&(t.current={saveProject:q,getEditor:()=>z})}),[t,z,q]),(0,b.jsxs)(v,{children:[(0,b.jsx)("div",{ref:i,style:{height:"100%"}}),(A||k)&&(0,b.jsxs)(j,{children:[(0,b.jsx)(f.A,{size:"large"}),(0,b.jsx)("p",{children:A?T:"Saving changes..."})]}),(0,b.jsx)(y,{visible:n.visible,type:n.type,children:(0,b.jsx)(x,{children:n.message})})]})}));var C=a(1881),A=a(9730),E=a(7158);const T=i.Ay.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
`,I=i.Ay.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`,L=i.Ay.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
  position: relative;
`,P=i.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`,S=i.Ay.div`
  background-color: var(--color-error-bg);
  color: var(--color-error);
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  border-left: 4px solid var(--color-error);
  
  h3 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0.5rem 0;
  }
  
  button {
    margin-top: 1rem;
  }
`,B=()=>{const{projectId:e}=(0,o.g)(),t=(0,o.Zp)(),{fetchProject:a,currentProject:i,loading:n,error:c}=(0,s.Y)(),[l,d]=(0,r.useState)(!1),[u,g]=(0,r.useState)(!1),h=(0,r.useRef)(null);(0,r.useEffect)((()=>{e&&a(e)}),[e,a]),(0,r.useEffect)((()=>(document.title=i?`Editing: ${i.name} | Byldur`:"Website Editor | Byldur",()=>{document.title="Byldur"})),[i]);return n?(0,b.jsxs)(P,{children:[(0,b.jsx)(f.A,{size:"large"}),(0,b.jsx)("p",{children:"Loading project..."})]}):c?(0,b.jsx)(P,{children:(0,b.jsxs)(S,{children:[(0,b.jsx)("h3",{children:"Error Loading Project"}),(0,b.jsx)("p",{children:c}),(0,b.jsx)("button",{onClick:()=>t("/dashboard"),children:"Return to Dashboard"})]})}):n||i||!e?(0,b.jsxs)(T,{children:[(0,b.jsx)(C.A,{toggleAIPanel:()=>{g(!u)},aiPanelOpen:u}),(0,b.jsxs)(I,{children:[(0,b.jsx)(A.A,{}),(0,b.jsx)(L,{children:(0,b.jsx)(k,{ref:h,onReady:()=>{d(!0)}})}),u&&(0,b.jsx)(E.A,{onClose:()=>g(!1)})]})]}):(0,b.jsx)(P,{children:(0,b.jsxs)(S,{children:[(0,b.jsx)("h3",{children:"Project Not Found"}),(0,b.jsx)("p",{children:"The project you're trying to access doesn't exist or you don't have permission to view it."}),(0,b.jsx)("button",{onClick:()=>t("/dashboard"),children:"Return to Dashboard"})]})})}}}]);