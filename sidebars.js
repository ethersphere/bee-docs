module.exports = {
  Balls: [
    'introduction',
    {
      type: 'category',
      label: 'The Basics',
      items: [
        'introduction/terminology',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Installation',
      items: [
        'installation/quick-start',
        'installation/configuration',
        'installation/manual',
        'installation/build-from-source',
        'installation/docker',
        'installation/connectivity',
        'installation/bee-clef'
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Maintainance',
      items: [
        'maintenance/backups'
      ],
    },
    {
      type: 'category',
      label: 'Basic Usage',
      items: [
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
        'advanced/starting-a-test-network',
        'advanced/large-node-operators'
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
