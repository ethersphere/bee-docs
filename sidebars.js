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
    {
      type: 'category',
      label: 'Technology',
      items: [
        'learn/technology/what_is_swarm',
        'learn/technology/core-concepts',
        'learn/technology/kademlia',
        'learn/technology/disc',
        'learn/technology/incentives',
        'learn/technology/pss',
        {
          type: 'category',
          label: 'Contracts',
          items: [
            'learn/technology/contracts/chequebook',
            'learn/technology/contracts/postage-stamp',
            'learn/technology/contracts/price-oracle',

          ],
          collapsed: false
        },
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Ecosystem',
      items: [
        'learn/ecosystem/swarm-foundation',
        'learn/ecosystem/fair-data-society',
        'learn/ecosystem/community',
        'learn/ecosystem/grants-bounties',
        'learn/ecosystem/awesome',
      ],
      collapsed: false
    },
    'learn/terminology',
    'learn/faq', 
  ],
  desktop: [
    'desktop/introduction',
    'desktop/install',
    'desktop/access-content',
    'desktop/upload-content',
    'desktop/backup-restore',
    'desktop/configuration',
    'desktop/postage-stamps',
    'desktop/publish-a-website',
  ],
  bee: [
    {
      type: 'category',
      label: 'Installation',
      items: [
        'bee/installation/quick-start',
        'bee/installation/install',
        'bee/installation/manual',
        'bee/installation/build-from-source',
        'bee/installation/hive',
        'bee/installation/docker',
        'bee/installation/bee-clef',
        'bee/installation/connectivity',
        'bee/installation/fund-your-node',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Working With Bee',
      items: [
        'bee/working-with-bee/introduction',
        'bee/working-with-bee/configuration',
        'bee/working-with-bee/debug-api',
        'bee/working-with-bee/logs-and-files',
        'bee/working-with-bee/bee-tools',
        'bee/working-with-bee/security',
        'bee/working-with-bee/staking',
        'bee/working-with-bee/cashing-out',
        'bee/working-with-bee/monitoring',
        'bee/working-with-bee/backups',
        'bee/working-with-bee/upgrading-bee',
        'bee/working-with-bee/uninstalling-bee',
        'bee/working-with-bee/light-nodes',
        'bee/working-with-bee/ultra-light-nodes'
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
