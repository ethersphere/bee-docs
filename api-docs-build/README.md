# Documentation for Swarm API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EndpointsOnLocalSwarmNodeApi* | [**bzzChunkAddrGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzzchunkaddrget) | **GET** /bzz-chunk/{addr} | Get Chunk
*EndpointsOnLocalSwarmNodeApi* | [**bzzChunkPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzzchunkpost) | **POST** /bzz-chunk | Upload Chunk
*EndpointsOnLocalSwarmNodeApi* | [**bzzRawAddressGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzzrawaddressget) | **GET** /bzz-raw/{address} | Get addressed data
*EndpointsOnLocalSwarmNodeApi* | [**bzzRawPost**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzzrawpost) | **POST** /bzz-raw | Upload data
*EndpointsOnLocalSwarmNodeApi* | [**bzzTagNameNamePost**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzztagnamenamepost) | **POST** /bzz-tag/name/{name} | Create Tag
*EndpointsOnLocalSwarmNodeApi* | [**bzzTagUuidUuidGet**](Apis/EndpointsOnLocalSwarmNodeApi.md#bzztaguuiduuidget) | **GET** /bzz-tag/uuid/{uuid} | Get Tag information using UUid


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Hash](.//Models/Hash.md)
 - [NewTagResponse](.//Models/NewTagResponse.md)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
