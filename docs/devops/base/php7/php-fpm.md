# php-fpm 配置说明

php-fpm 启动后会先读 php.ini，然后再读相应的 conf 配置文件，conf 配置可以覆盖 php.ini 的配置。

启动 php-fpm 之后，会创建一个 master 进程，监听 9000 端口（可配置），master 进程又会根据 etc/php-fpm.d/www.conf 去创建若干子进程，子进程用于处理实际的业务。

## 一、全局配置说明

编辑 php-fpm.conf
```bash
vim /usr/local/php73/etc/php-fpm.conf
```

```vim
[global]
; Pid file
; Note: the default prefix is /usr/local/php73/var
; Default Value: none
; pid = run/php-fpm.pid  //[!code --]
pid = run/php-fpm.pid  //[!code ++]
```

## 二、进程池配置说明

### 0x01.生成配置文件

```bash
cp /usr/local/php73/etc/php-fpm.d/www.conf.default /usr/local/php73/etc/php-fpm.d/www.conf
```

编辑 www.conf
```bash
vim /usr/local/php73/etc/php-fpm.d/www.conf
```

以nginx用户、nginx组的权限来运行池（ a pool named 'www'）
```vim
user = nginx
group = nginx
```

### 0x02.设置监听的地址
:::warning 约定
PHP-FPM 默认的端口为9000，为了实现一台服务器部署多版本 PHP-FPM ，同时为了便于后期通过端口就可以判断 PHP-FPM 的版本，制定如下策略：
- PHP-FPM70 端口：9070；PHP-FPM71 端口：9071；PHP-FPM72 端口：9072；
- PHP-FPM73 端口：9073；PHP-FPM74 端口：9074；
:::
```vim
listen = 127.0.0.1:9073
```

### 0x03.进程管理

```vim
# 启动时的管理方式
pm = static
# 进程池同时最多存在的进程数（初始的计算方式：memory / 50M）
pm.max_children = 300
```

### 0x04.慢日志

```vim
# 文件路径
slowlog = /var/log/php/php-fpm73.slow.log
# 超时时间
request_slowlog_timeout = 3
```

### 0x04.性能

设置单个请求的超时中止时间

:::tip
约定将 request_terminate_timeout 设置为略长于 max_execution_time，这样能够确保在请求超时后，有足够的时间来处理任务的终止操作，避免出现中途被强制终止的情况。如果系统在某些高负载或性能瓶颈的情况下，响应时间过长，可以降低 request_terminate_timeout 的值，从而提升系统的稳定性和响应效率。
:::

<font color="red">如果有长时间等待的操作（如Excel导出），需重新设置合理的值。</font>

```vim
request_terminate_timeout = 350
```

设置 master 进程的打开文件描述符 rlimit 数
```vim
rlimit_files = 65535
```

### 0x05.错误日志

> fpm-php73.www.log 所属用户及组都为nginx

```vim
php_admin_value[error_log] = /var/log/php/fpm-php73.www.log
php_admin_flag[log_errors] = on
```

## 附录一、参考资料

- https://www.php.net/manual/zh/install.fpm.configuration.php