"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[80],{8080:(e,r,o)=>{o.r(r),o.d(r,{default:()=>be});var t=o(9950),i=o(8429),a=o(4752),l=o(5261),n=o(9179),s=o(3507),c=o(9988),d=o(339),m=o(4414);const p=a.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease-in-out;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  border: 2px solid ${e=>e.selected?"var(--color-primary)":"transparent"};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  }
`,x=a.Ay.div`
  position: relative;
  height: 160px;
  background-color: var(--color-bg-secondary);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,h=a.Ay.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${e=>e.color||"var(--color-primary-light)"};
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 2rem;
`,g=a.Ay.div`
  padding: 1.25rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`,v=a.Ay.h3`
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`,b=a.Ay.p`
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin: 0 0 1rem;
  flex-grow: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`,y=a.Ay.div`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  
  svg {
    margin-right: 0.25rem;
  }
`,u=a.Ay.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.75rem 1.25rem;
  background-color: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
`,j=a.Ay.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: var(--color-primary-dark);
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.4);
  }
  
  &:disabled {
    background-color: var(--color-disabled);
    cursor: not-allowed;
  }
`,f=a.Ay.div`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`,w=e=>{let{template:r,selected:o=!1,onSelect:t,onUse:i}=e;const{id:a,name:n,description:s,category:c,thumbnail:d}=r,w=(e=>{const r=["#4299E1","#48BB78","#ED8936","#9F7AEA","#F56565","#38B2AC","#ECC94B"];let o=0;for(let t=0;t<e.length;t++)o=e.charCodeAt(t)+((o<<5)-o);return r[Math.abs(o)%r.length]})(n),k=(e=>e.split(" ").map((e=>e[0])).join("").toUpperCase().slice(0,2))(n);return(0,m.jsxs)(p,{selected:o,onClick:()=>{t&&t(a)},children:[(0,m.jsxs)(x,{children:[d?(0,m.jsx)("img",{src:d,alt:n}):(0,m.jsx)(h,{color:w,children:k}),o&&(0,m.jsx)(f,{children:"\u2713"})]}),(0,m.jsxs)(g,{children:[(0,m.jsx)(v,{children:n}),(0,m.jsx)(b,{children:s||"No description provided."}),(0,m.jsxs)(y,{children:[(0,m.jsx)(l.wJQ,{})," ",c||"General"]})]}),(0,m.jsx)(u,{children:(0,m.jsxs)(j,{onClick:e=>{e.stopPropagation(),i&&i(a)},children:[(0,m.jsx)(l.OiG,{})," Use Template"]})})]})},k=a.Ay.div`
  width: 100%;
`,A=a.Ay.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`,C=a.Ay.div`
  position: relative;
  flex: 1;
  
  svg {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
  }
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.25rem;
    font-size: 1rem;
    background-color: var(--bg-color);
    color: var(--text-color);
    
    &:focus {
      outline: none;
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-light);
    }
  }
`,S=a.Ay.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: ${e=>e.active?"var(--primary-color)":"var(--bg-color)"};
  color: ${e=>e.active?"white":"var(--text-color)"};
  border: 1px solid ${e=>e.active?"var(--primary-color)":"var(--border-color)"};
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${e=>e.active?"var(--primary-color-dark)":"var(--bg-color-hover)"};
  }
`,$=a.Ay.div`
  display: ${e=>e.show?"block":"none"};
  padding: 1rem;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
`,z=a.Ay.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`,T=a.Ay.div`
  font-weight: 600;
  margin-bottom: 0.5rem;
`,P=a.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`,B=a.Ay.button`
  padding: 0.5rem 1rem;
  background-color: ${e=>e.selected?"var(--primary-color)":"var(--bg-color)"};
  color: ${e=>e.selected?"white":"var(--text-color)"};
  border: 1px solid ${e=>e.selected?"var(--primary-color)":"var(--border-color)"};
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${e=>e.selected?"var(--primary-color-dark)":"var(--bg-color-hover)"};
  }
`,D=a.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`,U=a.Ay.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.75rem;
  background-color: var(--primary-color-light);
  color: var(--primary-color-dark);
  border-radius: 1rem;
  font-size: 0.875rem;
  
  svg {
    cursor: pointer;
  }
