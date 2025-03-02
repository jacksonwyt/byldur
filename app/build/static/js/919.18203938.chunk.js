"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[919],{1919:(e,r,o)=>{o.r(r),o.d(r,{default:()=>v});var a=o(9950),i=o(8429),s=o(2074),l=o(4752),n=o(5261),t=o(9988),d=o(3507),c=o(4414);const m=l.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 300px);
  padding: 2rem;
`,p=l.Ay.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
`,h=l.Ay.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-color-secondary);
  }
`,u=l.Ay.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,x=l.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,g=l.Ay.label`
  font-weight: 500;
`,y=l.Ay.div`
  display: flex;
  align-items: center;
  background-color: var(--bg-color-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  padding: 0 1rem;
  
  &:focus-within {
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px var(--primary-color-light);
  }
  
  svg {
    color: var(--text-color-secondary);
    margin-right: 0.5rem;
  }
`,w=l.Ay.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`,b=l.Ay.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,j=l.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`,v=()=>{const[e,r]=(0,a.useState)({email:"",password:""}),[o,l]=(0,a.useState)({}),{login:v,error:f,loading:A,isAuthenticated:S}=(0,d.A)(),k=(0,i.Zp)(),C=(0,i.zy)(),E=new URLSearchParams(C.search).get("redirect")||"/dashboard";(0,a.useEffect)((()=>{S&&k(E)}),[S,k,E]);const z=a=>{const{name:i,value:s}=a.target;r({...e,[i]:s}),o[i]&&l({...o,[i]:""})};return(0,c.jsx)(m,{children:(0,c.jsxs)(p,{children:[(0,c.jsxs)(h,{children:[(0,c.jsx)("h1",{children:"Welcome Back"}),(0,c.jsx)("p",{children:"Sign in to your Byldur account"})]}),(0,c.jsxs)(u,{onSubmit:async r=>{if(r.preventDefault(),(()=>{const r={};return e.email?/\S+@\S+\.\S+/.test(e.email)||(r.email="Email is invalid"):r.email="Email is required",e.password||(r.password="Password is required"),l(r),0===Object.keys(r).length})())try{await v(e.email,e.password)}catch(o){}},children:[(0,c.jsxs)(x,{children:[(0,c.jsx)(g,{htmlFor:"email",children:"Email"}),(0,c.jsxs)(y,{children:[(0,c.jsx)(n.x$1,{}),(0,c.jsx)(w,{type:"email",id:"email",name:"email",value:e.email,onChange:z,placeholder:"Enter your email",autoComplete:"email"})]}),o.email&&(0,c.jsx)(b,{children:o.email})]}),(0,c.jsxs)(x,{children:[(0,c.jsx)(g,{htmlFor:"password",children:"Password"}),(0,c.jsxs)(y,{children:[(0,c.jsx)(n.JhU,{}),(0,c.jsx)(w,{type:"password",id:"password",name:"password",value:e.password,onChange:z,placeholder:"Enter your password",autoComplete:"current-password"})]}),o.password&&(0,c.jsx)(b,{children:o.password})]}),f&&(0,c.jsx)(b,{children:f}),(0,c.jsxs)(t.A,{type:"submit",loading:A,fullWidth:!0,children:[(0,c.jsx)(n.Zu,{})," Sign In"]}),(0,c.jsxs)(j,{children:[(0,c.jsx)(s.N_,{to:"/forgot-password",children:"Forgot password?"}),(0,c.jsx)(s.N_,{to:"/register",children:"Don't have an account? Sign up"})]})]})]})})}}}]);