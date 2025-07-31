# Docker images

```bash
# 下载镜像
docker pull nginx:latest

# 保存镜像到本地文件tmp
docker save -o nginx_latest.tar nginx:latest

# 将本地文件tmp加载为镜像
docker load -i nginx_latest.tar

# 将docker镜像配置tag
docker tag nginx:latest mynginx:latest

# 将镜像推送到harbor仓库
docker tag nginx:latest harbor.example.com/myproject/nginx:latest

# 查看本地镜像
docker images

# 删除镜像
docker rmi nginx:latest

```