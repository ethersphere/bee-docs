import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import {Redirect} from '@docusaurus/router';

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout title="Welcome" description="Hello and welcome to Swarm! 🐝">
         <Head>
        <meta property="og:image" content="img/access1.png" />
        <meta name="twitter:card" content="summary_large_image" />      
      </Head>
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>Swarm Documentation</h1>
        <p className={styles.subTitle}>Official documentation of the decentralised data storage and distribution protocol built to power the next generation of censorship-resistant, unstoppable, serverless dapps.</p>
      </div>
      <div className={styles.container}>
        <a className={styles.sectionButton} href="/docs/learn/introduction">
          <div className={styles.sectionButtonInner}>
            <img className={styles.sectionImageLearnDark} src="img/learn-dark.svg"></img>
            <img className={styles.sectionImageLearnLight} src="img/learn-light.svg"></img>
            <h3 className={styles.buttonTitle}>Learn about Swarm</h3>
            <p className={styles.description}>Get to know more about the Swarm's decentralised data storage and distribution technology.</p>
          </div>
        </a> 
        <a className={styles.sectionButton} href="/docs/desktop/introduction">
          <div className={styles.sectionButtonInner}>
            <img className={styles.sectionImageDesktopDark} src="img/desktop-dark.svg"></img>
            <img className={styles.sectionImageDesktopLight} src="img/desktop-light.svg"></img>
            <h3 className={styles.buttonTitle}>Use Swarm Desktop</h3>
            <p className={styles.description}>Install the Swarm Desktop client to quickly spin up a Bee node and start interacting with the Swarm network.</p>
          </div>
        </a> 
        <a className={styles.sectionButton} href="/docs/bee/installation/quick-start">
          <div className={styles.sectionButtonInner}>
            <img className={styles.sectionImageDevelopDark} src="img/bee-dark.svg"></img>
            <img className={styles.sectionImageDevelopLight} src="img/bee-light.svg"></img>            
            <h3 className={styles.buttonTitle}>Run a Bee Node</h3>
            <p className={styles.description}>Operate a Bee node to connect with other peers all over the world to become part of Swarm network.</p>
          </div>
        </a>
        <a className={styles.sectionButton} href="/docs/develop/introduction">
          <div className={styles.sectionButtonInner}>
            <img className={styles.sectionImageDevelopDark} src="img/develop-dark.svg"></img>
            <img className={styles.sectionImageDevelopLight} src="img/develop-light.svg"></img>
            <h3 className={styles.buttonTitle}>Develop on Swarm</h3>
            <p className={styles.description}>Swarm empowers developers to create and host decentralised dapps, NFT meta-data, media files, and much more!</p>
          </div>
        </a>
      </div>
    </Layout>
  );
}

export default Home;
