"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[859],{5859:(r,e,s)=>{s.r(e),s.d(e,{default:()=>k});var o=s(9950),a=s(4752),n=s(8429),t=s(5261),d=s(3507),i=s(9988),l=s(339),c=s(4414);const m=a.Ay.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
`,w=a.Ay.div`
  margin-bottom: 2rem;
`,x=a.Ay.h1`
  font-size: 2rem;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
`,p=a.Ay.p`
  color: var(--color-text-secondary);
  font-size: 1.1rem;
`,u=a.Ay.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,h=a.Ay.div`
  background-color: var(--color-bg-card);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  padding: 2rem;
`,j=a.Ay.h2`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: var(--color-primary);
  }
`,g=a.Ay.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`,y=a.Ay.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`,f=a.Ay.label`
  font-weight: 500;
  color: var(--color-text-primary);
`,P=a.Ay.div`
  display: flex;
  align-items: center;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 0 1rem;
  
  &:focus-within {
    border-color: var(--color-primary);
    box-shadow: 0 0 0 2px rgba(var(--color-primary-rgb), 0.1);
  }
  
  svg {
    color: var(--color-text-secondary);
    margin-right: 0.5rem;
  }
  
  button {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`,b=a.Ay.input`
  width: 100%;
  padding: 0.75rem 0;
  border: none;
  background-color: transparent;
  color: var(--color-text-primary);
  
  &:focus {
    outline: none;
  }
  
  &:disabled {
    color: var(--color-text-secondary);
    cursor: not-allowed;
  }
`,v=a.Ay.div`
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: 0.5rem;
`,A=a.Ay.div`
  color: var(--color-success);
  background-color: var(--color-success-bg);
  border: 1px solid var(--color-success);
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.5rem;
    flex-shrink: 0;
  }
`,C=a.Ay.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
`,S=a.Ay.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.25rem;
  color: ${r=>r.met?"var(--color-success)":"var(--color-text-secondary)"};
  
  svg {
    margin-right: 0.5rem;
  }
