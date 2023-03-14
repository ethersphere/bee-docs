---
title: Connectivity
id: connectivity
---

To fully connect to the swarm, your Bee node needs to be able to both
send and receive messages from the outside world. Normally, your
router will not allow other IP's on the Internet to connect, unless
you have initiated the connection. Bees welcome newcomers in the
swarm, as long as they play by the rules! If a node misbehaves, we
will simply add it to a list of blocked nodes and refuse future
connections from them.

Here at Swarm, every Bee counts! To make sure all Bees can join the
swarm, below you will find a detailed guide to navigating your way
through your network and making out into the wild so you can buzz
around fellow bees and maximise your chances of earning xBZZ. If
you still have problems, please join us in our [Discord
server](https://discord.gg/wdghaQsGq5) and we'll help you find the
way! 🐝 🐝 🐝 🐝 🐝

:::info
To ensure your Bee has the best chance of participating in the swarm,
you must ensure your Bee is able to handle **both incoming and
outgoing connections from the global Internet to its p2p port
(`1634` by default)**. See below for a detailed guide on how to make sure
this is the case, or for the 1337: check your
`http://localhost:1635/addresses` to see which public IP and port
libp2p is advertising and verify its connectivity to the rest of the
Internet! You may need to alter your Bee nodes `nat-addr`
configuration. 🤓
:::

### Networking Basics

In a network, each computer is assigned an IP address. Each IP address
is then subdivided into thousands of _sockets_ or _ports_, each of
which has an incoming and outgoing component.

In a completely trusted network of computers, any connections to or
from any of these ports are allowed. However, to protect ourselves
from nefarious actors when we join the wider Internet, it is sometimes
important to filter this traffic so that some of these ports are off
limits to the public.

In order to allow messages to our p2p port from other Bee nodes that
we have previously not connected, we must ensure that our network is
set up to receive incoming connections (on port `1634` by default).

:::danger
There are also some ports which you should never expose to the outside
Internet. Make sure that your `api-addr` (default `1633`) is only ever
exposed in `Gateway Mode` and your `debug-api-addr` (default `1635`)
is never exposed to the Internet. It is good practice to employ one or
more firewalls that block traffic on every port except for those you
are expecting to be open.
:::

## Your IP Address

When you connect to the Internet, you are assigned a unique number
called an IP Address. IP stands for **Internet Protocol**. The most
prevalent IP version used is _still_ the archaic
[IPv4](https://en.wikipedia.org/wiki/IPv4) which was invented way back
in 1981. IPv6 is available but not well used. Due to the mitigation of
the deficiencies inherent in the IPv4 standard, we may encounter some
complications.

### Datacenters and Computers Connected Directly to the Internet

If you are renting space in a datacenter, the chances are that your computer will be connected directly to the real Internet. This means that the IP of your networking interface will be directly set to be the same as your public IP.

You can investigate this by running:

```bash
ifconfig
```

or

```bash
ip address
```

Your output should contain something like:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 178.128.196.191  netmask 255.255.240.0  broadcast 178.128.207.255
```

Here we can see our computer's **public IP address**
`178.128.196.191`. This is the address that is used by other computers
we connect to over the Internet. We can verify this using a third
party service such as _icanhazip_ or _ifconfig_.

```bash
curl icanhazip.com --ipv4
```

or

```bash
curl ifconfig.co --ipv4
```

The response something contain something like:

```
178.128.196.191
```

With Bee running, try to connect to your Bee's p2p port using the public IP adddress from another computer:

```bash
nc -zv 178.128.196.191 1634
```

If you have success, congratulations!

If this still doesn't work for you, see the last part of _Manual: Configure Your Router and Bee_ section below, as you may need to configure your `nat-addr`.

### Home, Commercial and Business Networks and Other Networks Behind NAT

To address the
[scarcity of IP numbers](https://en.wikipedia.org/wiki/IPv4_address_exhaustion),
Network Address Translation (NAT) was implemented. This approach
creates a smaller, private network which many devices connect to in
order to share a public IP address. Traffic destined for the Internet
at large is then mediated by another specialised computer. In the
cases of the a home network, this computer is the familiar home
router, normally also used to provide a WiFi network.

If we run the above commands to find the computer's IP in this scenario, we will see a different output.

```bash
ip address
```

```
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	...
	inet 192.168.0.10 netmask 0xffffff00 broadcast 192.168.0.255
	...
```

Here we can see that, instead of the public IP address, we can see
that our computer's IP address is `192.168.0.10`. This is part of the
IP address space that the Internet Engineering Task Force has
designated for
[private networks](https://en.wikipedia.org/wiki/Private_network).

As this IP won't work on the global Internet, our router remembers
that our computer has been assigned this IP. It then uses _Network
Address Translation_ (NAT) to modify all requests from our computer to
another computer somewhere in the Internet. As the requests pass
through the router it changes our local IP to the public IP of the
router, and vice versa when the responses are sent back, from the
public IP to the local one.

#### Navigating Through the NAT

The presence of NAT presents two problems for p2p networking.

The first is that it can be difficult for programs running on our computer to know our real public IP as it is not explicitly known by our computer's networking interface, which is configured with a private network IP. This is a relatively easy problem to solve as we can simply discover our public IP and then specify it in Bee's configuration, or indeed determine it using other means.

The second issue is that our router has only 65535 ports to expose to
the public network, however, _each device on your private network_ is
capable of exposing 65535 _each_. To the global Internet, it appears
that there is only one set of ports to connect to, whereas, in actual
fact, there is a full set of ports for each of the devices which are
connected to the private network. To solve this second problem,
routers commonly employ an approach known as _port forwarding_.

Bee's solution to these problems come in two flavours, automatic and manual.

##### Automatic: Universal Plug and Play (UPnP)

UPnP is a protocol designed to simplify the administration of NAT and
port forwarding for the end user by providing an API from which
software running within the network can use to ask the router for the
public IP and to request for ports to be forwarded to the private IP
of the computer running the software.

:::danger UPnP is a security risk!
UPnP is a security risk as it allows any host or process inside
(sometimes also outside) your network to open arbitrary ports which
may be used to transfer malicious traffic, for example a
[RAT](https://en.wikipedia.org/wiki/Remote_desktop_software#RAT). UPnP
can also be used to determine your IP, and in the case of using ToR or
a VPN, your _real_ public IP. We urge you to disable UPnP on your
router and use manual port forwarding as described below.
:::

Bee will use UPnP to determine your public IP, which is required for various internal processes.

In addition to this, a request will be sent to your router to ask it
to forward a random one of its ports, which are exposed directly to
the Internet, to the Bee p2p port (default `1634`) which your computer
is exposing only to the private network. Doing this creates a tunnel
through which other Bee's may connect to your computer safely.

If you start your Bee node in a private network with UPnP available, the output of the addresses endpoint of your Debug API will look something like this:

```json
[
  "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip4/192.168.0.10/tcp/1634/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip6/::1/tcp/1634/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip4/86.98.94.9/tcp/20529/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP"
]
```

Note that the port in the external
[multiaddress](https://docs.libp2p.io/concepts/addressing/) is the
router's randomly selected `20529` which is forwarded by the router to
`192.168.0.10:1634`. These addresses in this multiaddress are also
known as the underlay addresses.

##### Manual: Configure Your Router and Bee

Inspecting the underlay addresses in the output of the addresses
endpoint of our Debug API, we can see addresses only for _localhost_
`127.0.0.1` and our _private network IP_ `192.168.0.10`. Bee must be
having trouble navigating our NAT.

```json
[
  "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/192.168.0.10/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip6/::1/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB"
]
```

To help fix the first problem, let's determine our public IP address.

```bash
curl icanhazip.com
```

```
86.98.94.9
```

Now we can simply supply this IP in our Bee configuration on startup.

Solving our second problem is a little more difficult as we will need to interact with our router's firmware, which is a little cranky.

Each router is different, but the concept is usually the same. Log in to your router by navigating your browser to your router's configuration user interface, usually at [http://192.168.0.1](http://192.168.0.1). You will need to log in with a password. Sadly, passwords are often left to be the defaults, which can be found readily on the Internet.

Once logged in, find the interface to set up port forwarding. The [Port Forward](https://portforward.com/router.htm) website provides some good information, or you may refer to your router manual or provider.

Here, we will then set up a rule that forwards port `1634` of our
private IP address `192.168.0.10` to the same port `1634` of our
public IP.

Now, when requests arrive at our public address `86.98.94.9:1634` they
are modified by our router and forwarded to our private IP and port
`192.168.0.10:1634`.

Sometimes this can be a little tricky, so let's verify we are able to make a TCP connection using [netcat](https://nmap.org/ncat/).

First, with Bee **not** running, let's set up a simple TCP listener using Netcat on the same machine we would like to run Bee on.

```bash
nc -l 0.0.0.0 1634
```

```bash
nc -zv 86.98.94.9 1634
```

```
Connection to 86.98.94.9 port 1834 [tcp/*] succeeded!
```

Success! ✨

If this didn't work for you, check out our Debugging Connectivity guide below.

If it did, let's start our Bee node with the `--nat-addr` configured.

```bash
bee start --nat-addr 86.98.94.9:1634
```

Checking our addresses endpoint again, we can now see that Bee has been able to successfully assign a public address! Congratulations, your Bee is now connected to the outside world!

```json
[
  "/ip4/127.0.0.1/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/192.168.0.10/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip6/::1/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/86.98.94.9/tcp/1634/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB"
]
```

:::info
If you are regularly connecting and disconnecting to a network, you
may also want to use your router's firmware to configure the router to
reserve and only assign the same local network IP from its DHCP pool
to your computer's MAC address. This will ensure that your Bee
seamlessly connects when you rejoin the network!
:::

### Debugging Connectivity

The above guide navigates your NAT, but there are still a few hurdles to overcome. To make sure there is a clear path from your computer to the outside world, let's follow our Bee's journey from the inside out.

Let's set up a netcat listener on all interfaces on the computer we'd
like to run Bee on as we have above.

```bash
nc -l 0.0.0.0 1634
```

Now, let's verify we're able to connect to netcat by checking the connection from our local machine.

```bash
nc -zv 127.0.0.1 1634
```

```
Connection to 127.0.0.1 port 1634 [tcp/*] succeeded!
```

This should be a no brainer, the connection between localhost in not normally mediated.

If there is a problem here, the problem is with some other software running on your operating system or your operating system itself. Try a different port, such as `1734` and turning off any unneccesary software. If this doesn't work, you may need to try a different operating system environment. Please get in touch and we'll try to help!

If we were successful, let's move on to the next stage.

:::info
If you are not able to get access to some firewall settings, or
otherwise debug incoming connectivity, don't worry! All is not
lost. Bee can function just fine with just outgoing
connections. However, if you can, it is worth the effort to allow
incoming connections, as the whole swarm will benefit from the
increased connectivity.
:::

Let's find out what our IP looks like to the Internet.

```bash
curl icanhazip.com
```

```
86.98.94.9
```

Now try to connect to your port using the global IP.

```bash
nc -zv 86.98.94.9 1634
```

If this is successful, our Bee node's path is clear!

If not, we can try a few things to make sure there are no barriers stopping us from getting through.

1. Check your computer's firewall.

Sometimes your computer is configured to prevent connections. If you
are on a private network mediated by NAT, you can check if this is
the problem by trying to connect from another device on your network
using the local IP `nc -zv 192.168.0.10 1634`.

Ubuntu uses [UFW](https://help.ubuntu.com/community/UFW), MacOS can
be configured using the _Firewall_ tab in the _Security & Privacy_
section of _System Preferences_. Windows uses
[Defender Firewall](https://support.microsoft.com/en-us/help/4028544/windows-10-turn-microsoft-defender-firewall-on-or-off).

For each of these firewalls, set a special rule to allow UDP and TCP
traffic to pass through on port `1634`. You may want to limit this
traffic to the Bee application only.

2. Check your ingress' firewall.

For a datacenter hired server, this configuration will often take
place in somewhere in the web user interface. Refer to your server
hosting provider's documentation to work out how to open ports to
the open Internet. Ensure that both TCP and UDP traffic are allowed.

Similarly, if you are connecting from within a private network, you
may find that the port is blocked by the router. Each router is
different, so consult your router's firware documentation to make
sure there are no firewalls in place blocking traffic on your Bee's
designated p2p port.

You may check this using netcat by trying to connect using your
computer's public IP, as above `nc -zv 86.98.94.9 1634`.

3. Docker

Docker adds another level of complexity.

To debug docker connectivity issues, we may use netcat as above to
check port connections are working as expected. Double check that
you are exposing the right ports to your local network, either by
using the command line flags or in your docker-compose.yaml. You
should be able to successfully check the connection locally using
eg. `nc -zv localhost 1634` then follow instructions above to make
sure your local network has the correct ports exposed to the
Internet.

3. Something else entirely?

Networking is a complex topic, but it keeps us all together. If you
still can't connect to your Bee, get in touch via [The
Beehive](http://beehive.ethswarm.org/) and we'll do our best to get
you connected. In the swarm, no Bee is left behind.
