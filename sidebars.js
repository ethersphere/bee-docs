module.exports = {
  learn: [
    'learn/introduction',
    'learn/what-is-swarm',
    
    {
      type: 'category',
      label: 'DISC Storage',
      items: [
        'learn/DISC/disc',
        'learn/DISC/erasure-coding',
        'learn/DISC/neighbourhoods',
        
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Technology',
      items: [
        'learn/technology/incentives',
        'learn/technology/pss',
        'learn/technology/act',
        {
          type: 'category',
          label: 'Contracts',
          items: [

            'learn/technology/contracts/overview',
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
    'learn/tokens',
    'learn/glossary',
    'learn/faq',
  ],
  desktop: [
    'desktop/introduction',
    'desktop/install',
    'desktop/configuration',
    'desktop/access-content',
    'desktop/postage-stamps',
    'desktop/upload-content',
    'desktop/backup-restore',
    'desktop/publish-a-website',
    'desktop/start-a-blog',
  ],
  bee: [
    {
      type: 'category',
      label: 'Installation',
      items: [
        'bee/installation/quick-start',
        'bee/installation/install',
        'bee/installation/build-from-source',
        'bee/installation/hive',
        'bee/installation/docker',
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
        'bee/working-with-bee/bee-api',
        'bee/working-with-bee/logs-and-files',
        'bee/working-with-bee/bee-dashboard',
        'bee/working-with-bee/swarm-cli',
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
    'bee/bee-faq',
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
        'develop/access-the-swarm/buy-a-stamp-batch',
        'develop/access-the-swarm/upload-and-download',
        'develop/access-the-swarm/erasure-coding',
        'develop/access-the-swarm/store-with-encryption',
        'develop/access-the-swarm/host-your-website',
        'develop/access-the-swarm/syncing',
        'develop/access-the-swarm/pinning',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Tools and Features',
      items: [
        'develop/tools-and-features/introduction',
        'develop/tools-and-features/bee-js',
        'develop/tools-and-features/gateway-proxy',
        'develop/tools-and-features/chunk-types',
        'develop/tools-and-features/feeds',
        'develop/tools-and-features/pss',
        'develop/tools-and-features/bee-dev-mode',
        'develop/tools-and-features/starting-a-test-network',
        'develop/tools-and-features/act'
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Contribute',
      items: [
        'develop/contribute/introduction',
        'develop/contribute/protocols',
      ],
      collapsed: false
    },

  ]
};
