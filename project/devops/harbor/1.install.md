# Harbor

## Linux上Harbor部署及使用

[Harbor](https://so.csdn.net/so/search?q=Harbor&spm=1001.2101.3001.7020)是用于存储和分发Docker镜像的镜像仓库服务。

### 一、环境介绍

>- CentOS 7.9
>- Docker 26.1.4
>- docker-compose 1.18.0
>- harbor 2.13.0

>192.168.1.15（harbor所在机器）
>
>192.168.1.11（拉取harbor镜像的机器）

### 二、[安装docker/docker-compose](../docker/%E5%AE%89%E8%A3%85%E6%89%8B%E5%86%8C.md)

### 三、安装Harbor

#### 1、下载

Harbor部署https访问、域名访问。在这里我们采用离线安装包的方式来安装Harbor，可以避免在线安装时网络的影响。

在页面 [Releases · goharbor/harbor · GitHub](https://github.com/goharbor/harbor/releases) ，选择最新版本 并下载：[harbor-offline-installer-v2.13.0.tgz](https://github.com/goharbor/harbor/releases/download/v2.13.0/harbor-offline-installer-v2.13.0.tgz)

```bash
cd /usr/local/src
wget https://github.com/goharbor/harbor/releases/download/v2.13.0/harbor-offline-installer-v2.13.0.tgz
tar -zxvf harbor-offline-installer-v2.14.0.tgz
```

生成yml文件

```bash
cd /usr/local/src/harbor2.13
cp harbor.yml.tmpl harbor.yml
vim harbor.yml
```

```yaml
## 改为主机ip或者域名
hostname: 127.0.0.1

## 绑定主机端口
port: 88

## admin管理员登录密码
harbor_admin_password: 123456

## 数据卷目录
data_volume: /data/harbor

## 没有证书的话先关闭https
#https:
  # https port for harbor, default is 443
  #port: 443
  # The path of cert and key files for nginx
  #certificate: /your/certificate/path
  #private_key: /your/private/key/path
```

```
cd /usr/local/src/harbor2.13
./install.sh

docker-compose ps
```

