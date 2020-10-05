---
title: Connectivity
id: connectivity
---


To connect to the outside world, your Bee node needs to be able to both send and receive messages from the outside world. Normally, your router will not allow other IP's on the internet to connect, unless you have connected to them first. In Swarm, we welcome newcomers, as long as they play by the rules. If a node misbehaves, we will simply add it to a list of blocked nodes and refuse future connections from them.

In Swarm, every Bee counts! To make sure all Bees can join the swarm, below you will find a detailed guide to navigating your way through your network and making out into the wild so you can buzz with the crowd. If you still have problems, join us in [The Beehive](http://beehive.ethswarm.org/) and we'll help you find the way! 🐝 🐝 🐝 🐝 🐝

### Networking Basics

In a network, each computer is assigned an IP. Each IP is then subdivided into thousands of *sockets* or *ports*, each of which has an incoming and outgoing component.

In a completely trusted network of computers, connections to or from any of these ports are allowed. However, to protect ourselves from nefarious actors when we join the wider internet, it is sometimes important to filter this traffic so that some of these ports are off limits to the public.

In order to allow other Bee nodes we have previously not met to be able to send messages to our p2p port, usually `7070`, we must ensure that our network is set up to receive incoming connections.

:::info
There are also some ports which you should never expose to the outside internet. Make sure that your `api-addr`, usually port `8080` is only exposed in `Gateway Mode` and your `--debug-api-addr`, usually `6060` is never exposed to the internet. It is good practice to employ one or more firewalls which block traffic on every port except for those for whom you are expecting it.
:::

## Your IP

When you connect to the internet, you are assigned a unique number called an IP Address. IP stands for **Internet Protocol**. The most prevalent IP version used is *still* the archaic [IPv4](https://en.wikipedia.org/wiki/IPv4) which was invented way back in 1981. IPv6 is available but not well used. Due to the mitigation of the deficiencies within this standard, we may encounter some complications.


### Datacenters and Computers Connected Directly to the Internet

If you are renting space in a datacenter, the chances are that your computer will be connected directly to the real internet. This means that the IP of your networking interface will be directly set to be the same as your public IP.

You can investigate this by running:

```sh
ifconfig
```

or 

```sh
ip address
```

Your output should contain something like:

```
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 178.128.196.191  netmask 255.255.240.0  broadcast 178.128.207.255
```

Here we can see our computer's **public IP** `178.128.196.191`. This is the address that is used by other computers we connect to over the internet. We can very this using a third party service such as *icanhazip*.

```sh
curl icanhazip.com
```

```
178.128.196.191
```

If these numbers correspond, congratulations! You may skip the next section!

### Home, Commercial and Business Networks and Other Networks Behind NAT

To address the [scarcity of IP numbers](https://en.wikipedia.org/wiki/IPv4_address_exhaustion), Network Address Translation (NAT) was implemented. This approach creates a smaller, private network which many devices connect to in order to share a public IP. Traffic destined for the internet at large is then mediated by another specialised computer. In the cases of the a home network, this computer is the familiar home router, normally also used to provide a wifi network.

If we run the above commands to find the computer's IP in this scenario, we will see a different output.

```sh
ip address
```

```
en0: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
	...
	inet 192.168.0.10 netmask 0xffffff00 broadcast 192.168.0.255
	...
```

Here we can see that, instead of the public IP, we can see that our computers IP is `192.168.0.10`. This is part of the IP address space that the Internet Engineering Task Force has designated for [private networks](https://en.wikipedia.org/wiki/Private_network). 

As this IP won't work on the global internet, our router remembers that our computer has been assigned this IP. It then uses Network Address Translation to modify all requests from our computer to another computer somewhere in the internet. As the requests pass through the router it changes our local IP to the public IP of the router, and vice versa when the responses are sent back, from the public IP to the local one.

#### Navigating Through the NAT

The presence of Network Address Translations presents two problems for p2p networking. 

The first is that it can be difficult for programs running on our computer to know our real public IP as it is not explicitly known by our computer's networking interface, which is configured with a private network IP. This is a relatively easy problem to solve as we can simply discover our public IP and then specify it in Bee's configuration, or indeed determine it using other means.

The second issue is that our router has only 65535 ports to expose to the public network, however, *each device on your private network* is capable of exposing 65535 *each*. To the global internet, it appears that there is only one set of ports to connect to, whereas, in actual fact, there is a full set of ports for each of the devices which are connected to the private network. To solve this second problem, routers commonly employ an approach known as *port forwarding*.

Bee's solution to these problems come in two flavours, automatic and manual.

##### Automatic: Universal Plug and Play (UPNP)

UPNP is a protocol designed to simplify the administration of NAT and port forwarding by the end user by providing an API which software running within the network can use to ask the router for the external IP and to request for ports to be forwarded to the internal IP of the computer running the software.

```danger
UPNP can be considered a security risk as it exposes your (real) public IP to any processes running on your computer, and also allows them to open arbitrary ports which may be used to transfer malicious traffic, for example a [RAT](https://en.wikipedia.org/wiki/Remote_desktop_software#RAT). We recommend you disable UPNP on your router and use manual port forwarding as described below.
```

Bee will use UPNP to determine your public IP, which is required for various internal processes.

In addition to this, a request will be sent to your router to ask it to forward a random one of it's ports, which are exposed directly to the internet, to the Bee p2p port (usually `7070`) which your computer is exposing only to the private network. Doing this creates a tunnel through which other Bee's may connect to your computer safely.

If you start your Bee node in a private network with UPNP available, the output of the addresses endpoint of your debug API will look something like this:

```json
[
  "/ip4/127.0.0.1/tcp/7072/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip4/192.168.0.10/tcp/7072/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip6/::1/tcp/7072/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP",
  "/ip4/86.98.94.9/tcp/20529/p2p/16Uiu2HAm5zcoBFWmqjDTwGy9RXepBFF8idy6Pr312obMwwxdJSUP"
]
```

Note that the port in the external [multiaddress](https://docs.libp2p.io/concepts/addressing/) is the router's randomly selected `20529` which is forwarded by the router to `192.168.0.10:7070`.

##### Manual: Configure Your Router and Bee

Inspecting the underlay addresses in the output of the addresses endpoint our debug API, we can see addresses only for *localhost* `127.0.0.1` and our *private network IP* `192.168.0.10`. Bee must be having trouble navigating our NAT.

```sh
[
  "/ip4/127.0.0.1/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/192.168.0.10/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip6/::1/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
]
```

To help fix the first problem, let's determine our public IP.

```sh
curl icanhazip.com
```

```
86.98.94.9
```

Now we can simply supply this IP in our Bee configuration on startup.

Solving our second problem is a little more difficult as we will need to interact with our router's firmware, which is a little cranky.

Each router is different, but the concept is usually the same. Log in to your router by navigating your browser to your router's configuration user interface, usually at [http://192.168.0.1](http://192.168.0.1). You will need to log in with a password. Sadly, passwords are often left to be the defaults, which can be found readily on the internet.

Once logged in, find the interface to set up port forwarding. The [Port Forward](https://portforward.com/router.htm) website provides some good information, or you may refer to your router manual or provider.

Here, we will then set up a rule that forwards port `7070` of our internal IP `192.168.0.10` to the same port `7070` of our external IP.

Now, when requests arrive at our external address `86.98.94.9:7070` they are modified by our router and forwarded to our internal IP and port `192.168.0.10:7070`.

Sometimes this can be a little tricky, so let's verify we are able to make a TCP connection using [netcat](https://nmap.org/ncat/).

First, with Bee **not** running, let's set up a simple TCP listener using Netcat on the same machine we would like to run Bee on.

```sh
nc -l 0.0.0.0 7070
```

```sh
nc -zv 86.98.94.9 7070
```

```
Connection to 86.98.94.9 port 7072 [tcp/*] succeeded!
```
Success! ✨

If this didn't work for you, check out our [Debugging Connectivity]() guide below.

If it did, let's start our Bee node with the `--nat-addr` configured.

```sh
bee start --nat-addr 86.98.94.9:7070
```

Checking our addresses endpoint again, we can now see that Bee has been able to successfully assign a public address! Congratulations, your Bee is now connected to the outside world!

```sh
[
  "/ip4/127.0.0.1/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/192.168.0.10/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip6/::1/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB",
  "/ip4/86.98.94.9/tcp/7070/p2p/16Uiu2HAm8Hs91MzWuXfUyKrYaj3h8K8gzvRqzSK5gP9TNCwypkJB"
]
```

:::info
If you are regularly connecting and disconnecting to a network, you may also want to use your router's firmware to configure the router to reserve and only assign the same local network IP from it's DHCP pool to your computer's MAC address. This will ensure that your Bee seamlessly connects when you rejoin the network!
:::

### Debugging Connectivity

The above guide navigates your NAT, but there are still a few hurdles to overcome. To make sure there is a clear path from your computer to the outside world, let's follow our Bee's journey from the inside out.

Let's set up a Netcat listener on all interfaces on the computer we'd like to run Bee on as we have above.

```sh
nc -l 0.0.0.0 7070
```

Now, let's verify we're above to test this by checking the connection on our local machine.

```sh
nc -zv 127.0.0.1 7070
```

```
nc -zv 127.0.0.1 7070
Connection to 127.0.0.1 port 7070 [tcp/*] succeeded!
```

This should be a no brainer, the connection between localhost in not normally mediated. 

If there is a problem here, the problem is with some other software running on your operating system or your operating system itself. Try a different port, such as `7071` and turning off any unneccesary software. If this doesn't work, you may need to try a different operating system environment. Please get in touch and we'll try to help!

If we were successful, let's move on to the next stage.

Let's find out what our IP looks like to the internet.

```sh
curl icanhazip.com
```

```
86.98.94.9
```

Now try to connect to your port using the global IP.

```sh
nc -zv 86.98.94.9 7070
```

If this is successful, our Bee node's path is clear!

If not, we can try a few things to make sure there are no barriers stopping us from getting through.

1. Check your computers firewall.

Sometimes your computer is configured to prevent connections. If you are on a private network mediated by NAT, you can check if this is the problem by trying to connect from another device on your network using the local IP `nc -zv 192.168.0.10 7070`.

Ubuntu uses [UFW](https://help.ubuntu.com/community/UFW), MacOS can be configured using the *Firewall* tab in the *Security & Privacy* section of *System Preferences*. Windows uses [Defender Firewall](https://support.microsoft.com/en-us/help/4028544/windows-10-turn-microsoft-defender-firewall-on-or-off).

For each of these firewalls, set a special rule to allow UDP and TCP traffic to pass through on port `7070`. You may want to limit this traffic to the Bee application only.

2. Check your ingress firewall.

For a datacenter hired server, this configuration will often take place in somewhere in the web user interface. Refer to your server hosting provider's documentation to work out how to open ports to the open internet. Ensure that both TCP and UDP traffic are allowed.

Similarly, if you are connecting from within a private network, you may find that the port is blocked by the router. Each router is different, so consult your router's firware documentation to make sure there are no firewalls in place blocking traffic on your Bee's designated p2p port.

You may check this using Netcat by trying to connect using your computer's public IP, as above `nc -zv 86.98.94.9 7070`.

3. Docker

Docker adds another level of complexity. 

To debug docker connectivity issues, we may use netcat as above to check port connections are working as expected. Double check that you are exposing the right ports to your local network, either by using the command line flags or in your docker-compose.yaml. You should be able to successfully check the connection locally using eg. `nc -zv localhost 7070` then follow instructions above to make sure your local network has the correct ports exposed to the internet.

3. Something else entirely?

Networking is a complex topic, but it keeps us all together. If you still can't connect to your Bee, get in touch via [The Beehive](http://beehive.ethswarm.org/) and we'll do our best to get you connected. In the swarm, no Bee is left behind. 


