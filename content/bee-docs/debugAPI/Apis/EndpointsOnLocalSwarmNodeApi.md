---
aliases:
  - /bee-docs/debugAPI/Apis/EndpointsOnLocalSwarmNodeApi.html
---
# EndpointsOnLocalSwarmNodeApi

All URIs are relative to *http://localhost:6060/v1*

Method | HTTP request | Description
------------- | ------------- | -------------
[**tagsPost**](EndpointsOnLocalSwarmNodeApi.html#tagsPost) | **POST** /tags | Create Tag
[**tagsUuidGet**](EndpointsOnLocalSwarmNodeApi.html#tagsUuidGet) | **GET** /tags/{uuid} | Get Tag information using UUid


<a name="tagsPost"></a>
# **tagsPost**
> NewTagResponse tagsPost(name)

Create Tag

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **name** | **String**| Tagname | [default to null]

### Return type

[**NewTagResponse**](..//Models/NewTagResponse.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json

<a name="tagsUuidGet"></a>
# **tagsUuidGet**
> NewTagResponse tagsUuidGet(uuid)

Get Tag information using UUid

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **uuid** | **String**| UUid | [default to null]

### Return type

[**NewTagResponse**](..//Models/NewTagResponse.html)

### Authorization

No authorization required

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: application/json, application/problem+json
