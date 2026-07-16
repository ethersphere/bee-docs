---
title: Swarm Cheatsheet
id: cheatsheets
description: A dense printable quick-reference for building on Swarm — what it is, its limits, and curated links to get started.
hide_table_of_contents: true
---

The Swarm Cheatsheet is a dense, two-page quick-reference for building on Swarm.

It's designed to print cleanly to A4, so you can keep it beside you at a hackathon or on your desk — use the **Download PDF** link below to grab a copy.

<iframe
  src="/cheatsheets/overview/"
  title="Swarm Cheatsheet"
  loading="lazy"
  onLoad={(e) => {
    // Same-origin (served from /cheatsheets/): grow the frame to its content
    // height so the page scrolls, not the iframe. Re-measure on reflow (the
    // card's fonts load and QR codes render after the initial load event).
    const frame = e.currentTarget;
    const doc = frame.contentDocument;
    if (!doc) return;
    const fit = () => { frame.style.height = doc.documentElement.scrollHeight + 'px'; };
    fit();
    new ResizeObserver(fit).observe(doc.documentElement);
  }}
  style={{ width: '100%', minHeight: '85vh', border: 0 }}
></iframe>

<a className="button button--primary button--lg" href="/cheatsheets/swarm-overview-cheatsheet.pdf" download>Download PDF</a>
&nbsp;
<a className="button button--secondary button--lg" href="/cheatsheets/overview/" target="_blank" rel="noopener">Open in a new tab</a>
