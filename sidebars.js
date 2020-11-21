module.exports = {
  Balls: [
    'introduction',
    {
      type: 'category',
      label: 'Installation',
      items: [
        'installation/quick-start',
        'installation/configuration',
        'installation/package-managers',
        'installation/build-from-source',
        'installation/docker',
        'installation/connectivity'
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/start-your-node',
        'getting-started/working-with-your-node',
        'getting-started/upload-and-download',
        'getting-started/upload-a-directory',
        'getting-started/host-your-website-using-ens',
        'getting-started/store-with-encryption'
      ],
      collapsed: false,
    },
    {
      type: 'category',
      label: 'Advanced Usage',
      items: [
        'advanced/pss',
        'advanced/tags',
        'advanced/persistence',
        'advanced/swap',
        'advanced/starting-a-test-network'
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/api-reference'
      ],
    },
    {
      type: 'category',
      label: 'Bee Developers',
      items: [
        'bee-developers/useful-dev-info'
      ],
    },
    {
      type: 'category',
      label: 'Join Us',
      items: [
        'community/community'
      ],
      collapsed: false
    }
  ]
};