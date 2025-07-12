# Nacos 部署（集群）

## 环境准备

| node-1            | node-2            | node-3            |
| ----------------- | ----------------- | ----------------- |
| 192.168.0.11:8848 | 192.168.0.12:8848 | 192.168.0.13:8848 |

确保各节点均已安装 Nacos 服务。

## 配置节点

各节点编辑配置文件：

```bash
vim /usr/local/nacos2.1/conf/cluster.conf
```

修改文件内容为各节点 ip 及端口：

```bash
192.168.0.11:8848
192.168.0.12:8848
192.168.0.13:8848
```

## 调整启动命令并重启服务

1. **调整 nacos 服务启动脚本**

   各节点编辑启动脚本文件：

   ```bash
   vim /etc/systemd/system/nacos.service
   ```

   调整内容：

   ```bash
   [Unit]
   Description=Nacos
   After=network.target

   [Service]
   Type=forking
   Environment="JAVA_HOME=/usr/local/jdk1.8.0_251"
   WorkingDirectory=/usr/local/nacos2.1/bin/
   ExecStart=/usr/local/nacos2.1/bin/startup.sh
   ExecStop=/usr/local/nacos2.1/bin/shutdown.sh
   Restart=always

   [Install]
   WantedBy=multi-user.target
   ```

   > **注意：**
   >
   > 需注意修改 JAVA_HOME 路径为 JDK 的实际安装路径。

2. **重载配置并重启服务**

   ```bash
   systemctl daemon-reload
   systemctl restart nacos
   ```
   
   此时即可通过各个节点的 IP 及端口访问 Nacos 集群（可通过使用 Nginx+Keepalived 的方式实现高可用负载均衡）。