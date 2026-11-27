// docusaurus.config.mjs
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import redirects from './redirects.mjs';

// Code block colours. The ethswarm.org design system has no syntax palette, so these are built
// from its tokens (see src/css/custom.css): greens and greys, no orange (orange marks actions).
const prismDark = {
  plain: { color: '#f2f2f2', backgroundColor: '#101411' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#818c85', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: '#b5b5b5' } },
    { types: ['string', 'char', 'attr-value', 'inserted', 'url'], style: { color: '#a5d367' } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'variable'], style: { color: '#def4b6' } },
    { types: ['keyword', 'tag', 'selector', 'atrule', 'builtin', 'important'], style: { color: '#979e7c' } },
    { types: ['property', 'attr-name', 'class-name'], style: { color: '#d2d9d4' } },
    { types: ['function'], style: { color: '#f2f2f2' } },
    { types: ['deleted'], style: { color: '#e5484d' } },
  ],
};
const prismLight = {
  plain: { color: '#121613', backgroundColor: '#e6e9e5' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#636b65', fontStyle: 'italic' } },
    { types: ['punctuation', 'operator'], style: { color: '#454c47' } },
    { types: ['string', 'char', 'attr-value', 'inserted', 'url'], style: { color: '#4e6b23' } },
    { types: ['number', 'boolean', 'constant', 'symbol', 'variable'], style: { color: '#3d5a1a' } },
    { types: ['keyword', 'tag', 'selector', 'atrule', 'builtin', 'important'], style: { color: '#636b65' } },
    { types: ['property', 'attr-name', 'class-name'], style: { color: '#454c47' } },
    { types: ['function'], style: { color: '#121613' } },
    { types: ['deleted'], style: { color: '#b42318' } },
  ],
};

