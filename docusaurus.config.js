const math = require('remark-math');
const katex = require('rehype-katex');

module.exports = {
  scripts: [
    {
      src: "/matomo.js",
      async: true,
    }
  ],
  title: 'Swarm Documentation',
  tagline: 'Welcome to the Swarm',
  url: 'https://docs.ethswarm.org',
  // note! we use SED to change this during automated builds, see ./.github/workflows/gh-pages.yml
  baseUrl: '/',
  plugins: [
  'plugin-image-zoom',
  [
    '@docusaurus/plugin-client-redirects',
    {
      redirects: [
        // /docs/oldDoc -> /docs/newDoc
        {
          to: '/',
          from: '/docs',
        },
        {
          to: '/docs/bee/working-with-bee/bee-api',
          from: '/docs/api-reference/',
        },
        {
          to: '/docs/develop/access-the-swarm/host-your-website',
          from: '/docs/access-the-swarm/host-your-website',
        },
        {
          to: '/docs/bee/working-with-bee/configuration',
          from: '/docs/working-with-bee/configuration',
        },
        {
          to: '/docs/bee/installation/quick-start',
          from: '/docs/installation/quick-start',
        },
        {
          to: '/docs/develop/access-the-swarm/buy-a-stamp-batch',
          from: '/docs/develop/access-the-swarm/keep-your-data-alive',
        },
        {
          to: '/docs/develop/access-the-swarm/upload-and-download',
          from: '/docs/develop/access-the-swarm/upload-a-directory',
        },
        {
          to: '/docs/bee/installation/fund-your-node',
          from: '/docs/installation/fund-your-node',
        },
        {
          to: '/docs/develop/tools-and-features/introduction',
          from: '/docs/dapps-on-swarm/introduction',
        },
        {
          to: '/docs/develop/tools-and-features/introduction',
          from: '/docs/develop/dapps-on-swarm/introduction',
        },
        {
          to: '/docs/develop/tools-and-features/bee-js',
          from: '/docs/develop/dapps-on-swarm/bee-js',
        },
        {
          to: '/docs/develop/tools-and-features/chunk-types',
          from: '/docs/develop/dapps-on-swarm/chunk-types',
        },
        {
          to: '/docs/develop/tools-and-features/feeds',
          from: '/docs/develop/dapps-on-swarm/feeds',
        },
        {
          to: '/docs/develop/tools-and-features/pss',
          from: '/docs/develop/dapps-on-swarm/pss',
        },
        {
          to: '/docs/develop/tools-and-features/bee-dev-mode',
          from: '/docs/develop/dapps-on-swarm/bee-dev-mode',
        },
        {
          to: '/docs/develop/tools-and-features/starting-a-test-network',
          from: '/docs/develop/dapps-on-swarm/starting-a-test-network',
        },
      ],
    },
  ],
  ],
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: 'Swarm', // Usually your GitHub org/user name.
  projectName: 'bee', // Usually your repo name.
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
        
      title: '',
      logo: {
        alt: 'Swarm Logo',
        src: 'img/logo.svg',
      },
      items: [
        { 
          type: 'dropdown',
          activeBasePath: 'docs/concepts',
          label: 'Concepts',
          position: 'left',
          className: 'inter',
          items: [
            {
              to: 'docs/concepts/introduction',
              label: 'Introduction',
            },
            {
              to: '/docs/concepts/what-is-swarm',
              label: 'What is Swarm?',
            },
            {
              to: '/docs/concepts/DISC/',
              label: 'DISC Storage',
            },
            {
              to: '/docs/concepts/incentives/overview',
              label: 'Incentives',
            },
            {
              to: '/docs/concepts/pss',
              label: 'PSS',
            },
            {
              to: '/docs/concepts/access-control',
              label: 'Access Control',
            },
            
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'docs/bee',
          label: 'Bee Client',
          position: 'left',
          items: [
            {
              to: 'docs/bee/installation/quick-start',
              label: 'Installation'
            },
            {
              to: 'docs/bee/working-with-bee/introduction',
              label: 'Working With Bee'
            },
            {
              to: 'docs/bee/bee-faq',
              label: 'Bee FAQ'
            },
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'docs/develop',
          label: 'Develop',
          position: 'left',
          items: [
            {
              to: 'docs/develop/introduction',
              label: 'Introduction'
            },
            {
              to: 'docs/develop/access-the-swarm/introduction',
              label: 'Access the Swarm'
            },
            {
              to: 'docs/develop/tools-and-features/introduction',
              label: 'Tools and Features'
            },
            {
              to: 'docs/develop/contribute/introduction',
              label: 'Contribute to Bee Development'
            },
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'docs/desktop',
          label: 'Desktop App',
          position: 'left',
          items: [
            {
              to: 'docs/desktop/introduction',
              label: 'Introduction'
            },
            {
              to: 'docs/desktop/install',
              label: 'Install'
            },
            {
              to: 'docs/desktop/configuration',
              label: 'Configuration'
            },
            {
              to: 'docs/desktop/access-content',
              label: 'Access Content'
            },
            {
              to: 'docs/desktop/postage-stamps',
              label: 'Postage Stamps'
            },
            {
              to: 'docs/desktop/upload-content',
              label: 'Upload Content'
            },
            {
              to: 'docs/desktop/backup-restore',
              label: 'Backup and Restore'
            },
            {
              to: 'docs/desktop/publish-a-website',
              label: 'Publish a Static Website'
            },
            {
              to: 'docs/desktop/start-a-blog',
              label: 'Start a Blog'
            }
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'docs/references',
          label: 'References',
          position: 'left',
          items: [
            {
              to: 'docs/references/smart-contracts',
              label: 'Smart Contracts'
            },
            {
              to: 'docs/references/tokens',
              label: 'Tokens'
            },
            {
              to: '/docs/references/community',
              label: 'Community',
            },
            {
              to: 'docs/references/glossary',
              label: 'Glossary'
            },
            {
              to: 'docs/references/fair-data-society',
              label: 'Fair Data Society'
            },
            {
              to: 'docs/references/faq',
              label: 'FAQ'
            },
          ]
        },
        
        {
          to: '/api/',
          activeBasePath: '/api/',
          label: 'API Specification',
          position: 'left',
        },
        {
          href: 'https://github.com/ethersphere/bee',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Swarm Foundation',
          items: [
            {
              label: 'Homepage',
              to: 'https://ethswarm.org',
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/wdghaQsGq5',
            },
            {
              label: 'Mattermost',
              href: 'https://beehive.ethswarm.org/',
            },
            {
              label: 'Reddit',
              href: 'https://www.reddit.com/r/ethswarm',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/ethswarm',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Blog',
              href: 'https://blog.ethswarm.org/',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/ethersphere/bee',
            },
          ],
        },
      ],
      copyright: `Copyleft © ${new Date().getFullYear()}.`,
    },
    // announcementBar: {
    //   id: 'bee_announcements',
    //   content:
    //     '🐝 v0.5.0 is released feat. Swarm Feeds! Update your Bees now! 🐝',
    //   backgroundColor: '#dd7200', // Defaults to `#fff`.
    //   textColor: '#242424', // Defaults to `#000`.
    // },
    
    algolia: {
      appId: "UAJRQL15I8",

      apiKey: "7660a0b9a0f5aff5abd6c285b57f1e45",

      indexName: "ethswarm",

      contextualSearch: false,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/ethersphere/docs.github.io/blob/master',
          remarkPlugins: [math],
          rehypePlugins: [katex],
        },
        blog: {
          showReadingTime: false,
          // Please change this to your repo.
          editUrl:
            'https://github.com/ethersphere/docs.github.io',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          {
            spec: 'openapi/Swarm.yaml',
            route: '/api/',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
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
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
};
