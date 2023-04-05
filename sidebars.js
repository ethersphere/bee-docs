module.exports = {
  docs: [
   
    {
      type: 'category',
      label: 'API Reference',
      items: [
        'api-reference/api-reference'
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
  ],
  learn: [
    'learn/introduction',
    'learn/what-is-swarm',
    'learn/book-of-swarm',
    'learn/technology',
    'learn/roadmap',
    'learn/ecosystem',
    'learn/terminology',
    'learn/faq', 
  ],
  operate: [
    {
      type: 'category',
      label: 'Installation',
      items: [
        'operate/installation/quick-start',
        'operate/installation/install',
        'operate/installation/manual',
        'operate/installation/build-from-source',
        'operate/installation/hive',
        'operate/installation/docker',
        'operate/installation/bee-clef',
        'operate/installation/connectivity',
        'operate/installation/fund-your-node',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Working With Bee',
      items: [
        'operate/working-with-bee/introduction',
        'operate/working-with-bee/configuration',
        'operate/working-with-bee/debug-api',
        'operate/working-with-bee/logs-and-files',
        'operate/working-with-bee/bee-tools',
        'operate/working-with-bee/security',
        'operate/working-with-bee/staking',
        'operate/working-with-bee/cashing-out',
        'operate/working-with-bee/monitoring',
        'operate/working-with-bee/backups',
        'operate/working-with-bee/upgrading-bee',
        'operate/working-with-bee/uninstalling-bee',
        'operate/working-with-bee/light-nodes',
        'operate/working-with-bee/ultra-light-nodes'
      ],
      collapsed: false
    },
  ],
  develop: [
    {
      type: 'category',
      label: 'Develop',
      items: [
        'develop/introduction',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Access the Swarm',
      items: [
        'develop/access-the-swarm/introduction',
        'develop/access-the-swarm/upload-and-download',
        'develop/access-the-swarm/upload-a-directory',
        'develop/access-the-swarm/direct-upload',
        'develop/access-the-swarm/store-with-encryption',
        'develop/access-the-swarm/host-your-website',
        'develop/access-the-swarm/syncing',
        'develop/access-the-swarm/keep-your-data-alive',
        'develop/access-the-swarm/pinning',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Dapps on Swarm',
      items: [
        'develop/dapps-on-swarm/introduction',
        'develop/dapps-on-swarm/develop-on-bee',
        'develop/dapps-on-swarm/bee-js',
        'develop/dapps-on-swarm/chunk-types',
        'develop/dapps-on-swarm/feeds',
        'develop/dapps-on-swarm/pss'
      ],
    },
    {
      type: 'category',
      label: 'Bee Developers',
      items: [
        'develop/bee-developers/useful-dev-info',
        'develop/bee-developers/bee-dev-mode'
      ],
    },

  ]
};
