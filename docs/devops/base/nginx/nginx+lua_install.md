# Nginx+Lua安装

最新稳定版：https://nginx.org/en/download.html

> [!WARNING]
>
> 采用在访问路径中添加“private”标识的方式进行授权访问。因此，**Nginx 的 Lua 扩展仅需部署在最外层代理服务器上即可实现授权校验**，从而简化了整体部署流程。此外，**接口缓存功能也可以在这一层实现**，无需对业务代码进行大幅改动，即可有效提升系统的并发处理能力。

> [!TIP]
>
> - 源码包统一放置于 /usr/local/src 目录
> - 软件安装到 /usr/local 中，并以软件名及主次版本号命名，如 nginx1.24

------

## 一、安装必要的库

```bash
yum -y install pcre pcre-devel zlib zlib-devel
```

> [!TIP]
>
> - 使用正则表达式需要安装 pcre & pcre-devel
> - 使用 gzip 压缩需要安装 zlib & zlib-devel

------

## 二、安装Lua及相关包

### 1.安装LuaJIT2.1

```bash
cd /usr/local/src

wget https://github.com/openresty/luajit2/archive/refs/tags/v2.1-20230410.tar.gz -O luajit-2.1.tar.gz
tar -zxvf  luajit-2.1.tar.gz

# 编译安装
cd /usr/local/src/luajit2-2.1-20230410
make && make install PREFIX=/usr/local/luajit2.1

# 设置 LuaJIT 环境变量
echo 'export LUAJIT_LIB=/usr/local/luajit2.1/lib
export LUAJIT_INC=/usr/local/luajit2.1/include/luajit-2.1' >> /etc/profile

# 刷新环境变量
source /etc/profile
```

### 2.安装ngx_devel_kit

```bash
cd /usr/local/src
wget https://github.com/vision5/ngx_devel_kit/archive/refs/tags/v0.3.2.tar.gz -O ngx_devel_kit-0.3.2.tar.gz
tar -zxvf ngx_devel_kit-0.3.2.tar.gz
```

### 3.安装lua-nginx-module

```bash
cd /usr/local/src
wget https://github.com/openresty/lua-nginx-module/archive/refs/tags/v0.10.24.tar.gz -O lua-nginx-module-0.10.24.tar.gz
tar -zxvf lua-nginx-module-0.10.24.tar.gz
```

### 4.安装lua-resty-core

```bash
cd /usr/local/src
wget https://github.com/openresty/lua-resty-core/archive/refs/tags/v0.1.26.tar.gz -O lua-resty-core-0.1.26.tar.gz
tar -zxvf lua-resty-core-0.1.26.tar.gz

# 编译安装
cd /usr/local/src/lua-resty-core-0.1.26
make && make install PREFIX=/usr/local/lua-resty-core-0.1
```

### 5.安装lua-resty-lrucache

```bash
cd /usr/local/src
wget https://github.com/openresty/lua-resty-lrucache/archive/refs/tags/v0.13.tar.gz -O lua-resty-lrucache-0.13.tar.gz
tar -zxvf lua-resty-lrucache-0.13.tar.gz

# 编译安装
cd /usr/local/src/lua-resty-lrucache-0.13
make && make install PREFIX=/usr/local/lua-resty-lrucache-0.13
```

> [!TIP]
>
> 安装 lua-resty-core 和 lua-resty-lrucache 时，如果不加 PREFIX 参数，相关 lua 脚本会被默认安装到 /usr/local/lib/lua 中，需要将 `lua_package_path "/usr/local/lib/lua/?.lua;;";` 配置到 nginx.conf 的 `http` 块中。

### 6.修改Nginx配置文件

> [!TIP]
>
> - Nginx 的日志文件存放路径（如：/data/log/nginx）要使用启动 nginx 服务的用户新建。

创建日志目录

```bash
mkdir -pv /data/log/nginx1.24
```

配置文件内容请参照[Nginx基础配置](configuration.md)

加载Lua的相关配置：Nginx 的基础配置完成后，需要在 nginx.conf 文件的 `http` 块中添加 `lua_package_path "/usr/local/lua-resty-core-0.1/lib/lua/?.lua;/usr/local/lua-resty-lrucache-0.13/lib/lua/?.lua;;";`

------

## 四、使用Systemd管理进程TIP

> [!TIP]
>
> - service 执行文件需构建在 /etc/systemd/system 目录下
> - 主机操作系统（如物理机或虚拟机）使用，不推荐在容器中使用

### 1.创建service文件

> [!TIP]
>
> - 为了便于后期维护，约定在 nginx.service 中明确加载的配置文件路径（如：-c /usr/local/nginx1.24/conf/nginx.conf）。
> - 配置文件中不支持在每行命令的后面添加注释

在 /etc/systemd/system 目录下面新建一个 service 文件

bash

```bash
vim /etc/systemd/system/nginx.service
```

```vim
[Unit]
Description=nginx
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx1.24/sbin/nginx -c /usr/local/nginx1.24/conf/nginx.conf
ExecReload=/usr/local/nginx1.24/sbin/nginx -s reload
ExecStop=/usr/local/nginx1.24/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

### 2.重新加载systemctl配置

```bash
systemctl daemon-reload
```

### 3.启动并设置开机自启

```bash
systemctl enable nginx --now
```

> [!NOTE]
>
> ```bash
> systemctl status nginx  #启动服务
> systemctl start nginx   #启动服务
> systemctl stop nginx    #停止服务
> systemctl reload nginx  #重新加载配置
> systemctl enable nginx  #开启开机自启服务
> systemctl disable nginx #关闭开机自启服务
> ```