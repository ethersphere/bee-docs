"use strict";(self.webpackChunkbee_docs=self.webpackChunkbee_docs||[]).push([[2774],{94972:(e,s,t)=>{t.r(s),t.d(s,{assets:()=>h,contentTitle:()=>a,default:()=>u,frontMatter:()=>r,metadata:()=>d,toc:()=>i});var n=t(74848),o=t(28453);const r={title:"Chunk Types",id:"chunk-types"},a=void 0,d={id:"develop/tools-and-features/chunk-types",title:"Chunk Types",description:"Swarm is home to many types of chunks, but these can be categoried",source:"@site/docs/develop/tools-and-features/chunk-types.md",sourceDirName:"develop/tools-and-features",slug:"/develop/tools-and-features/chunk-types",permalink:"/docs/develop/tools-and-features/chunk-types",draft:!1,unlisted:!1,editUrl:"https://github.com/ethersphere/docs.github.io/blob/master/docs/develop/tools-and-features/chunk-types.md",tags:[],version:"current",frontMatter:{title:"Chunk Types",id:"chunk-types"},sidebar:"develop",previous:{title:"Gateway Proxy",permalink:"/docs/develop/tools-and-features/gateway-proxy"},next:{title:"Feeds",permalink:"/docs/develop/tools-and-features/feeds"}},h={},i=[{value:"Content Addressed Chunks",id:"content-addressed-chunks",level:2},{value:"Trojan Chunks",id:"trojan-chunks",level:2},{value:"Single Owner Chunks",id:"single-owner-chunks",level:2},{value:"Custom Chunk Types",id:"custom-chunk-types",level:2}];function c(e){const s={a:"a",admonition:"admonition",h2:"h2",p:"p",...(0,o.R)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(s.p,{children:["Swarm is home to many types of chunks, but these can be categoried\ninto 4 broad categories. Read ",(0,n.jsx)(s.a,{href:"https://www.ethswarm.org/the-book-of-swarm-2.pdf",children:"The Book of Swarm"})," for\nmore information on how swarm comes together."]}),"\n",(0,n.jsx)(s.h2,{id:"content-addressed-chunks",children:"Content Addressed Chunks"}),"\n",(0,n.jsx)(s.p,{children:"Content addressed chunks are chunks whose addresses are determined by the BMT hashing algorithm. This means you can be sure that all content addressed chunks content is already verified - no more need to check md5 hashes of your downloaded data!"}),"\n",(0,n.jsx)(s.admonition,{type:"warning",children:(0,n.jsx)(s.p,{children:"To be able trust your data, you must run your own Bee node that automatically verifies data, using gateways puts your trust in the gateway operators."})}),"\n",(0,n.jsx)(s.h2,{id:"trojan-chunks",children:"Trojan Chunks"}),"\n",(0,n.jsxs)(s.p,{children:["Trojan chunks are a special version of content addressed chunks that have been 'mined' so that their natural home is in a particular area of the Swarm. If the destination node is in the right neighborhood, it will be able to receive and decrypt the message. See ",(0,n.jsx)(s.a,{href:"/docs/develop/tools-and-features/pss",children:"PSS"})," for more information, or check out the ",(0,n.jsx)(s.a,{href:"https://bee-js.ethswarm.org/docs/api/classes/Bee/#psssend",children:"bee-js"})," bindings."]}),"\n",(0,n.jsx)(s.h2,{id:"single-owner-chunks",children:"Single Owner Chunks"}),"\n",(0,n.jsxs)(s.p,{children:["Single Owner Chunks are distinct from Trojan and Content Addressed\nChunks and are the only other type of chunk which is allowed in\nSwarm. These chunks represent part of Swarm's address space which is\nreserved just for your personal Ethereum key pair! Here you can write\nwhatever you'd please. Single Owner Chunks are the technology that\npowers Swarm's ",(0,n.jsx)(s.a,{href:"/docs/develop/tools-and-features/feeds",children:"feeds"}),", but they are\ncapable of much more! Look out for more chats about this soon, and for\nmore info read ",(0,n.jsx)(s.a,{href:"https://www.ethswarm.org/the-book-of-swarm-2.pdf",children:"The Book of Swarm"}),"."]}),"\n",(0,n.jsx)(s.h2,{id:"custom-chunk-types",children:"Custom Chunk Types"}),"\n",(0,n.jsx)(s.p,{children:"Although all chunks must satisfy the constraints of either being addressed by the BMT hash of their payload, or assigned by the owner of an Ethereum private key pair, so much more is possible. How else can you use the DISC to distribute and store your data? We're excited to see what you come up with! \ud83d\udca1"}),"\n",(0,n.jsxs)(s.p,{children:["Share your creations in the ",(0,n.jsx)(s.a,{href:"https://discord.gg/C6dgqpxZkU",children:"#develop-on-swarm"})," channel of our ",(0,n.jsx)(s.a,{href:"https://discord.gg/wdghaQsGq5",children:"Discord Server"}),"."]})]})}function u(e={}){const{wrapper:s}={...(0,o.R)(),...e.components};return s?(0,n.jsx)(s,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},28453:(e,s,t)=>{t.d(s,{R:()=>a,x:()=>d});var n=t(96540);const o={},r=n.createContext(o);function a(e){const s=n.useContext(r);return n.useMemo((function(){return"function"==typeof e?e(s):{...s,...e}}),[s,e])}function d(e){let s;return s=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:a(e.components),n.createElement(r.Provider,{value:s},e.children)}}}]);