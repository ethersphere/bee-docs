---
title: PSS
id: pss
---

PSS, or Postal Service over Swarm, is a messaging protocol that enables users to send and receive messages in a decentralized network. It is an essential component of Swarm's infrastructure, providing secure, private, and efficient communication between nodes.

PSS is designed to be secure by encrypting messages for the intended recipient and wrapping them with a topic in a content-addressed chunk. The chunk is crafted in such a way that its content address falls into the recipient's neighborhood, ensuring that delivery is naturally taken care of by the push-sync protocol. This ensures that messages are delivered only to the intended recipient and cannot be intercepted or read by unauthorized parties.

PSS also provides privacy by allowing users to receive messages from previously unknown identities. This makes it an ideal communication primitive for sending anonymous messages to public identities such as registrations or initial contact to start a thread by setting up secure communication.

Efficiency is another key feature of PSS. It uses direct node-to-node messaging in Swarm, which means that messages are delivered directly from one node to another without the need for intermediaries. This reduces latency and ensures that messages are delivered quickly and reliably.

PSS also supports mailboxing, which allows users to deposit messages for download if the recipient is not online. This ensures that messages are not lost if the recipient is offline when they are sent.

PSS is an essential component of Swarm's infrastructure, providing secure, private, and efficient communication between nodes. Its features include encryption for security, support for anonymous messaging for privacy, direct node-to-node messaging for efficiency, and mailboxing for reliability. PSS plays a critical role in enabling self-sovereign digital society envisioned by Swarm.