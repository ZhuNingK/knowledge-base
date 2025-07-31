# 升级OpenSSH

- OpenSSH Downloads：https://www.openssh.com/portable.html
- OpenSSH Releases On Github：https://github.com/openssh/openssh-portable/tags
- 阿里云镜像站：https://mirrors.aliyun.com/pub/OpenBSD/OpenSSH/portable/

## 一、升级到9.9(Centos7)

最新稳定版本为：openssh-9.9p1（截止2024年12月18日）

## 0x01.开启telnet

:::tip
OpenSSH 在升级过程中可能会出现远程连接中断,当 SSH 中断时可通过`telnet`命令连接服务器进行升级
:::

1. 确认 telnet 及依赖的 xinetd 安装情况

```shell
rpm -qa |grep -E "telnet|xinetd"
```

2. 安装telnet 及 依赖的xinetd（已有则不需要再安装）

```shell
yum -y install xinetd telnet-server
```

3. 修改 telnet 配置文件

```shell
cat >> /etc/securetty <<EOF
pts/0
pts/1
pts/2
pts/3
pts/4
EOF
```

4. 启动 telnet 及依赖的 xinetd ，并设置开机自启

```shell
systemctl enable xinetd --now
systemctl enable telnet.socket --now
```

5. 验证开启Telnet

```shell
ss -nltp | grep :23
```
使用非本机的命令行终端执行`telnet $IP`验证是否可连接（防火墙需放行）

::: warning
测试 telnet 连接时，如果可以成功连接 telnet 但不能成功认证，可通过 /var/log/secure 日志进行排查。
:::

## 0x02.先决条件

1. 安装依赖

```shell
yum -y install gcc gcc-c++ glibc make autoconf pcre-devel pam-devel zlib zlib-devel
```

2. 升级OpenSSL

参照 <a href="/devops/baseops/server-os/initialization.html#升级-openssl">系统初始操作 · 升级OpenSSL</a>，将 OpenSSL 升级到1.1.*

## 0x03.源码编译安装

1. 备份配置文件

```shell
mv /etc/ssh /etc/ssh.bak_$(date "+%Y%m%d")
mv /etc/pam.d/sshd /etc/pam.d/sshd.bak_$(date "+%Y%m%d")
```

2. 下载源码并解压

```shell
cd /usr/local/src
wget http://ftp.openbsd.org/pub/OpenBSD/OpenSSH/portable/openssh-9.9p1.tar.gz
tar -zxvf openssh-9.9p1.tar.gz
```

3. 编译安装

<font color="red"><b>注意：openssl 的路径依据每个服务器的环境而定（openssl 至少是1.1.*或以上版本）</b></font>

```shell
cd /usr/local/src/openssh-9.9p1
./configure --prefix=/usr/local/openssh9.9 \
    --sysconfdir=/etc/ssh \
    --with-openssl-includes=/usr/local/include \
    --with-ssl-dir=/usr/local/openssl1.1 \
    --with-zlib --with-md5-passwords --with-pam
make && make install
```

4. 修改配置文件

```shell
cat >>/etc/ssh/sshd_config << EOF
UseDNS no
PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication yes
X11Forwarding yes
X11UseLocalhost no
XAuthLocation /usr/bin/xauth
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521
EOF
```

5. 备份可执行文件

```bash
mv /usr/bin/ssh /usr/bin/ssh.bak_$(date "+%Y%m%d")
mv /usr/sbin/sshd /usr/sbin/sshd.bak_$(date "+%Y%m%d")
mv /usr/bin/ssh-keygen /usr/bin/ssh-keygen.bak_$(date "+%Y%m%d")
```

6. 配置新版本执行文件

```bash
ln -s /usr/local/openssh9.9/bin/ssh /usr/bin/ssh
ln -s /usr/local/openssh9.9/bin/ssh-keygen /usr/bin/ssh-keygen 
ln -s /usr/local/openssh9.9/sbin/sshd /usr/sbin/sshd
```

7. 使用Service管理进程

```shell
# 备份服务文件
mv /etc/systemd/system/sshd.service /etc/systemd/system/sshd.service.bak_$(date "+%Y%m%d")

# 配置新版本启动脚本
cp -a /usr/local/src/openssh-9.9p1/contrib/redhat/sshd.init /etc/init.d/sshd
cp -a /usr/local/src/openssh-9.9p1/contrib/redhat/sshd.pam /etc/pam.d/sshd

# 配置可执行权限 
chmod +x /etc/init.d/sshd

# 重启sshd服务
/etc/init.d/sshd restart
```

8. <font color="red">设置开机自启（必须执行）</font>

```shell
# 配置 sshd 加入 chkconfig 管理
chkconfig --add sshd

# 配置sshd开机自启动
chkconfig sshd on
```

9. 验证安装

```shell
# 查看版本号
ssh -V

OpenSSH_9.9p1, OpenSSL 3.0.8 7 Feb 2023
```

使用非本机的终端基于SSH通道连接验证。

## 0x04.关闭Telnet

```shell
systemctl stop xinetd.service
systemctl disable xinetd.service

systemctl stop telnet.socket
systemctl disable telnet.socket
```

## 0x05.常见问题

1. 奇安信堡垒机纳管的机器可能会出现连接错误,解决办法

```shell
echo ‘HostKeyAlgorithms ecdsa-sha2-nistp256,ecdsa-sha2-nistp384,ecdsa-sha2-nistp521,ssh-rsa,ssh-dss’ >>/etc/ssh/sshd_config

systemctl restart sshd
```

