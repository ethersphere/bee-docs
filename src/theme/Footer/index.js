import React from 'react';
import Link from '@docusaurus/Link';
import ThemedImage from '@theme/ThemedImage';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

/**
 * Site footer, replacing the classic theme's footer (themeConfig.footer is not used).
 *
 * It follows the ethswarm.org footer (ethswarm-website components/layout/SiteFooter.tsx and
 * data/footer.ts, as of 24 Nov 2026): logo and mission, Foundation links, newsletter, community.
 * The newsletter column links to the sign-up form on ethswarm.org instead of embedding it.
 *
 * NOTE: a fully swizzled component does not follow theme upgrades; it only uses stable theme
 * APIs (Link, ThemedImage, useBaseUrl).
 */

const SITE = 'https://www.ethswarm.org';

const mission =
  'Swarm provides storage and communication infrastructure for a sovereign digital society.';

const foundationLinks = [
  { name: 'Swarm Foundation', href: `${SITE}/foundation` },
  { name: 'Jobs', href: `${SITE}/jobs` },
];

const docsLinks = [
  { name: 'ethswarm.org', href: SITE },
  { name: 'Blog', href: `${SITE}/blog` },
  { name: 'GitHub', href: 'https://github.com/ethersphere' },
  { name: 'Edit these docs', href: 'https://github.com/ethersphere/bee-docs' },
];

const community = [
  { name: 'Discord', href: 'https://discord.ethswarm.org' },
  { name: 'X', href: 'https://x.com/ethswarm' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/ethereum-swarm' },
  { name: 'Reddit', href: 'https://www.reddit.com/r/ethswarm/' },
  { name: 'YouTube', href: 'https://www.youtube.com/@ethswarm' },
];

function Dot() {
  return <span aria-hidden="true" className={styles.dot} />;
}

function Column({ title, links }) {
  return (
    <div>
      <h2 className={styles.columnTitle}>{title}</h2>
      <ul className={styles.list}>
        {links.map(({ name, href }) => (
          <li key={name}>
            <Link href={href} className={styles.link}>
              {name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const logoLight = useBaseUrl('/img/swarm-logo-on-light.svg');
  const logoDark = useBaseUrl('/img/swarm-logo-on-dark.svg');
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div aria-hidden="true" className={styles.horizonRule} />
      <div className={styles.inner}>
        <div className={styles.identity}>
          <Link href={SITE} aria-label="Swarm home" className={styles.logoLink}>
            <ThemedImage
              alt="Swarm"
              className={styles.logo}
              sources={{ light: logoLight, dark: logoDark }}
              width="108"
              height="28"
            />
          </Link>
          <p className={styles.mission}>{mission}</p>
          <p className={styles.inline}>
            {foundationLinks.map((link, i) => (
              <React.Fragment key={link.href}>
                {i > 0 && <Dot />}
                <Link href={link.href} className={styles.link}>
                  {link.name}
                </Link>
              </React.Fragment>
            ))}
          </p>
          <p className={styles.meta}>
            <span>{year}</span>
            <Dot />
            <Link href={`${SITE}/privacy`} className={styles.metaLink}>
              Privacy Policy
            </Link>
          </p>
        </div>

        <div className={styles.columns}>
          <div className={styles.newsletter}>
            <h2 className={styles.columnTitle}>Newsletter</h2>
            <Link href={`${SITE}/#newsletter`} className={styles.signup}>
              <span>Sign up on ethswarm.org</span>
              <span aria-hidden="true" className={styles.arrow}>→</span>
            </Link>
            <p className={styles.note}>Updates from the Swarm Project, by email.</p>
          </div>
          <Column title="Resources" links={docsLinks} />
          <Column title="Community" links={community} />
        </div>
      </div>
    </footer>
  );
}
