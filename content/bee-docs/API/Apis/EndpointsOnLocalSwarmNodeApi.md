# EndpointsOnLocalSwarmNodeApi

All URIs are relative to *http://localhost:8080/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**bytesAddressGet**](EndpointsOnLocalSwarmNodeApi.md#bytesAddressGet) | **GET** /bytes/{address} | Get addressed data
[**bytesPost**](EndpointsOnLocalSwarmNodeApi.md#bytesPost) | **POST** /bytes | Upload data
[**chunksAddrGet**](EndpointsOnLocalSwarmNodeApi.md#chunksAddrGet) | **GET** /chunks/{addr} | Get Chunk
[**chunksAddrPost**](EndpointsOnLocalSwarmNodeApi.md#chunksAddrPost) | **POST** /chunks/{addr} | Upload Chunk
[**filesAddressGet**](EndpointsOnLocalSwarmNodeApi.md#filesAddressGet) | **GET** /files/{address} | Get addressed data
[**filesPost**](EndpointsOnLocalSwarmNodeApi.md#filesPost) | **POST** /files | Upload data


<a name="bytesAddressGet"></a>
# **bytesAddressGet**
> File bytesAddressGet(address)

Get addressed data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of content | [default to null]

### Return type

[**File**](..//Models/file.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/octet-stream, application/problem+json

<a name="bytesPost"></a>
# **bytesPost**
> Reference bytesPost(body)

Upload data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **File**|  | [optional]

### Return type

[**Reference**](..//Models/Reference.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: application/octet-stream
- **Accept**: application/json, application/problem+json

<a name="chunksAddrGet"></a>
# **chunksAddrGet**
> File chunksAddrGet(addr)

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

<a name="chunksAddrPost"></a>
# **chunksAddrPost**
> Hash chunksAddrPost(addr, swarmTagUid, swarmPin, body)

Upload Chunk

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **addr** | **String**| Bzz address of chunk | [default to null]
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

<a name="filesAddressGet"></a>
# **filesAddressGet**
> Object filesAddressGet(address)

Get addressed data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **address** | **String**| Bzz address of content | [default to null]

### Return type

[**Object**](..//Models/object.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: multipart/form-data, file, application/problem+json

<a name="filesPost"></a>
# **filesPost**
> Reference filesPost(file)

Upload data

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **file** | **List**|  | [optional] [default to null]

### Return type

[**Reference**](..//Models/Reference.md)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: multipart/form-data, file
- **Accept**: application/json, application/problem+json

