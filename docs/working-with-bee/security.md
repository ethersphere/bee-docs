---
title: Security
id: security
---

:::warning
The restricted APIs feature is experimental, further breaking changes might be introduced in the upcoming releases
:::

Now that you decided to restrict the access to the APIs you should follow the next steps:

* Pick a password that is strong enough.
* Use a bcrypt utility to hash it (you can use `bee bcrypt` command for this purpose [too](TBD))
* Pass the hash to the bee instance using the `--admin-password` command line option (or as a configuration parameter)
* Pick a random string to be used for the `--token-encryption-key` (the same security token can be used against many instances sharing the same encryption key)

## Calling the restricted APIs

### Getting the security token

In order to call any of the restricted APIs the requests have to have a "Bearer" `Authorization` header with a valid security token. The security token can be acquired by calling the `/auth` HTTP endpoint that is protected using [basic authentication](https://www.w3.org/Protocols/HTTP/1.0/spec.html#BasicAA)

To call this endpoint you need to generate an authorization header based on our password. That is achieved by `base64` encoding our password *prepended* with a colon ":" character (since username is empty in our case). So if our password is `s3cret` then you need to `base64(:s3cret)`

The payload is in a json format containing two fields:

* role
* expiry

The `role` field can have one of the four values:

* maintainer
* creator
* auditor
* consumer

The `expiry` field is a numeric value representing the lifetime of the token (in seconds)

#### Example

Let's say our password is `hello`

By base64 encoding `:hello` we get the value `OmhlbGxv`

this is our basic authorization header value that we can use in our payload:


```http
POST {{api}}/auth
Content-Type: application/json
Authorization: Basic OmhlbGxv

{
    "role": "maintainer",
    "expiry": 3600
}
```

Sample response:

```json
{
  "key":"A1UQrbNUK22otp50EsESoJNYkJfrK9H1D4ex4gSWUddx3H/A9VCu8ltS8lVmvSTzoNA=="
}
```

### Refreshing the security token

In order to refresh the token we need to call the `/refresh` endpoint in the same manner as when we are calling any other restricted API endpoint - by putting valid existing token in the http request:

```http
POST {{api}}/refresh
Content-Type: application/json
Authorization: Bearer A1UQrbNUK22otp50EsESoJNYkJfrK9H1D4ex4gSWUddx3H/A9VCu8ltS8lVmvSTzoNA==

{
    "role": "maintainer",
    "expiry": 86400
}
```

In the payload you can specify a different role and token lifetime.

### Note

Some of the API endpoints can not be restricted:

* /health
* /metrics
* /readiness
* /debug/*

They are always going to be available for the user to call.