module.exports = {
  title: 'Swarm Bee Client',
  tagline: 'Welcome to the Swarm',
  url: 'https://bee.ethswarm.org',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Swarm', // Usually your GitHub org/user name.
  projectName: 'bee', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'Swarm Bee Documentation',
      logo: {
        alt: 'Swarm Logo',
        src: 'img/swarm-logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Get Started',
          position: 'left',
        },
        {
          to: 'docs/installation/quick-start',
          activeBasePath: 'docs',
          label: 'Installation',
          position: 'left',
        },
        {
          to: 'docs/getting-started/start-your-node',
          activeBasePath: 'docs',
          label: 'Start Your Node',
          position: 'left',
        },
        {
          to: 'docs/api-reference/api-reference',
          activeBasePath: 'docs',
          label: 'API Reference',
          position: 'left',
        },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/ethersphere/bee',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Swarm',
          items: [
            {
              label: 'Swarm',
              to: 'https://ethswarm.org',
            }
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Mattermost',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Reddit',
              href: 'https://discordapp.com/invite/docusaurus',
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
              to: 'blog',
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
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'introduction',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/ethersphere/docs.github.io',
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
  ],
};
