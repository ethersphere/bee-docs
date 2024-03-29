"use strict";(self.webpackChunkbee_docs=self.webpackChunkbee_docs||[]).push([[5692],{98041:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>l,contentTitle:()=>r,default:()=>h,frontMatter:()=>a,metadata:()=>d,toc:()=>o});var s=i(17624),t=i(4552);const a={title:"Swarm CLI",id:"swarm-cli"},r="Swarm-CLI",d={id:"bee/working-with-bee/swarm-cli",title:"Swarm CLI",description:"Node.js tests",source:"@site/docs/bee/working-with-bee/swarm-cli.md",sourceDirName:"bee/working-with-bee",slug:"/bee/working-with-bee/swarm-cli",permalink:"/docs/bee/working-with-bee/swarm-cli",draft:!1,unlisted:!1,editUrl:"https://github.com/ethersphere/docs.github.io/blob/master/docs/bee/working-with-bee/swarm-cli.md",tags:[],version:"current",frontMatter:{title:"Swarm CLI",id:"swarm-cli"},sidebar:"bee",previous:{title:"Bee Tools",permalink:"/docs/bee/working-with-bee/bee-tools"},next:{title:"Security",permalink:"/docs/bee/working-with-bee/security"}},l={},o=[{value:"Purchasing a Postage Stamp",id:"purchasing-a-postage-stamp",level:2},{value:"Uploading a File",id:"uploading-a-file",level:2},{value:"Creating an Identity",id:"creating-an-identity",level:2},{value:"Uploading to a Feed",id:"uploading-to-a-feed",level:2},{value:"Installation",id:"installation",level:2},{value:"From npm",id:"from-npm",level:3},{value:"From source",id:"from-source",level:3},{value:"Usage",id:"usage",level:2},{value:"Commands",id:"commands",level:2},{value:"Example usage",id:"example-usage",level:2},{value:"Usability Features",id:"usability-features",level:2},{value:"Uploading Files, Folders, Websites, and Arbitrary Data from stdin",id:"uploading-files-folders-websites-and-arbitrary-data-from-stdin",level:3},{value:"Files",id:"files",level:4},{value:"Folders and Websites",id:"folders-and-websites",level:4},{value:"Standard Input",id:"standard-input",level:4},{value:"Custom HTTP Headers",id:"custom-http-headers",level:3},{value:"Autocomplete",id:"autocomplete",level:3},{value:"Numerical Separator and Units",id:"numerical-separator-and-units",level:3},{value:"Stamp Picker",id:"stamp-picker",level:3},{value:"Identity Picker",id:"identity-picker",level:3},{value:"Human Readable Topics",id:"human-readable-topics",level:3},{value:"Manifest address scheme",id:"manifest-address-scheme",level:3},{value:"Automating tasks with Swarm-CLI",id:"automating-tasks-with-swarm-cli",level:3},{value:"Connectivity",id:"connectivity",level:4},{value:"Postage Stamps",id:"postage-stamps",level:4},{value:"Uploading",id:"uploading",level:4},{value:"Config",id:"config",level:2},{value:"Assignment priority",id:"assignment-priority",level:2},{value:"System environment",id:"system-environment",level:2}];function c(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",pre:"pre",table:"table",tbody:"tbody",td:"td",th:"th",thead:"thead",tr:"tr",ul:"ul",...(0,t.M)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"swarm-cli",children:"Swarm-CLI"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.img,{src:"https://github.com/ethersphere/swarm-cli/workflows/Node.js%20tests/badge.svg?branch=master",alt:"Node.js tests"}),"\n",(0,s.jsx)(n.a,{href:"https://swarm.ethereum.org/",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/made%20by-Swarm-blue.svg?style=flat-square",alt:""})}),"\n",(0,s.jsx)(n.a,{href:"https://github.com/RichardLitt/standard-readme",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/standard--readme-OK-brightgreen.svg?style=flat-square",alt:"standard-readme compliant"})}),"\n",(0,s.jsx)(n.a,{href:"https://github.com/feross/standard",children:(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square",alt:"js-standard-style"})}),"\n",(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/npm-%3E%3D6.0.0-orange.svg?style=flat-square",alt:""}),"\n",(0,s.jsx)(n.img,{src:"https://img.shields.io/badge/Node.js-%3E%3D12.0.0-orange.svg?style=flat-square",alt:""})]}),"\n",(0,s.jsxs)(n.p,{children:["Stay up to date with changes by joining the ",(0,s.jsx)(n.a,{href:"https://discord.gg/GU22h2utj6",children:"official Discord"})," and by keeping an eye on the ",(0,s.jsx)(n.a,{href:"https://github.com/ethersphere/swarm-cli/releases",children:"releases tab"}),"."]}),"\n",(0,s.jsx)(n.h1,{id:"table-of-contents",children:"Table of Contents"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#swarm-cli",children:"Swarm-CLI"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#table-of-contents",children:"Table of Contents"})}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#demo",children:"Demo"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#purchasing-a-postage-stamp",children:"Purchasing a Postage Stamp"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#uploading-a-file",children:"Uploading a File"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#creating-an-identity",children:"Creating an Identity"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#uploading-to-a-feed",children:"Uploading to a Feed"})}),"\n"]}),"\n"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#description",children:"Description"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#installation",children:"Installation"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#from-npm",children:"From npm"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#from-source",children:"From source"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#usage",children:"Usage"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#commands",children:"Commands"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#example-usage",children:"Example usage"})}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#usability-features",children:"Usability Features"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#uploading-files--folders--websites--and-arbitrary-data-from-stdin",children:"Uploading Files, Folders, Websites, and Arbitrary Data from stdin"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#files",children:"Files"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#folders-and-websites",children:"Folders and Websites"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#standard-input",children:"Standard Input"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#custom-http-headers",children:"Custom HTTP Headers"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#autocomplete",children:"Autocomplete"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#numerical-separator-and-units",children:"Numerical Separator and Units"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#stamp-picker",children:"Stamp Picker"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#identity-picker",children:"Identity Picker"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#human-readable-topics",children:"Human Readable Topics"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#manifest-address-scheme",children:"Manifest address scheme"})}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.a,{href:"#automating-tasks-with-swarm-cli",children:"Automating tasks with Swarm-CLI"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#connectivity",children:"Connectivity"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#postage-stamps",children:"Postage Stamps"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#uploading",children:"Uploading"})}),"\n"]}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#config",children:"Config"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#assignment-priority",children:"Assignment priority"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#system-environment",children:"System environment"})}),"\n"]}),"\n"]}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#development",children:"Development"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#contribute",children:"Contribute"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#maintainers",children:"Maintainers"})}),"\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"#license",children:"License"})}),"\n"]}),"\n",(0,s.jsx)(n.h1,{id:"demo",children:"Demo"}),"\n",(0,s.jsx)(n.h2,{id:"purchasing-a-postage-stamp",children:"Purchasing a Postage Stamp"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Swarm CLI Stamp Buy Command",src:i(8870).c+"",width:"1600",height:"164"})}),"\n",(0,s.jsx)(n.h2,{id:"uploading-a-file",children:"Uploading a File"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Swarm CLI Upload Command",src:i(46728).c+"",width:"1600",height:"416"})}),"\n",(0,s.jsx)(n.h2,{id:"creating-an-identity",children:"Creating an Identity"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Swarm CLI Identity Create Command",src:i(48568).c+"",width:"1600",height:"542"})}),"\n",(0,s.jsx)(n.h2,{id:"uploading-to-a-feed",children:"Uploading to a Feed"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.img,{alt:"Swarm CLI Feed Upload Command",src:i(24812).c+"",width:"1600",height:"416"})}),"\n",(0,s.jsx)(n.h1,{id:"description",children:"Description"}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsx)(n.p,{children:"Manage your Bee node and interact with the Swarm network via the CLI"}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"The goal of this project is to handle most of the Swarm operations through CLI at some point in the future."}),"\n",(0,s.jsxs)(n.p,{children:["For the currently supported operations, see the ",(0,s.jsx)(n.a,{href:"#commands",children:"Commands"})," section."]}),"\n",(0,s.jsx)(n.h2,{id:"installation",children:"Installation"}),"\n",(0,s.jsx)(n.h3,{id:"from-npm",children:"From npm"}),"\n",(0,s.jsxs)(n.p,{children:["To install globally (requires ",(0,s.jsx)(n.code,{children:"npm root --global"})," to be writable):"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"npm install --global @ethersphere/swarm-cli\n"})}),"\n",(0,s.jsx)(n.p,{children:"To install locally:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:"cd [some directory for nodejs files]\nnpm install @ethersphere/swarm-cli\n./node_modules/.bin/swarm-cli --help\n"})}),"\n",(0,s.jsx)(n.h3,{id:"from-source",children:"From source"}),"\n",(0,s.jsxs)(n.p,{children:["See the ",(0,s.jsx)(n.a,{href:"#development",children:"Development"})," section."]}),"\n",(0,s.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,s.jsx)(n.p,{children:"The general usage is to provide a command, optionally a subcommand, then arguments and options."}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.code,{children:"swarm-cli command [subcommand] <arguments> [options]"})}),"\n",(0,s.jsxs)(n.p,{children:["Running a command with the ",(0,s.jsx)(n.code,{children:"--help"})," option prints out the usage of a command."]}),"\n",(0,s.jsx)(n.h2,{id:"commands",children:"Commands"}),"\n",(0,s.jsxs)(n.p,{children:["Running ",(0,s.jsx)(n.code,{children:"swarm-cli"})," without arguments prints the available commands:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"Swarm CLI 1.5.0 - Manage your Bee node and interact with the Swarm network via the CLI\n\n\u2588 Usage:\n\nswarm-cli COMMAND [OPTIONS]\n\n\u2588 Available Groups:\n\npinning    Pin, unpin and check pinned chunks\nidentity   Import, export and manage keypairs, identities\nfeed       Upload, update and view feeds\ncheque     Deposit, withdraw and manage cheques\nstamp      Buy, list and show postage stamps\npss        Send, receive, or subscribe to PSS messages\nmanifest   Operate on manifests\n\nRun 'swarm-cli GROUP --help' to see available commands in a group\n\n\u2588 Available Commands:\n\nupload      Upload file to Swarm\ndownload    Download arbitrary Swarm hash\nstatus      Check API availability and Bee compatibility\naddresses   Display the addresses of the Bee node\n\nRun 'swarm-cli COMMAND --help' for more information on a command\n"})}),"\n",(0,s.jsx)(n.h2,{id:"example-usage",children:"Example usage"}),"\n",(0,s.jsxs)(n.p,{children:["Let's say we want to upload our website to Swarm and update a feed to point to the newest version. For updating a feed we would need to sign it with an Ethereum key, so first we need to create one with the ",(0,s.jsx)(n.code,{children:"identity create"})," command:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli identity create\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This command will ask for a password. After that a new identity is created (named ",(0,s.jsx)(n.code,{children:"main"}),"). Now we can use this identity to sign updates. It's also possible to import and export Ethereum JSON V3 format identities that works with other apps (e.g. wallets)."]}),"\n",(0,s.jsxs)(n.p,{children:["Another requirement for uploading to the Swarm network is a valid postage batch, also called a postage stamp or simply a stamp. Stamps need to be purchased with BZZ tokens. We can use the ",(0,s.jsx)(n.code,{children:"stamp buy"})," command to take care of this step. The ",(0,s.jsx)(n.code,{children:"--amount"})," and ",(0,s.jsx)(n.code,{children:"--depth"})," options alter the capacity of the postage stamp. For example, running ",(0,s.jsx)(n.code,{children:"stamp buy --amount 1 --depth 20"})," will get back with a Stamp ID after a while. We will be using that with the ",(0,s.jsx)(n.code,{children:"--stamp"})," option in commands which upload files, or write feeds."]}),"\n",(0,s.jsxs)(n.p,{children:["For uploading to a feed we can use the ",(0,s.jsx)(n.code,{children:"feed upload"})," command. It expects the path of the folder (or file) we want to upload and as options it expects ",(0,s.jsx)(n.code,{children:"identity"})," to be provided along with the ",(0,s.jsx)(n.code,{children:"password"})," that belongs to it, as well as the earlier mentioned ",(0,s.jsx)(n.code,{children:"stamp"}),"."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli feed upload path-to-be-uploaded --identity my-identity --password my-secret-password --stamp stamp-id\n"})}),"\n",(0,s.jsxs)(n.p,{children:["In this example we are uploading the content of the ",(0,s.jsx)(n.code,{children:"dist"})," folder. If the uploading was successful the last printed line will contain a ",(0,s.jsx)(n.code,{children:"Feed Manifest URL"}),". This URL can be opened in the browser. If the uploaded folder contains an ",(0,s.jsx)(n.code,{children:"index.html"})," file then it will be automatically displayed when visiting the URL."]}),"\n",(0,s.jsxs)(n.p,{children:["This URL will stay the same when we upload an updated version of the website. Because of this we can also put this URL into a reverse proxy configuration or use the reference (the hex string after the ",(0,s.jsx)(n.code,{children:"/bzz/"}),") in an ENS record. There is more information about that in the ",(0,s.jsx)(n.a,{href:"https://docs.ethswarm.org/docs/getting-started/host-your-website-using-ens",children:"Bee documentation"}),". The uploaded content can be found on the link in the line starting with ",(0,s.jsx)(n.code,{children:"URL"}),". This will change every time the content is modified."]}),"\n",(0,s.jsx)(n.h2,{id:"usability-features",children:"Usability Features"}),"\n",(0,s.jsx)(n.h3,{id:"uploading-files-folders-websites-and-arbitrary-data-from-stdin",children:"Uploading Files, Folders, Websites, and Arbitrary Data from stdin"}),"\n",(0,s.jsx)(n.h4,{id:"files",children:"Files"}),"\n",(0,s.jsxs)(n.p,{children:["Use ",(0,s.jsx)(n.code,{children:"swarm-cli"})," to upload a single file:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli upload README.md\n"})}),"\n",(0,s.jsxs)(n.p,{children:["The command above will print a ",(0,s.jsx)(n.code,{children:"/bzz"})," URL that may be opened in the browser. If the browser is able to handle the file format then the file is displayed, otherwise it will be offered to be downloaded."]}),"\n",(0,s.jsx)(n.h4,{id:"folders-and-websites",children:"Folders and Websites"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"swarm-cli"})," also supports uploading folders with the same ",(0,s.jsx)(n.code,{children:"upload"})," command:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli upload build/\n"})}),"\n",(0,s.jsxs)(n.p,{children:["This also yields a ",(0,s.jsx)(n.code,{children:"/bzz"})," URL. If there is an ",(0,s.jsx)(n.code,{children:"index.html"})," present in the root of the folder, ",(0,s.jsx)(n.code,{children:"--index-document"})," will be automatically applied by ",(0,s.jsx)(n.code,{children:"swarm-cli"}),". This option sets which file the browser should open for an empty path. You may also freely set ",(0,s.jsx)(n.code,{children:"--index-document"})," during upload to change this."]}),"\n",(0,s.jsx)(n.h4,{id:"standard-input",children:"Standard Input"}),"\n",(0,s.jsxs)(n.p,{children:["You can pipe data from other commands to ",(0,s.jsx)(n.code,{children:"swarm-cli"})," using the ",(0,s.jsx)(n.code,{children:"--stdin"})," option."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"curl -L https://picsum.photos/200 | swarm-cli --stdin --stamp [...]\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Unlike other upload methods, this results in a ",(0,s.jsx)(n.code,{children:"/bytes"})," URL, which cannot be displayed by browsers normally. You can still share your hash and others can download it. However, with the ",(0,s.jsx)(n.code,{children:"--name"})," option, you can give your arbitrary data a file name, and ",(0,s.jsx)(n.code,{children:"swarm-cli"})," will attempt to determine the suitable content type for your data. Given it is successful, ",(0,s.jsx)(n.code,{children:"swarm-cli"})," will print a ",(0,s.jsx)(n.code,{children:"/bzz"})," URL instead of the ",(0,s.jsx)(n.code,{children:"/bytes"})," URL, which is good to be displayed in browsers. Example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"curl -L https://picsum.photos/200 | swarm-cli --stdin --stamp [...] --name random.jpg\n"})}),"\n",(0,s.jsxs)(n.p,{children:["There is also a ",(0,s.jsx)(n.code,{children:"--content-type"})," option if you want to adjust it manually:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"curl -L https://picsum.photos/200 | swarm-cli --stdin --stamp [...] --name random --content-type image/jpeg\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Please note that stdin is reserved for the data you are uploading, so interactive features are disabled during this time. Because of that, ",(0,s.jsx)(n.code,{children:"--stamp"})," must be passed beforehand. You may create an alias for grabbing the ID of the least used postage stamp:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"alias st='swarm-cli stamp list --least-used --limit 1 --hide-usage --quiet'\n"})}),"\n",(0,s.jsx)(n.p,{children:"Leveraging the alias above, you can use a shortcut for uploading from stdin:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"curl -L https://picsum.photos/200 | swarm-cli --stdin --stamp $(st)\n"})}),"\n",(0,s.jsx)(n.h3,{id:"custom-http-headers",children:"Custom HTTP Headers"}),"\n",(0,s.jsxs)(n.p,{children:["Similarly to ",(0,s.jsx)(n.code,{children:"curl"}),", you may use the ",(0,s.jsx)(n.code,{children:"--header"})," or ",(0,s.jsx)(n.code,{children:"-H"})," option to specify as many additional headers as you want, which will be sent with all requests:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'swarm-cli upload README.md -H "Authorization: [...]" -H "X-Custom-Header: Your Value"\n'})}),"\n",(0,s.jsx)(n.h3,{id:"autocomplete",children:"Autocomplete"}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"swarm-cli"})," has support for autocomplete in ",(0,s.jsx)(n.code,{children:"bash"}),", ",(0,s.jsx)(n.code,{children:"zsh"})," and ",(0,s.jsx)(n.code,{children:"fish"}),". This turns on ",(0,s.jsx)(n.code,{children:"<tab><tab>"})," suggestions which can complete commands, paths and options for you."]}),"\n",(0,s.jsx)(n.p,{children:"To enable it, you need to install it once via two options:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Running ",(0,s.jsx)(n.code,{children:"swarm-cli --generate-completion"})," and following the instructions there"]}),"\n",(0,s.jsxs)(n.li,{children:["Running ",(0,s.jsx)(n.code,{children:"swarm-cli --install-completion"})," which automatically appends the completion script to your configuration file"]}),"\n"]}),"\n",(0,s.jsxs)(n.table,{children:[(0,s.jsx)(n.thead,{children:(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.th,{children:"Shell"}),(0,s.jsx)(n.th,{children:"Completion System"}),(0,s.jsx)(n.th,{children:"Configuration Path"})]})}),(0,s.jsxs)(n.tbody,{children:[(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"bash"})}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)(n.code,{children:"compdef"})," & ",(0,s.jsx)(n.code,{children:"compadd"})," OR ",(0,s.jsx)(n.code,{children:"complete"})," & ",(0,s.jsx)(n.code,{children:"COMPREPLY"})]}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)(n.code,{children:"$HOME/.bashrc"})," & ",(0,s.jsx)(n.code,{children:"$HOME/.bash_profile"})]})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"zsh"})}),(0,s.jsxs)(n.td,{children:[(0,s.jsx)(n.code,{children:"compdef"})," & ",(0,s.jsx)(n.code,{children:"compadd"})," OR ",(0,s.jsx)(n.code,{children:"complete"})," & ",(0,s.jsx)(n.code,{children:"COMPREPLY"})]}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"$HOME/.zshrc"})})]}),(0,s.jsxs)(n.tr,{children:[(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"fish"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"complete"})}),(0,s.jsx)(n.td,{children:(0,s.jsx)(n.code,{children:"$HOME/.config/fish/config.fish"})})]})]})]}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Warning! If you start a subshell (e.g. running ",(0,s.jsx)(n.code,{children:"bash"})," from ",(0,s.jsx)(n.code,{children:"zsh"}),"), your ",(0,s.jsx)(n.code,{children:"SHELL"})," env variable would still be the old value! The generation and completion script cannot detect your shell accurately in that case, so please set ",(0,s.jsx)(n.code,{children:"SHELL"})," manually. It is generally advised to run ",(0,s.jsx)(n.code,{children:"--generate-completion"})," first to ensure the shell and the paths are properly detected."]}),"\n"]}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"$ SHELL=zsh\n$ swarm-cli --generate-completion\nYour shell is: zsh\nFound configuration file path: /Users/Swarm/.zshrc\n\nAppend the completion script below to your configuration file to enable autocomplete.\nYou need to source your configuration, or restart your shell, to load the changes.\n\n<script>\n"})}),"\n",(0,s.jsx)(n.h3,{id:"numerical-separator-and-units",children:"Numerical Separator and Units"}),"\n",(0,s.jsx)(n.p,{children:"As most of the units are specified in wei and PLUR - the smallest denominations of currencies - they are a bit difficult to write out."}),"\n",(0,s.jsxs)(n.p,{children:["To aid this, you may use underscores (",(0,s.jsx)(n.code,{children:"_"}),") and ",(0,s.jsx)(n.code,{children:"K"}),", ",(0,s.jsx)(n.code,{children:"M"}),", ",(0,s.jsx)(n.code,{children:"B"})," and ",(0,s.jsx)(n.code,{children:"T"})," units to make your numbers more comprehensible."]}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli stamp buy --amount 10M --depth 17 --gas-price 10_000_000_000_000\n"})}),"\n",(0,s.jsxs)(n.p,{children:["You may combine the two: ",(0,s.jsx)(n.code,{children:"100_000T"}),"."]}),"\n",(0,s.jsx)(n.h3,{id:"stamp-picker",children:"Stamp Picker"}),"\n",(0,s.jsxs)(n.p,{children:["Unless you are running in ",(0,s.jsx)(n.code,{children:"--quiet"})," mode, some options are not hard-required."]}),"\n",(0,s.jsxs)(n.p,{children:["Look for hints in the ",(0,s.jsx)(n.code,{children:"--help"})," sections. Take the ",(0,s.jsx)(n.code,{children:"upload"})," command for example:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"\u2588 Required Options:\n\n   --stamp   ID of the postage stamp to use  [required when quiet][string]\n"})}),"\n",(0,s.jsxs)(n.p,{children:["That means, you don't have to provide the postage stamp ID beforehand. Simply running ",(0,s.jsx)(n.code,{children:"swarm-cli upload <path>"})," will prompt you with an interactive stamp picker:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"? Please select a stamp for this action.\n\n  Stamp ID                                                         Utilization\n (Use arrow keys)\n\u276f b9d5bb548c2c209cb99cbb27b0bef59b8f0cd3558363e307f45177b5a64ad0c8 (1)\n"})}),"\n",(0,s.jsx)(n.h3,{id:"identity-picker",children:"Identity Picker"}),"\n",(0,s.jsx)(n.p,{children:"Similarly to Stamp Picker, when an identity is not provided, an interactive picker will be prompted."}),"\n",(0,s.jsxs)(n.p,{children:["Take the command ",(0,s.jsx)(n.code,{children:"feed upload"})," for example. Albeit it takes quite a lot of options, you can run it with typing as little as ",(0,s.jsx)(n.code,{children:"feed upload <path>"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"swarm-cli"})," will take you through some prompts to interactively specify all required options, such as ",(0,s.jsx)(n.code,{children:"identity"}),", ",(0,s.jsx)(n.code,{children:"password"})," of the identity, and the mandatory ",(0,s.jsx)(n.code,{children:"stamp"}),"."]}),"\n",(0,s.jsx)(n.p,{children:"Passing identities is also tolerant to errors, so if you provide one which does not exist, the output will tell you and you can correct it:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"The provided identity does not exist. Please select one that exists.\n? Please select an identity for this action (Use arrow keys)\n\u276f main\n"})}),"\n",(0,s.jsx)(n.h3,{id:"human-readable-topics",children:"Human Readable Topics"}),"\n",(0,s.jsx)(n.p,{children:"You may need to pass topics on multiple occasions - for example, when uploading to feeds."}),"\n",(0,s.jsx)(n.p,{children:"Topics are 32-byte long identifiers, so you need 64 characters to write them out in hexadecimal string format."}),"\n",(0,s.jsxs)(n.p,{children:["You can do that with the ",(0,s.jsx)(n.code,{children:"--topic"})," or ",(0,s.jsx)(n.code,{children:"-t"})," option, or alternatively take a shortcut and use a human readable string which will be hashed by ",(0,s.jsx)(n.code,{children:"swarm-cli"})," for your convenience. It is available via the ",(0,s.jsx)(n.code,{children:"--topic-string"})," or ",(0,s.jsx)(n.code,{children:"-T"})," option."]}),"\n",(0,s.jsx)(n.p,{children:"Example:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'swarm-cli feed upload [...] -T "Awesome Swarm Website"\n'})}),"\n",(0,s.jsxs)(n.p,{children:["This is also indicated in the ",(0,s.jsx)(n.code,{children:"--help"})," section:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"-t --topic         32-byte long identifier in hexadecimal format    [hex-string][default all zeroes]\n-T --topic-string  Construct the topic from human readable strings                          [string]\n\nOnly one is required: [topic] or [topic-string]\n"})}),"\n",(0,s.jsx)(n.h3,{id:"manifest-address-scheme",children:"Manifest address scheme"}),"\n",(0,s.jsxs)(n.p,{children:["The ",(0,s.jsx)(n.code,{children:"manifest"})," commands enable low-level operation on manifests. These always require a root manifest reference (hash) argument as the input. Some commands, however, work with subparts of the manifest. A few examples are: downloading only a folder from a manifest, listing files only under a specific path in a manifest, and adding files or folders not to the root of the manifest, but under some path."]}),"\n",(0,s.jsxs)(n.p,{children:["These can be achieved by using the ",(0,s.jsx)(n.code,{children:"bzz://<hash>/<path>"})," scheme in the ",(0,s.jsx)(n.code,{children:"<address>"})," argument as follows:"]}),"\n",(0,s.jsxs)(n.p,{children:["List entries under the ",(0,s.jsx)(n.code,{children:"/command/pss"})," prefix in manifest ",(0,s.jsx)(n.code,{children:"1512546a3f4d0fea9f35fa1177486bdfe2bc2536917ad5012ee749604a7b425f"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli manifest list bzz://1512546a3f4d0fea9f35fa1177486bdfe2bc2536917ad5012ee749604a7b425f/command/pss\n"})}),"\n",(0,s.jsxs)(n.p,{children:["Download ",(0,s.jsx)(n.code,{children:"README.md"})," from manifest ",(0,s.jsx)(n.code,{children:"1512546a3f4d0fea9f35fa1177486bdfe2bc2536917ad5012ee749604a7b425f"})]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli manifest download bzz://1512546a3f4d0fea9f35fa1177486bdfe2bc2536917ad5012ee749604a7b425f/README.md\n"})}),"\n",(0,s.jsxs)(n.blockquote,{children:["\n",(0,s.jsxs)(n.p,{children:["Note: The ",(0,s.jsx)(n.code,{children:"bzz://"})," protocol can be omitted."]}),"\n"]}),"\n",(0,s.jsx)(n.h3,{id:"automating-tasks-with-swarm-cli",children:"Automating tasks with Swarm-CLI"}),"\n",(0,s.jsxs)(n.p,{children:["Running ",(0,s.jsx)(n.code,{children:"swarm-cli"})," with the flag ",(0,s.jsx)(n.code,{children:"--quiet"})," (or ",(0,s.jsx)(n.code,{children:"-q"})," for short) disables all interactive features, and makes commands print information in an easily parsable format. The exit code also indicates whether running the command was successful or not. These may be useful for automating tasks both in CI environments and in your terminal too."]}),"\n",(0,s.jsx)(n.p,{children:"Below you will find a few snippets to give an idea how it can be used to compose tasks."}),"\n",(0,s.jsx)(n.h4,{id:"connectivity",children:"Connectivity"}),"\n",(0,s.jsx)(n.p,{children:"Exit if not all status checks succeed:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli status -q || exit 1\n"})}),"\n",(0,s.jsx)(n.p,{children:"Check Bee API connection, compatibility does not matter:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:'swarm-cli status -q | head -n 1 | grep "^OK"\n'})}),"\n",(0,s.jsx)(n.h4,{id:"postage-stamps",children:"Postage Stamps"}),"\n",(0,s.jsx)(n.p,{children:"Grab the first postage stamp:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli stamp list --limit 1 --quiet --hide-usage\n"})}),"\n",(0,s.jsx)(n.p,{children:"Grab the least used postage stamp:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli stamp list --limit 1 --quiet --hide-usage --least-used\n"})}),"\n",(0,s.jsx)(n.p,{children:"List all postage stamps with zero utilization:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli stamp list --max-usage 0 --quiet --hide-usage\n"})}),"\n",(0,s.jsx)(n.p,{children:"Sort postage stamps based on utilization (least utilized comes first):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"swarm-cli stamp list --least-used --quiet\n"})}),"\n",(0,s.jsx)(n.h4,{id:"uploading",children:"Uploading"}),"\n",(0,s.jsx)(n.p,{children:"Upload a file with the least utilized postage stamp (that has at most 50% usage):"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{children:"STAMP=$(swarm-cli stamp list --max-usage 50 --least-used --limit 1 --quiet --hide-usage)\nswarm-cli upload -q README.md --stamp $STAMP\n"})}),"\n",(0,s.jsx)(n.h2,{id:"config",children:"Config"}),"\n",(0,s.jsxs)(n.p,{children:["The configuration file is placed in a hidden folder named ",(0,s.jsx)(n.code,{children:"swarm-cli"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["In case of Unix-based systems this config path will be: ",(0,s.jsx)(n.code,{children:"$HOME/.swarm-cli"})]}),"\n",(0,s.jsxs)(n.p,{children:["On Windows systems: ",(0,s.jsx)(n.code,{children:"$HOME\\AppData\\swarm-cli"})]}),"\n",(0,s.jsxs)(n.p,{children:["The configuration file is saved with ",(0,s.jsx)(n.code,{children:"600"})," file permission."]}),"\n",(0,s.jsx)(n.p,{children:"On first run, this configuration will be generated with default values, that you are able to change on your demand under the before mentioned path."}),"\n",(0,s.jsx)(n.h2,{id:"assignment-priority",children:"Assignment priority"}),"\n",(0,s.jsx)(n.p,{children:"It is possible to set value of particular parameters in different ways."}),"\n",(0,s.jsx)(n.p,{children:"The assignment priority of how option gets its value in question is the following:"}),"\n",(0,s.jsxs)(n.ol,{children:["\n",(0,s.jsxs)(n.li,{children:["passed CLI option value (with e.g. ",(0,s.jsx)(n.code,{children:"--option-example-1"}),")"]}),"\n",(0,s.jsxs)(n.li,{children:["env variable for that option in form of either ",(0,s.jsx)(n.code,{children:"OPTION_EXAMPLE_1"})," or ",(0,s.jsx)(n.code,{children:"SWARM_CLI_OPTION_EXAMPLE_1"})," (if it is available)"]}),"\n",(0,s.jsx)(n.li,{children:"CLI configuration value of that option (if it is available)"}),"\n",(0,s.jsx)(n.li,{children:"option's default fallback value (or it is required to define by #1)"}),"\n"]}),"\n",(0,s.jsx)(n.h2,{id:"system-environment",children:"System environment"}),"\n",(0,s.jsx)(n.p,{children:"With specific system environment variables you can alter the behaviour of the CLI"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"BEE_API_URL"})," - API URL of Bee client"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"BEE_DEBUG_API_URL"})," - Debug API URL of Bee client"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"SWARM_CLI_CONFIG_FOLDER"})," - full path to a configuration folder"]}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"SWARM_CLI_CONFIG_FILE"})," - configuration file name, defaults to config.json"]}),"\n"]}),"\n",(0,s.jsx)(n.h1,{id:"development",children:"Development"}),"\n",(0,s.jsx)(n.p,{children:"After the project has been cloned, the dependencies must be\ninstalled. Run the following in the project folder:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:" $ npm install\n"})}),"\n",(0,s.jsx)(n.p,{children:"Then you need to compile the TypeScript code:"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:" $ npm run build\n"})}),"\n",(0,s.jsxs)(n.p,{children:["To make the local ",(0,s.jsx)(n.code,{children:"swarm-cli"})," files in the ",(0,s.jsx)(n.code,{children:"dist/"})," directory available as a global package:"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-sh",children:" $ npm link\n"})}),"\n",(0,s.jsxs)(n.p,{children:["If all went well you should be able to run ",(0,s.jsx)(n.code,{children:"swarm-cli"}),"."]}),"\n",(0,s.jsxs)(n.p,{children:["If ",(0,s.jsx)(n.code,{children:"npm link"})," fails, or you don't want to install anything, then you\ncan use ",(0,s.jsx)(n.code,{children:"node dist/src/index.js"})," to run ",(0,s.jsx)(n.code,{children:"swarm-cli"})," from the checked out\ndirectory."]}),"\n",(0,s.jsx)(n.h1,{id:"contribute",children:"Contribute"}),"\n",(0,s.jsx)(n.p,{children:"There are some ways you can make this module better:"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsxs)(n.li,{children:["Consult our ",(0,s.jsx)(n.a,{href:"https://github.com/ethersphere/swarm-cli/issues",children:"open issues"})," and take on one of them"]}),"\n",(0,s.jsx)(n.li,{children:"Help our tests reach 100% coverage!"}),"\n"]}),"\n",(0,s.jsx)(n.h1,{id:"maintainers",children:"Maintainers"}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:(0,s.jsx)(n.a,{href:"https://github.com/Cafe137",children:"Cafe137"})}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:['See what "Maintainer" means ',(0,s.jsx)(n.a,{href:"https://github.com/ethersphere/repo-maintainer",children:"here"}),"."]}),"\n",(0,s.jsx)(n.h1,{id:"license",children:"License"}),"\n",(0,s.jsx)(n.p,{children:(0,s.jsx)(n.a,{href:"https://github.com/ethersphere/swarm-cli/blob/master/LICENSE",children:"BSD-3-Clause"})})]})}function h(e={}){const{wrapper:n}={...(0,t.M)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(c,{...e})}):c(e)}},24812:(e,n,i)=>{i.d(n,{c:()=>s});const s=i.p+"assets/images/feed-upload-b3af506b51bdafc6dde5b9ff36e0f43b.gif"},48568:(e,n,i)=>{i.d(n,{c:()=>s});const s=i.p+"assets/images/identity-create-a87e806054f894895d513643d803e382.gif"},8870:(e,n,i)=>{i.d(n,{c:()=>s});const s=i.p+"assets/images/stamp-buy-c680b08fe89623c66b99c3cd032d72aa.gif"},46728:(e,n,i)=>{i.d(n,{c:()=>s});const s=i.p+"assets/images/upload-6054eedc44c106d442560f033f1e6402.gif"},4552:(e,n,i)=>{i.d(n,{I:()=>d,M:()=>r});var s=i(11504);const t={},a=s.createContext(t);function r(e){const n=s.useContext(a);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:r(e.components),s.createElement(a.Provider,{value:n},e.children)}}}]);