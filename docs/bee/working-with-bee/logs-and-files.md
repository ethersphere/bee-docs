---
title: Logging in Bee
id: logs-and-files
---

# Logging in Bee

This section provides an overview of logging in Bee, including log locations, exporting logs, managing verbosity levels, and using fine-grained control for specific loggers.

:::info
Bee uses a structured logging format compatible with popular tools such as [Grafana](https://grafana.com/) and [Elasticsearch](https://www.elastic.co/elasticsearch). Structured logging helps streamline log analysis and management by organizing data into machine-readable formats which enable easy integration with monitoring and debugging tools.
:::

:::warning  
Bee logs can be verbose by default, potentially consuming significant disk space over time. Consider implementing [log rotation](https://en.wikipedia.org/wiki/Log_rotation) to prevent excessive disk utilization.
:::


## Log Locations

### **Linux (Package Manager Installation)**
When installed via a package manager (e.g., `APT`, `RPM`), Bee runs as a **systemd service**, and logs are managed by the system journal, **journalctl**.

View logs using:
```bash
journalctl --lines=100 --follow --unit bee
```

Export all logs as JSON:
```bash
journalctl --unit bee --output=json > bee-logs.json
```

Export logs for a specific time range:
```bash
journalctl --since "1 hour ago" --output=json --unit bee > bee-logs.json
```

Learn more about `journalctl` usage and filtering logs in this [tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-journalctl-to-view-and-manipulate-systemd-logs) from DigitalOcean.


### **macOS (Homebrew Installation)**

For a Homebrew installation on macOS, logs are saved to:
```bash
/usr/local/var/log/swarm-bee/bee.log
```

View logs in real time:
```bash
tail -f /usr/local/var/log/swarm-bee/bee.log
```


### **Docker**

Docker saves **stdout** and **stderr** output as JSON files by default. The logs are stored under:

```
/var/lib/docker/containers/<container-id>/<container-id>-json.log
```

View logs in real time:
```bash
docker logs -f <container-name>
```

Export logs to a file:
```bash
docker logs <container-name> > bee-logs.json
```

Export logs for a specific time range:
```bash
docker logs --since "30m" <container-name> > bee-logs.json
```

See [Docker documentation](https://docs.docker.com/reference/cli/docker/container/logs/) for additional options.


### **Shell Script**

For a shell script-installed Bee started using `bee start`, logs are sent to **stdout** and **stderr** by default, which means they will appear in the terminal. They are **not saved to disk by default**.

To save logs to a file, redirect **stdout** and **stderr**:

```bash
bee start --password <password> > bee.log 2>&1 &
```

View recent logs and follow for updates:
```bash
tail -f bee.log
```

## Logging Levels

Bee supports the following log levels:

| Level       | Description                        |
|-------------|------------------------------------|
| `0=silent` | No logs.                           |
| `1=error`  | Critical errors only.              |
| `2=warn`   | Warnings and errors.               |
| `3=info`   | General operational logs (default).|
| `4=debug`  | Detailed diagnostic logs.          |
| `5=trace`  | Highly granular logs for debugging.|

### Behavior of Log Levels

Log levels are cumulative: setting a higher verbosity includes all lower levels.  
For example, `debug` will output logs at `debug`, `info`, `warn`, and `error` levels.


## Setting Verbosity

The general verbosity level can be set using the `verbosity` configuration option in order to display all log messages up to the selected level of verbosity. 

### **YAML Config File**
Set the `verbosity` parameter in `config.yaml`:

```yaml
# Log verbosity: 0=silent, 1=error, 2=warn, 3=info, 4=debug, 5=trace
verbosity: debug
```

### **Command Line Flag**
Specify verbosity when starting Bee:

```bash
bee start --verbosity debug
```

### **Environment Variable**
Set `BEE_VERBOSITY` before starting Bee:

```bash
export BEE_VERBOSITY=debug
bee start
```


## Fine-Grained Logging Control

Bee allows fine-grained control of logging levels for specific subsystems using the **`/loggers` API endpoint**. This enables adjustments without restarting the node.

### **1. Retrieving Loggers List**

Retrieve the list of active loggers and their verbosity levels:
```bash
curl http://localhost:1633/loggers | jq
```

The list of loggers includes detailed entries for each subsystem. Below is an example for the `node/api` logger:

```json
{
  "logger": "node/api",
  "verbosity": "info",
  "subsystem": "node/api[0][]>>824634474528",
  "id": "bm9kZS9hcGlbMF1bXT4-ODI0NjM0NDc0NTI4"
}
```

- **`id`**: The Base64-encoded identifier used to adjust the logger’s verbosity.
- **`verbosity`**: The current log level.


### **2. Adjusting Logger Verbosity**

You can dynamically adjust the log level for any logger without restarting Bee.

**Syntax**:
```bash
curl -X PUT http://localhost:1633/loggers/<id>/<verbosity>
```

- **`<id>`**: The Base64-encoded logger name retrieved from `/loggers`.
- **`<verbosity>`**: Desired log level (`none`, `error`, `warn`, `info`, `debug`, `trace`).

**Example**: Set `node/api` to `debug`:
```bash
curl -X PUT http://localhost:1633/loggers/bm9kZS9hcGlbMF1bXT4-ODI0NjM0NDc0NTI4/debug
```

### Log Level Behavior Note

Log levels are cumulative. When a logger is set to a specific level, it will include all log messages at that level and below.  

For example:
- Setting a logger to `info` will show logs at `info`, `warn`, and `error`.
- Logs at higher levels (`debug` and `trace`) will **not** be displayed.

