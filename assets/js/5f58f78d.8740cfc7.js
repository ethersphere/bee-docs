"use strict";(self.webpackChunkbee_docs=self.webpackChunkbee_docs||[]).push([[4536],{93348:(e,n,o)=>{o.r(n),o.d(n,{assets:()=>h,contentTitle:()=>r,default:()=>c,frontMatter:()=>d,metadata:()=>t,toc:()=>a});var s=o(74848),i=o(28453);const d={title:"Neighborhoods",id:"neighborhoods"},r=void 0,t={id:"concepts/DISC/neighborhoods",title:"Neighborhoods",description:"In Swarm, a neighborhood refers to an area of responsibility within the network, where nodes in proximity to one another share the task of storing and maintaining data chunks. Nodes within a neighborhood replicate chunks to ensure that if one node goes offline, other nodes in the neighborhood can still retrieve and serve the content.",source:"@site/docs/concepts/DISC/neighborhoods.md",sourceDirName:"concepts/DISC",slug:"/concepts/DISC/neighborhoods",permalink:"/docs/concepts/DISC/neighborhoods",draft:!1,unlisted:!1,editUrl:"https://github.com/ethersphere/docs.github.io/blob/master/docs/concepts/DISC/neighborhoods.md",tags:[],version:"current",frontMatter:{title:"Neighborhoods",id:"neighborhoods"},sidebar:"concepts",previous:{title:"Kademlia",permalink:"/docs/concepts/DISC/kademlia"},next:{title:"Erasure Coding",permalink:"/docs/concepts/DISC/erasure-coding"}},h={},a=[{value:"Key Concepts",id:"key-concepts",level:2},{value:"Proximity Order (PO)",id:"proximity-order-po",level:3},{value:"Reserve Depth",id:"reserve-depth",level:3},{value:"Storage Depth",id:"storage-depth",level:3},{value:"Neighborhood Depth",id:"neighborhood-depth",level:3},{value:"Neighborhood",id:"neighborhood",level:3},{value:"Example neighborhood",id:"example-neighborhood",level:2},{value:"Area of Responsibility",id:"area-of-responsibility",level:3},{value:"Neighborhood Doubling",id:"neighborhood-doubling",level:3},{value:"Doubling Implications for Node Operators",id:"doubling-implications-for-node-operators",level:4}];function l(e){const n={a:"a",admonition:"admonition",blockquote:"blockquote",br:"br",code:"code",em:"em",h2:"h2",h3:"h3",h4:"h4",p:"p",strong:"strong",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",...(0,i.R)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.p,{children:"In Swarm, a neighborhood refers to an area of responsibility within the network, where nodes in proximity to one another share the task of storing and maintaining data chunks. Nodes within a neighborhood replicate chunks to ensure that if one node goes offline, other nodes in the neighborhood can still retrieve and serve the content."}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsxs)(n.p,{children:["To see current neighborhood populations and the current storage depth / storage radius navigate to the ",(0,s.jsx)(n.a,{href:"https://swarmscan.io/neighborhoods",children:'"Neighborhoods" page of Swarmscan.io'}),"."]})}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsx)(n.p,{children:'The terms "depth" and "radius" are often used interchangeably when discussing neighborhoods. Both refer to number of shared leading bits of node and chunk addresses used to determine the nodes and chunks which fall into which neighborhoods.'})}),"\n",(0,s.jsx)(n.h2,{id:"key-concepts",children:"Key Concepts"}),"\n",(0,s.jsx)(n.h3,{id:"proximity-order-po",children:"Proximity Order (PO)"}),"\n",(0,s.jsx)(n.p,{children:"The PO is a measure how close a node is to a particular chunk of data or other node. It is defined as the number of shared leading bits between two addresses. Proximity order plays a role in how neighborhoods are defined, as a node\u2019s neighborhood extends up to its storage depth, covering all nodes within that proximity\u200b."}),"\n",(0,s.jsx)(n.h3,{id:"reserve-depth",children:"Reserve Depth"}),"\n",(0,s.jsxs)(n.p,{children:["The reserve depth is the shallowest PO at which neighborhoods are able to store all of the chunks which have been paid for through ",(0,s.jsx)(n.a,{href:"/docs/concepts/incentives/overview#postage-stamps",children:"postage stamp batch"})," purchases."]}),"\n",(0,s.jsx)(n.h3,{id:"storage-depth",children:"Storage Depth"}),"\n",(0,s.jsxs)(n.p,{children:["Storage depth is the shallowest PO at which neighborhoods are able to store all the chunks which have been ",(0,s.jsx)(n.em,{children:"uploaded"}),". If 100% of all all chunks which have been paid for have been stamped and uploaded to the network, then storage depth will equal reserve depth. However, it is common that stamp batches are not always fully utilized, meaning that it is possible for the storage depth to be shallower than the reserve depth."]}),"\n",(0,s.jsx)(n.p,{children:"Storage depth is the proximity order of chunks for which a node must synchronize and store chunks, and it is determined by nodes' reserve sizes in combination with the amount of chunks actually uploaded."}),"\n",(0,s.jsx)(n.h3,{id:"neighborhood-depth",children:"Neighborhood Depth"}),"\n",(0,s.jsxs)(n.p,{children:["Neigborhood depth for a node is the highest (deepest) PO ",(0,s.jsx)(n.em,{children:(0,s.jsx)(n.code,{children:"d"})})," where the node has at least 3 peers which share the same ",(0,s.jsx)(n.em,{children:(0,s.jsx)(n.code,{children:"d"})})," number of leading binary prefix bits in their addresses."]}),"\n",(0,s.jsx)(n.h3,{id:"neighborhood",children:"Neighborhood"}),"\n",(0,s.jsx)(n.p,{children:"A neighborhood is a set of nodes in close proximity to each other based on their proximity order (PO). Each node in the neighborhood defined by storage depth is responsible for interacting with other nodes within that neighborhood to store and replicate data chunks, ensuring data availability and redundancy."}),"\n",(0,s.jsx)(n.h2,{id:"example-neighborhood",children:"Example neighborhood"}),"\n",(0,s.jsx)(n.p,{children:"Let's take a closer look at an example. Below is a neighborhood of six nodes at depth 10. Each node is identified by its Swarm address, which is a 256 bit hexadecimal number derived from the node's Gnosis Chain address, the Swarm network id, and a random nonce."}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"da4cb0d125bba638def55c0061b00d7c01ed4033fa193d6e53a67183c5488d73\nda5d39a5508fadf66c8665d5e51617f0e9e5fd501e429c38471b861f104c1504\nda7a974149543df1b459831286b42b302f22393a20e9b3dd9a7bb5a7aa5af263\nda76f8fccc3267b589d822f1c601b21b525fdc2598df97856191f9063029d21e\nda7b6439c8d3803286b773a56c4b9a38776b5cd0beb8fd628b6007df235cf35c\nda7fd412b79358f84b7928d2f6b7ccdaf165a21313608e16edd317a5355ba250"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Since we are only concerned with the leading binary bits close to the neighborhood depth, for the rest of this example we will abbreviate the addresses to the first four prefixed hexadecimal digits only. Below are listed the hex prefixes and their binary representation, with the first ten leading bits underlined:"}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Hex prefix"}),(0,s.jsx)(n.th,{children:"Binary Bits"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da4c"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"001100"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da5d"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"011101"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da76"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"110110"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7a"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"111010"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7b"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"111011"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7f"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"1101101001"}),"111111"]})]})]})]}),"\n",(0,s.jsx)(n.h3,{id:"area-of-responsibility",children:"Area of Responsibility"}),"\n",(0,s.jsx)(n.p,{children:"Storer nodes are responsible for storing chunks with addresses whose leading btis match their own up to the storage depth. Here are two example chunks which fall within our example neighborhood:"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Chunk A address: ",(0,s.jsx)(n.code,{children:"da49a42926015cd1e2bc552147c567b1ca13e8d4302c9e6026e79a24de328b65"}),(0,s.jsx)(n.br,{}),"\n","Chunk B address: ",(0,s.jsx)(n.code,{children:"da696a3dfb0f7f952872eb33e0e2a1435c61f111ff361e64203b5348cc06dc8a"})]}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:["As the address of the chunk shown above shares the same ten leading binary bits as the nodes in our example neighborhood, it falls into that neighborhood's ",(0,s.jsx)(n.a,{href:"/docs/references/glossary#2-area-of-responsibility-related-depths",children:"area of responsibility"}),", and all the nodes in that neighborhood are required to store that chunk:"]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["da49 --\x3e ",(0,s.jsx)("u",{children:"1101101001"}),"001001",(0,s.jsx)(n.br,{}),"\n","da69 --\x3e ",(0,s.jsx)("u",{children:"1101101001"}),"101001"]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.em,{children:"As with the example for nodes, we've abbreviated the chunk addresses to their leading four hexadecimal digits only and converted them to binary digits."})}),"\n",(0,s.jsx)(n.h3,{id:"neighborhood-doubling",children:"Neighborhood Doubling"}),"\n",(0,s.jsx)(n.p,{children:'As more and more chunks are assigned to neighborhoods, the chunk reserves of the nodes in that neighborhood will begin to fill up. Once the nodes\' reserves in a neighborhood become full and can no longer store additional chunks, that neighborhood will split, with each half of the neighborhood taking responsibility for half of the chunks. This event is referred to as a "doubling", as it results in double the number of neighborhoods. The split is done by increasing the storage depth by one, so that the number of shared leading bits is increased by one. This results in a binary splitting of the neighborhood and associated chunks into two new neighborhoods and respective groups of chunks.'}),"\n",(0,s.jsx)(n.admonition,{type:"info",children:(0,s.jsx)(n.p,{children:'Note that when chunks begin to expire and new chunks are not uploaded to Swarm, it is possible for node\'s reserves to empty out, once they fall below a certain threshold, a "halving" will occur in which the storage depth will be decreased by one and two neighborhoods will merge to make a new one so that they are responsible for a wider set of chunks.'})}),"\n",(0,s.jsx)(n.p,{children:"Using our previous example neighborhood, during a doubling, the storage depth would increase from 10 to 11, and the neighborhood would be split based on the 11th leading bit."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"neighborhood A:"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Hex prefix"}),(0,s.jsx)(n.th,{children:"Binary Bits"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da4c"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010010"}),"01100"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da5d"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010010"}),"11101"]})]})]})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"neighborhood B:"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Hex prefix"}),(0,s.jsx)(n.th,{children:"Binary Bits"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da76"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"10110"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7a"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11010"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7b"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11011"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7f"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11111"]})]})]})]}),"\n",(0,s.jsx)(n.p,{children:"Each of our two example chunks will also be split amongst the two new neighborhoods based on their 11th leading bit:"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"neighborhood A:"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Hex prefix"}),(0,s.jsx)(n.th,{children:"Binary Bits"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da4c"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010010"}),"01100"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da5d"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010010"}),"11101"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da49 (chunk)"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010010"}),"01001"]})]})]})]}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.strong,{children:"neighborhood B:"})}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Hex prefix"}),(0,s.jsx)(n.th,{children:"Binary Bits"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da76"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"10110"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7a"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11010"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7b"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11011"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da7f"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"11111"]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:"da69 (chunk)"}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)("u",{children:"11011010011"}),"01001"]})]})]})]}),"\n",(0,s.jsx)(n.h4,{id:"doubling-implications-for-node-operators",children:"Doubling Implications for Node Operators"}),"\n",(0,s.jsxs)(n.p,{children:["One of the implications of doubling for node operators is that the reward chances for a node depends in part on how many other nodes are in its neighborhood. If it is in a neighborhood with fewer nodes, its chances of winning rewards are greater. Therefore node operators should make certain to place their nodes into less populated neighborhoods, and also should look ahead to neighborhoods at the next depth after a doubling. For more details about how to adjust node placement, see ",(0,s.jsx)(n.a,{href:"/docs/bee/installation/install#set-target-neighborhood-optional",children:"the section on setting a target neighborhood"})," in the installation guide."]})]})}function c(e={}){const{wrapper:n}={...(0,i.R)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(l,{...e})}):l(e)}},28453:(e,n,o)=>{o.d(n,{R:()=>r,x:()=>t});var s=o(96540);const i={},d=s.createContext(i);function r(e){const n=s.useContext(d);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function t(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(i):e.components||i:r(e.components),s.createElement(d.Provider,{value:n},e.children)}}}]);