/** @type {import('@docusaurus/types').Config} */
export default {
  title: 'Swarm Documentation',
  tagline: 'Welcome to the Swarm',
  url: 'https://docs.ethswarm.org',
  baseUrl: '/', 

  onBrokenLinks: 'warn',
  onDuplicateRoutes: 'throw',
  favicon: 'img/favicon.png',
  organizationName: 'Swarm',
  projectName: 'bee',

  scripts: [{ src: "/matomo.js", async: true }],

  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'api-description',
        href: '/openapi.yaml',
        type: 'application/openapi+yaml',
      },
    },
    // Machine-readable pointer to the hand-curated llms.txt index (no standard rel yet;
    // rel="alternate" + text/plain is the least-surprising choice for AI-agent discovery).
    {
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        title: 'llms.txt',
        href: '/llms.txt',
      },
    },
    // Site-wide structured data: Organization + WebSite. The @id values below are a shared
    // contract with the per-doc TechArticle in src/theme/DocItem/Layout — keep them identical.
    {
      tagName: 'script',
      attributes: { type: 'application/ld+json' },
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': 'https://docs.ethswarm.org/#organization',
            name: 'Swarm Foundation',
            url: 'https://www.ethswarm.org',
            logo: 'https://docs.ethswarm.org/img/logo-512.png',
            sameAs: [
              'https://twitter.com/ethswarm',
              'https://github.com/ethersphere',
              'https://www.reddit.com/r/ethswarm',
            ],
          },
          {
            '@type': 'WebSite',
            '@id': 'https://docs.ethswarm.org/#website',
            name: 'Swarm Documentation',
            url: 'https://docs.ethswarm.org',
            publisher: { '@id': 'https://docs.ethswarm.org/#organization' },
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://docs.ethswarm.org/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          },
        ],
      }),
    },
  ],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],

  themes: ['@docusaurus/theme-mermaid'],
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn'
    }
  },

  plugins: [
    'plugin-image-zoom',
    [
      'docusaurus-plugin-llms',
      {
        generateLLMsTxt: false,
        generateLLMsFullTxt: true,
        title: 'Ethereum Swarm Documentation',
        description: 'Swarm is a decentralised storage and communication system for a sovereign digital society.',
        excludeImports: true,
        removeDuplicateHeadings: true,
        includeOrder: [
          'docs/concepts/**',
          'docs/bee/get-started/**',
          'docs/bee/install/**',
          'docs/bee/configure/**',
          'docs/bee/operate/**',
          'docs/bee/how-it-works/**',
          'docs/bee/reference/**',
          'docs/bee/contribute/**',
          'docs/develop/**',
          'docs/desktop/**',
          'docs/references/**',
        ],
        customLLMFiles: [
          {
            filename: 'llms-api.txt',
            includePatterns: [
              'docs/develop/upload-and-download.md',
              'docs/develop/files.md',
              'docs/develop/tools-and-features/buy-a-stamp-batch.md',
              'docs/develop/tools-and-features/feeds.md',
              'docs/develop/tools-and-features/pss.md',
              'docs/develop/tools-and-features/gsoc.md',
              'docs/develop/tools-and-features/chunk-types.md',
              'docs/develop/tools-and-features/manifests.md',
              'docs/develop/tools-and-features/pinning.md',
              'docs/develop/tools-and-features/store-with-encryption.md',
              'docs/develop/tools-and-features/erasure-coding.md',
              'docs/develop/tools-and-features/bee-js.md',
              'docs/develop/tools-and-features/gateway-proxy.md',
              'docs/develop/access-control.md',
              'docs/develop/dynamic-content.md',
              'docs/bee/configure/ultra-light-nodes.md',
              'docs/develop/host-your-website.md',
              'docs/develop/routing.md',
              'docs/develop/multi-author-blog.md',
              'docs/develop/resources-md.md',
            ],
            fullContent: true,
            title: 'Swarm API & Development',
            description: 'API usage, uploads, downloads, stamps, feeds, chunks, and integration patterns — for agents building on Swarm.',
            rootContent: 'Focused documentation slice for integration-focused agents. Covers the Bee HTTP API, data operations, stamps, feeds, encryption, and developer tooling. For the full documentation, see llms-full.txt.',
          },
          {
            filename: 'llms-node-ops.txt',
            includePatterns: [
              'docs/bee/**',
            ],
            fullContent: true,
            title: 'Swarm Node Operations',
            description: 'Installation, configuration, monitoring, staking, backups, and troubleshooting — for DevOps and sysadmin agents.',
            rootContent: 'Focused documentation slice for node operators. Covers installation methods, configuration, monitoring, staking, backups, upgrades, and FAQ. For the full documentation, see llms-full.txt.',
          },
        ],
      }
    ],
    [
      '@docusaurus/plugin-client-redirects',
      { redirects },
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
          routeBasePath: 'docs', // Serve the docs at the site's root
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
          primaryColor: '#e85d04',
          primaryColorDark: '#f47a20',
          // The request/response samples panel, dark in both modes (bg/surface).
          theme: { rightPanel: { backgroundColor: '#101411' } },
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
    prism: { theme: prismLight, darkTheme: prismDark },
    mermaid: { theme: { light: 'neutral', dark: 'dark' } },
    navbar: {
      title: '',
      logo: { alt: 'Swarm', src: 'img/swarm-logo-on-light.svg', srcDark: 'img/swarm-logo-on-dark.svg' },
      items: [
        { 
          type: 'dropdown',
          activeBasePath: 'concepts',
          label: 'Concepts',
          position: 'left',
          className: 'inter',
          items: [
            { to: '/docs/concepts/introduction', label: 'Introduction' },
            { to: '/docs/concepts/what-is-swarm', label: 'What is Swarm?' },
            { to: '/docs/concepts/DISC/', label: 'DISC Storage' },
            { to: '/docs/bee/how-it-works/incentives', label: 'Incentives' },
            { to: '/docs/concepts/pss', label: 'PSS' },
            { to: '/docs/concepts/access-control', label: 'Access Control' },
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'bee',
          label: 'Bee Client',
          position: 'left',
          items: [
            { to: '/docs/bee/get-started/getting-started', label: 'Installation' },
            { to: '/docs/bee/operate/introduction', label: 'Working With Bee' },
            { to: '/docs/bee/reference/bee-faq', label: 'Bee FAQ' },
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'develop',
          label: 'Develop',
          position: 'left',
          items: [
            { to: '/docs/develop/introduction', label: 'Getting Started' },  
            { to: '/docs/develop/introduction', label: 'Building on Swarm' },
            { to: '/docs/develop/tools-and-features/introduction', label: 'Tools and Features' },
            { to: '/docs/bee/contribute/introduction', label: 'Contribute to Bee Development' },
          ]
        },
        {
          type: 'dropdown',
          activeBasePath: 'desktop',
          label: 'Desktop App',
          position: 'left',
          items: [
            { to: '/docs/desktop/introduction', label: 'Introduction' },
            { to: '/docs/desktop/install', label: 'Install' },
            { to: '/docs/desktop/configuration', label: 'Configuration' },
            { to: '/docs/desktop/access-content', label: 'Access Content' },
            { to: '/docs/desktop/postage-stamps', label: 'Postage Stamps' },
            { to: '/docs/desktop/upload-content', label: 'Upload Content' },
            { to: '/docs/desktop/backup-restore', label: 'Backup and Restore' },
            { to: '/docs/desktop/publish-a-website', label: 'Publish a Static Website' },
            { to: '/docs/desktop/start-a-blog', label: 'Start a Blog' }
          ]
        },
        { 
          type: 'dropdown',
          activeBasePath: 'references',
          label: 'References',
          position: 'left',
          items: [
            { to: '/docs/references/smart-contracts', label: 'Smart Contracts' },
            { to: '/docs/references/tokens', label: 'Tokens' },
            { to: '/docs/references/community', label: 'Community' },
            { to: '/docs/references/glossary', label: 'Glossary' },
            { to: '/docs/references/fair-data-society', label: 'Fair Data Society' },
            { to: '/docs/references/awesome-list', label: 'Awesome Swarm' },
            { to: '/docs/references/faq', label: 'FAQ' },
          ]
        },
        { to: '/api/', activeBasePath: '/api/', label: 'API Specification', position: 'left' },
        { href: 'https://github.com/ethersphere/bee', position: 'right', className: 'header-github-link', 'aria-label': 'GitHub repository' },
      ],
    },
    // The footer is src/theme/Footer (it follows the ethswarm.org footer); no footer config here.
    algolia: {
      appId: "UAJRQL15I8",
      apiKey: "7660a0b9a0f5aff5abd6c285b57f1e45",
      indexName: "ethswarm",
      contextualSearch: false,
    },
  },
};
