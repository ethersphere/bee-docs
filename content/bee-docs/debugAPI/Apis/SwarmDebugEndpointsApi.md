---
aliases:
  - /bee-docs/debugAPI/Apis/SwarmDebugEndpointsApi.html
---
# SwarmDebugEndpointsApi

All URIs are relative to *http://localhost:6060/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**addressesGet**](SwarmDebugEndpointsApi.html#addressesGet) | **GET** /addresses | Get overlay and underlay addresses of the node
[**chunksAddressGet**](SwarmDebugEndpointsApi.html#chunksAddressGet) | **GET** /chunks/{address} | Get chunk address
[**chunksPinAddressDelete**](SwarmDebugEndpointsApi.html#chunksPinAddressDelete) | **DELETE** /chunks-pin/{address} | Unpin chunk with given address
[**chunksPinAddressGet**](SwarmDebugEndpointsApi.html#chunksPinAddressGet) | **GET** /chunks-pin/{address} | Get pinning status of chunk with given address
[**chunksPinAddressPost**](SwarmDebugEndpointsApi.html#chunksPinAddressPost) | **POST** /chunks-pin/{address} | Pin chunk with given address
[**chunksPinGet**](SwarmDebugEndpointsApi.html#chunksPinGet) | **GET** /chunks-pin/ | Get list of pinned chunks
[**connectMultiAddressPost**](SwarmDebugEndpointsApi.html#connectMultiAddressPost) | **POST** /connect/{multiAddress} | Connect to address
[**healthGet**](SwarmDebugEndpointsApi.html#healthGet) | **GET** /health | Get health of node
[**peersAddressDelete**](SwarmDebugEndpointsApi.html#peersAddressDelete) | **DELETE** /peers/{address} | Remove peer
[**peersGet**](SwarmDebugEndpointsApi.html#peersGet) | **GET** /peers | Get a list of peers
[**pingpongPeerIdPost**](SwarmDebugEndpointsApi.html#pingpongPeerIdPost) | **POST** /pingpong/{peer-id} | Try connection to node
[**readinessGet**](SwarmDebugEndpointsApi.html#readinessGet) | **GET** /readiness | Get readiness state of node
[**topologyGet**](SwarmDebugEndpointsApi.html#topologyGet) | **GET** /topology |


<a name="addressesGet"></a>
# **addressesGet**
> Addresses addressesGet()

Get overlay and underlay addresses of the node

### Parameters
This endpoint does not need any parameter.

### Return type

[**Addresses**](..//Models/Addresses.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="chunksAddressGet"></a>
# **chunksAddressGet**
> Response chunksAddressGet(address)

Get chunk address

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of chunk | [default to null]

### Return type

[**Response**](..//Models/Response.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="chunksPinAddressDelete"></a>
# **chunksPinAddressDelete**
> Response chunksPinAddressDelete(address)

Unpin chunk with given address

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of chunk | [default to null]

### Return type

[**Response**](..//Models/Response.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="chunksPinAddressGet"></a>
# **chunksPinAddressGet**
> PinningState chunksPinAddressGet(address)

Get pinning status of chunk with given address

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of chunk | [default to null]

### Return type

[**PinningState**](..//Models/PinningState.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="chunksPinAddressPost"></a>
# **chunksPinAddressPost**
> Response chunksPinAddressPost(address)

Pin chunk with given address

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of chunk | [default to null]

### Return type

[**Response**](..//Models/Response.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="chunksPinGet"></a>
# **chunksPinGet**
> BzzChunksPinned chunksPinGet()

Get list of pinned chunks

### Parameters
This endpoint does not need any parameter.

### Return type

[**BzzChunksPinned**](..//Models/BzzChunksPinned.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="connectMultiAddressPost"></a>
# **connectMultiAddressPost**
> Address connectMultiAddressPost(multiAddress)

Connect to address

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **multiAddress** | **String**| Bzz address of content | [default to null]

### Return type

[**Address**](..//Models/Address.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="healthGet"></a>
# **healthGet**
> Status healthGet()

Get health of node

### Parameters
This endpoint does not need any parameter.

### Return type

[**Status**](..//Models/Status.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="peersAddressDelete"></a>
# **peersAddressDelete**
> Response peersAddressDelete(address)

Remove peer

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of peer | [default to null]

### Return type

[**Response**](..//Models/Response.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="peersGet"></a>
# **peersGet**
> Peers peersGet()

Get a list of peers

### Parameters
This endpoint does not need any parameter.

### Return type

[**Peers**](..//Models/Peers.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="pingpongPeerIdPost"></a>
# **pingpongPeerIdPost**
> RttMs pingpongPeerIdPost(peerId)

Try connection to node

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **peerId** | **String**| Bzz address of peer | [default to null]

### Return type

[**RttMs**](..//Models/RttMs.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="readinessGet"></a>
# **readinessGet**
> Status readinessGet()

Get readiness state of node

### Parameters
This endpoint does not need any parameter.

### Return type

[**Status**](..//Models/Status.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json

<a name="topologyGet"></a>
# **topologyGet**
> BzzTopology topologyGet()



    Get topology of known network

### Parameters
This endpoint does not need any parameter.

### Return type

[**BzzTopology**](..//Models/BzzTopology.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json
