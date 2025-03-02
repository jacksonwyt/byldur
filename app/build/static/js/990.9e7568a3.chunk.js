"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[990],{5990:(r,e,o)=>{o.r(e),o.d(e,{default:()=>D});var t=o(9950),i=o(2074),a=o(4752),s=o(5261),n=o(9179),c=o(3507),l=o(339),d=o(9988),x=o(4414);const m=a.Ay.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`,p=a.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`,h=a.Ay.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 0;
`,g=a.Ay.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
`,j=a.Ay.div`
  position: relative;
  flex: 1;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }

  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--color-border);
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);

    &:focus {
      outline: none;
      border-color: var(--color-primary);
      box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
    }
  }
`,y=a.Ay.div`
  display: flex;
  gap: 0.5rem;
`,u=a.Ay.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--color-bg-hover);
  }

  svg {
    font-size: 0.9rem;
  }
`,b=a.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`,f=a.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
  }
`,v=a.Ay.div`
  height: 160px;
  background-color: var(--color-bg-secondary);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`,w=a.Ay.div`
  padding: 1rem;
`,A=a.Ay.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  color: var(--color-text-primary);
`,k=a.Ay.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
`,_=a.Ay.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
`,C=(0,a.Ay)(f)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-secondary);
  border: 2px dashed var(--color-border);
  cursor: pointer;

  &:hover {
    background-color: var(--color-bg-hover);
    border-color: var(--color-primary);
  }
`,N=a.Ay.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--color-primary);
  color: #ffffff;
  margin-bottom: 1rem;
  
  svg {
    font-size: 1.5rem;
  }
`,P=a.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 3rem;
  background-color: var(--color-bg-secondary);
  border-radius: 8px;
  margin-top: 2rem;

  h3 {
    margin: 1rem 0 0.5rem;
    color: var(--color-text-primary);
  }

  p {
    color: var(--color-text-secondary);
    margin-bottom: 1.5rem;
  }
`,D=()=>{const{projects:r,loading:e,error:o,fetchProjects:a}=(0,n.Y)(),{user:D}=(0,c.A)(),[z,L]=(0,t.useState)(""),[O,S]=(0,t.useState)("desc");(0,t.useEffect)((()=>{a()}),[a]);const Y=[...r?r.filter((r=>r.name.toLowerCase().includes(z.toLowerCase()))):[]].sort(((r,e)=>{const o=new Date(r.updated_at||r.created_at),t=new Date(e.updated_at||e.created_at);return"asc"===O?o-t:t-o}));return e?(0,x.jsx)(m,{children:(0,x.jsx)("div",{style:{display:"flex",justifyContent:"center",marginTop:"3rem"},children:(0,x.jsx)(l.A,{size:"large"})})}):o?(0,x.jsx)(m,{children:(0,x.jsxs)(P,{children:[(0,x.jsx)("h3",{children:"Error Loading Projects"}),(0,x.jsx)("p",{children:o||"An error occurred while loading your projects. Please try again."}),(0,x.jsx)(d.A,{onClick:a,children:"Try Again"})]})}):(0,x.jsxs)(m,{children:[(0,x.jsxs)(p,{children:[(0,x.jsx)(h,{children:"My Projects"}),(0,x.jsx)(i.N_,{to:"/projects/new",children:(0,x.jsx)(d.A,{primary:!0,icon:(0,x.jsx)(s.OiG,{}),children:"New Project"})})]}),(0,x.jsxs)(g,{children:[(0,x.jsxs)(j,{children:[(0,x.jsx)(s.KSO,{}),(0,x.jsx)("input",{type:"text",placeholder:"Search projects...",value:z,onChange:r=>{L(r.target.value)}})]}),(0,x.jsxs)(y,{children:[(0,x.jsxs)(u,{onClick:()=>{S("asc"===O?"desc":"asc")},children:["asc"===O?(0,x.jsx)(s.HL0,{}):(0,x.jsx)(s.EDF,{}),"asc"===O?"Oldest":"Newest"]}),(0,x.jsxs)(u,{children:[(0,x.jsx)(s.YsJ,{}),"Filter"]})]})]}),r&&0!==r.length?(0,x.jsxs)(b,{children:[Y.map((r=>(0,x.jsx)(f,{children:(0,x.jsxs)(i.N_,{to:`/projects/${r.id}`,style:{textDecoration:"none"},children:[(0,x.jsx)(v,{children:r.thumbnail?(0,x.jsx)("img",{src:r.thumbnail,alt:r.name}):(0,x.jsx)("div",{style:{opacity:.5},children:"No Preview"})}),(0,x.jsxs)(w,{children:[(0,x.jsx)(A,{children:r.name}),(0,x.jsx)(k,{children:(0,x.jsxs)("span",{children:["Updated ",new Date(r.updated_at||r.created_at).toLocaleDateString()]})}),(0,x.jsxs)(_,{children:[(0,x.jsx)(d.A,{small:!0,children:"View Details"}),(0,x.jsx)(i.N_,{to:`/editor/${r.id}`,children:(0,x.jsx)(d.A,{small:!0,primary:!0,children:"Edit"})})]})]})]})},r.id))),(0,x.jsx)(i.N_,{to:"/projects/new",style:{textDecoration:"none"},children:(0,x.jsxs)(C,{children:[(0,x.jsx)(N,{children:(0,x.jsx)(s.OiG,{})}),(0,x.jsx)("h3",{children:"Create New Project"})]})})]}):(0,x.jsxs)(P,{children:[(0,x.jsx)("h3",{children:"No Projects Yet"}),(0,x.jsx)("p",{children:"Create your first website project to get started"}),(0,x.jsx)(i.N_,{to:"/projects/new",children:(0,x.jsx)(d.A,{primary:!0,icon:(0,x.jsx)(s.OiG,{}),children:"Create New Project"})})]})]})}}}]);