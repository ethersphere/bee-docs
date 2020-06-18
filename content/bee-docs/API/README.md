---
aliases:
  - /bee-docs/API/README.md
---
# Documentation for Swarm API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EndpointsOnLocalSwarmNodeApi* | [**bytesAddressGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#bytesaddressget) | **GET** /bytes/{address} | Get addressed data
*EndpointsOnLocalSwarmNodeApi* | [**bytesPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#bytespost) | **POST** /bytes | Upload data
*EndpointsOnLocalSwarmNodeApi* | [**chunksAddrGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#chunksaddrget) | **GET** /chunks/{addr} | Get Chunk
*EndpointsOnLocalSwarmNodeApi* | [**chunksAddrPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#chunksaddrpost) | **POST** /chunks/{addr} | Upload Chunk
*EndpointsOnLocalSwarmNodeApi* | [**filesAddressGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#filesaddressget) | **GET** /files/{address} | Get addressed data
*EndpointsOnLocalSwarmNodeApi* | [**filesPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#filespost) | **POST** /files | Upload data


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Hash](.//Models/Hash.md)
 - [Reference](.//Models/Reference.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
