for i in {0..69}; do
wget -e robots=off -r -np --page-requisites --no-check-certificate -T10000 -t1 https://bee-${i}.gateway.ethswarm.org/bzz/docs.swarm.eth/
wget -e robots=off -r -np --page-requisites --no-check-certificate -T10000 -t1 https://bee-${i}.gateway.ethswarm.org/bzz/docs.swarm.eth/docs/
done