## 二、升级到10.0(openEuler)

最新稳定版本为：openssh-9.9p1（截止2024年12月18日）

## 0x01.开启telnet

:::tip
OpenSSH 在升级过程中可能会出现远程连接中断,当 SSH 中断时可通过`telnet`命令连接服务器进行升级
:::

1. 确认 telnet 及依赖的 xinetd 安装情况

```shell
rpm -qa | grep -E "telnet|xinetd"
```

2. 安装telnet 及 依赖的xinetd（已有则不需要再安装）

```shell
yum -y install xinetd telnet-server
```

3. 启动 telnet 及依赖的 xinetd ，并设置开机自启

```shell
systemctl enable xinetd --now
systemctl enable telnet.socket --now
```

5. 验证开启Telnet

```shell
ss -nltp | grep :23
```
使用非本机的命令行终端执行`telnet $IP`验证是否可连接（防火墙需放行）

::: warning
测试 telnet 连接时，如果可以成功连接 telnet 但不能成功认证，可通过 /var/log/secure 日志进行排查。
:::

## 0x02.先决条件

1. 安装依赖

```shell
yum -y install gcc gcc-c++ glibc make autoconf pcre-devel pam-devel zlib zlib-devel
```

2. 安装openssl-devel库 （<font color="red"> <span> 未进行 openssl 编译升级的服务器执行</span></font>）

```shell
yum -y install openssl-devel
```

## 0x03.源码编译安装

1. 备份配置文件

```shell
mv /etc/ssh /etc/ssh.bak_$(date "+%Y%m%d")
mv /etc/pam.d/sshd /etc/pam.d/sshd.bak_$(date "+%Y%m%d")
```

2. 下载源码并解压

```shell
cd /usr/local/src
wget https://mirrors.aliyun.com/pub/OpenBSD/OpenSSH/portable/openssh-10.0p1.tar.gz
tar zxvf openssh-10.0p1.tar.gz 
```

3. 编译安装

① 未完成编译升级 openssl 的服务器使用如下指令

:::tip
因 OpenEuler22.03 默认的 OpenSSL 版本为 v1.1.1m，约定该系统上使用如下方式升级 OpenSSH。
:::

```shell
cd /usr/local/src/openssh-10.0p1/
./configure --prefix=/usr/local/openssh10.0 \
    --sysconfdir=/etc/ssh \
    --with-zlib --with-md5-passwords --with-pam
make && make install
```

② 已完成编译升级 openssl 的服务器使用如下指令

<font color="red"><b>注意：openssl 的路径依据每个服务器的环境而定（openssl 至少是1.1.*或以上版本）</b></font>

```shell
cd /usr/local/src/openssh-10.0p1/
./configure --prefix=/usr/local/openssh10.0 \
    --sysconfdir=/etc/ssh \
    --with-openssl-includes=/usr/local/include \
    --with-ssl-dir=/usr/local/openssl1.1 \
    --with-zlib --with-md5-passwords --with-pam
make && make install
```

4. 修改配置文件

```shell
cat >>/etc/ssh/sshd_config << EOF
UseDNS no
PermitRootLogin yes
PubkeyAuthentication yes
PasswordAuthentication yes
X11Forwarding yes
X11UseLocalhost no
XAuthLocation /usr/bin/xauth
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,ecdh-sha2-nistp256,ecdh-sha2-nistp384,ecdh-sha2-nistp521
EOF
```

5. 备份可执行文件

```bash
mv /usr/bin/ssh /usr/bin/ssh.bak_$(date "+%Y%m%d")
mv /usr/sbin/sshd /usr/sbin/sshd.bak_$(date "+%Y%m%d")
mv /usr/bin/ssh-keygen /usr/bin/ssh-keygen.bak_$(date "+%Y%m%d")
```

6. 配置新版本执行文件

```bash
ln -s /usr/local/openssh10.0/bin/ssh /usr/bin/ssh
ln -s /usr/local/openssh10.0/bin/ssh-keygen /usr/local/ssh-keygen
ln -s /usr/local/openssh10.0/sbin/sshd /usr/sbin/sshd
```


7. 使用Service管理进程

```shell
# 备份服务文件
# mv /etc/systemd/system/sshd.service /etc/systemd/system/sshd.service.bak_$(date "+%Y%m%d")
rm  -f /usr/lib/systemd/system/sshd.service

# 配置新版本启动脚本
mv  /etc/init.d/sshd /etc/init.d/sshd.bak
cp -a /usr/local/src/openssh-10.0p1/contrib/redhat/sshd.init /etc/init.d/sshd
cp -a /usr/local/src/openssh-10.0p1/contrib/redhat/sshd.pam /etc/pam.d/ssd

# 配置可执行权限 
chmod +x /etc/init.d/sshd

# 重载配置文件 
systemctl daemon-reload

# 重启sshd服务
/etc/init.d/sshd restart
```

8. <font color="red">设置开机自启（必须执行）</font>

```shell
systemctl enable --now sshd.service
systemctl is-enabled sshd.service
systemctl status  sshd.service
systemctl restart  sshd.service
```

9. 验证安装

```shell
# 查看版本号
ssh -V

OpenSSH_9.9p1, OpenSSL 3.0.8 7 Feb 2023
```

使用非本机的终端基于SSH通道连接验证。

## 0x04.关闭Telnet

```shell
systemctl stop xinetd.service
systemctl disable xinetd.service

systemctl stop telnet.socket
systemctl disable telnet.socket
```
