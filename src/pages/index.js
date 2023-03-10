import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import {Redirect} from '@docusaurus/router';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout title="Hello" description="Hello React Page">
      <div className={styles.container}>
        <a className={styles.panel} href="/docs/about/introduction">
          <div>
            <h3>About Swarm</h3>
          </div>
          <p className={styles.description}>Learn more about the decentralised data storage and distribution technology which will power the next generation of censorship-resistant, unstoppable, serverless dapps.</p>
        </a> 
        <a className={styles.panel} href="/docs/installation/quick-start">
          <div>
            <h3>Run a Bee Node</h3>
            <p className={styles.description}>Bee is a peer-to-peer client that connects you with other peers all over the world to become part of Swarm network, a global distributed p2p storage network that aims to store and distribute all of the world's data.</p>
          </div>
        </a>
        <a className={styles.panel} href="/docs/access-the-swarm/introduction">
          <div>
            <h3>Develop on Swarm</h3>
            <p className={styles.description}>Swarm provides a complete stack of essential base layer components for developers to create and host decentralised dapps, NFT meta-data, media files, and anything else you can think of!</p>
          </div>
        </a>
        
      </div>
    </Layout>
  );
}

export default Home;
