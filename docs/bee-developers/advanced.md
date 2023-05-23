---
title: Advanced
id: advanced
---

# Protocols specifications

## Abstract

An attempt to describe the desired, theoretical behavior of the main DISC protocols.
We'll begin by describing Retrieval, PushSync, PullSync and Kademlia communication protocols but eventually this should be expanded to cover all protocols fully.
Ideally we should always think in terms of how we could design and implement the protocols in such a way that simultations could be written allowing us to validate the protocol rules and behaviour, as well as allow us to test any potential improvements.

## Introduction

A communications protocol is a set of formal rules describing how to transmit or exchange data, especially across a network.
While ideally specialized tools (TLA+ etc) could be employed to verify the correctness of the specifications, at this point in time, with the resources at hand we might want to limit ourselves with building some kind of a simultation framework that would allow us to validate how a collection of in-memory nodes perform when collaborating via a given protocol.

## Proposal

At the moment there isn’t a single source of truth about WHATs and HOWs of the DISC protocols.
There is the observed behavior that is coded into the repository inherited from the previous iterations of the project - however - except for the high level description of the expectations that can be found in <a href="/the-book-of-swarm.pdf" target="_blank" rel="noopener noreferrer">The Book of Swarm</a> - there’s no specific, tangible and actionable documentation that we can referred to when implementing and reasoning about specific protocols.
This is not an optimal situation for successful development because on the code level an observer would look at both the WHYs and the HOWs, concepts that are easy to confuse and even easier to misinterpret in a multi-threaded environment like ours.

The purpose of this document is to specify these concepts:

- A pattern of exchange of messages which in semantic units correspons to the high level function of what a node accomplishes in an exchange.
- Strategies of behavior that a node should adopt in situations like network disconects, timeouts, invalid chunks etc.
- An incentivisation strategy such that constructive behavior should be rewarded and encoraged while deviating from the protocol rules should result in punishing measures.

footnote --
All of this above should resemble the functioning of an FSA

# Protocols

## Retrieval

The retrieval of a chunk is a process which fetches a given chunk from the network by its address. Since Swarm involves a direct storage scheme of fixed size where chunks are stored on nodes with address corresponding to the chunk address the retrieval protocol involves reaching those neighborhoods wherever the request is initiated. Such a route is sure to exist as a result of the Kademlia topology of keep-alive connections between peers. The process of relaying the request from the initiator to the storer is called forwarding and also the process of passing the chunk data along the same path is called backwarding. If we zoom into a particular node in the forwarding path we see the following strategy:

- Receive a retrieve request
- Decide who to forward the request to (decision strategy)
- Have a way to match the the response to the original request

The crucial step is the second one - strategy of choosing the peer to forward the request to and how they react to failure like stream closure or nodes dropping offline or closing the protocol connection and whether we proactively initiate several requests to peers.

Backwarding and Forwarding are both notions defined on a keep alive network of peers as strategies of reaching certain addresses.

The key elemement of these notions is that the decision about the next action is being done on the node level, which will select the next peers(s) and delegate them with handling the request.

The simplest representation of this would be a recursive algoritm that with every iteration gets closer to the target address and stops when it runs out of peers.

### Requirements

- We need a way to ensure that this request has not been received recently (enough) before. Are we dealing with a spamming attack?
- We need a way to determine the "best" candidate peer to forward the request to, and if this option fails, continue with the "next-best" candidate until we exhaust available peers. The decision of picking the "best" peer is delegeate to an overlay driver that has the best knowledge of this peer's past history and performance and topology structure.
- We need a strategy of parallelisation of retrieval requests that we pass downstream, where appropriate. Parallel requests to different peers allow us increase the chances of successfully retrieving the chunk but it comes with the cost of using our bandwidth allowance, so it's imperative to zoom in on an optimal balance between the two.
- We need a way to ensure that when we issue a retrieval request we don’t end up in a situation when this request comes back around to us, wasting network resources.
- In the case when we are a “backwarder” node, we might consider a decision strategy on whether we want to cache the chunk in the event of a repeated request.
- To every forwarding/backwarding exchange we attach an incentivisation action that would take into account variables like the success of the action and the cost of performing the action.
- We need to design the optimal incentivisation scheme, to determine the optimal payment/settlement frequency and correctness of computation of the payment/charged amount. This also applies to both chunk storage scheme and the relayed request-response scheme.
- We need to have a sensible strategy when it comes to waiting for a peer to respond to our retrieval request; as a backwarder, we want to make our best effort to retrieve the chunk but without waiting for an excessive amount of time, which would lead to waste of resources.

### Protocol breach

- If we determine that the requested chunk is non-existing we need a strategy of rate limiting in order to discourage resource wasteful actions.
- Receiving a response in the form of an invalid chunk constitutes a protocol breach and punishing measures are being taken against the peer at fault.
- If we receive a response to an expired request, or we are unable to conclude if such a request has ever been issued, this would be considered a protol breach and punishing measures should be imposed on the upstream peer.

### Retrieve request steps

