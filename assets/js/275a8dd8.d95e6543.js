"use strict";(self.webpackChunkbee_docs=self.webpackChunkbee_docs||[]).push([[4304],{10897:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>m,frontMatter:()=>r,metadata:()=>d,toc:()=>c});var i=n(74848),o=n(28453);const a=n.p+"assets/images/bos_fig_2_3-53841f6e16aa27a058942aaa6a8badcc.jpg",r={title:"Kademlia",id:"kademlia"},s=void 0,d={id:"concepts/DISC/kademlia",title:"Kademlia",description:"Kademlia is a distributed hash table (DHT) algorithm used in peer-to-peer networks to efficiently store and retrieve data without relying on centralized servers. It organizes nodes into an overlay network that ensures efficient routing using a binary tree structure.",source:"@site/docs/concepts/DISC/kademlia.mdx",sourceDirName:"concepts/DISC",slug:"/concepts/DISC/kademlia",permalink:"/docs/concepts/DISC/kademlia",draft:!1,unlisted:!1,editUrl:"https://github.com/ethersphere/docs.github.io/blob/master/docs/concepts/DISC/kademlia.mdx",tags:[],version:"current",frontMatter:{title:"Kademlia",id:"kademlia"},sidebar:"concepts",previous:{title:"DISC",permalink:"/docs/concepts/DISC/"},next:{title:"Neighborhoods",permalink:"/docs/concepts/DISC/neighborhoods"}},l={},c=[{value:"Kademlia Key Concepts",id:"kademlia-key-concepts",level:2},{value:"<strong>XOR Distance Metric</strong>",id:"xor-distance-metric",level:3},{value:"<strong>Routing Table</strong>",id:"routing-table",level:3},{value:"Kademlia Advantages",id:"kademlia-advantages",level:2},{value:"<strong>Efficient Lookups</strong>",id:"efficient-lookups",level:3},{value:"<strong>Fault Tolerance</strong>",id:"fault-tolerance",level:3},{value:"<strong>Scalability</strong>",id:"scalability",level:3},{value:"Kademlia in Swarm",id:"kademlia-in-swarm",level:2},{value:"Proximity Order &amp; Neighborhoods",id:"proximity-order--neighborhoods",level:3},{value:"Forwarding Kademlia",id:"forwarding-kademlia",level:3},{value:"Neighborhood Based Storage Incentives",id:"neighborhood-based-storage-incentives",level:3}];function h(e){const t={a:"a",h2:"h2",h3:"h3",p:"p",strong:"strong",...(0,o.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(t.p,{children:"Kademlia is a distributed hash table (DHT) algorithm used in peer-to-peer networks to efficiently store and retrieve data without relying on centralized servers. It organizes nodes into an overlay network that ensures efficient routing using a binary tree structure."}),"\n",(0,i.jsx)(t.h2,{id:"kademlia-key-concepts",children:"Kademlia Key Concepts"}),"\n",(0,i.jsx)(t.h3,{id:"xor-distance-metric",children:(0,i.jsx)(t.strong,{children:"XOR Distance Metric"})}),"\n",(0,i.jsx)(t.p,{children:'Kademlia uses a distance metric based on the XOR (exclusive OR) between any addresses. This allows nodes to calculate "distance" from each other. Lookups are made by recursively querying nodes that are progressively closer to the target.'}),"\n",(0,i.jsx)(t.h3,{id:"routing-table",children:(0,i.jsx)(t.strong,{children:"Routing Table"})}),"\n",(0,i.jsx)(t.p,{children:"Each node in a Kademlia network maintains a routing table containing information about other nodes, organized by the XOR distance between node IDs."}),"\n",(0,i.jsx)(t.h2,{id:"kademlia-advantages",children:"Kademlia Advantages"}),"\n",(0,i.jsx)(t.h3,{id:"efficient-lookups",children:(0,i.jsx)(t.strong,{children:"Efficient Lookups"})}),"\n",(0,i.jsx)(t.p,{children:"To retrieve a specific chunk, a node uses Kademlia's lookup process to find and fetch the chunk from a node in the neighborhood where it is stored. The number of hops required for a chunk to be retrieved is logarithmic to the number of nodes in the network, meaning lookups remain efficient even as the network grows larger and larger."}),"\n",(0,i.jsx)(t.h3,{id:"fault-tolerance",children:(0,i.jsx)(t.strong,{children:"Fault Tolerance"})}),"\n",(0,i.jsx)(t.p,{children:"Because nodes' peer lists are regularly refreshed through lookups and interactions, and because redundant copies of data are replicated within the network, the network remains functional even when individual nodes leave or fail."}),"\n",(0,i.jsx)(t.h3,{id:"scalability",children:(0,i.jsx)(t.strong,{children:"Scalability"})}),"\n",(0,i.jsx)(t.p,{children:"Kademlia's design allows it to scale to large networks, as each node only needs to keep track of a small subset of the total nodes in the network. The required set of connected peers grows logarithmically with the number of nodes, making it efficient even in large networks."}),"\n",(0,i.jsx)(t.h2,{id:"kademlia-in-swarm",children:"Kademlia in Swarm"}),"\n",(0,i.jsx)(t.p,{children:"As mentioned above, Swarm's version of Kademlia differs from commonly used implementations of Kademlia in several important ways:"}),"\n",(0,i.jsx)(t.h3,{id:"proximity-order--neighborhoods",children:"Proximity Order & Neighborhoods"}),"\n",(0,i.jsxs)(t.p,{children:["Swarm introduces the concept of ",(0,i.jsx)(t.a,{href:"/docs/references/glossary#proximity-order-po",children:"proximity order (PO)"})," as a discrete measure of node relatedness between two addresses. In contrast with Kademlia distance which is an exact measure of relatedness, PO is used to measure the relatedness between two addresses on a discrete scale based on the number of shared leading bits. Since this metric ignores all the bits after the shared leading bits, it is not an exact measure of distance between any two addresses."]}),"\n",(0,i.jsxs)(t.p,{children:["In Swarm's version of Kademlia, nodes are grouped into ",(0,i.jsx)(t.a,{href:"/docs/concepts/DISC/neighborhoods",children:"neighborhoods"})," of nodes based on PO (ie., neighborhood are composed of nodes which all share the same leading binary prefix bits). Each neighborhood of nodes is responsible for storing the same set of chunks."]}),"\n",(0,i.jsx)(t.p,{children:"Neighborhoods are important for ensuring data redundancy, and they also play a role in the incentives system which guarantees nodes are rewarded for contributing resources to the network."}),"\n",(0,i.jsx)(t.h3,{id:"forwarding-kademlia",children:"Forwarding Kademlia"}),"\n",(0,i.jsx)(t.p,{children:"Kademlia comes in two flavors, iterative and forwarding. In iterative Kademlia, the requesting node directly queries each node it contacts for nodes that are progressively closer to the target until the node with the requested chunk is found. The chunk is then sent directly from the storer node to the node which initiated the request."}),"\n",(0,i.jsx)(t.p,{children:"In contrast, Swarm makes use of forwarding Kademlia. Here each node forwards the query to the next closest node in the network, and this process continues until a node with the requested chunk is found. Once the chunk is found, it is sent back along the same chain of nodes rather than sent directly to the initiator of the request."}),"\n",(0,i.jsx)(t.p,{children:"The main advantage of forwarding Kademlia is that it maintains the anonymity of the node which initiated the request."}),"\n",(0,i.jsxs)("div",{style:{textAlign:"center"},children:[(0,i.jsx)("img",{src:a,className:"responsive-image"}),(0,i.jsx)("p",{style:{fontStyle:"italic",marginTop:"0.5rem"},children:(0,i.jsxs)(t.p,{children:["Source: ",(0,i.jsx)("a",{href:"https://www.ethswarm.org/the-book-of-swarm-2.pdf#subsection.2.1.3",target:"_blank",children:'The Book of Swarm - Figure 2.3 - "Iterative and Forwarding Kademlia routing"'})]})})]}),"\n",(0,i.jsx)(t.h3,{id:"neighborhood-based-storage-incentives",children:"Neighborhood Based Storage Incentives"}),"\n",(0,i.jsx)(t.p,{children:'Swarm introduces a storage incentives layer on top of its Kademlia implementation in order to reward nodes for continuing to provide resources to the network. Neighborhoods play a key role in the storage incentives mechanism. Storage incentives take the role of a "game" in which nodes play to win a reward for storing the correct data. Each round in the game, one neighborhood is chosen to play, and all nodes within the same neighborhood participate as a group. The nodes each compare the data they are storing with each other to make sure they are all storing the data they are responsible for, and one node is chosen to win from among the group. You can read more about how storage incentives work in the dedicated page for storage incentives.'})]})}function m(e={}){const{wrapper:t}={...(0,o.R)(),...e.components};return t?(0,i.jsx)(t,{...e,children:(0,i.jsx)(h,{...e})}):h(e)}},28453:(e,t,n)=>{n.d(t,{R:()=>r,x:()=>s});var i=n(96540);const o={},a=i.createContext(o);function r(e){const t=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function s(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:r(e.components),i.createElement(a.Provider,{value:t},e.children)}}}]);