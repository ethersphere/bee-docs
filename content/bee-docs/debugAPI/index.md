---
title: 'debugAPI'
date: 2018-11-28T15:14:39+10:00
weight: 6
summary: "debug API of Bee"
aliases:
  - /bee-docs/API/README.html
---
# Documentation for Swarm Debug API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:6060/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EndpointsOnLocalSwarmNodeApi* | [**tagsPost**](Apis/EndpointsOnLocalSwarmNodeApi.html#tagspost) | **POST** /tags | Create Tag
*EndpointsOnLocalSwarmNodeApi* | [**tagsUuidGet**](Apis/EndpointsOnLocalSwarmNodeApi.html#tagsuuidget) | **GET** /tags/{uuid} | Get Tag information using UUid
*SwarmDebugEndpointsApi* | [**addressesGet**](Apis/SwarmDebugEndpointsApi.html#addressesget) | **GET** /addresses | Get overlay and underlay addresses of the node
*SwarmDebugEndpointsApi* | [**chunksAddressGet**](Apis/SwarmDebugEndpointsApi.html#chunksaddressget) | **GET** /chunks/{address} | Get chunk address
*SwarmDebugEndpointsApi* | [**chunksPinAddressDelete**](Apis/SwarmDebugEndpointsApi.html#chunkspinaddressdelete) | **DELETE** /chunks-pin/{address} | Unpin chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinAddressGet**](Apis/SwarmDebugEndpointsApi.html#chunkspinaddressget) | **GET** /chunks-pin/{address} | Get pinning status of chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinAddressPost**](Apis/SwarmDebugEndpointsApi.html#chunkspinaddresspost) | **POST** /chunks-pin/{address} | Pin chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinGet**](Apis/SwarmDebugEndpointsApi.html#chunkspinget) | **GET** /chunks-pin/ | Get list of pinned chunks
*SwarmDebugEndpointsApi* | [**connectMultiAddressPost**](Apis/SwarmDebugEndpointsApi.html#connectmultiaddresspost) | **POST** /connect/{multiAddress} | Connect to address
*SwarmDebugEndpointsApi* | [**healthGet**](Apis/SwarmDebugEndpointsApi.html#healthget) | **GET** /health | Get health of node
*SwarmDebugEndpointsApi* | [**peersAddressDelete**](Apis/SwarmDebugEndpointsApi.html#peersaddressdelete) | **DELETE** /peers/{address} | Remove peer
*SwarmDebugEndpointsApi* | [**peersGet**](Apis/SwarmDebugEndpointsApi.html#peersget) | **GET** /peers | Get a list of peers
*SwarmDebugEndpointsApi* | [**pingpongPeerIdPost**](Apis/SwarmDebugEndpointsApi.html#pingpongpeeridpost) | **POST** /pingpong/{peer-id} | Try connection to node
*SwarmDebugEndpointsApi* | [**readinessGet**](Apis/SwarmDebugEndpointsApi.html#readinessget) | **GET** /readiness | Get readiness state of node
*SwarmDebugEndpointsApi* | [**topologyGet**](Apis/SwarmDebugEndpointsApi.html#topologyget) | **GET** /topology | Get topology of known network


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Address](.//Models/Address.html)
 - [Addresses](.//Models/Addresses.html)
 - [BzzChunksPinned](.//Models/BzzChunksPinned.html)
 - [BzzChunksPinnedChunks](.//Models/BzzChunksPinnedChunks.html)
 - [BzzTopology](.//Models/BzzTopology.html)
 - [BzzTopologyBins](.//Models/BzzTopologyBins.html)
 - [NewTagResponse](.//Models/NewTagResponse.html)
 - [Peers](.//Models/Peers.html)
 - [PinningState](.//Models/PinningState.html)
 - [Response](.//Models/Response.html)
 - [RttMs](.//Models/RttMs.html)
 - [Status](.//Models/Status.html)



<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
