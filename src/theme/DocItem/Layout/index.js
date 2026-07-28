import React from 'react';
import Layout from '@theme-original/DocItem/Layout';
import Head from '@docusaurus/Head';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Swizzled wrapper (wrap, not eject) around @theme-original/DocItem/Layout.
 *
 * Adds a per-doc schema.org TechArticle JSON-LD block for AEO/GEO. The theme already emits
 * BreadcrumbList structured data (see @theme/DocBreadcrumbs/StructuredData), so we deliberately
 * do NOT re-emit BreadcrumbList here — that would produce duplicate structured data.
 *
 * The #organization / #website @ids referenced below MUST stay byte-identical to the site-wide
 * Organization/WebSite JSON-LD in docusaurus.config.mjs (shared contract) — search engines merge
 * all JSON-LD on a page, so these cross-block references resolve only if the strings match exactly.
 *
 * NOTE: per README/CLAUDE.md, swizzled components do NOT auto-upgrade with the Docusaurus theme.
 * After a theme bump, re-verify this still renders — it only wraps the original Layout and adds a
 * <Head>, so the risk surface is small.
 */
export default function DocItemLayoutWrapper(props) {
  const {metadata} = useDoc();
  const {siteConfig} = useDocusaurusContext();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: metadata.title,
    description: metadata.description,
    url: siteConfig.url + metadata.permalink,
    inLanguage: 'en',
    isPartOf: {'@id': 'https://docs.ethswarm.org/#website'},
    publisher: {'@id': 'https://docs.ethswarm.org/#organization'},
  };

  return (
    <>
      <Head>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Head>
      <Layout {...props} />
    </>
  );
}
