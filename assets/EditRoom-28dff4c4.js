import{c as y,b as N,u as k,r as p,a as t,j as e,L as w,d as C,e as S}from"./index-d82c478d.js";function R(){const h=y(),x=N(),{myRooms:f}=k(),c=h.search.split("=")[1],g=f.find(a=>a.id===+c),[o,s]=p.useState({...g});p.useEffect(()=>{c||x("/rooms")},[c]);function v(a){let i=document.querySelector("#cover img"),l=new FileReader;l.readAsDataURL(a.target.files[0]),l.onload=()=>{i.src=l.result}}function n(a){s(i=>({...i,[a.target.name]:a.target.value}))}function m(a){let i=a.target.previousSibling,l=a.target.parentElement.parentElement.children;for(let r=0;r<l.length;r++)l[r].querySelector("input")!=i?(l[r].querySelector("input").classList.remove("peer"),l[r].querySelector("input").removeAttribute("checked")):(l[r].querySelector("input").classList.add("peer"),l[r].querySelector("input").setAttribute("checked","checked"))}function d(a){let i={two:2,three:3,four:4,five:5,six:6};m(a),s(l=>({...l,max:i[a.target.getAttribute("for")]}))}function u(a){let i={private:!0,public:!1};if(i[a.target.getAttribute("for")]&&!o.key){let l=S();s(r=>({...r,key:l}))}s(l=>({...l,isPrivate:i[a.target.getAttribute("for")]})),m(a)}function b(a){console.log(o)}return t("div",{id:"edit-container",className:"max-h-[88vh] overflow-y-auto pb-5",children:[e("div",{id:"navigate",children:t(w,{to:"/rooms",className:"flex items-center gap-x-2",children:[e("i",{className:"bx bx-arrow-back"}),e("span",{children:"back"})]})}),t("section",{id:"room-details",className:"flex flex-col gap-4 max-w-3xl mx-auto sm:flex-row",children:[t("div",{id:"general",className:"rounded-md bg-violet-500/20 py-7 px-3 grow",children:[t("div",{id:"cover",className:"relative w-52 h-52 mx-auto",children:[e("img",{src:o.cover,alt:"cover",className:"w-full h-full rounded-full border object-cover"}),e("label",{htmlFor:"upPhoto",className:"w-full h-full cursor-pointer rounded-full mx-auto border flex justify-center items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2",children:e("i",{className:"bx bxs-camera-plus text-2xl"})}),e("input",{type:"file",id:"upPhoto",className:"hidden",onChange:v})]}),t("div",{id:"room-name",className:"flex justify-center flex-col py-10 px-10",children:[e("label",{htmlFor:"name",className:"text-sm text-gray-100/80 font-light mr-1",children:"room name:"}),e("input",{type:"text",name:"name",placeholder:"group name",value:o.name,onInput:n,className:"input w-full"})]}),t("div",{id:"insertState",children:[e("h4",{className:"'text-sm text-gray-100/80 font-light mr-1'",children:"status:"}),t("div",{id:"room-state",className:"flex gap-x-2",children:[t("div",{className:"basis-1/2",children:[e("input",{type:"radio",id:"public",className:"peer hidden",defaultChecked:!0}),e("label",{htmlFor:"public",onClick:u,className:"checkbox",children:"public"})]}),t("div",{className:"basis-1/2",children:[e("input",{type:"radio",id:"private",className:"peer hidden"}),e("label",{htmlFor:"private",onClick:u,className:"checkbox",children:"private"})]})]})]}),o.isPrivate&&t("div",{id:"Key",className:"flex flex-wrap items-center gap-x-3 my-5",children:[e("h4",{className:"whitespace-nowrap text-sm text-gray-100/80 font-light mr-1",children:"private Key:"}),e("input",{type:"text",id:"privatekey",readOnly:!0,value:o.key,className:"w-36 bg-transparent px-3 py-1 rounded-md bg-indigo-700"}),e("button",{onClick:C,className:"bg-violet-500 block p-1 text-sm font-light w-16 rounded-xl cursor-pointer hover:bg-violet-600",children:"copy"})]}),t("div",{id:"insertMax",className:"",children:[e("h4",{children:"max members:"}),t("div",{id:"maxChoices",className:"grid grid-cols-3 gap-4",children:[t("div",{children:[e("input",{type:"radio",name:"two",id:"two",className:"hidden peer",defaultChecked:!0}),e("label",{htmlFor:"two",className:"checkbox",onClick:d,children:"two"})]}),t("div",{children:[e("input",{type:"radio",name:"three",id:"three",className:"hidden"}),e("label",{htmlFor:"three",className:"checkbox",onClick:d,children:"three"})]}),t("div",{children:[e("input",{type:"radio",name:"four",id:"four",className:"hidden"}),e("label",{htmlFor:"four",className:"checkbox",onClick:d,children:"four"})]})]})]})]}),t("div",{className:"grow grid grid-rows-[auto_1fr]",children:[t("div",{id:"topic",className:"bg-violet-700/20 py-7 px-3 rounded-md",children:[e("h4",{className:"'text-sm text-gray-100/80 font-light mr-1'",children:"topic:"}),e("input",{type:"text",name:"topic",placeholder:"topic",value:o.topic,onInput:n,className:"resize-none input no-scrollbar w-full"})]}),t("div",{id:"desc",className:"bg-violet-900/20 py-7 px-3 rounded-md",children:[e("h4",{className:"'text-sm text-gray-100/80 font-light mr-1'",children:"description:"}),e("textarea",{name:"desc",value:o.desc,placeholder:"description...",onInput:n,className:"resize-none input no-scrollbar w-full h-[95%]"})]})]})]}),e("div",{id:"update-button",className:"mt-5",children:e("button",{onClick:b,className:"bg-violet-500 block py-3 text-sm font-light w-52 mx-auto rounded-xl cursor-pointer hover:bg-violet-600",children:"update"})})]})}export{R as default};