`,E=a.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`,F=a.Ay.div`
  text-align: center;
  padding: 2rem;
  background-color: var(--bg-color);
  border-radius: 0.25rem;
  border: 1px dashed var(--border-color);
  color: var(--text-color-secondary);
`,L=e=>{let{templates:r=[],selectedTemplateId:o=null,onSelectTemplate:i,loading:a=!1}=e;const[n,s]=(0,t.useState)(""),[c,p]=(0,t.useState)(!1),[x,h]=(0,t.useState)([]),[g,v]=(0,t.useState)([]),b=[...new Set(r.map((e=>e.category)))].filter(Boolean);(0,t.useEffect)((()=>{let e=[...r];if(n){const r=n.toLowerCase();e=e.filter((e=>{var o;return e.name.toLowerCase().includes(r)||(null===(o=e.description)||void 0===o?void 0:o.toLowerCase().includes(r))}))}x.length>0&&(e=e.filter((e=>x.includes(e.category)))),v(e)}),[r,n,x]);return(0,m.jsxs)(k,{children:[(0,m.jsxs)(A,{children:[(0,m.jsxs)(C,{children:[(0,m.jsx)(l.KSO,{}),(0,m.jsx)("input",{type:"text",placeholder:"Search templates...",value:n,onChange:e=>{s(e.target.value)}})]}),(0,m.jsxs)(S,{active:c,onClick:()=>p(!c),children:[(0,m.jsx)(l.YsJ,{})," Filter"]})]}),(0,m.jsxs)($,{show:c,children:[(0,m.jsxs)(z,{children:[(0,m.jsx)(T,{children:"Categories"}),(0,m.jsx)(P,{children:b.map((e=>(0,m.jsx)(B,{selected:x.includes(e),onClick:()=>(e=>{h((r=>r.includes(e)?r.filter((r=>r!==e)):[...r,e]))})(e),children:e},e)))})]}),(0,m.jsx)(S,{onClick:()=>{s(""),h([])},children:"Clear Filters"})]}),(x.length>0||n)&&(0,m.jsxs)(D,{children:[x.map((e=>(0,m.jsxs)(U,{children:[e,(0,m.jsx)(l.QCr,{onClick:()=>(e=>{h((r=>r.filter((r=>r!==e))))})(e)})]},e))),n&&(0,m.jsxs)(U,{children:["Search: ",n,(0,m.jsx)(l.QCr,{onClick:()=>s("")})]})]}),a?(0,m.jsx)(d.A,{message:"Loading templates..."}):g.length>0?(0,m.jsx)(E,{children:g.map((e=>(0,m.jsx)(w,{template:e,selected:o===e.id,onSelect:()=>i(e)},e.id)))}):(0,m.jsxs)(F,{children:[(0,m.jsx)("h3",{children:"No templates found"}),(0,m.jsx)("p",{children:"Try adjusting your search or filters to find more templates."})]})]})},N=a.Ay.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--border-color);
`,M=a.Ay.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
`,Y=a.Ay.h2`
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-size: 1.5rem;
`,O=a.Ay.p`
  color: var(--text-color-secondary);
  margin-bottom: 1rem;
  font-size: 1rem;
  line-height: 1.5;
`,Q=a.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
`,I=a.Ay.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  
  svg {
    color: var(--primary-color);
  }
`,J=a.Ay.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  gap: 1rem;
`,q=a.Ay.button`
  background-color: ${e=>e.active?"var(--primary-color)":"transparent"};
  color: ${e=>e.active?"white":"var(--text-color-secondary)"};
  border: 1px solid ${e=>e.active?"var(--primary-color)":"var(--border-color)"};
  border-radius: 0.25rem;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${e=>e.active?"var(--primary-color-dark)":"var(--bg-color-hover)"};
  }
`,G=a.Ay.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  
  iframe {
    width: 100%;
    height: ${e=>"mobile"===e.device?"667px":"100%"};
    max-width: ${e=>"mobile"===e.device?"375px":"tablet"===e.device?"768px":"100%"};
    border: none;
    margin: 0 auto;
    display: block;
    background-color: white;
  }
`,H=a.Ay.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`,W=a.Ay.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
`,Z=a.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: var(--bg-color-secondary);
  color: var(--text-color-secondary);
  
  h3 {
    margin-bottom: 0.5rem;
  }
  
  p {
    max-width: 400px;
    text-align: center;
  }
