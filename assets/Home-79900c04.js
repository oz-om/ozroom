import{u as c,r,j as e,O as i,a as s,N as l,b as m,c as d,F as n}from"./index-d82c478d.js";const p=()=>{const{loggedIn:t,fetchRooms:o}=c();return r.useEffect(()=>{t&&o()},[]),e("div",{id:"rooms-container",children:e(i,{})})},h=r.memo(()=>s("div",{id:"search-bar",className:"relative overflow-hidden flex items-center pl-2 backdrop-blur-md shadow-sm shadow-violet-400 w-11/12 mx-auto rounded-md",children:[e("i",{className:"bx bx-search-alt text-3xl absolute z-[-1] text-violet-500"}),e("input",{type:"text",className:"w-full bg-transparent outline-none pl-10 py-2",placeholder:"search"})]})),u=r.memo(()=>s("nav",{className:"toggle-sides flex justify-center mb-2 rounded-md",children:[e(l,{to:"explore",className:"inline-block w-full text-center px-2 py-1 cursor-pointer hover:bg-violet-600/30 ",children:"explore"}),e(l,{to:"rooms",className:"inline-block w-full text-center px-2 py-1 cursor-pointer hover:bg-violet-600/30 ",children:"rooms"})]}));function f(){const{loggedIn:t}=c(),o=m(),a=d();return r.useEffect(()=>{t?a.pathname==="/"?o("/explore"):o(a.pathname):o("/login")},[t]),e("section",{className:"min-h-[calc(100vh_-_70px)]",children:t&&e(n,{children:s("div",{className:" wrapper grid",children:[(a.pathname==="/rooms"||a.pathname==="/explore")&&s(n,{children:[e(u,{}),e(h,{})]}),e(p,{})]})})})}export{f as default};
