# EndpointsOnLocalSwarmNodeApi

All URIs are relative to *http://localhost:8080/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bzzChunkAddrGet**](EndpointsOnLocalSwarmNodeApi.md#bzzChunkAddrGet) | **GET** /bzz-chunk/{addr} | Get Chunk
[**bzzChunkPost**](EndpointsOnLocalSwarmNodeApi.md#bzzChunkPost) | **POST** /bzz-chunk | Upload Chunk
[**bzzRawAddressGet**](EndpointsOnLocalSwarmNodeApi.md#bzzRawAddressGet) | **GET** /bzz-raw/{address} | Get addressed data
[**bzzRawPost**](EndpointsOnLocalSwarmNodeApi.md#bzzRawPost) | **POST** /bzz-raw | Upload data
[**bzzTagNameNamePost**](EndpointsOnLocalSwarmNodeApi.md#bzzTagNameNamePost) | **POST** /bzz-tag/name/{name} | Create Tag
[**bzzTagUuidUuidGet**](EndpointsOnLocalSwarmNodeApi.md#bzzTagUuidUuidGet) | **GET** /bzz-tag/uuid/{uuid} | Get Tag information using UUid


<a name="bzzChunkAddrGet"></a>
# **bzzChunkAddrGet**
> File bzzChunkAddrGet(addr)

Get Chunk

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addr** | **String**| Bzz address of chunk | [default to null]

### Return type

[**File**](..//Models/file.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/octet-stream, application/problem+json

<a name="bzzChunkPost"></a>
# **bzzChunkPost**
> Hash bzzChunkPost(swarmTagUid, swarmPin, body)

Upload Chunk

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **swarmTagUid** | **String**| UUid of chunk | [optional] [default to null]
 **swarmPin** | **Boolean**| Represents the pinning state of the chunk | [optional] [default to null]
 **body** | **File**|  | [optional]

### Return type

[**Hash**](..//Models/Hash.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/octet-stream
- **Accept**: application/json, application/problem+json

<a name="bzzRawAddressGet"></a>
# **bzzRawAddressGet**
> bzzRawAddressGet(address)

Get addressed data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of content | [default to null]

### Return type

null (empty response body)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/problem+json

<a name="bzzRawPost"></a>
# **bzzRawPost**
> Hash bzzRawPost(body)

Upload data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **File**|  | [optional]

### Return type

[**Hash**](..//Models/Hash.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/octet-stream
- **Accept**: application/json, application/problem+json

<a name="bzzTagNameNamePost"></a>
# **bzzTagNameNamePost**
> NewTagResponse bzzTagNameNamePost(name)

Create Tag

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**| Tagname | [default to null]

### Return type

[**NewTagResponse**](..//Models/NewTagResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="bzzTagUuidUuidGet"></a>
# **bzzTagUuidUuidGet**
> NewTagResponse bzzTagUuidUuidGet(uuid)

Get Tag information using UUid

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uuid** | **String**| UUid | [default to null]

### Return type

[**NewTagResponse**](..//Models/NewTagResponse.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

