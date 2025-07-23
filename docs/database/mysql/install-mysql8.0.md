# 安装 Mysql8.0

- https://downloads.mysql.com/archives/community/
- https://dev.mysql.com/downloads/mysql/

:::warning 约定
- 所有源码包下载到 /usr/local/src 中
- 软件安装到 /usr/local 中，并以软件名及主次版本号命名，如 mysql8.0
- 业务开发中，团队约定使用 mysql8.0.*（*表示最新的补丁版本）
:::

## 1.先决条件

### 0x01.安装必要的库

```bash
yum -y install libaio
```

## 2.基于二进制包安装

### 0x01.下载压缩包

截止2024年5月，Mysql8.0 最新稳定版为 v8.0.37

:::tip 下载
➤ [MySQL Community Downloads](https://dev.mysql.com/downloads/mysql/)
1. Select Operating System: **Linux - Generic**
2. Select OS Version: **Linux - Generic (glibc 2.12) (x86, 64-bit)**
3. Download Compressed TAR Archive
:::

```bash
cd /usr/local/src
wget https://cdn.mysql.com/Downloads/MySQL-8.0/mysql-8.0.37-linux-glibc2.12-x86_64.tar.xz
```

:::warning
软件包下载比较慢的情况下，可下载团队软件库中对应的安装包。命令示例：`wget <Software Download Link> -O <Software Package Name>`。
:::

### 0x02.解压文件并复制

```bash
cd /usr/local/src
tar xvf mysql-8.0.37-linux-glibc2.12-x86_64.tar.xz
cp -ar mysql-8.0.37-linux-glibc2.12-x86_64 /usr/local/mysql8.0
```

### 0x03.创建Mysql用户

```bash
groupadd mysql
useradd -g mysql mysql -s /sbin/nologin
```

### 0x04.添加环境变量

```bash
echo '
PATH=$PATH:/usr/local/mysql8.0/bin
export PATH' >> /etc/profile
```

刷新环境变量
```bash
source /etc/profile
```

### 0x05.创建相关目录

数据及进程目录
```bash
mkdir -p /data/mysql
chown -R mysql:mysql /data/mysql
```

日志目录
```bash
mkdir -p /var/log/mysql
chown -R mysql:mysql /var/log/mysql
```

## 3.创建配置文件

### 0x01.创建配置文件目录

```bash
mkdir /usr/local/mysql8.0/etc
```

### 0x02.创建并编辑配置文件

```bash
vim /usr/local/mysql8.0/etc/my.cnf
```

:::warning 配置文件中无需配置`binlog_format`
<a href="https://dev.mysql.com/doc/refman/8.0/en/replication-options-binary-log.html#sysvar_binlog_format">binlog_format is deprecated as of MySQL 8.0.34, and is subject to removal in a future version of MySQL. This implies that support for logging formats other than row-based is also subject to removal in a future release. Thus, only row-based logging should be employed for any new MySQL Replication setups. </a>
:::

:::warning 约定禁止将 mysql 默认的认证插件配置成`mysql_native_password`
<a href="https://dev.mysql.com/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html">In MySQL 8.0, caching_sha2_password is the default authentication plugin rather than mysql_native_password.</a>

通过升级客户端或者创建支持`mysql_native_password`认证的数据库用户解决应用程序无法正常操作数据库的问题。
:::

:::warning
- 在默认情况下，MySQL 的 PID 文件和套接字文件通常存储在 `/var/run/mysql` 目录中。然而，`/var/run` 是一个临时文件系统（tmpfs），在系统重启后会被清空，导致 MySQL 服务无法找到这些文件，从而可能引发服务启动失败或其他问题。为了解决这一问题，约定将 PID 文件和套接字文件存储在数据目录中，以确保系统重启后 MySQL 服务能够正常启动并找到所需的文件。
:::

:::tip
- 为确保 MySQL 客户端能够通过 socket 成功连接至 MySQL 服务器，需将`client`块的 socket 文件路径配置为与`mysqld`块中的路径完全一致。这一调整可有效解决因路径不匹配而引发的“Can't connect to local MySQL server through socket '/tmp/mysql.sock'”错误，从而实现客户端与服务器的正常通信。
:::

配置文件示例（<font color="red"><b>当前配置仅适用于单节点的Mysql实例</b></font>）
```vim
[mysqld]

# Specifies the server ID
server_id=1
# 只能用IP地址检查客户端的登录
skip_name_resolve=On
# 日志内记录时间使用系统时间（the local system time zone）
log_timestamps=SYSTEM
# 进程ID的文件所在目录
pid_file=/data/mysql/mysqld.pid

# 最大连接数
max_connections=2000

# 超时
interactive_timeout=60
wait_timeout=60

# The path to the MySQL installation base directory
basedir=/usr/local/mysql8.0
# 数据文件所在位置
datadir=/data/mysql
# 设置socket文件所在目录
socket=/data/mysql/mysqld.sock
# 数据库错误日志
log_error=/var/log/mysql/mysqld-error.log
log_error_suppression_list='MY-013360'

# 慢日志相关配置
slow_query_log=1
long_query_time=3 #3 seconds
slow_query_log_file=/var/log/mysql/mysqld-slow.log

# InnoDB启动选项和系统变量
innodb_buffer_pool_size=2048M

# 二进制日志
log_bin=mysql-bin
max_binlog_size=1G
binlog_expire_logs_seconds=15552000 #180 days

[client]

# 设置 MySQL 客户端尝试通过 socket 连接 MySQL 服务器的文件路径
socket=/data/mysql/mysqld.sock
```

## 4.初始化数据库

### 0x01.设置my.cnf的所属组

> 如果不设置 my.cnf 所属组，可能会导致初始化数据库失败

```bash
chown mysql:mysql /usr/local/mysql8.0/etc/my.cnf
```

### 0x03.创建软链接

:::warning Important
- [When initializing the data directory, you should not specify any options other than those used for setting directory locations such as --basedir or --datadir, and the --user option if needed.](https://dev.mysql.com/doc/refman/8.0/en/data-directory-initialization.html)

- MySQL 官方在源码包的 `./support-files/mysql.server` 路径下提供了 `mysql.server` 作为 MySQL 守护进程的启动/停止脚本。为了避免直接修改该脚本，约定采用软链接的方式，将全局配置文件 `/etc/my.cnf` 软链接至 `/usr/local/mysql8.0/etc/my.cnf`，以确保配置管理的规范性与灵活性。
:::

```bash
ln -s /usr/local/mysql8.0/etc/my.cnf /etc/my.cnf
```

### 0x04.初始化数据目录

```bash
/usr/local/mysql8.0/bin/mysqld --initialize --user=mysql
```

初始化完成后，数据文件目录（/data/mysql）中会生成数据库相关文件，日志文件（/var/log/mysql/mysqld-error.log）中会被写入 root 用户的随机密码。

查看 root 用户的随机密码
```bash
cat /var/log/mysql/mysqld-error.log | grep password
```
输出如下内容
2025-02-03T13:24:20.783432+08:00 6 [Note] [MY-010454] [Server] A temporary password is generated for root@localhost: u8qH.cmWJI%W

如上示例中，随机密码为：`u8qH.cmWJI%W`

## 5.使用Systemd管理进程

:::warning
- mysqld.service 执行文件需构建在 /etc/systemd/system 目录下
- 主机操作系统（如物理机或虚拟机）使用，不推荐在容器中使用
:::

### 0x01.编辑service文件

```bash
vim  /etc/systemd/system/mysqld.service
```

添加如下内容

> 配置文件中不支持在每行命令的后面添加注释

```vim
[Unit]
Description=MySQL Server
Documentation=man:mysqld(8)
Documentation=http://dev.mysql.com/doc/refman/en/using-systemd.html
After=network.target
After=syslog.target

[Install]
WantedBy=multi-user.target

[Service]
User=mysql
Group=mysql
Type=simple
ExecStart=/usr/local/mysql8.0/bin/mysqld --defaults-file=/etc/my.cnf
ExecReload=/bin/kill -HUP $MAINPID
LimitNOFILE=65535
TimeoutSec=600
Restart=on-failure
RestartPreventExitStatus=1
PrivateTmp=true
```

参照在 CentOS/RHEL 系统中通过 yum 安装 MySQL 生成的服务文件，文件路径在 /usr/lib/systemd/system/mysqld.service。


### 0x02.重新加载systemctl配置

```bash
systemctl daemon-reload
```

### 0x03.启动并设置开机自启

```bash
systemctl enable mysqld --now
```

:::tip Systemctl指令
```bash
systemctl status mysqld  #查看服务
systemctl start mysqld   #启动服务
systemctl stop mysqld    #停止服务
systemctl restart mysqld #重启服务
systemctl enable mysqld  #开启开机自启服务
systemctl disable mysqld #关闭开机自启服务
```
:::

## 6.Mysql运维场景

:::warning 
执行命令`mysql -uroot -p` 有如下错误信息：mysql: error while loading shared libraries: libtinfo.so.5: cannot open shared object file: No such file or directory.

解决方法
```bash
ln -s /usr/lib64/libtinfo.so.6.3 /usr/lib64/libtinfo.so.5
```
:::

### 0x01.修改初始密码

:::danger 密码说明
密码长度需不少于12位的随机字符串，且必须包含大小写字母、数字及特殊符号。约定特殊符号不包含`'`、`"`、`\`。
:::

:::warning
Mysql 的 root 账号只允许在数据库服务器登录。
:::

连接到 MySQL（输入初始化数据库的随机密码）
```bash
mysql -uroot -p
```

在 MySQL 中执行以下命令
```sql
ALTER user 'root'@'localhost' identified by '$PASSWORD';
```
```sql
FLUSH PRIVILEGES;
```

退出 MySQL
```bash
quit;
```

### 0x01.重置密码

:::danger 密码说明
密码长度需不少于12位的随机字符串，且必须包含大小写字母、数字及特殊符号。约定特殊符号不包含`'`、`"`、`\`。
:::

停止 Mysql 服务
```bash
systemctl stop mysqld
```

以安全模式启动 MySQL（跳过权限检查）
```bash
mysqld_safe --skip-grant-tables &
```

连接到 MySQL（无需密码）
```bash
mysql -u root
```

在 MySQL 中执行以下命令
```sql
FLUSH PRIVILEGES;
```
```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '$PASSWORD';
```

退出 MySQL 并强制终止 mysqld_safe 进程
```sql
exit;
```
```bash
ps -ef | grep "mysqld" | grep -v grep | awk '{print $2}' | xargs kill -9
```

启动 MySQL 服务
```bash
systemctl restart mysqld
```

### 0x03.查看Mysql版本

```bash
/usr/local/mysql8.0/bin/mysql -V
```

:::tip 输出如下内容
/usr/local/mysql8.0/bin/mysql  Ver 8.0.37 for Linux on x86_64 (MySQL Community Server - GPL)
:::

### 0x03.查看读取my.cnf的目录

```bash
/usr/local/mysql8.0/bin/mysql --help | grep 'my.cnf'
```

:::tip 输出如下内容（顺序排前的优先）
                order of preference, my.cnf, $MYSQL_TCP_PORT,
/etc/my.cnf /etc/mysql/my.cnf /usr/local/mysql/etc/my.cnf ~/.my.cnf 
:::

## 7.常用的SQL命令

前提：执行命令`mysql -uroot -p`登录 Mysql 服务

### 0x01.用户管理

创建用户
```sql
CREATE USER '用户名'@'%' IDENTIFIED BY '密码';
```

创建继续使用 mysql_native_password 的用户
```sql
CREATE USER '用户名'@'%' IDENTIFIED WITH mysql_native_password BY '密码';
```

赋予权限
```sql
GRANT ALL PRIVILEGES ON *.* TO '用户名'@'%';
```
```sql
FLUSH PRIVILEGES;
```

修改密码
```sql
ALTER USER '用户名'@'主机名' IDENTIFIED BY '新密码';
```

更新当前用户密码
```sql
ALTER USER CURRENT_USER() IDENTIFIED BY '新密码';
```

### 0x02.binlog管理

查看是否打开binlog模式
```sql
SHOW VARIABLES LIKE 'log_bin';
```

查看binlog日志文件列表
```sql
SHOW BINARY LOGS;
```

查看当前正在写入的binlog文件
```sql
SHOW MASTER STATUS;
```

删除特定时间点之前的所有binlog
```sql
PURGE BINARY LOGS BEFORE '2025-06-04 00:00:00';
```

删除指定日志文件之前的所有binlog
```sql
PURGE BINARY LOGS TO 'mysql-bin.000005';
```

删除当前正在使用的binlog之前的所有文件
```sql
PURGE BINARY LOGS BEFORE NOW();
```

## 附录1.使用Service管理进程

### 0x01.复制mysqld
```bash
cp /usr/local/mysql8.0/support-files/mysql.server /etc/init.d/mysqld
```

### 0x02.变更脚本权限
```bash
chmod +x /etc/init.d/mysqld
```

### 0x03.启动Mysql服务

```bash
/etc/init.d/mysqld start
```

:::tip 查看 Mysqld 脚本支持的命令
```bash
/etc/init.d/mysqld
```
输出如下内容<br />
Usage: mysqld  {start|stop|restart|reload|force-reload|status}  [ MySQL server options ]
:::

### 0x04.设置Mysql服务开机自启

```bash
chkconfig --add mysqld  #加入服务
chkconfig mysqld on     #设置自启
```

## 附录2.参考资料

- https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/binary-installation.html
- https://dev.mysql.com/doc/refman/8.0/en/mysqld.html
- https://dev.mysql.com/doc/refman/8.0/en/using-systemd.html
- https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/data-directory-initialization.html
- https://dev.mysql.com/doc/refman/8.0/en/innodb-dedicated-server.html
- https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/using-systemd.html
- https://haydenjames.io/mysql-8-sample-config-tuning/
