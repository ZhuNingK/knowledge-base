# 单节点kibana安装

### 1、依赖软件：jdk8

### 2、下载kibana

```bash
cd /usr/local/src
wget https://artifacts.elastic.co/downloads/kibana/kibana-8.14.3-linux-x86_64.tar.gz
tar zxvf kibana-8.14.3-linux-x86_64.tar.gz
mv kibana-8.14.3-linux-x86_64 /usr/local/kibana8.14.3
```

### 3、设置kibana账号密码
```bash
/usr/local/elasticsearch-8.14.3/bin/elasticsearch-reset-password -u kibana
```

### 4、设置配置文件

```bash
cd /usr/local/kibana8.14.3
vim config/kibana.yml


server.name: kibana

# kibana的主机地址 0.0.0.0可表示监听所有IP
server.host: "0.0.0.0"
# kibana端口
server.port: 5601

# 这边设置自己es的地址
elasticsearch.hosts: [ "http://**.**.**.**:9200" ]
# 最新版本不允许使用elastic账号
elasticsearch.username: 'kibana'
elasticsearch.password: '********'

# 显示登陆页面
monitoring.ui.container.elasticsearch.enabled: true

# 开启中文模式
i18n.locale: "zh-CN"

```

### 5、创建用户和目录

```bash
# 创建elastic用户
groupadd elastic
useradd elastic -g elastic -p elastic
# 赋权限
chown elastic:elastic -R /usr/local/kibana8.14.3
```

### 6、配置systemd守护

`vim /etc/systemd/system/kibana.service`

```
[Unit]
Description=kibana
After=network.target

[Service]
#Environment="JAVA_HOME=/usr/local/jdk8"
Type=simple
User=elastic
Group=elastic
ExecStart=/usr/local/kibana8.14.3/bin/kibana
Restart=no
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 7、启动

启动kibana并配置自启
```
systemctl daemon-reload
systemctl restart kibana
systemctl status kibana
systemctl enable kibana

```

### 8、验证服务是否可用
```bash
netstat -nltp | grep 5601
```

## 9、访问kibana
前端访问地址：http://IP地址:5601  