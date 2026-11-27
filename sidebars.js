module.exports = {
  concepts: [
    'concepts/introduction',
    'concepts/what-is-swarm',
    {
      type: 'category',
      label: 'DISC Storage',
      items: [
        'concepts/DISC/disc',
        'concepts/DISC/erasure-coding',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Incentives',
      items: [
        'concepts/incentives/postage-stamps',
        
      ],
      collapsed: false
    },
    'concepts/pss',
    'concepts/access-control',
    
   
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
      label: 'Get started',
      items: [
        'bee/get-started/getting-started',
        'bee/get-started/quick-start',
        'bee/get-started/node-types',
        'bee/get-started/fund-your-node',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Install',
      items: [
        'bee/install/shell-script-install',
        'bee/install/docker',
        'bee/install/package-manager-install',
        'bee/install/build-from-source',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Configure',
      items: [
        'bee/configure/configuration',
        'bee/configure/connectivity',
        'bee/configure/set-target-neighborhood',
        'bee/configure/hive',
        'bee/configure/bcrypt',
        'bee/configure/ultra-light-nodes',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Operate',
      items: [
        'bee/operate/introduction',
        'bee/operate/bee-api',
        'bee/operate/staking',
        'bee/operate/cashing-out',
        'bee/operate/monitoring',
        'bee/operate/logs-and-files',
        'bee/operate/backups',
        'bee/operate/upgrading-bee',
        'bee/operate/uninstalling-bee',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'How it works',
      items: [
        'bee/how-it-works/kademlia',
        'bee/how-it-works/neighborhoods',
        'bee/how-it-works/incentives',
        'bee/how-it-works/redistribution-game',
        'bee/how-it-works/bandwidth-incentives',
        'bee/how-it-works/price-oracle',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'bee/reference/bee-faq',
      ],
      collapsed: false
    },
    {
      type: 'category',
      label: 'Contribute',
      items: [
        'bee/contribute/introduction',
        'bee/contribute/protocols',
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
        'develop/upload-and-download',
        'develop/host-your-website',
        'develop/files',
        'develop/routing',
        'develop/gateway-proxy',
        'develop/dynamic-content',
        'develop/multi-author-blog',
        'develop/act',
        'develop/resources',
      ],
      collapsed: false
    },

    {
      type: 'category',
      label: 'Tools and Features',
      items: [
        'develop/tools-and-features/introduction',
        'develop/tools-and-features/ai-agent-skills',
        'develop/tools-and-features/cheatsheets',
        'develop/tools-and-features/buy-a-stamp-batch',
        'develop/tools-and-features/bee-js',
        'develop/reference/swarm-cli',
        'develop/tools-and-features/gateway-proxy',
        'develop/tools-and-features/chunk-types',
        'develop/tools-and-features/feeds',
        'develop/tools-and-features/manifests',
        'develop/tools-and-features/pss',
        'develop/tools-and-features/gsoc',
        'develop/tools-and-features/pinning',
        'develop/tools-and-features/erasure-coding',
        'develop/tools-and-features/store-with-encryption',
        'develop/tools-and-features/bee-dev-mode',
        'develop/tools-and-features/starting-a-test-network',
      ],
      collapsed: false
    },

  ],
  References: [
    'references/smart-contracts',
    'references/tokens',
    'references/glossary',
    'references/community',
    'references/fair-data-society',
    'references/faq',
    'references/awesome-list',
     ],
};
