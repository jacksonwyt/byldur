"use strict";(self.webpackChunkbyldur_react=self.webpackChunkbyldur_react||[]).push([[471],{1471:(r,e,i)=>{i.r(e),i.d(e,{default:()=>X});var t=i(9950),n=i(8429),o=i(4752),a=i(5261),s=i(3507),c=(i(9206),i(9988)),d=i(339),l=i(1986),h=i(1794);var u=i(5604),m=i(4269),x=i(4414);const p=(0,m.c)("pk_test_your_publishable_key"),v=r=>{let{children:e}=r;return(0,x.jsx)(u.Elements,{stripe:p,children:e})},y=o.Ay.div`
  margin-bottom: 2rem;
`,g=o.Ay.div`
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  background-color: var(--input-bg-color);
`,b=o.Ay.div`
  color: var(--error-color);
  margin-top: 0.5rem;
  font-size: 0.875rem;
`,j=o.Ay.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: flex-end;
`,f=r=>{let{onSubmit:e,buttonText:i="Update Payment Method",isSubmitting:n=!1}=r;const o=(0,u.useStripe)(),a=(0,u.useElements)(),[s,d]=(0,t.useState)(null);return(0,x.jsx)(y,{children:(0,x.jsxs)("form",{onSubmit:async r=>{if(r.preventDefault(),!o||!a)return;d(null);const i=a.getElement(u.CardElement),{error:t,paymentMethod:n}=await o.createPaymentMethod({type:"card",card:i});if(t)return console.error("Error creating payment method:",t),void d(t.message);e(n.id)},children:[(0,x.jsx)(g,{children:(0,x.jsx)(u.CardElement,{options:{style:{base:{fontSize:"16px",color:"var(--text-color)","::placeholder":{color:"var(--text-color-muted)"}},invalid:{color:"var(--error-color)",iconColor:"var(--error-color)"}},hidePostalCode:!0}})}),s&&(0,x.jsx)(b,{children:s}),(0,x.jsx)(j,{children:(0,x.jsx)(c.A,{type:"submit",disabled:!o||n,loading:n,children:i})})]})})},A=o.Ay.div`
  max-width: 1200px;
  margin: 0 auto;
`,w=o.Ay.div`
  margin-bottom: 2rem;
`,S=o.Ay.h1`
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`,P=o.Ay.p`
  color: var(--text-color-secondary);
  font-size: 1.1rem;
`,C=o.Ay.div`
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${r=>"info"===r.type?"var(--info-bg-color)":"success"===r.type?"var(--success-bg-color)":"warning"===r.type?"var(--warning-bg-color)":"error"===r.type?"var(--error-bg-color)":"var(--info-bg-color)"};
  color: ${r=>"info"===r.type?"var(--info-color)":"success"===r.type?"var(--success-color)":"warning"===r.type?"var(--warning-color)":"error"===r.type?"var(--error-color)":"var(--info-color)"};
  border-left: 4px solid ${r=>"info"===r.type?"var(--info-color)":"success"===r.type?"var(--success-color)":"warning"===r.type?"var(--warning-color)":"error"===r.type?"var(--error-color)":"var(--info-color)"};
`,k=o.Ay.div``,z=o.Ay.h3`
  margin: 0 0 0.5rem 0;
  font-weight: 600;
`,E=o.Ay.p`
  margin: 0;
`,$=o.Ay.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`,q=o.Ay.div`
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 2px solid ${r=>r.isActive?"var(--primary-color)":"transparent"};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--card-shadow-hover);
  }
`,U=o.Ay.div`
  padding: 1.5rem;
  background-color: ${r=>r.isPro?"var(--primary-color)":"var(--secondary-color)"};
  color: ${r=>r.isPro?"var(--primary-text-color)":"var(--secondary-text-color)"};
`,M=o.Ay.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
`,Y=o.Ay.div`
  font-size: 2rem;
  font-weight: 700;
  
  span {
    font-size: 1rem;
    font-weight: 400;
  }
`,L=o.Ay.div`
  padding: 1.5rem;
`,D=o.Ay.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
`,R=o.Ay.li`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    color: ${r=>r.available?"var(--success-color)":"var(--text-color-muted)"};
  }
`,_=o.Ay.div`
  padding: 0 1.5rem 1.5rem;
`,N=o.Ay.div`
  margin-bottom: 2rem;
`,H=o.Ay.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`,T=o.Ay.div`
  background-color: var(--card-bg-color);
  border-radius: 0.5rem;
  box-shadow: var(--card-shadow);
  padding: 1.5rem;
  margin-bottom: 2rem;
`,B=o.Ay.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`,I=o.Ay.span`
  font-weight: 500;
  color: var(--text-color-secondary);
`,K=o.Ay.span`
  font-weight: ${r=>r.bold?"600":"400"};
  color: ${r=>r.highlight?"var(--primary-color)":"var(--text-color)"};
`,W=o.Ay.div`
  margin-top: 3rem;
`,Z=o.Ay.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid var(--border-color);
  }
  
  th {
    font-weight: 600;
    color: var(--text-color-secondary);
  }
  
  tr:last-child td {
    border-bottom: none;
  }
`,F=o.Ay.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: ${r=>"active"===r.status?"var(--success-bg-color)":"canceled"===r.status?"var(--warning-bg-color)":"inactive"===r.status?"var(--error-bg-color)":"var(--info-bg-color)"};
  color: ${r=>"active"===r.status?"var(--success-color)":"canceled"===r.status?"var(--warning-color)":"inactive"===r.status?"var(--error-color)":"var(--info-color)"};
`,O=o.Ay.div`
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
`,Q=o.Ay.div`
  background-color: var(--bg-color);
  border-radius: 0.5rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
`,G=o.Ay.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
`,J=o.Ay.p`
  margin-bottom: 1.5rem;
`,V=o.Ay.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
`,X=()=>{var r;const{user:e,isAuthenticated:i}=(0,s.A)(),o=(0,n.Zp)(),u=(0,n.zy)(),{subscription:m,plans:p,paymentHistory:y,loading:g,error:b,fetchPaymentHistory:j,createCheckoutSession:X,cancelSubscription:rr,reactivateSubscription:er,updatePaymentMethod:ir}=(()=>{const r=(0,t.useContext)(h.l);if(!r)throw new Error("useStripe must be used within a StripeProvider");return r})(),[tr,nr]=(0,t.useState)(!1),[or,ar]=(0,t.useState)(!1),[sr,cr]=(0,t.useState)(!1),dr="true"===new URLSearchParams(u.search).get("required");(0,t.useEffect)((()=>{document.title="Subscription | Byldur";"true"===new URLSearchParams(u.search).get("success")&&o("/dashboard/subscription",{replace:!0}),j()}),[u,o,j]);const lr=r=>(0,x.jsx)(F,{status:r,children:r.charAt(0).toUpperCase()+r.slice(1)});return g?(0,x.jsx)("div",{style:{display:"flex",justifyContent:"center",padding:"4rem 0"},children:(0,x.jsx)(d.A,{size:"50px",message:"Loading subscription information..."})}):(0,x.jsxs)(A,{children:[(0,x.jsxs)(w,{children:[(0,x.jsx)(S,{children:"Subscription"}),(0,x.jsx)(P,{children:"Manage your subscription and billing information"})]}),b&&(0,x.jsx)(C,{type:"error",children:(0,x.jsxs)(k,{children:[(0,x.jsx)(z,{children:"Error"}),(0,x.jsx)(E,{children:b})]})}),dr&&!(null!==m&&void 0!==m&&m.active)&&(0,x.jsx)(C,{type:"warning",children:(0,x.jsxs)(k,{children:[(0,x.jsx)(z,{children:"Subscription Required"}),(0,x.jsx)(E,{children:"This feature requires an active subscription. Please subscribe to a plan to continue."})]})}),m&&(0,x.jsxs)(N,{children:[(0,x.jsx)(H,{children:"Current Plan"}),(0,x.jsxs)(T,{children:[(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Plan"}),(0,x.jsx)(K,{bold:!0,highlight:!0,children:(null===(r=m.plan)||void 0===r?void 0:r.name)||"Free"})]}),(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Status"}),(0,x.jsx)(K,{children:lr(m.status)})]}),(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Billing Period"}),(0,x.jsx)(K,{children:m.currentPeriodStart&&m.currentPeriodEnd?`${(0,l.Yq)(m.currentPeriodStart)} to ${(0,l.Yq)(m.currentPeriodEnd)}`:"N/A"})]}),(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Next Billing Date"}),(0,x.jsx)(K,{children:"active"===m.status&&m.currentPeriodEnd?(0,l.Yq)(m.currentPeriodEnd):"N/A"})]}),m.canceledAt&&(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Canceled On"}),(0,x.jsx)(K,{children:(0,l.Yq)(m.canceledAt)})]}),(0,x.jsxs)(B,{children:[(0,x.jsx)(I,{children:"Actions"}),(0,x.jsxs)("div",{children:["active"===m.status&&(0,x.jsxs)(c.A,{variant:"outline",size:"small",onClick:()=>nr(!0),disabled:g.cancel,children:[(0,x.jsx)(a.QCr,{size:12})," Cancel Subscription"]}),"canceled"===m.status&&(0,x.jsxs)(c.A,{variant:"primary",size:"small",onClick:()=>ar(!0),disabled:g.reactivate,loading:g.reactivate,children:[(0,x.jsx)(a.Swo,{size:12})," Reactivate"]}),"active"===m.status&&(0,x.jsxs)(c.A,{variant:"secondary",size:"small",onClick:()=>{cr(!0)},disabled:g.updatePayment,style:{marginLeft:"0.5rem"},children:[(0,x.jsx)(a.x1c,{size:12})," Update Payment"]})]})]})]})]}),(0,x.jsxs)("div",{children:[(0,x.jsx)(H,{children:"Available Plans"}),(0,x.jsx)($,{children:p.map((r=>{var e,i;return(0,x.jsxs)(q,{isActive:(null===m||void 0===m||null===(e=m.plan)||void 0===e?void 0:e.id)===r.id,children:[(0,x.jsxs)(U,{isPro:r.name.toLowerCase().includes("pro"),children:[(0,x.jsx)(M,{children:r.name}),(0,x.jsxs)(Y,{children:["$",r.price," ",(0,x.jsxs)("span",{children:["/ ",r.interval]})]})]}),(0,x.jsx)(L,{children:(0,x.jsx)(D,{children:r.features.map(((r,e)=>(0,x.jsxs)(R,{available:!0,children:[(0,x.jsx)(a.CMH,{})," ",r]},e)))})}),(0,x.jsx)(_,{children:(null===m||void 0===m||null===(i=m.plan)||void 0===i?void 0:i.id)===r.id?(0,x.jsx)(c.A,{variant:"outline",disabled:!0,fullWidth:!0,children:"Current Plan"}):(0,x.jsxs)(c.A,{variant:r.name.toLowerCase().includes("pro")?"primary":"secondary",onClick:()=>(async r=>{await X(r)})(r.id),disabled:g.checkout,loading:g.checkout,fullWidth:!0,children:[r.price>0?"Subscribe":"Choose Plan"," ",(0,x.jsx)(a.Z0P,{size:12})]})})]},r.id)}))})]}),y&&y.length>0&&(0,x.jsxs)(W,{children:[(0,x.jsx)(H,{children:"Payment History"}),(0,x.jsx)(T,{children:(0,x.jsxs)(Z,{children:[(0,x.jsx)("thead",{children:(0,x.jsxs)("tr",{children:[(0,x.jsx)("th",{children:"Date"}),(0,x.jsx)("th",{children:"Amount"}),(0,x.jsx)("th",{children:"Plan"}),(0,x.jsx)("th",{children:"Status"})]})}),(0,x.jsx)("tbody",{children:y.map((r=>(0,x.jsxs)("tr",{children:[(0,x.jsx)("td",{children:(0,l.Yq)(r.date)}),(0,x.jsxs)("td",{children:["$",r.amount]}),(0,x.jsx)("td",{children:r.description}),(0,x.jsx)("td",{children:lr(r.status)})]},r.id)))})]})})]}),tr&&(0,x.jsx)(O,{children:(0,x.jsxs)(Q,{children:[(0,x.jsx)(G,{children:"Cancel Subscription"}),(0,x.jsx)(J,{children:"Are you sure you want to cancel your subscription? You will continue to have access until the end of your current billing period."}),(0,x.jsxs)(V,{children:[(0,x.jsx)(c.A,{variant:"outline",onClick:()=>nr(!1),disabled:g.cancel,children:"Keep Subscription"}),(0,x.jsx)(c.A,{variant:"danger",onClick:async()=>{await rr()&&nr(!1)},disabled:g.cancel,loading:g.cancel,children:"Cancel Subscription"})]})]})}),or&&(0,x.jsx)(O,{children:(0,x.jsxs)(Q,{children:[(0,x.jsx)(G,{children:"Reactivate Subscription"}),(0,x.jsx)(J,{children:"Are you sure you want to reactivate your subscription?"}),(0,x.jsxs)(V,{children:[(0,x.jsx)(c.A,{variant:"outline",onClick:()=>ar(!1),disabled:g.reactivate,children:"Keep Subscription"}),(0,x.jsx)(c.A,{variant:"primary",onClick:async()=>{await er()&&ar(!1)},disabled:g.reactivate,loading:g.reactivate,children:"Reactivate"})]})]})}),sr&&(0,x.jsx)(O,{children:(0,x.jsxs)(Q,{children:[(0,x.jsx)(G,{children:"Update Payment Method"}),(0,x.jsx)(J,{children:"Please enter your new payment method details:"}),(0,x.jsx)(v,{children:(0,x.jsx)(f,{onSubmit:async r=>{try{console.log("Updating payment method with ID:",r),cr(!1)}catch(e){console.error("Error updating payment method:",e)}},buttonText:"Update Payment Method",isSubmitting:g.updatePayment})}),(0,x.jsx)(V,{children:(0,x.jsx)(c.A,{variant:"secondary",onClick:()=>cr(!1),children:"Cancel"})})]})})]})}},1986:(r,e,i)=>{i.d(e,{Yq:()=>t});const t=function(r){let e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!r)return"Unknown date";try{const i=new Date(r);if(isNaN(i.getTime()))return"Invalid date";const t={year:"numeric",month:"short",day:"numeric",...e};return i.toLocaleDateString(void 0,t)}catch(i){return console.error("Error formatting date:",i),"Invalid date"}}}}]);