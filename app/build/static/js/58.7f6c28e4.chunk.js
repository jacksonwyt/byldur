"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[58],{8058:(e,r,o)=>{o.r(r),o.d(r,{default:()=>w});var i=o(9950),s=o(8429),a=o(2074),l=o(4752),t=o(5261),n=o(9988),d=o(3507),c=o(4414);const m=l.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 300px);
  padding: 2rem;
`,u=l.Ay.div`
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
`,x=l.Ay.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,g=l.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,p=l.Ay.label`
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
`,b=l.Ay.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`,v=l.Ay.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,f=l.Ay.div`
  color: var(--success-color);
  background-color: var(--success-color-light);
  border: 1px solid var(--success-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`,j=l.Ay.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`,w=()=>{const[e,r]=(0,i.useState)(""),[o,l]=(0,i.useState)(""),[w,A]=(0,i.useState)(!1),{requestPasswordReset:k,error:S,loading:E,isAuthenticated:C,setError:R}=(0,d.A)(),_=(0,s.Zp)();(0,i.useEffect)((()=>(C&&_("/dashboard"),()=>R(null))),[C,_,R]);return(0,c.jsx)(m,{children:(0,c.jsxs)(u,{children:[(0,c.jsxs)(h,{children:[(0,c.jsx)("h1",{children:"Reset Password"}),(0,c.jsx)("p",{children:"Enter your email to receive a password reset link"})]}),w?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(f,{children:["We've sent a password reset link to ",(0,c.jsx)("strong",{children:e}),". Please check your inbox and follow the instructions to reset your password."]}),(0,c.jsxs)(n.A,{as:a.N_,to:"/login",fullWidth:!0,children:[(0,c.jsx)(t.QVr,{})," Back to Login"]})]}):(0,c.jsxs)(x,{onSubmit:async r=>{if(r.preventDefault(),e?/\S+@\S+\.\S+/.test(e)||(l("Email is invalid"),0):(l("Email is required"),0))try{await k(e),A(!0)}catch(o){}},children:[(0,c.jsxs)(g,{children:[(0,c.jsx)(p,{htmlFor:"email",children:"Email"}),(0,c.jsxs)(y,{children:[(0,c.jsx)(t.maD,{}),(0,c.jsx)(b,{type:"email",id:"email",name:"email",value:e,onChange:e=>{r(e.target.value),l("")},placeholder:"Enter your email",autoComplete:"email"})]}),o&&(0,c.jsx)(v,{children:o})]}),S&&(0,c.jsx)(v,{children:S}),(0,c.jsx)(n.A,{type:"submit",loading:E,fullWidth:!0,children:"Send Reset Link"}),(0,c.jsx)(j,{children:(0,c.jsx)(a.N_,{to:"/login",children:"Remember your password? Sign in"})})]})]})})}}}]);