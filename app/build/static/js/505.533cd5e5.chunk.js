"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[505],{4505:(r,e,o)=>{o.r(e),o.d(e,{default:()=>P});var s=o(9950),a=o(8429),t=o(2074),n=o(4752),i=o(5261),l=o(3507),d=o(9988),c=o(339),m=o(4414);const p=n.Ay.div`
  min-height: calc(100vh - 60px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-primary);
`,x=n.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 500px;
  padding: 2.5rem;

  @media (max-width: 576px) {
    padding: 1.5rem;
  }
`,h=n.Ay.div`
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--color-text-secondary);
  }
`,u=n.Ay.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`,w=n.Ay.div`
  display: flex;
  flex-direction: column;
`,j=n.Ay.label`
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  color: var(--color-text-primary);
  font-weight: 500;
`,g=n.Ay.div`
  position: relative;

  svg {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--color-text-secondary);
  }

  button {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text-secondary);
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,y=n.Ay.input`
  width: 100%;
  padding: 0.75rem 2.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }

  ${r=>{let{error:e}=r;return e&&"\n    border-color: var(--color-error);\n    &:focus {\n      box-shadow: 0 0 0 2px rgba(var(--color-error-rgb), 0.1);\n    }\n  "}}
`,f=n.Ay.div`
  color: var(--color-error);
  font-size: 0.85rem;
  margin-top: 0.5rem;
`,b=n.Ay.div`
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
`,v=n.Ay.div`
  display: flex;
  align-items: center;
  margin-top: 0.25rem;
  color: ${r=>{let{met:e}=r;return e?"var(--color-success)":"var(--color-text-secondary)"}};

  svg {
    margin-right: 0.5rem;
    font-size: 0.85rem;
  }
`,A=n.Ay.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);

  a {
    color: var(--color-primary);
    margin-left: 0.25rem;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: var(--color-primary-hover);
      text-decoration: underline;
    }
  }
`,P=()=>{var r,e;const o=(0,a.Zp)(),n=(0,a.zy)(),{register:P,isAuthenticated:C,loading:k,error:z}=(0,l.A)(),[S,F]=(0,s.useState)({name:"",email:"",password:"",confirmPassword:""}),[N,q]=(0,s.useState)({}),[E,Y]=(0,s.useState)(!1),[J,Z]=(0,s.useState)(!1),$=(null===(r=n.state)||void 0===r||null===(e=r.from)||void 0===e?void 0:e.pathname)||"/dashboard";(0,s.useEffect)((()=>{C&&o($,{replace:!0})}),[C,o,$]);const _=r=>{const{name:e,value:o}=r.target;F((r=>({...r,[e]:o}))),N[e]&&q((r=>({...r,[e]:""})))},D={length:S.password.length>=8,uppercase:/[A-Z]/.test(S.password),lowercase:/[a-z]/.test(S.password),number:/[0-9]/.test(S.password),special:/[^A-Za-z0-9]/.test(S.password),match:S.password&&S.password===S.confirmPassword};return(0,m.jsx)(p,{children:(0,m.jsxs)(x,{children:[(0,m.jsxs)(h,{children:[(0,m.jsx)("h2",{children:"Create Account"}),(0,m.jsx)("p",{children:"Join Byldur to create stunning websites"})]}),(0,m.jsxs)(u,{onSubmit:async r=>{r.preventDefault(),(()=>{const r={};return S.name.trim()||(r.name="Name is required"),S.email?/\S+@\S+\.\S+/.test(S.email)||(r.email="Email is invalid"):r.email="Email is required",S.password?D.length?D.uppercase&&D.lowercase&&D.number||(r.password="Password does not meet requirements"):r.password="Password must be at least 8 characters":r.password="Password is required",S.confirmPassword?S.password!==S.confirmPassword&&(r.confirmPassword="Passwords do not match"):r.confirmPassword="Please confirm your password",q(r),0===Object.keys(r).length})()&&await P({name:S.name,email:S.email,password:S.password})},children:[(0,m.jsxs)(w,{children:[(0,m.jsx)(j,{htmlFor:"name",children:"Full Name"}),(0,m.jsxs)(g,{children:[(0,m.jsx)(i.x$1,{}),(0,m.jsx)(y,{type:"text",id:"name",name:"name",value:S.name,onChange:_,placeholder:"Your full name",error:N.name})]}),N.name&&(0,m.jsx)(f,{children:N.name})]}),(0,m.jsxs)(w,{children:[(0,m.jsx)(j,{htmlFor:"email",children:"Email Address"}),(0,m.jsxs)(g,{children:[(0,m.jsx)(i.maD,{}),(0,m.jsx)(y,{type:"email",id:"email",name:"email",value:S.email,onChange:_,placeholder:"Your email address",error:N.email})]}),N.email&&(0,m.jsx)(f,{children:N.email})]}),(0,m.jsxs)(w,{children:[(0,m.jsx)(j,{htmlFor:"password",children:"Password"}),(0,m.jsxs)(g,{children:[(0,m.jsx)(i.JhU,{}),(0,m.jsx)(y,{type:E?"text":"password",id:"password",name:"password",value:S.password,onChange:_,placeholder:"Create a strong password",error:N.password}),(0,m.jsx)("button",{type:"button",onClick:()=>Y(!E),"aria-label":E?"Hide password":"Show password",children:E?(0,m.jsx)(i.mx3,{}):(0,m.jsx)(i.Ny1,{})})]}),N.password&&(0,m.jsx)(f,{children:N.password}),S.password&&(0,m.jsxs)(b,{children:[(0,m.jsxs)(v,{met:D.length,children:[(0,m.jsx)(i.A7C,{})," At least 8 characters long"]}),(0,m.jsxs)(v,{met:D.uppercase,children:[(0,m.jsx)(i.A7C,{})," At least one uppercase letter"]}),(0,m.jsxs)(v,{met:D.lowercase,children:[(0,m.jsx)(i.A7C,{})," At least one lowercase letter"]}),(0,m.jsxs)(v,{met:D.number,children:[(0,m.jsx)(i.A7C,{})," At least one number"]}),(0,m.jsxs)(v,{met:D.special,children:[(0,m.jsx)(i.A7C,{})," At least one special character"]})]})]}),(0,m.jsxs)(w,{children:[(0,m.jsx)(j,{htmlFor:"confirmPassword",children:"Confirm Password"}),(0,m.jsxs)(g,{children:[(0,m.jsx)(i.JhU,{}),(0,m.jsx)(y,{type:J?"text":"password",id:"confirmPassword",name:"confirmPassword",value:S.confirmPassword,onChange:_,placeholder:"Confirm your password",error:N.confirmPassword}),(0,m.jsx)("button",{type:"button",onClick:()=>Z(!J),"aria-label":J?"Hide password":"Show password",children:J?(0,m.jsx)(i.mx3,{}):(0,m.jsx)(i.Ny1,{})})]}),N.confirmPassword&&(0,m.jsx)(f,{children:N.confirmPassword}),S.confirmPassword&&(0,m.jsxs)(v,{met:D.match,children:[(0,m.jsx)(i.A7C,{})," Passwords match"]})]}),z&&(0,m.jsx)(f,{children:z}),(0,m.jsx)(d.A,{type:"submit",primary:!0,fullWidth:!0,disabled:k,children:k?(0,m.jsx)(c.A,{size:"small",color:"white"}):"Create Account"})]}),(0,m.jsxs)(A,{children:["Already have an account?",(0,m.jsx)(t.N_,{to:"/login",children:"Log in"})]})]})})}}}]);