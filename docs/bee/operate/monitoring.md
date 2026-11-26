---
title: Monitoring Your Node
id: monitoring
description: Explains how to monitor Bee node metrics using Prometheus and Grafana for tracking cheque rates and network performance.
---

Bee nodes expose runtime metrics in Prometheus format, which you can collect and visualise with Grafana to understand what your Bee has been up to.

Navigate to `http://localhost:1633/metrics`.

The /metrics page shows a snapshot of your Bee node's metrics at the moment you load it.

To make these raw metrics useful, you need to record them over time.

To record Bee's metrics over time, we will use [Prometheus](https://prometheus.io/docs/introduction/overview/). Simply install, configure as follows, and restart!

For Ubuntu and other Debian based Linux distributions install using `apt`:

```bash
sudo apt install prometheus
```

And configure `localhost:1633` as a `target` in the `static_configs`.

```bash
sudo vim /etc/prometheus/prometheus.yml
```

```yaml
static_configs:
  - targets: ["localhost:9090", "localhost:1633"]
```

Navigate to [http://localhost:9090](http://localhost:9090) to see the Prometheus user interface.

Now that our metrics are being scraped into Prometheus' database, we can use it as a data source which is used by [Grafana](https://grafana.com/oss/grafana/) to display the metrics as a time series graph on the dashboard.

Type `bee_` in the 'expression' or 'metrics' field in Prometheus or Grafana respectively to see the list of metrics available. Here's a few to get you started!

```
rate(bee_swap_cheques_received[1d])
rate(bee_swap_cheques_sent[1d])
rate(bee_swap_cheques_rejected[1d])
```

Share your creations in the [#node-operators](https://discord.gg/kHRyMNpw7t) channel of our Discord server!
