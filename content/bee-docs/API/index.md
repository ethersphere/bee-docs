---
title: 'API'
date: 2018-11-28T15:14:39+10:00
weight: 6
summary: "API of Bee"
aliases:
  - /bee-docs/API/README.html
---
# Documentation for Swarm API

<a name="documentation-for-api-endpoints"></a>
## Documentation for API Endpoints

All URIs are relative to *http://localhost:8080/v1*

Class | Method | HTTP request | Description
------------ | ------------- | ------------- | -------------
*EndpointsOnLocalSwarmNodeApi* | [**bytesAddressGet**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#bytesaddressget) | **GET** /bytes/{address} | Get addressed data
*EndpointsOnLocalSwarmNodeApi* | [**bytesPost**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#bytespost) | **POST** /bytes | Upload data
*EndpointsOnLocalSwarmNodeApi* | [**chunksAddrGet**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#chunksaddrget) | **GET** /chunks/{addr} | Get Chunk
*EndpointsOnLocalSwarmNodeApi* | [**chunksAddrPost**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#chunksaddrpost) | **POST** /chunks/{addr} | Upload Chunk
*EndpointsOnLocalSwarmNodeApi* | [**filesAddressGet**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#filesaddressget) | **GET** /files/{address} | Get addressed data
*EndpointsOnLocalSwarmNodeApi* | [**filesPost**](/bee-docs/API/EndpointsOnLocalSwarmNodeApi.html#filespost) | **POST** /files | Upload data


<a name="documentation-for-models"></a>
## Documentation for Models

 - [Hash](/bee-docs/API/Hash.html)
 - [Reference](/bee-docs/API/Reference.html)


<a name="documentation-for-authorization"></a>
## Documentation for Authorization

All endpoints do not require authorization.
