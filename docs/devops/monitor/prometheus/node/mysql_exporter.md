# mysql_exporter

## 安装mysql_exporter 0.10.0

```bash
ps -ef | grep mysqld_exporter
cd /usr/local/exporter
tar -zxvf mysqld_exporter-0.18.0.linux-amd64.tar.gz -C mysqld_exporter0.18
rm -rf mysqld_exporter-0.18.0.linux-amd64.tar.gz
```

## 配置mysql_exporter为系统服务

```mysql
CREATE USER 'exporter'@'%' IDENTIFIED BY 'StrongPass@123';
GRANT PROCESS, REPLICATION CLIENT, SELECT ON *.* TO 'exporter'@'%';
FLUSH PRIVILEGES;
```

```bash
netstat -tulnp | grep 9104
```

```bash
vim /usr/local/exporter/mysqld_exporter0.18/my.cnf
```

```yaml
[client]
user=exporter
password=StrongPass@123
host=127.0.0.1
port=3306
```

```bash
chmod 600 /usr/local/exporter/mysqld_exporter0.18/my.cnf
```

```bash
vim /etc/systemd/system/mysqld_exporter.service
```

```ini
[Unit]
Description=Prometheus MySQL Exporter
After=network.target mysql.service
Wants=mysql.service

[Service]
Type=simple
User=root
Group=root

ExecStart=/usr/local/exporter/mysqld_exporter0.18/mysqld_exporter \
  --config.my-cnf=/usr/local/exporter/mysqld_exporter0.18/my.cnf \
  --web.listen-address=:9104 \
  --log.level=info

Restart=always
RestartSec=5
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target

```

## 加载服务

```bash
# 重新加载服务
systemctl daemon-reload
# 设置开机启动
systemctl enable mysqld_exporter  --now
# 查看服务状态
systemctl status mysqld_exporter 
# 启动服务
systemctl start mysqld_exporter 
# 重启服务
systemctl restart mysqld_exporter 
# 停止服务
systemctl stop mysqld_exporter 
```