import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import {Redirect} from '@docusaurus/router';

const features = [
  {
    title: <>Join the Swarm</>,
    imageUrl: 'img/undraw_Around_the_world_re_n353.svg',
    description: (
      <>
        Welcome to the decentralised revolution. Swarm will make our data our own.
      </>
    ),
  },
  {
    title: <>The Decentralised Internet</>,
    imageUrl: 'img/undraw_Master_plan_re_jvit.svg',
    description: (
      <>
        Store and distribute file and data using a global p2p network of storers and relayers.
      </>
    ),
  },
  {
    title: <>Get ready to make BZZ</>,
    imageUrl: 'img/undraw_Bitcoin_P2P_re_1xqa.svg',
    description: (
      <>
        Start running the future Swarm client now and get ahead of the game. An incentivised network is coming.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Redirect to="/docs/" />
  );
}

export default Home;