```markdown
step I
1) check if this exact request has been received withing last N minutes
2) if such request is found and has been satisfied previously DO take punishing measures against the requester (blocklisting)

step II
1) using a given selection strategy (TDB) select a peer from our peer store
2) for each selected peer we execute action 'request chunk' defined below
3) if we exhaust the list of peers (candidates) for this action, return a 'failure to get chunk' response to the requester. We might consider increasing our peer connections pool to avoid such situation in the fugure
4) if we are able to conclude that the chunk is non-existent (TBD) we return 'chunk not found' to the requester and consider rate limiting measures against the requester.
```

### Request chunk from peer

```markdown
1) if we ran out of allowed time while looking for the chunk we return a 'timeout' response to the requester
2) if the chunk is retrieved successfully but does not pass validation, take punishing measures against the peer (blocklisting).
3) if the chunk is valid, log the event details in the local state and return the chunk to the requester
4) consider caching the chunk in case there might be a repeated request for it
5) if the attempt fails, log the relevant attempt details in the local state and repeat the attempt against a new peer
6) if the peer times out responding to our request we log the attempt details and repeat step II against a new peer
```

### Simplified request chunk sequence diagram

```mermaid
sequenceDiagram
    Originator->>+Backwarder: Request for chunk
    Backwarder->>+Backwarder: Have I seen this request before
    Backwarder->>-Originator: Reject duplicate request
    Backwarder->>+Backwarder: Compute a list of candidate peers
    Backwarder->>+Storer: Request for chunk
    Storer->>-Backwarder: Success
    Backwarder->>-Originator: Return chunk
```

### Request chunk flow diagram

```mermaid
flowchart TD
    A[Request received] -->|Check request log| B{Is request duplicate}
    B -->|Yes| Z(Throttle requester) --> I
    B -->|No| D[Compute a list of candidate peers] --> G(Attemp to fetch chunk from the peers)
    G --> H{Any time left?}
    H --> |No| I(Reject request) --> S[STOP]
    H --> |Yes| J(Pick next peer from the list)
    J --> M{Any peers left}
    M --> |Yes| N(Request the chunk from peer) --> K{Check response}
    M --> |No peers left to try| I
    K --> |Timeout| L(Update peer stats) --> J
    K --> |Invalid chunk| N1(Punish peer) --> J
    K --> |Success| R(Return the chunk to the sender) --> S
```

### Sample Implementation

A node is comprised of:

- a request log component.
- a Kademlia table component.
- a persistence component.
- a component for collecting performance statistics.
- a component responsible for accounting.
  
The request log component is something like a ring buffer data structure that captures last N requests with some aditional info like the time of the request and the result of the action.

The Kademlia table is described in this chapter: <a href="/the-book-of-swarm.pdf#subsection.2.1.3" target="_blank" rel="noopener noreferrer">2.1.3 Kademlia routing</a>

When a retrieval request is received it will check if the same exact request has been seen in the last `T` seconds, and depending on the result the request can be accepted, rejected and/or the requester can be punished.

If the request is accepted then the request log is updated by overwriting its the oldest record with the data of the current request.

Next, the persistence component will be invoked to fetch the given chunk from the local disk. If no such address was found, the chunk is requested from the network.

A list of peers is requested from the Kademlia table following some criteria, for simplicity we could use the proximity order alone.

Next we request the chunk from the peer whose address is closest to the chunk address.

If the peer responds within given time and the response contains a valid chunk - we update the request log and return the chunk to the requester.

If the peer fails to produce a valid chunk, we pick the next two peer in order of their closeness to the chunk and repeat the previous step towards each of them in parallel.

If both of them fail to succeed within given time then we double the number of peers (4) and repeat the process.

The process will stop when we run out of peers or one of them manages the return a valid chunk.

Once the process stops the request log is updated once again with the result of the action.

If the request was completed successfully the chunk can be stored in a 'cache' compartment of the persistence component, in the event of future requests of this sort.

The performance statistics and accounting components can be implemented by using the adapter design pattern, where every retrieval request is wrapped in such a way that the low level logic does not known about higher level cross-cutting concerns.

The aformentioned components collaborate with the persistence component to store the performance metrics as well as the accounting data on disk.

Additionally, the Kademlia component can be wrapped in the performance module in such a way that the sole responsibility of the Kademlia table is to take care of the topology in terms of distances and saturation.

So when we request a list of peers from the wrapped Kademlia, the returned list of peers is further sorted by the performance layer that has the knowledge about the reliability of the given peers.

The output is a list of peers that has been sorted twice, first by their proximity to an address and then by their performance and reliability rating.

The resulting component can be further wrapped in the accounting module, so that it removes the peers to whom we are over indebted.

The resulting clean separation of concerns leeds to a code structure that is easier to read and scrutinize, and generally is a more 'future-proof' solution since each component can be changed and tested individually.

### Appendix

The protobuf definitions

```protobuf
message Request {
  bytes Addr = 1;
}

message Delivery {
  bytes Data = 1;
  bytes Stamp = 2;
}
```

## Pushsync

Appendix: the protobuf definitions

## Pullsync

Appendix: the protobuf definitions

## Kademlia

Appendix: the protobuf definitions