`,_=a.Ay.div`
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
`,K=e=>{let{template:r,onUse:o,onBack:i,loadingPreview:a=!1}=e;const[n,s]=t.useState("desktop");if(!r)return(0,m.jsx)(N,{children:(0,m.jsxs)(Z,{children:[(0,m.jsx)("h3",{children:"No template selected"}),(0,m.jsx)("p",{children:"Select a template from the list to see a preview."})]})});const{name:p,description:x,category:h,createdAt:g,previewUrl:v,thumbnail:b}=r,y=g?new Date(g).toLocaleDateString():"Unknown date";return(0,m.jsxs)(N,{children:[(0,m.jsxs)(M,{children:[(0,m.jsx)(Y,{children:p}),(0,m.jsx)(O,{children:x||"No description available for this template."}),(0,m.jsxs)(Q,{children:[h&&(0,m.jsxs)(I,{children:[(0,m.jsx)(l.wJQ,{})," ",h]}),(0,m.jsxs)(I,{children:[(0,m.jsx)(l.bfZ,{})," Added: ",y]})]})]}),v&&(0,m.jsxs)(J,{children:[(0,m.jsxs)(q,{active:"desktop"===n,onClick:()=>s("desktop"),children:[(0,m.jsx)(l.Wqt,{})," Desktop"]}),(0,m.jsxs)(q,{active:"tablet"===n,onClick:()=>s("tablet"),children:[(0,m.jsx)(l.z4D,{})," Tablet"]}),(0,m.jsxs)(q,{active:"mobile"===n,onClick:()=>s("mobile"),children:[(0,m.jsx)(l.rle,{})," Mobile"]})]}),a?(0,m.jsx)(d.A,{message:"Loading preview..."}):v?(0,m.jsxs)(G,{device:n,children:[(0,m.jsx)("iframe",{src:v,title:`Preview of ${p}`,sandbox:"allow-same-origin allow-scripts"}),(0,m.jsx)(W,{children:"Preview Mode - Some features may be limited"})]}):b?(0,m.jsx)(H,{children:(0,m.jsx)("img",{src:b,alt:`Preview of ${p} template`})}):(0,m.jsxs)(Z,{children:[(0,m.jsx)("h3",{children:"No preview available"}),(0,m.jsx)("p",{children:"This template doesn't have a preview yet."})]}),(0,m.jsxs)(_,{children:[(0,m.jsx)(c.A,{variant:"secondary",onClick:i,children:"Back to Templates"}),(0,m.jsx)(c.A,{onClick:()=>o(r),children:"Use This Template"})]})]})},R=a.Ay.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
`,V=a.Ay.div`
  margin-bottom: 2rem;
`,X=a.Ay.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`,ee=a.Ay.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`,re=a.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  margin-bottom: 2rem;
`,oe=a.Ay.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
`,te=a.Ay.div`
  margin-bottom: 1.5rem;
`,ie=a.Ay.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
`,ae=a.Ay.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`,le=a.Ay.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  min-height: 100px;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
`,ne=a.Ay.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,se=a.Ay.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`,ce=a.Ay.div`
  flex: 1;
  background-color: var(--color-bg-card);
  border: 1px solid ${e=>e.selected?"var(--color-primary)":"var(--color-border)"};
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${e=>e.selected?"0 0 0 2px rgba(var(--color-primary-rgb), 0.3)":"0 2px 8px rgba(0, 0, 0, 0.08)"};
  
  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-3px);
  }
`,de=a.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`,me=a.Ay.h3`
  font-size: 1.2rem;
  color: var(--color-text-primary);
  margin: 0;
`,pe=a.Ay.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${e=>e.selected?"var(--color-primary)":"transparent"};
  border: 2px solid ${e=>e.selected?"var(--color-primary)":"var(--color-border)"};
  color: white;
  transition: all 0.2s ease;
`,xe=a.Ay.p`
  color: var(--color-text-secondary);
  margin-bottom: 0;
`,he=a.Ay.div`
  margin-top: 2rem;
`,ge=a.Ay.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 1200px) {
    grid-template-columns: 1fr 1fr;
  }
