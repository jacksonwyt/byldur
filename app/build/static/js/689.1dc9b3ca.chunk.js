"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[689],{1689:(e,r,i)=>{i.r(r),i.d(r,{default:()=>L});var t=i(9950),o=i(8429),a=i(2074),n=i(4752),s=i(5261),l=i(9179),c=i(3507),d=i(3097),h=i(9988),p=i(339),x=i(1986),j=i(6516),m=i(4414);const g=n.Ay.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`,u=(0,n.Ay)(h.A)`
  flex: 1;
  min-width: 120px;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`,y=n.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`,b=n.Ay.div`
  background-color: var(--color-bg-primary);
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 90%;
`,v=n.Ay.h2`
  margin-top: 0;
  color: var(--color-text-primary);
`,f=n.Ay.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`,w=n.Ay.div`
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  
  h4 {
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
  
  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }
`,k=e=>{let{projectId:r,isPublished:i=!1}=e;const a=(0,o.Zp)(),{duplicateProject:n,deleteProject:l,publishProject:c,unpublishProject:p,deployProject:x,getDeploymentHistory:k,deployments:A,loading:P}=(0,j.B)(),C=(0,d.s)(),[D,E]=(0,t.useState)(!1),[_,z]=(0,t.useState)(!1),[B,S]=(0,t.useState)(!1);return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsxs)(g,{children:[(0,m.jsxs)(u,{variant:"primary",onClick:()=>{C.trackEditorOpened(r),a(`/editor/${r}`)},"aria-label":"Edit project",children:[(0,m.jsx)(s.uO9,{})," Edit"]}),(0,m.jsxs)(u,{variant:"secondary",onClick:()=>{C.trackFeatureUsage("project_preview","opened",r),window.open(`/preview/${r}`,"_blank")},"aria-label":"Preview project",children:[(0,m.jsx)(s.Ny1,{})," Preview"]}),(0,m.jsxs)(u,{variant:"outline",onClick:async()=>{if(P)return;const e=await n(r);e&&(C.trackProjectDuplicated(r),a(`/projects/${e.id}`))},disabled:P,"aria-label":"Duplicate project",children:[(0,m.jsx)(s.paH,{})," Duplicate"]}),(0,m.jsxs)(u,{variant:i?"outline":"primary",onClick:async()=>{P||(i?(await p(r),C.trackProjectUnpublished(r)):(await c(r),C.trackProjectPublished(r)))},disabled:P,"aria-label":i?"Unpublish project":"Publish project",children:[i?(0,m.jsx)(s.jZj,{}):(0,m.jsx)(s.RIx,{})," ",i?"Unpublish":"Publish"]}),(0,m.jsxs)(u,{variant:"primary",onClick:()=>z(!0),disabled:P||!i,"aria-label":"Deploy project",children:[(0,m.jsx)(s.BzO,{})," Deploy"]}),(0,m.jsxs)(u,{variant:"outline",onClick:async()=>{C.trackFeatureUsage("deployment_history","viewed",r),await k(r),S(!0)},disabled:P,"aria-label":"View deployment history",children:[(0,m.jsx)(s.OKX,{})," History"]}),(0,m.jsxs)(u,{variant:"danger",onClick:()=>E(!0),disabled:P,"aria-label":"Delete project",children:[(0,m.jsx)(s.qbC,{})," Delete"]})]}),D&&(0,m.jsx)(y,{children:(0,m.jsxs)(b,{children:[(0,m.jsx)(v,{children:"Confirm Delete"}),(0,m.jsx)("p",{children:"Are you sure you want to delete this project? This action cannot be undone."}),(0,m.jsxs)(f,{children:[(0,m.jsx)(h.A,{variant:"outline",onClick:()=>E(!1),children:"Cancel"}),(0,m.jsx)(h.A,{variant:"danger",onClick:async()=>{if(P)return;await l(r)&&(C.trackProjectDeleted(r),E(!1),a("/dashboard"))},loading:P,children:"Delete"})]})]})}),_&&(0,m.jsx)(y,{children:(0,m.jsxs)(b,{children:[(0,m.jsx)(v,{children:"Deploy Project"}),(0,m.jsx)("p",{children:"Are you sure you want to deploy this project to production? This will make your changes live to all visitors."}),(0,m.jsxs)(f,{children:[(0,m.jsx)(h.A,{variant:"outline",onClick:()=>z(!1),children:"Cancel"}),(0,m.jsx)(h.A,{variant:"primary",onClick:async()=>{P||(await x(r),C.trackProjectDeployed(r),z(!1))},loading:P,children:"Deploy"})]})]})}),B&&(0,m.jsx)(y,{children:(0,m.jsxs)(b,{children:[(0,m.jsx)(v,{children:"Deployment History"}),0===A.length?(0,m.jsx)("p",{children:"No deployment history found."}):A.map(((e,r)=>(0,m.jsxs)(w,{children:[(0,m.jsxs)("h4",{children:["Deployment ",r+1]}),(0,m.jsxs)("p",{children:[(0,m.jsx)("strong",{children:"Date:"})," ",new Date(e.createdAt).toLocaleString()]}),(0,m.jsxs)("p",{children:[(0,m.jsx)("strong",{children:"Status:"})," ",e.status]}),e.url&&(0,m.jsxs)("p",{children:[(0,m.jsx)("strong",{children:"URL:"})," ",(0,m.jsx)("a",{href:e.url,target:"_blank",rel:"noopener noreferrer",children:e.url})]})]},e.id||r))),(0,m.jsx)(f,{children:(0,m.jsx)(h.A,{variant:"primary",onClick:()=>S(!1),children:"Close"})})]})})]})},A=n.Ay.div`
  max-width: 1200px;
  margin: 0 auto;
