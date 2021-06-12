(window.webpackJsonp=window.webpackJsonp||[]).push([[43],{110:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return s})),a.d(t,"metadata",(function(){return i})),a.d(t,"toc",(function(){return c})),a.d(t,"default",(function(){return p}));var n=a(3),r=a(7),o=(a(0),a(124)),s={title:"Feeds",id:"feeds"},i={unversionedId:"dapps-on-swarm/feeds",id:"dapps-on-swarm/feeds",isDocsHomePage:!1,title:"Feeds",description:"Swarm feeds cleverly combine single owner chunks into a data structure which enables you to have static addresses for your mutable content. This means that you can signpost your data for other Bees, and then update at will.",source:"@site/docs/dapps-on-swarm/feeds.md",slug:"/dapps-on-swarm/feeds",permalink:"/docs/dapps-on-swarm/feeds",editUrl:"https://github.com/ethersphere/docs.github.io/blob/master/docs/dapps-on-swarm/feeds.md",version:"current",sidebar:"Balls",previous:{title:"Chunk Types",permalink:"/docs/dapps-on-swarm/chunk-types"},next:{title:"PSS Messaging",permalink:"/docs/dapps-on-swarm/pss"}},c=[{value:"What are Feeds?",id:"what-are-feeds",children:[]},{value:"Creating and Updating a Feed",id:"creating-and-updating-a-feed",children:[]},{value:"No More ENS Transaction Charges",id:"no-more-ens-transaction-charges",children:[]},{value:"Use Cases for Feeds",id:"use-cases-for-feeds",children:[]}],d={toc:c};function p(e){var t=e.components,a=Object(r.a)(e,["components"]);return Object(o.b)("wrapper",Object(n.a)({},d,a,{components:t,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Swarm feeds cleverly combine ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/dapps-on-swarm/chunk-types"}),"single owner chunks")," into a data structure which enables you to have static addresses for your mutable content. This means that you can signpost your data for other Bees, and then update at will."),Object(o.b)("div",{className:"admonition admonition-info alert alert--info"},Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-heading"}),Object(o.b)("h5",{parentName:"div"},Object(o.b)("span",Object(n.a)({parentName:"h5"},{className:"admonition-icon"}),Object(o.b)("svg",Object(n.a)({parentName:"span"},{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"}),Object(o.b)("path",Object(n.a)({parentName:"svg"},{fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"})))),"info")),Object(o.b)("div",Object(n.a)({parentName:"div"},{className:"admonition-content"}),Object(o.b)("p",{parentName:"div"},"Although it's possible to interact with feeds directly, it can involve\na little data juggling and crypto magic. For the easiest route, see\n",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/dapps-on-swarm/bee-js"}),"the bee-js feeds functionality")," and\n",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/working-with-bee/bee-tools"}),"swarm-cli"),", or for the super 1337,\nshare your implementations in other languages in the\n",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://discord.gg/C6dgqpxZkU"}),"#develop-on-swarm")," channel of our\n",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"https://discord.gg/wdghaQsGq5"}),"Discord Server"),"."))),Object(o.b)("h3",{id:"what-are-feeds"},"What are Feeds?"),Object(o.b)("p",null,"A feed is a collection of Single Owner Chunks with predicatable addresses. This enables creators to upload pointers to data so that consumers of the feed to be able to find the data in swarm using only an ",Object(o.b)("em",{parentName:"p"},"etheruem address")," and ",Object(o.b)("em",{parentName:"p"},"topic id"),"."),Object(o.b)("h3",{id:"creating-and-updating-a-feed"},"Creating and Updating a Feed"),Object(o.b)("p",null,"In order to edit a feed, you will need to sign your chunks using an Ethereum keypair. For the intrepid, check out the ",Object(o.b)("a",{href:"/the-book-of-swarm-viktor-tron-v1.0-pre-release7.pdf",target:"_blank",rel:"noopener noreferrer"},"The Book of Swarm"),"  on precise details on how to do this. For the rest of us, both ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/dapps-on-swarm/bee-js"}),"bee-js")," and ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/working-with-bee/bee-tools"}),"swarm-cli")," provide facilities to achieve this using javascript and a node-js powered command line tool respectively."),Object(o.b)("h3",{id:"no-more-ens-transaction-charges"},"No More ENS Transaction Charges"),Object(o.b)("p",null,"Swarm's feeds provide the ability to update your immutable content in a mutable world. Simply reference your feed's ",Object(o.b)("inlineCode",{parentName:"p"},"manifest address")," as the ",Object(o.b)("inlineCode",{parentName:"p"},"content hash")," in your ENS domain's resolver, and Bee will automatically provide the latest version of your website. "),Object(o.b)("h3",{id:"use-cases-for-feeds"},"Use Cases for Feeds"),Object(o.b)("p",null,"Feeds are a hugely versatile data structure."),Object(o.b)("h4",{id:"key-value-store"},"Key Value Store"),Object(o.b)("p",null,"Use ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/dapps-on-swarm/bee-js"}),"bee-js")," to use feeds to store values as a simple key value store in your javascript application. No more need for servers and databases!"),Object(o.b)("h4",{id:"store-the-history-of-a-file"},"Store the History of a File"),Object(o.b)("p",null,"Use ",Object(o.b)("a",Object(n.a)({parentName:"p"},{href:"/docs/working-with-bee/bee-tools"}),"swarm-cli")," to store a file at the same location, and update whenever you like without changing the address."))}p.isMDXComponent=!0},124:function(e,t,a){"use strict";a.d(t,"a",(function(){return l})),a.d(t,"b",(function(){return h}));var n=a(0),r=a.n(n);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function s(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?s(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):s(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function c(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var d=r.a.createContext({}),p=function(e){var t=r.a.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},l=function(e){var t=p(e.components);return r.a.createElement(d.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return r.a.createElement(r.a.Fragment,{},t)}},u=r.a.forwardRef((function(e,t){var a=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,d=c(e,["components","mdxType","originalType","parentName"]),l=p(a),u=n,h=l["".concat(s,".").concat(u)]||l[u]||b[u]||o;return a?r.a.createElement(h,i(i({ref:t},d),{},{components:a})):r.a.createElement(h,i({ref:t},d))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=a.length,s=new Array(o);s[0]=u;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:n,s[1]=i;for(var d=2;d<o;d++)s[d]=a[d];return r.a.createElement.apply(null,s)}return r.a.createElement.apply(null,a)}u.displayName="MDXCreateElement"}}]);