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
        <a className={styles.sectionButton} href="/docs/learn/introduction">
          <img className={styles.sectionImageLearn} src="img/learn.svg"></img>
          <h3 className={styles.buttonTitle}>Learn about Swarm</h3>
          <p className={styles.description}>Get to know more about the Swarm's decentralised data storage and distribution technology.</p>
        </a> 
        <a className={styles.sectionButton} href="/docs/desktop/introduction">
          <img className={styles.sectionImageDesktop} src="img/desktop.svg"></img>
          <h3 className={styles.buttonTitle}>Use Swarm Desktop</h3>
          <p className={styles.description}>Install the Swarm Desktop client to quickly spin up a Bee node and start interacting with the Swarm network.</p>
        </a> 
        <a className={styles.sectionButton} href="/docs/bee/installation/quick-start">
          <img className={styles.sectionImageOperate} src="img/operate.svg"></img>
            <h3 className={styles.buttonTitle}>Run a Bee Node</h3>
            <p className={styles.description}>Operate a Bee node to connect with other peers all over the world to become part of Swarm network.</p>
        </a>
        <a className={styles.sectionButton} href="/docs/develop/introduction">
          <img className={styles.sectionImageOperate} src="img/develop.svg"></img>
          <h3 className={styles.buttonTitle}>Develop on Swarm</h3>
          <p className={styles.description}>Swarm empowers developers to create and host decentralised dapps, NFT meta-data, media files, and much more!</p>
        </a>
      </div>
    </Layout>
  );
}

export default Home;
