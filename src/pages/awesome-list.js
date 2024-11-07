import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

export default function AwesomeList() {
  const [content, setContent] = useState('');

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ethersphere/awesome-swarm/refs/heads/master/README.md')
      .then((res) => res.text())
      .then((text) => setContent(text));
  }, []);

  return (
    <div>
      <Markdown>{content}</Markdown>
    </div>
  );
}