`,k=()=>{const{user:r,updateProfile:e,changePassword:s,loading:a,error:k,setError:z}=(0,d.A)(),[E,N]=((0,n.Zp)(),(0,o.useState)({name:"",email:""})),[F,q]=(0,o.useState)({currentPassword:"",newPassword:"",confirmPassword:""}),[U,Y]=(0,o.useState)(!1),[J,D]=(0,o.useState)(!1),[H,I]=(0,o.useState)(!1),[Z,$]=(0,o.useState)(!1),[O,T]=(0,o.useState)(!1),[_,M]=(0,o.useState)({profile:{},password:{}});(0,o.useEffect)((()=>{r&&N({name:r.name||"",email:r.email||""})}),[r]),(0,o.useEffect)((()=>()=>z(null)),[z]);const B={length:F.newPassword.length>=8,uppercase:/[A-Z]/.test(F.newPassword),lowercase:/[a-z]/.test(F.newPassword),number:/[0-9]/.test(F.newPassword),special:/[^A-Za-z0-9]/.test(F.newPassword),match:F.newPassword&&F.newPassword===F.confirmPassword},G=r=>{const{name:e,value:s}=r.target;N({...E,[e]:s}),M({..._,profile:{..._.profile,[e]:""}}),$(!1)},K=r=>{const{name:e,value:s}=r.target;q({...F,[e]:s}),M({..._,password:{..._.password,[e]:""}}),T(!1)};return r?(0,c.jsxs)(m,{children:[(0,c.jsxs)(w,{children:[(0,c.jsx)(x,{children:"Your Profile"}),(0,c.jsx)(p,{children:"Manage your personal information and change your password"})]}),(0,c.jsxs)(u,{children:[(0,c.jsxs)(h,{children:[(0,c.jsxs)(j,{children:[(0,c.jsx)(t.x$1,{}),"Personal Information"]}),Z&&(0,c.jsxs)(A,{children:[(0,c.jsx)(t.A7C,{})," Your profile has been updated successfully."]}),(0,c.jsxs)(g,{onSubmit:async r=>{if(r.preventDefault(),(()=>{const r={};return E.name.trim()||(r.name="Name is required"),E.email.trim()?/\S+@\S+\.\S+/.test(E.email)||(r.email="Email is invalid"):r.email="Email is required",M({..._,profile:r}),0===Object.keys(r).length})())try{await e(E),$(!0),setTimeout((()=>{$(!1)}),5e3)}catch(s){}},children:[(0,c.jsxs)(y,{children:[(0,c.jsx)(f,{htmlFor:"name",children:"Full Name"}),(0,c.jsxs)(P,{children:[(0,c.jsx)(t.x$1,{}),(0,c.jsx)(b,{type:"text",id:"name",name:"name",value:E.name,onChange:G,placeholder:"Your full name"})]}),_.profile.name&&(0,c.jsx)(v,{children:_.profile.name})]}),(0,c.jsxs)(y,{children:[(0,c.jsx)(f,{htmlFor:"email",children:"Email Address"}),(0,c.jsxs)(P,{children:[(0,c.jsx)(t.maD,{}),(0,c.jsx)(b,{type:"email",id:"email",name:"email",value:E.email,onChange:G,placeholder:"Your email address"})]}),_.profile.email&&(0,c.jsx)(v,{children:_.profile.email})]}),(0,c.jsxs)(i.A,{type:"submit",primary:!0,loading:a,children:[(0,c.jsx)(t.dIn,{})," Save Changes"]})]})]}),(0,c.jsxs)(h,{children:[(0,c.jsxs)(j,{children:[(0,c.jsx)(t.JhU,{}),"Change Password"]}),O&&(0,c.jsxs)(A,{children:[(0,c.jsx)(t.A7C,{})," Your password has been changed successfully."]}),(0,c.jsxs)(g,{onSubmit:async r=>{if(r.preventDefault(),(()=>{const r={};return F.currentPassword||(r.currentPassword="Current password is required"),F.newPassword?B.length?B.uppercase&&B.lowercase&&B.number||(r.newPassword="Password does not meet requirements"):r.newPassword="Password must be at least 8 characters":r.newPassword="New password is required",F.confirmPassword?F.newPassword!==F.confirmPassword&&(r.confirmPassword="Passwords do not match"):r.confirmPassword="Please confirm your password",M({..._,password:r}),0===Object.keys(r).length})())try{await s(F.currentPassword,F.newPassword),q({currentPassword:"",newPassword:"",confirmPassword:""}),T(!0),setTimeout((()=>{T(!1)}),5e3)}catch(e){}},children:[(0,c.jsxs)(y,{children:[(0,c.jsx)(f,{htmlFor:"currentPassword",children:"Current Password"}),(0,c.jsxs)(P,{children:[(0,c.jsx)(t.JhU,{}),(0,c.jsx)(b,{type:U?"text":"password",id:"currentPassword",name:"currentPassword",value:F.currentPassword,onChange:K,placeholder:"Enter your current password"}),(0,c.jsx)("button",{type:"button",onClick:()=>Y(!U),"aria-label":U?"Hide password":"Show password",children:U?(0,c.jsx)(t.mx3,{}):(0,c.jsx)(t.Ny1,{})})]}),_.password.currentPassword&&(0,c.jsx)(v,{children:_.password.currentPassword})]}),(0,c.jsxs)(y,{children:[(0,c.jsx)(f,{htmlFor:"newPassword",children:"New Password"}),(0,c.jsxs)(P,{children:[(0,c.jsx)(t.JhU,{}),(0,c.jsx)(b,{type:J?"text":"password",id:"newPassword",name:"newPassword",value:F.newPassword,onChange:K,placeholder:"Enter your new password"}),(0,c.jsx)("button",{type:"button",onClick:()=>D(!J),"aria-label":J?"Hide password":"Show password",children:J?(0,c.jsx)(t.mx3,{}):(0,c.jsx)(t.Ny1,{})})]}),_.password.newPassword&&(0,c.jsx)(v,{children:_.password.newPassword}),F.newPassword&&(0,c.jsxs)(C,{children:[(0,c.jsxs)(S,{met:B.length,children:[(0,c.jsx)(t.A7C,{})," At least 8 characters long"]}),(0,c.jsxs)(S,{met:B.uppercase,children:[(0,c.jsx)(t.A7C,{})," At least one uppercase letter"]}),(0,c.jsxs)(S,{met:B.lowercase,children:[(0,c.jsx)(t.A7C,{})," At least one lowercase letter"]}),(0,c.jsxs)(S,{met:B.number,children:[(0,c.jsx)(t.A7C,{})," At least one number"]}),(0,c.jsxs)(S,{met:B.special,children:[(0,c.jsx)(t.A7C,{})," At least one special character"]})]})]}),(0,c.jsxs)(y,{children:[(0,c.jsx)(f,{htmlFor:"confirmPassword",children:"Confirm New Password"}),(0,c.jsxs)(P,{children:[(0,c.jsx)(t.JhU,{}),(0,c.jsx)(b,{type:H?"text":"password",id:"confirmPassword",name:"confirmPassword",value:F.confirmPassword,onChange:K,placeholder:"Confirm your new password"}),(0,c.jsx)("button",{type:"button",onClick:()=>I(!H),"aria-label":H?"Hide password":"Show password",children:H?(0,c.jsx)(t.mx3,{}):(0,c.jsx)(t.Ny1,{})})]}),_.password.confirmPassword&&(0,c.jsx)(v,{children:_.password.confirmPassword}),F.confirmPassword&&(0,c.jsxs)(S,{met:B.match,children:[(0,c.jsx)(t.A7C,{})," Passwords match"]})]}),k&&(0,c.jsx)(v,{children:k}),(0,c.jsxs)(i.A,{type:"submit",primary:!0,loading:a,children:[(0,c.jsx)(t.dIn,{})," Update Password"]})]})]})]})]}):(0,c.jsx)(m,{children:(0,c.jsx)(l.A,{size:"large"})})}}}]);