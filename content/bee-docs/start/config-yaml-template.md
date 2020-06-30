
``` yaml
# Bee config template
# Date of generation: 30 June 2020

# HTTP API listen address (default ":8080")
api-addr: :8083
# initial nodes to connect to (default [/dnsaddr/bootnode.ethswarm.org])
bootnode: [/dnsaddr/bootnode.ethswarm.org]
# data directory (default "/home/<user>/.bee")
data-dir: ~/.bee
# db capacity in chunks, multiply by 4096 to get approximate capacity in bytes
db-capacity: 5000000
# debug HTTP API listen address (default ":6060")
debug-api-addr: :6060
# enable debug HTTP API (true / false)
enable-debug-api : false
# NAT exposed address
nat-addr: ""
# ID of the Swarm network (default 1)
network-id: 1
# P2P listen address (default ":7070")
p2p-addr: :7070
# disable P2P QUIC protocol (enable / disable)
p2p-disable-quic: disable
# disable P2P WebSocket protocol (enable / disable)
p2p-disable-ws: disable
# password for decrypting keys
password: ""
# path to a file that contains password for decrypting keys
password-file: ""
# enable tracing (true / false)
tracing: false
# endpoint to send tracing data (default "127.0.0.1:6831")
tracing-endpoint: 127.0.0.1:6831
# service name identifier for tracing
tracing-service-name: "bee"
# log verbosity level 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace (default "info")
verbosity: 3
```
