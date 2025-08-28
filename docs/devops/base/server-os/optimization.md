# 系统优化

## 一、设置最大打开文件数及进程数

主要关注两个：

1）open files – 用户可以打开文件的最大数目

对应 ulimit 的命令`ulimit -n`，可以使用`ulimit -n 65535`进行临时设置。

对应 /etc/security/limits.conf 的资源限制类型是：nofile

2）max user processes – 用户可以开启进程/线程的最大数目

对应 ulimit 的命令`ulimit  -u`，可以使用`ulimit -u 65535`进行临时设置。

对应/etc/security/limits.conf的资源限制类型是：noproc

## 0x01.临时设置

通过命令行方式配置最大打开文件数与进程数（需在 root 权限下执行）。

1.设置用户 open files（用户可以打开文件的最大数目）

```bash
ulimit -n 65535
```

2.设置用户 max user processes（用户可以开启进程/线程的最大数目）

```bash
ulimit -u 65535
```

## 0x02.永久设置

修改最大打开文件数或进程数的配置后，<font color="red">需重启才能生效</font>。

```bash
vim /etc/security/limits.conf
```

写入如下内容
> nproc 进程数；nofile 文件数
```vim
*          soft    nproc     65535
*          hard    nproc     65535
*          soft    nofile    65535
*          hard    nofile    65535
```

:::warning
- soft 和 hard 需要都进行设置，才能生效。
- nofile 不能设置 unlimited。
- nofile 可以设置的最大值为 1048576(2^20)，如果设置的值大于该数，就会无法登录系统。
- soft 设置的值一定要小于或等于 hard 的值。
- <font color="red">目前还没有找到资料证明 65535 这个数值的合理性。</font>
  :::

:::tip
<b>在 Centos7 中，/etc/security/limits.d/20-nproc.conf 会覆盖 /etc/security/limits.conf 的配置参数。约定在 Centos7 中，修改 /etc/security/limits.d/20-nproc.conf。</b>
:::

## 0x03.systemd管理的进程设置

在 /etc/security/limits.conf 文件中有如下的说明

```vim
# /etc/security/limits.conf
#
#This file sets the resource limits for the users logged in via PAM.
#It does not affect resource limits of the system services.
#
```

从上面的描述可知，limits.conf 中的配置，只适用于通过 PAM 认证登录用户的资源限制，它对 system services 的资源限制不生效。

目前 Redis、Elasticsearch、RabbitMQ 等中间件均使用 Systemd 进行管理，在 Centos7 或 openEuler22.03 中，要进行全局的配置进程打开文件数量，需要修改 /etc/systemd/system.conf 和 /etc/systemd/user.conf 这两个配置文件，或者在systemd单元文件（.service）中进行配置（如LimitNOFILE、LimitNPROC）。<font color="red">约定系统初始化的时候只修改 /etc/systemd/system.conf 中的配置</font>。

```bash
vim /etc/systemd/system.conf
```

```vim
#DefaultLimitNOFILE=1024:524288 //[!code --]
DefaultLimitNOFILE=65535 //[!code ++]

#DefaultLimitNPROC= //[!code --]
DefaultLimitNPROC=65535 //[!code ++]
```

<font color="red">需重启后才能生效</font>。

:::tip
openEuler22.03 中，DefaultLimitNOFILE 被设置成65535的合理性待验证。
:::

## 0x04.参考资料

- https://wiki.swoole.com/#/other/sysctl
- https://www.cnblogs.com/CoolMark-blog/p/12318850.html
- https://cloud.tencent.com/developer/article/1982394
- https://www.cnblogs.com/linuxk/p/11989559.html
- https://www.mongodb.com/docs/manual/reference/ulimit
- https://www.elastic.co/guide/en/elasticsearch/reference/7.17/file-descriptors.html

## 二、内核及网络设置

```bash
cp /etc/sysctl.conf /etc/sysctl.conf.bak
vim /etc/sysctl.conf
```

写入如下参数配置
```vim
net.ipv6.conf.all.disable_ipv6=0
net.ipv4.ip_forward = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.conf.default.accept_source_route = 0
kernel.sysrq = 0
kernel.core_uses_pid = 1
net.ipv4.tcp_syncookies = 0
kernel.msgmnb = 65536
kernel.msgmax = 65536
kernel.shmmax = 68719476736
kernel.shmall = 4294967296
net.ipv4.tcp_max_tw_buckets = 6000
net.ipv4.tcp_sack = 1
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_rmem = 4096 87380 4194304
net.ipv4.tcp_wmem = 4096 16384 4194304
net.core.wmem_default = 8388608
net.core.rmem_default = 8388608
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.core.somaxconn = 65535
net.core.netdev_max_backlog = 262144
net.ipv4.tcp_max_orphans = 3276800
net.ipv4.tcp_max_syn_backlog = 262144
net.ipv4.tcp_synack_retries = 1
net.ipv4.tcp_syn_retries = 1
net.ipv4.tcp_fin_timeout = 1
net.ipv4.tcp_keepalive_time = 1200
net.ipv4.tcp_mem = 94500000 915000000 927000000
net.ipv4.ip_local_port_range = 1024 65535
net.ipv4.tcp_timestamps=0
net.ipv4.tcp_tw_reuse = 1
fs.file-max=65535
```

强制Linux重新加载新配置（以root用户身份执行以下命令）

```bash
sysctl -p
```

:::tip
- [Linux 从4.12内核版本开始移除了 tcp_tw_recycle 配置，低于该版本的内核需要将该配置设置为0](https://mp.weixin.qq.com/s/uwykopNnkcRL5JXTVufyBw)。
  :::

## 三、查看打开文件数

> lsof 只能以 root 权限执行。在终端下输入 lsof 即可显示系统打开的文件,因为 lsof 需要访问核心内存和各种文件，所以必须以 root 用户的身份运行它才能够充分地发挥其功能。

1.查看系统用户所有限制值
```bash
ulimit -a
```

2.查看当前登录用户可以打开文件的最大数目
```bash
ulimit -n
```

3.查看当前系统打开的文件数量
```bash
lsof | wc -l
```

4.查看某个进程的打开文件数量
```bash
lsof -p $PID | wc -l
```

5.查看某个进程的最大可以打开的文件数
```bash
cat /proc/$PID/limits
``` 

6.查看系统总限制打开文件的最大数量
> 在 openEuler22.03 中，如下命令显示的是最大值：9223372036854775807（2⁶³−1）
```bash
cat /proc/sys/fs/file-max**
```

## 四、查看开启进程/线程数

查看系统用户所有限制值
```bash
ulimit -a
```

查看当前登录用户可以开启进程/线程的最大数目
```bash
ulimit -u
```
