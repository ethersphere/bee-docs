module.exports = {
  Balls: [
    'introduction',
    {
      type: 'category',
      label: 'Installation',
      items: [
        'installation/quick-start',
        'installation/install',
        'installation/manual',
        'installation/build-from-source',
        'installation/rasp-bee-ry-pi',
        'installation/hive',
        'installation/docker',
        'installation/bee-clef',
        'installation/connectivity',
        'installation/fund-your-node'
      ],
      collapsed: true
    },
    {
      type: 'category',
      label: 'Working With Bee',
      items: [
        'working-with-bee/configuration',
        'working-with-bee/debug-api',
        'working-with-bee/logs-and-files',
        'working-with-bee/bee-tools',
        'working-with-bee/cashing-out',
        'working-with-bee/monitoring',
        'working-with-bee/backups',
        'working-with-bee/upgrading-bee',
        'working-with-bee/uninstalling-bee'
      ],
      collapsed: true
    },
    {
      type: 'category',
      label: 'Access the Swarm',
      items: [
        'access-the-swarm/introduction',
        'access-the-swarm/upload-and-download',
        'access-the-swarm/upload-a-directory',
        'access-the-swarm/store-with-encryption',
        'access-the-swarm/host-your-website',
        'access-the-swarm/syncing',
        'access-the-swarm/keep-your-data-alive',
        'access-the-swarm/pinning',
        'access-the-swarm/light-nodes'
      ],
      collapsed: true
    },
    {
      type: 'category',
      label: 'Dapps on Swarm',
      items: [
        'dapps-on-swarm/introduction',
        'dapps-on-swarm/develop-on-bee',
        'dapps-on-swarm/bee-js',
        'dapps-on-swarm/chunk-types',
        'dapps-on-swarm/feeds',
        'dapps-on-swarm/pss'
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
      label: 'FAQ',
      items: [
        'FAQ'
      ],
    },
    {
      type: 'category',
      label: 'Join Us',
      items: [
        'community/community',
        'community/awesome-swarm'
      ],
      collapsed: false
    }
  ]
};