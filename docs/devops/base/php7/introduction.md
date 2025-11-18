# PHP7介绍

PHP7.3 更新日志: https://www.php.net/ChangeLog-7.php

PHP Unsupported Historical Releases: https://www.php.net/releases/

PHP Supported Versions: https://www.php.net/supported-versions.php

## php-fpm.service示例

> 来源：/usr/local/src/php-7.3.33/sapi/fpm/php-fpm.service

```vim
# It's not recommended to modify this file in-place, because it
# will be overwritten during upgrades.  If you want to customize,
# the best way is to use the "systemctl edit" command.

[Unit]
Description=The PHP FastCGI Process Manager
After=network.target

[Service]
Type=simple
PIDFile=/usr/local/php73/var/run/php-fpm.pid
ExecStart=/usr/local/php73/sbin/php-fpm --nodaemonize --fpm-config /usr/local/php73/etc/php-fpm.conf
ExecReload=/bin/kill -USR2 $MAINPID
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```