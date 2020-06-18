---
aliases:
  - /bee-docs/debugAPI/README.md
---
# Documentation for Swarm Debug API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:6060/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EndpointsOnLocalSwarmNodeApi* | [**tagsPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#tagspost) | **POST** /tags | Create Tag
*EndpointsOnLocalSwarmNodeApi* | [**tagsUuidGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#tagsuuidget) | **GET** /tags/{uuid} | Get Tag information using UUid
*SwarmDebugEndpointsApi* | [**addressesGet**](Apis/SwarmDebugEndpointsApi.md#addressesget) | **GET** /addresses | Get overlay and underlay addresses of the node
*SwarmDebugEndpointsApi* | [**chunksAddressGet**](Apis/SwarmDebugEndpointsApi.md#chunksaddressget) | **GET** /chunks/{address} | Get chunk address
*SwarmDebugEndpointsApi* | [**chunksPinAddressDelete**](Apis/SwarmDebugEndpointsApi.md#chunkspinaddressdelete) | **DELETE** /chunks-pin/{address} | Unpin chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinAddressGet**](Apis/SwarmDebugEndpointsApi.md#chunkspinaddressget) | **GET** /chunks-pin/{address} | Get pinning status of chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinAddressPost**](Apis/SwarmDebugEndpointsApi.md#chunkspinaddresspost) | **POST** /chunks-pin/{address} | Pin chunk with given address
*SwarmDebugEndpointsApi* | [**chunksPinGet**](Apis/SwarmDebugEndpointsApi.md#chunkspinget) | **GET** /chunks-pin/ | Get list of pinned chunks
*SwarmDebugEndpointsApi* | [**connectMultiAddressPost**](Apis/SwarmDebugEndpointsApi.md#connectmultiaddresspost) | **POST** /connect/{multiAddress} | Connect to address
*SwarmDebugEndpointsApi* | [**healthGet**](Apis/SwarmDebugEndpointsApi.md#healthget) | **GET** /health | Get health of node
*SwarmDebugEndpointsApi* | [**peersAddressDelete**](Apis/SwarmDebugEndpointsApi.md#peersaddressdelete) | **DELETE** /peers/{address} | Remove peer
*SwarmDebugEndpointsApi* | [**peersGet**](Apis/SwarmDebugEndpointsApi.md#peersget) | **GET** /peers | Get a list of peers
*SwarmDebugEndpointsApi* | [**pingpongPeerIdPost**](Apis/SwarmDebugEndpointsApi.md#pingpongpeeridpost) | **POST** /pingpong/{peer-id} | Try connection to node
*SwarmDebugEndpointsApi* | [**readinessGet**](Apis/SwarmDebugEndpointsApi.md#readinessget) | **GET** /readiness | Get readiness state of node
*SwarmDebugEndpointsApi* | [**topologyGet**](Apis/SwarmDebugEndpointsApi.md#topologyget) | **GET** /topology | Get topology of known network


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Address](.//Models/Address.md)
 - [Addresses](.//Models/Addresses.md)
 - [BzzChunksPinned](.//Models/BzzChunksPinned.md)
 - [BzzChunksPinnedChunks](.//Models/BzzChunksPinnedChunks.md)
 - [BzzTopology](.//Models/BzzTopology.md)
 - [BzzTopologyBins](.//Models/BzzTopologyBins.md)
 - [NewTagResponse](.//Models/NewTagResponse.md)
 - [Peers](.//Models/Peers.md)
 - [PinningState](.//Models/PinningState.md)
 - [Response](.//Models/Response.md)
 - [RttMs](.//Models/RttMs.md)
 - [Status](.//Models/Status.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
