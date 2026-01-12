// docusaurus.config.mjs
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'Swarm Documentation',
  tagline: 'Welcome to the Swarm',
  url: 'https://docs.ethswarm.org',
  baseUrl: '/', 

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'Swarm',
  projectName: 'bee',

  scripts: [{ src: "/matomo.js", async: true }],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: { mermaid: true },

  plugins: [
    'plugin-image-zoom',
    [
      'docusaurus-plugin-llms',
      {
        // Include core developer documentation
        include: [
          'docs/develop/**',
          'docs/api/**',
          'docs/learn/technology/**'
        ],
        // Exclude non-essential content
        exclude: [
          'docs/learn/ecosystem/**',
          'docs/desktop/**'
        ],
        // Prioritize essential developer content
        priority: {
          'docs/develop/getting-started': 'high',
          'docs/api/': 'high',
          'docs/learn/technology/**': 'medium'
        }
      }
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
           { to: '/', from: '/docs' },
           { to: '/docs/bee/working-with-bee/bee-api', from: '/docs/api-reference/' },
           { to: '/docs/develop/host-your-website', from: '/docs/access-the-swarm/host-your-website' },
           { to: '/docs/bee/working-with-bee/configuration', from: '/docs/working-with-bee/configuration' },
           { to: '/docs/develop/tools-and-features/buy-a-stamp-batch', from: '/docs/develop/access-the-swarm/keep-your-data-alive' },
           { to: '/docs/develop/upload-and-download', from: '/docs/develop/access-the-swarm/upload-a-directory' },
           { to: '/docs/bee/installation/fund-your-node', from: '/docs/installation/fund-your-node' },
           { to: '/docs/develop/tools-and-features/introduction', from: '/docs/dapps-on-swarm/introduction' },
           { to: '/docs/develop/tools-and-features/introduction', from: '/docs/develop/dapps-on-swarm/introduction' },
           { to: '/docs/develop/tools-and-features/bee-js', from: '/docs/develop/dapps-on-swarm/bee-js' },
           { to: '/docs/develop/tools-and-features/chunk-types', from: '/docs/develop/dapps-on-swarm/chunk-types' },
           { to: '/docs/develop/tools-and-features/feeds', from: '/docs/develop/dapps-on-swarm/feeds' },
           { to: '/docs/develop/tools-and-features/pss', from: '/docs/develop/dapps-on-swarm/pss' },
           { to: '/docs/develop/tools-and-features/bee-dev-mode', from: '/docs/develop/dapps-on-swarm/bee-dev-mode' },
           { to: '/docs/develop/tools-and-features/starting-a-test-network', from: '/docs/develop/dapps-on-swarm/starting-a-test-network' },
           { to: '/docs/concepts/incentives/postage-stamps', from: '/docs/learn/technology/contracts/postage-stamp' },
           { to: '/docs/develop/introduction', from: '/docs/develop/access-the-swarm/introduction' },
           { to: '/docs/develop/upload-and-download', from: '/docs/develop/access-the-swarm/upload-and-download' },
           { to: '/docs/develop/host-your-website', from: '/docs/develop/access-the-swarm/host-your-website' },
           { to: '/docs/develop/act', from: '/docs/develop/access-the-swarm/act' },
           { to: '/docs/develop/ultra-light-nodes', from: '/docs/develop/access-the-swarm/ultra-light-nodes' },
           { to: '/docs/develop/introduction', from: '/docs/develop/access-the-swarm' },
        ],
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.js', // Simplified path for ESM
          editUrl: 'https://github.com/ethersphere/docs.github.io/blob/master',
          remarkPlugins: [remarkMath], // Now using imported ESM modules
          rehypePlugins: [rehypeKatex],
        },
        blog: { showReadingTime: false, editUrl: 'https://github.com/ethersphere/docs.github.io' },
        theme: { customCss: './src/css/custom.css' },
      },
    ],
    [
      'redocusaurus',
      {
        specs: [{ spec: 'openapi/Swarm.yaml', route: '/api/' }],
        theme: {
          primaryColor: '#1890ff',
          options: {
            requiredPropsFirst: true,
            noAutoAuth: true,
            expandDefaultServerVariables: true,
            scrollYOffset: 60,
            searchMaxDepth: 10
          },
        },
      },
    ],
  ],

  themeConfig: {
    colorMode: { defaultMode: 'dark', disableSwitch: false, respectPrefersColorScheme: false },
    navbar: {
      title: '',
      logo: { alt: 'Swarm Logo', src: 'img/logo.svg' },
      items: [
        { 
          type: 'dropdown',
          activeBasePath: 'docs/concepts',
          label: 'Concepts',
          position: 'left',
          className: 'inter',
          items: [
            { to: 'docs/concepts/introduction', label: 'Introduction' },
            { to: '/docs/concepts/what-is-swarm', label: 'What is Swarm?' },
            { to: '/docs/concepts/DISC/', label: 'DISC Storage' },
            { to: '/docs/concepts/incentives/overview', label: 'Incentives' },
            { to: '/docs/concepts/pss', label: 'PSS' },
            { to: '/docs/concepts/access-control', label: 'Access Control' },
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'docs/bee',
          label: 'Bee Client',
          position: 'left',
          items: [
            { to: 'docs/bee/installation/getting-started', label: 'Installation' },
            { to: 'docs/bee/working-with-bee/introduction', label: 'Working With Bee' },
            { to: 'docs/bee/bee-faq', label: 'Bee FAQ' },
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'docs/develop',
          label: 'Develop',
          position: 'left',
          items: [
            { to: 'docs/develop/introduction', label: 'Getting Started' },  
            { to: 'docs/develop/introduction', label: 'Building on Swarm' },
            { to: 'docs/develop/tools-and-features/introduction', label: 'Tools and Features' },
            { to: 'docs/develop/contribute/introduction', label: 'Contribute to Bee Development' },
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'docs/desktop',
          label: 'Desktop App',
          position: 'left',
          items: [
            { to: 'docs/desktop/introduction', label: 'Introduction' },
            { to: 'docs/desktop/install', label: 'Install' },
            { to: 'docs/desktop/configuration', label: 'Configuration' },
            { to: 'docs/desktop/access-content', label: 'Access Content' },
            { to: 'docs/desktop/postage-stamps', label: 'Postage Stamps' },
            { to: 'docs/desktop/upload-content', label: 'Upload Content' },
            { to: 'docs/desktop/backup-restore', label: 'Backup and Restore' },
            { to: 'docs/desktop/publish-a-website', label: 'Publish a Static Website' },
            { to: 'docs/desktop/start-a-blog', label: 'Start a Blog' }
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'docs/references',
          label: 'References',
          position: 'left',
          items: [
            { to: 'docs/references/smart-contracts', label: 'Smart Contracts' },
            { to: 'docs/references/tokens', label: 'Tokens' },
            { to: '/docs/references/community', label: 'Community' },
            { to: 'docs/references/glossary', label: 'Glossary' },
            { to: 'docs/references/fair-data-society', label: 'Fair Data Society' },
            { to: 'docs/references/awesome-list', label: 'Awesome Swarm' },
            { to: 'docs/references/faq', label: 'FAQ' },
          ]
        },
        { to: '/api/', activeBasePath: '/api/', label: 'API Specification', position: 'left' },
        { href: 'https://github.com/ethersphere/bee', position: 'right', className: 'header-github-link', 'aria-label': 'GitHub repository' },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Swarm Foundation',
          items: [{ label: 'Homepage', to: 'https://ethswarm.org' }],
        },
        {
          title: 'Community',
          items: [
            { label: 'Discord', href: 'https://discord.gg/wdghaQsGq5' },
            { label: 'Mattermost', href: 'https://beehive.ethswarm.org/' },
            { label: 'Reddit', href: 'https://www.reddit.com/r/ethswarm' },
            { label: 'Twitter', href: 'https://twitter.com/ethswarm' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', href: 'https://blog.ethswarm.org/' },
            { label: 'GitHub', href: 'https://github.com/ethersphere/bee' },
          ],
        },
      ],
      copyright: `Copyleft © ${new Date().getFullYear()}.`,
    },
    algolia: {
      appId: "UAJRQL15I8",
      apiKey: "7660a0b9a0f5aff5abd6c285b57f1e45",
      indexName: "ethswarm",
      contextualSearch: false,
    },
  },
};