`,P=n.Ay.div`
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  
  a {
    color: var(--color-text-secondary);
    text-decoration: none;
    display: flex;
    align-items: center;
    
    &:hover {
      color: var(--color-primary);
    }
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  span {
    margin: 0 0.5rem;
  }
`,C=n.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`,D=n.Ay.h1`
  font-size: 2rem;
  margin: 0 0 0.5rem;
  color: var(--color-text-primary);
`,E=(n.Ay.div`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  background-color: ${e=>e.published?"var(--color-success-bg)":"var(--color-warning-bg)"};
  color: ${e=>e.published?"var(--color-success)":"var(--color-warning)"};
  margin-bottom: 1rem;
`,n.Ay.div`
  display: flex;
  align-items: center;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  
  svg {
    margin-right: 0.25rem;
  }
`,n.Ay.div`
  display: flex;
  gap: 0.5rem;
  
  @media (max-width: 576px) {
    flex-wrap: wrap;
  }
`),_=n.Ay.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`,z=n.Ay.section`
  background-color: var(--color-bg-card);
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 2rem;
`,B=n.Ay.h2`
  font-size: 1.25rem;
  margin: 0 0 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-primary);
`,S=n.Ay.p`
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
`,F=n.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`,N=n.Ay.div`
  h3 {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin: 0 0 0.25rem;
  }
  
  p {
    font-size: 1rem;
    color: var(--color-text-primary);
    margin: 0;
  }
`,U=n.Ay.div`
  width: 100%;
  height: 200px;
  border-radius: 0.5rem;
  overflow: hidden;
  background-color: var(--color-bg-secondary);
  margin-bottom: 1.5rem;
`,$=n.Ay.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`,O=n.Ay.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${e=>e.color||"var(--color-primary-light)"};
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: 2rem;
`,I=n.Ay.div`
  border: 1px solid var(--color-error);
  border-radius: 0.5rem;
  padding: 1.5rem;
  
  h3 {
    color: var(--color-error);
    margin: 0 0 0.5rem;
    display: flex;
    align-items: center;
    
    svg {
      margin-right: 0.5rem;
    }
  }
  
  p {
    color: var(--color-text-secondary);
    margin-bottom: 1rem;
  }
`,q=n.Ay.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`,H=n.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 0.5rem;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  h2 {
    margin-top: 0;
    color: var(--color-text-primary);
  }
  
  p {
    margin-bottom: 1.5rem;
    color: var(--color-text-secondary);
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
`,L=()=>{const{projectId:e}=(0,o.g)(),r=(0,o.Zp)(),{user:i}=(0,c.A)(),n=(0,d.s)(),{getProject:j,deleteProject:g,publishProject:u,unpublishProject:y,duplicateProject:b,loading:v,error:f}=(0,l.Y)(),[w,L]=(0,t.useState)(null),[T,Y]=(0,t.useState)(!1);(0,t.useEffect)((()=>{e&&(async()=>{try{const r=await j(e);L(r),n.trackFeatureUsage("project_details","viewed",e)}catch(r){console.error("Error fetching project:",r),n.trackError("project_fetch",`Failed to fetch project: ${r.message}`)}})()}),[e,j,n]);if(v)return(0,m.jsx)(A,{children:(0,m.jsx)("div",{style:{textAlign:"center",padding:"3rem"},children:(0,m.jsx)(p.A,{size:"60px"})})});if(f)return(0,m.jsx)(A,{children:(0,m.jsxs)("div",{style:{textAlign:"center",padding:"3rem",color:"var(--color-danger)"},children:[(0,m.jsx)(s.BS8,{size:60}),(0,m.jsx)("h2",{children:"Error Loading Project"}),(0,m.jsx)("p",{children:f}),(0,m.jsx)(a.N_,{to:"/dashboard",children:"Back to Dashboard"})]})});if(!w)return(0,m.jsx)(A,{children:(0,m.jsxs)("div",{style:{textAlign:"center",padding:"3rem"},children:[(0,m.jsx)("h2",{children:"Project Not Found"}),(0,m.jsx)("p",{children:"The project you're looking for doesn't exist or you don't have access to it."}),(0,m.jsx)(a.N_,{to:"/dashboard",children:"Back to Dashboard"})]})});const Z=(e=>{const r=["#4299E1","#48BB78","#ED8936","#9F7AEA","#F56565","#38B2AC","#ECC94B"];let i=0;for(let t=0;t<e.length;t++)i=e.charCodeAt(t)+((i<<5)-i);return r[Math.abs(i)%r.length]})(w.name),M=w.name.split(" ").map((e=>e[0])).join("").toUpperCase().slice(0,2);return(0,m.jsxs)(A,{children:[(0,m.jsxs)(P,{children:[(0,m.jsxs)(a.N_,{to:"/dashboard",children:[(0,m.jsx)(s.QVr,{})," Back to Dashboard"]}),(0,m.jsx)("span",{children:"/"}),(0,m.jsx)("span",{children:w.name})]}),(0,m.jsxs)(C,{children:[(0,m.jsxs)("div",{children:[(0,m.jsx)(D,{children:w.name}),w.published&&(0,m.jsxs)(StatusBadge,{status:"published",children:[(0,m.jsx)(s.A7C,{})," Published"]})]}),(0,m.jsxs)(E,{children:[(0,m.jsx)(h.A,{secondary:!0,onClick:async()=>{try{w.published?(await y(e),n.trackProjectUnpublished(e)):(await u(e),n.trackProjectPublished(e)),L({...w,published:!w.published})}catch(r){console.error("Error toggling publish state:",r),n.trackError("project_publish_toggle",`Failed to toggle publish state: ${r.message}`)}},children:w.published?(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(s.mSE,{})," Unpublish"]}):(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(s.BzO,{})," Publish"]})}),(0,m.jsxs)(h.A,{secondary:!0,onClick:async()=>{try{const i=await b(e);n.trackProjectDuplicated(e),r(`/dashboard/projects/${i.id}`)}catch(i){console.error("Error duplicating project:",i),n.trackError("project_duplicate",`Failed to duplicate project: ${i.message}`)}},children:[(0,m.jsx)(s.paH,{})," Duplicate"]}),(0,m.jsxs)(h.A,{as:a.N_,to:`/editor/${e}`,primary:!0,children:[(0,m.jsx)(s.uO9,{})," Edit"]})]})]}),(0,m.jsxs)(_,{children:[(0,m.jsx)("div",{children:(0,m.jsxs)(z,{children:[(0,m.jsx)(B,{children:"Project Details"}),(0,m.jsx)(S,{children:w.description||"No description provided."}),(0,m.jsxs)(F,{children:[(0,m.jsxs)(N,{children:[(0,m.jsx)("h3",{children:"Created By"}),(0,m.jsx)("p",{children:(null===i||void 0===i?void 0:i.name)||"Unknown User"})]}),(0,m.jsxs)(N,{children:[(0,m.jsx)("h3",{children:"Created On"}),(0,m.jsx)("p",{children:(0,x.Yq)(w.createdAt)})]}),(0,m.jsxs)(N,{children:[(0,m.jsx)("h3",{children:"Last Modified"}),(0,m.jsx)("p",{children:(0,x.Yq)(w.updatedAt)||"Not modified"})]}),(0,m.jsxs)(N,{children:[(0,m.jsx)("h3",{children:"Status"}),(0,m.jsx)("p",{children:w.published?"Published":"Draft"})]})]}),(0,m.jsx)(B,{children:"Project Screenshot"}),(0,m.jsx)(U,{children:w.thumbnail?(0,m.jsx)($,{src:w.thumbnail,alt:w.name}):(0,m.jsx)(O,{color:Z,children:M})}),(0,m.jsxs)(h.A,{as:"a",href:`/preview/${e}`,target:"_blank",secondary:!0,children:[(0,m.jsx)(s.Ny1,{})," Preview Project"]})]})}),(0,m.jsx)("div",{children:(0,m.jsxs)(z,{children:[(0,m.jsx)(B,{children:"Actions"}),(0,m.jsx)(k,{projectId:e,isPublished:w.published}),(0,m.jsxs)(I,{children:[(0,m.jsxs)("h3",{children:[(0,m.jsx)(s.BS8,{})," Danger Zone"]}),(0,m.jsx)("p",{children:"Once you delete a project, there is no going back. Please be certain."}),(0,m.jsxs)(h.A,{danger:!0,onClick:()=>Y(!0),children:[(0,m.jsx)(s.qbC,{})," Delete Project"]})]})]})})]}),T&&(0,m.jsx)(q,{children:(0,m.jsxs)(H,{children:[(0,m.jsx)("h2",{children:"Delete Project"}),(0,m.jsxs)("p",{children:["Are you sure you want to delete ",(0,m.jsx)("strong",{children:w.name}),"? This action cannot be undone."]}),(0,m.jsxs)("div",{className:"actions",children:[(0,m.jsx)(h.A,{secondary:!0,onClick:()=>Y(!1),children:"Cancel"}),(0,m.jsx)(h.A,{danger:!0,onClick:async()=>{try{await g(e),n.trackProjectDeleted(e),r("/dashboard")}catch(i){console.error("Error deleting project:",i),n.trackError("project_delete",`Failed to delete project: ${i.message}`)}},children:"Delete"})]})]})})]})}},1986:(e,r,i)=>{i.d(r,{Yq:()=>t});const t=function(e){let r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!e)return"Unknown date";try{const i=new Date(e);if(isNaN(i.getTime()))return"Invalid date";const t={year:"numeric",month:"short",day:"numeric",...r};return i.toLocaleDateString(void 0,t)}catch(i){return console.error("Error formatting date:",i),"Invalid date"}}}}]);