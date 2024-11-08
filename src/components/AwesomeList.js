import React, { useEffect, useState } from 'react';
import Markdown from 'react-markdown';

const AwesomeList = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/ethersphere/awesome-swarm/refs/heads/master/README.md')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.text();
      })
      .then((text) => {
        setContent(text);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching Awesome Swarm list:', err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading Awesome Swarm list...</p>;
  }

  if (error) {
    return <p>Failed to retrieve Awesome Swarm list contents</p>;
  }

  return <Markdown>{content}</Markdown>;
};

export default AwesomeList;
