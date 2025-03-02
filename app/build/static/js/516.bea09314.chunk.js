"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[516],{9516:(r,e,s)=>{s.r(e),s.d(e,{default:()=>k});var o=s(9950),a=s(8429),n=s(2074),t=s(4752),d=s(5261),i=s(9988),l=s(3507),c=s(4414);const m=t.Ay.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px - 300px);
  padding: 2rem;
`,p=t.Ay.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-lg);
  padding: 2rem;
  width: 100%;
  max-width: 450px;
  border: 1px solid var(--border-color);
`,h=t.Ay.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-color-secondary);
  }
`,w=t.Ay.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,x=t.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,u=t.Ay.label`
  font-weight: 500;
`,g=t.Ay.div`
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
  
  button {
    background: none;
    border: none;
    color: var(--text-color-secondary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,j=t.Ay.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--text-color);
  
  &:focus {
    outline: none;
  }
`,f=t.Ay.div`
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,y=t.Ay.div`
  color: var(--success-color);
  background-color: var(--success-color-light);
  border: 1px solid var(--success-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`,b=t.Ay.div`
  color: var(--danger-color);
  background-color: var(--danger-color-light);
  border: 1px solid var(--danger-color);
  border-radius: 0.25rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
`,v=t.Ay.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`,A=t.Ay.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: ${r=>r.met?"var(--success-color)":"var(--text-color-secondary)"};
  
  svg {
    margin-right: 0.5rem;
  }
`,P=t.Ay.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-size: 0.875rem;
`,k=()=>{const[r,e]=(0,o.useState)({password:"",confirmPassword:""}),[s,t]=(0,o.useState)({}),[k,C]=(0,o.useState)(!1),[S,N]=(0,o.useState)(!1),[z,R]=(0,o.useState)(!1),[L,_]=(0,o.useState)(!0),{resetPassword:q,error:E,loading:F,setError:U}=(0,l.A)(),W=((0,a.Zp)(),(0,a.zy)()),Y=new URLSearchParams(W.search).get("token");(0,o.useEffect)((()=>{U(null),Y||_(!1)}),[Y,U]);const Z={length:r.password.length>=8,uppercase:/[A-Z]/.test(r.password),lowercase:/[a-z]/.test(r.password),number:/[0-9]/.test(r.password),special:/[^A-Za-z0-9]/.test(r.password),match:r.password&&r.password===r.confirmPassword},H=o=>{const{name:a,value:n}=o.target;e({...r,[a]:n}),s[a]&&t({...s,[a]:""})};return L?(0,c.jsx)(m,{children:(0,c.jsxs)(p,{children:[(0,c.jsxs)(h,{children:[(0,c.jsx)("h1",{children:"Reset Your Password"}),(0,c.jsx)("p",{children:"Please enter a new password for your account"})]}),z?(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(y,{children:"Your password has been successfully reset. You can now log in with your new password."}),(0,c.jsx)(i.A,{as:n.N_,to:"/login",fullWidth:!0,children:"Go to Login"})]}):(0,c.jsxs)(w,{onSubmit:async e=>{if(e.preventDefault(),(()=>{const e={};return r.password?Z.length?Z.uppercase&&Z.lowercase&&Z.number||(e.password="Password does not meet requirements"):e.password="Password must be at least 8 characters":e.password="Password is required",r.confirmPassword?r.password!==r.confirmPassword&&(e.confirmPassword="Passwords do not match"):e.confirmPassword="Please confirm your password",t(e),0===Object.keys(e).length})())try{await q(Y,r.password),R(!0)}catch(s){}},children:[(0,c.jsxs)(x,{children:[(0,c.jsx)(u,{htmlFor:"password",children:"New Password"}),(0,c.jsxs)(g,{children:[(0,c.jsx)(d.JhU,{}),(0,c.jsx)(j,{type:k?"text":"password",id:"password",name:"password",value:r.password,onChange:H,placeholder:"Enter your new password"}),(0,c.jsx)("button",{type:"button",onClick:()=>C(!k),"aria-label":k?"Hide password":"Show password",children:k?(0,c.jsx)(d.mx3,{}):(0,c.jsx)(d.Ny1,{})})]}),s.password&&(0,c.jsx)(f,{children:s.password}),r.password&&(0,c.jsxs)(v,{children:[(0,c.jsxs)(A,{met:Z.length,children:[(0,c.jsx)(d.A7C,{})," At least 8 characters long"]}),(0,c.jsxs)(A,{met:Z.uppercase,children:[(0,c.jsx)(d.A7C,{})," At least one uppercase letter"]}),(0,c.jsxs)(A,{met:Z.lowercase,children:[(0,c.jsx)(d.A7C,{})," At least one lowercase letter"]}),(0,c.jsxs)(A,{met:Z.number,children:[(0,c.jsx)(d.A7C,{})," At least one number"]}),(0,c.jsxs)(A,{met:Z.special,children:[(0,c.jsx)(d.A7C,{})," At least one special character"]})]})]}),(0,c.jsxs)(x,{children:[(0,c.jsx)(u,{htmlFor:"confirmPassword",children:"Confirm New Password"}),(0,c.jsxs)(g,{children:[(0,c.jsx)(d.JhU,{}),(0,c.jsx)(j,{type:S?"text":"password",id:"confirmPassword",name:"confirmPassword",value:r.confirmPassword,onChange:H,placeholder:"Confirm your new password"}),(0,c.jsx)("button",{type:"button",onClick:()=>N(!S),"aria-label":S?"Hide password":"Show password",children:S?(0,c.jsx)(d.mx3,{}):(0,c.jsx)(d.Ny1,{})})]}),s.confirmPassword&&(0,c.jsx)(f,{children:s.confirmPassword}),r.confirmPassword&&(0,c.jsxs)(A,{met:Z.match,children:[(0,c.jsx)(d.A7C,{})," Passwords match"]})]}),E&&(0,c.jsx)(f,{children:E}),(0,c.jsx)(i.A,{type:"submit",loading:F,fullWidth:!0,children:"Reset Password"}),(0,c.jsx)(P,{children:(0,c.jsxs)(n.N_,{to:"/login",children:[(0,c.jsx)(d.QVr,{})," Back to Login"]})})]})]})}):(0,c.jsx)(m,{children:(0,c.jsxs)(p,{children:[(0,c.jsxs)(h,{children:[(0,c.jsx)("h1",{children:"Invalid Reset Link"}),(0,c.jsx)("p",{children:"The password reset link is invalid or has expired"})]}),(0,c.jsx)(b,{children:"The password reset link you followed is invalid or has expired. Please request a new password reset link."}),(0,c.jsx)(i.A,{as:n.N_,to:"/forgot-password",fullWidth:!0,children:"Request New Reset Link"})]})})}}}]);