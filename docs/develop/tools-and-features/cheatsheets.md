---
title: Swarm Cheatsheet
id: cheatsheets
description: A dense printable quick-reference for building on Swarm — what it is, its limits, and curated links to get started.
hide_table_of_contents: true
---

The Swarm Cheatsheet is a dense, two-page quick-reference for building on Swarm.

It's designed to print cleanly to A4, so you can keep it beside you at a hackathon or on your desk — use the **Download PDF** link below to grab a copy.

<div className="cheatsheet-embed" style={{ overflow: 'hidden', margin: '1.5rem -1rem' }}>
  <iframe
    src="/cheatsheets/overview/"
    title="Swarm Cheatsheet"
    loading="lazy"
    onLoad={(e) => {
      // Same-origin (served from /cheatsheets/): the card is a fixed 210mm A4
      // sheet. Scale it to fill the wrapper — removes the grey margins beside
      // the centered sheet and makes it a bit larger than native — then size
      // the wrapper to the scaled height so the page (not the iframe) scrolls.
      const frame = e.currentTarget;
      const wrap = frame.parentElement;
      const doc = frame.contentDocument;
      if (!doc) return;
      // Hide the inner document's scrollbars so the embed shows no scroll of
      // its own; the frame is sized to the full content height below.
      doc.documentElement.style.overflow = 'hidden';
      const SHEET_W = 794; // 210mm A4 at 96dpi — the iframe's intrinsic width
      const fit = () => {
        const scale = wrap.clientWidth / SHEET_W;
        const h = doc.body.scrollHeight; // body grows as fonts/QR render
        frame.style.transform = 'scale(' + scale + ')';
        frame.style.height = h + 'px';
        wrap.style.height = (h * scale) + 'px';
      };
      fit();
      // Re-fit on reflow (fonts/QR render late) and on window resize.
      new ResizeObserver(fit).observe(doc.body);
      window.addEventListener('resize', fit);
    }}
    style={{ width: '794px', border: 0, transformOrigin: 'top left' }}
  ></iframe>
</div>

<a className="button button--primary button--lg" href="/cheatsheets/swarm-overview-cheatsheet.pdf" download>Download PDF</a>
