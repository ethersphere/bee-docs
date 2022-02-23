---
title: Bcrypt hashing utility
id: bcrypt
---

In order to generate a valid admin password hash you can use any available bcrypt compatible tools, both [online](https://bcrypt-generator.com/) and offline (htpasswd).

For convenience Bee also provides a method to generate and validate password hashes:

```sh
$ ./bee bcrypt super$ecret
$2a$10$eZP5YuhJq2k8DFmj9UJGWOIjDtXu6NcAQMrz7Zj1bgIVBcHA3bU5u
$ ./bee bcrypt --check super$ecret '$2a$10$eZP5YuhJq2k8DFmj9UJGWOIjDtXu6NcAQMrz7Zj1bgIVBcHA3bU5u'
OK: password hash matches provided plain text
```

:::info
When validating a hash don't forget about quotes - the ($) hash prefix might interfere with you terminal.
:::
