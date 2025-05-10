# Docker

## Linux上Docker部署及使用

### 一、环境准备

>- CentOS 7.9
>- Docker 26.1.4
>- docker-compose 1.18.0

### 二、卸载已有docker

```bash
yum remove -y docker \
                  docker-client \
                  docker-client-latest \
                  docker-common \
                  docker-latest \
                  docker-latest-logrotate \
                  docker-logrotate \
                  docker-selinux \
                  docker-engine-selinux \
                  docker-engine
```

或者

```bash
sudo yum remove docker \
docker-common \
container-selinux \
docker-selinux \
docker-engine
```

> 卸载docker后,/var/lib/docker/目录下会保留原Docker的镜像,网络,存储卷等文件. 如果需要全新安装Docker,需要删除/var/lib/docker/目录
>
> ```bash
> rm -rf /var/lib/docker/
> ```

### 三、安装docker

#### 3.1 配置docker yum源

```bash
# 查看是否已安装了docker，未安装则查询不出结果
yum list installed | grep docker
# 使用yum安装yum-utils工具包
yum install -y yum-utils
# 设置国内的阿里云镜像仓库
yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
```

配置docker镜像源地址：

```bash
tee /etc/docker/daemon.json <<-'EOF'
{
    "registry-mirrors": [
        "https://1nj0zren.mirror.aliyuncs.com",
        "https://docker.mirrors.ustc.edu.cn",
        "http://f1361db2.m.daocloud.io",
        "https://registry.docker-cn.com"
    ]
}
EOF

systemctl daemon-reload
```

#### 3.2 安装docker

安装docker

```bash
# 查看所有可用的docker版本:
yum list docker-ce --showduplicates | sort -r

yum -y install  docker-ce-26.1.4-1.el7

docker version

# 安装docker命令补全工具：
yum install -y bash-completion

```

docker常用命令

```bash
# 查看docker服务状态
systemctl status docker
# 启动docker服务
systemctl start docker
# 重启docker服务
systemctl restart docker
# 停止docker服务
systemctl stop doceker
# 开机docker开机自启
systemctl enable docker
# 关闭docker开机自启
systemctl disable docker

# 查找应用
docker search rabbitmq
# 拉取镜像
docker pull rabbitmq
# 查看镜像
docker images
# 删除镜像
docker rmi [IMAGE ID]
#查看启动的容器
docker ps -a
# 启动docker
docker start [IMAGE]/[name]

7、停止docker：docker stop [IMAGE]/[name]

8、删除docker：docker rm [IMAGE]/[name]

9、查看日志：docker logs [name]

10、进入docker容器：docker exec -it [容器id或容器名] /bin/bash

11、退出容器到宿主机：exit

12、修改镜像名称：docker tag 原镜像名称 新镜像名称

13、docker inspect [容器id或容器名]

14、docker update
```