`,ve=a.Ay.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
`,be=()=>{const e=(0,i.Zp)(),{addProject:r,fetchTemplates:o,templates:a,loading:p,error:x}=(0,n.Y)(),{user:h}=(0,s.A)(),[g,v]=(0,t.useState)(""),[b,y]=(0,t.useState)("blank"),[u,j]=(0,t.useState)(null),[f,w]=(0,t.useState)(null),[k,A]=(0,t.useState)({name:"",description:""}),[C,S]=(0,t.useState)({}),[$,z]=(0,t.useState)(!1),[T,P]=(0,t.useState)(!1);(0,t.useEffect)((()=>{"template"!==b||a&&0!==a.length||o()}),[b,a,o]);const B=e=>{const{name:r,value:o}=e.target;A({...k,[r]:o}),C[r]&&S({...C,[r]:""})},D=e=>{y(e),"template"!==e&&(j(null),w(null))};return(0,m.jsxs)(R,{children:[(0,m.jsxs)(V,{children:[(0,m.jsx)(X,{children:"Create New Project"}),(0,m.jsx)(ee,{children:"Start with a blank canvas or choose from our professionally designed templates"})]}),(0,m.jsxs)("form",{onSubmit:async o=>{if(o.preventDefault(),(()=>{const e={};return k.name.trim()||(e.name="Project name is required"),"template"!==b||u||(e.template="Please select a template"),S(e),0===Object.keys(e).length})()){z(!0);try{const o={...k,templateId:(null===u||void 0===u?void 0:u.id)||null},t=await r(o);t&&t.id&&e(`/editor/${t.id}`)}catch(t){console.error("Error creating project:",t)}finally{z(!1)}}},children:[(0,m.jsxs)(re,{children:[(0,m.jsx)(oe,{children:"Project Details"}),(0,m.jsxs)(te,{children:[(0,m.jsx)(ie,{htmlFor:"name",children:"Project Name"}),(0,m.jsx)(ae,{type:"text",id:"name",name:"name",value:k.name,onChange:B,placeholder:"My Awesome Website"}),C.name&&(0,m.jsx)(ne,{children:C.name})]}),(0,m.jsxs)(te,{children:[(0,m.jsx)(ie,{htmlFor:"description",children:"Description (Optional)"}),(0,m.jsx)(le,{id:"description",name:"description",value:k.description,onChange:B,placeholder:"Describe your project..."})]})]}),(0,m.jsxs)(re,{children:[(0,m.jsx)(oe,{children:"Project Type"}),(0,m.jsxs)(se,{children:[(0,m.jsxs)(ce,{selected:"blank"===b,onClick:()=>D("blank"),children:[(0,m.jsxs)(de,{children:[(0,m.jsx)(me,{children:"Blank Project"}),(0,m.jsx)(pe,{selected:"blank"===b,children:"blank"===b&&(0,m.jsx)(l.CMH,{})})]}),(0,m.jsx)(xe,{children:"Start with a clean slate and build your website from scratch."})]}),(0,m.jsxs)(ce,{selected:"template"===b,onClick:()=>D("template"),children:[(0,m.jsxs)(de,{children:[(0,m.jsx)(me,{children:"Start from Template"}),(0,m.jsx)(pe,{selected:"template"===b,children:"template"===b&&(0,m.jsx)(l.CMH,{})})]}),(0,m.jsx)(xe,{children:"Choose from our pre-designed templates to jump-start your project."})]})]}),"template"===b&&(0,m.jsxs)(he,{children:[(0,m.jsx)(oe,{children:"Choose a Template"}),p?(0,m.jsx)(d.A,{message:"Loading templates..."}):x?(0,m.jsxs)("div",{style:{color:"var(--color-error)"},children:["Failed to load templates: ",x]}):(0,m.jsx)(ge,{children:f?(0,m.jsx)(K,{template:f,onUse:e=>{j(e),window.scrollTo({top:0,behavior:"smooth"}),k.name.trim()||A((r=>({...r,name:`${e.name} Project`})))},onBack:()=>{w(null)},loadingPreview:T}):(0,m.jsx)(L,{templates:a||[],selectedTemplateId:null===u||void 0===u?void 0:u.id,onSelectTemplate:e=>{j(e),w(e),C.template&&S({...C,template:""})},loading:p})}),C.template&&(0,m.jsx)(ne,{style:{marginTop:"1rem"},children:C.template})]})]}),(0,m.jsxs)(ve,{children:[(0,m.jsx)(c.A,{type:"button",variant:"secondary",onClick:()=>e("/dashboard"),children:"Cancel"}),(0,m.jsx)(c.A,{type:"submit",disabled:$,children:$?(0,m.jsx)(d.A,{size:"small"}):"Create Project"})]})]})]})}}}]);