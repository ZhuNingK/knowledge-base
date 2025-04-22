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
systemctl status docker
systemctl start docker
systemctl restart docker
systemctl stop doceker

systemctl enable docker
systemctl disable docker
```

#### 3.3 安装docker-compose

```bash
# docker-compose下载地址
https://github.com/docker/compose/releases/download/v2.3.4/docker-compose-linux-x86_64
# 将下载好的安装包上传到服务器后，将文件移动到/usr/local/bin下，并改名为docker-compose
mv docker-compose-Linux-x86_64 /usr/local/bin/docker-compose
# 添加docker-compose文件的执行权限
chmod +x /usr/local/bin/docker-compose
# 创建软链接
ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
# 查看docker-compose版本
docker-compose version
```





