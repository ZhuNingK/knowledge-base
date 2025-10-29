# Docker-compose安装

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

> [!TIP]
>
> 官网地址：https://get.daocloud.io/
