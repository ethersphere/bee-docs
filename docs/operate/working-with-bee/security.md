---
title: Security
id: security
---

:::warning
The restricted APIs feature is experimental, further breaking changes might be introduced in the upcoming releases
:::

:::warning
Only a subset of endpoints running on `:1633` can be restricted. This is subject to change in the future releases.
:::

Now that you decided to restrict the access to the APIs you should follow the next steps:

* Pick a password that is strong enough.
* Use a bcrypt utility to hash it (you can use `bee bcrypt` command for this purpose [bcrypt utility](/docs/operate/working-with-bee/bcrypt)
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

:::info
There is an inheritance relationship between roles: consumer ⊆ creator ⊆ accountant ⊆ maintainer
Maintainer role is universal - it's the superset of all permissions belonging to other roles.
:::

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

### A note on the HTTP endpoints

There are three major groups:

* technical debug endpoints
  * /readiness
  * /node
  * /addresses
  * /chainstate
  * /debug/pprof
  * /debug/vars
  * /health
* business related endpoints residing on the debug port
  * /peers
  * /pingpong/{peer-id}
  * /reservestate
  * /connect/{address}
  * /blocklist
  * /peers/{address}
  * /chunks/{address}
  * /topology
  * /welcome-message
  * /balances
  * /balances/{peer}
  * /consumed
  * /consumed/{peer}
  * /timesettlements
  * /settlements
  * /settlements/{peer}
  * /chequebook/cheque/{peer}
  * /chequebook/cheque
  * /chequebook/cashout/{peer}
  * /chequebook/balance
  * /chequebook/address
  * /chequebook/deposit
  * /chequebook/withdraw
  * /wallet
  * /stamps
  * /stamps/{id}
  * /stamps/{id}/buckets
  * /stamps/{amount}/{depth}
  * /stamps/topup/{id}/{amount}
  * /stamps/dilute/{id}/{depth}
  * /batches
  * /tags/{id}
* API endpoints
  * /bytes
  * /bytes/{address}
  * /chunks
  * /chunks/stream
  * /chunks/{address}
  * /soc/{owner}/{id}
  * /feeds/{owner}/{topic}
  * /bzz
  * /bzz/{address}
  * /bzz/{address}/{path}
  * /pss/send/{topic}/{targets}
  * /pss/subscribe/{topic}
  * /tags
  * /tags/{id}
  * /pins
  * /pins/{reference}
  * /stewardship/{address}
  * /auth
  * /refresh

The user can toggle the debug port by setting the appropriate boolean value on `debug-api-enable` configuration parameter.
If the value is `false` (default) then the first two groups of endpoints will not be available.

Once we toggle the `restricted` flag to `true` - two things are going to happen:

* it will expose the debug business related endpoints on the API port
* it will restrict the access to them based on the security configuration provided.

:::info
Toggling the restricted flag ON will not remove the business related endpoints from the debug port, nor will it restrict them there.
:::

### The order in which HTTP endpoints become available

The technical debug endpoints group will be the first to become available - as soon as its dependencies come online (within seconds).
The other two groups will become available at a later stage, specifically after the postage syncing is done.
Requests to a non technical debug endpoint before it becomes available will be rejected with a `404` http response code.
