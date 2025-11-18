# php.ini 配置说明

源文件地址：/usr/local/src/php-7.3.33/php.ini-production

当前加载的文件位置：/usr/local/php73/etc/php.ini（通过 `/usr/local/php73/bin/php --ini` 获取）

编辑配置文件
```bash
vim /usr/local/php73/etc/php.ini
```

## 关于 php.ini

```ini
;;;;;;;;;;;;;;;;;;;
; About this file ;
;;;;;;;;;;;;;;;;;;;

; This is the php.ini-production INI file.
```

## 语言选项

```ini
;;;;;;;;;;;;;;;;;;;;
; Language Options ;
;;;;;;;;;;;;;;;;;;;;

; This directive determines whether or not PHP will recognize code between
; <? and ?> tags as PHP source which should be processed as such. It is
; generally recommended that <?php and ?> should be used and that this feature
; should be disabled, as enabling it may result in issues when generating XML
; documents, however this remains supported for backward compatibility reasons.
; Note that this directive does not control the <?= shorthand tag, which can be
; used regardless of this directive.
; Default Value: On
; Development Value: Off
; Production Value: Off
; http://php.net/short-open-tag
; 告诉 PHP 是否允许 PHP 开放标签的缩写形式（<? ?>）。
short_open_tag = Off
```

## 其他

```ini
;;;;;;;;;;;;;;;;;
; Miscellaneous ;
;;;;;;;;;;;;;;;;;

; Decides whether PHP may expose the fact that it is installed on the server
; (e.g. by adding its signature to the Web server header).  It is no security
; threat in any way, but it makes it possible to determine whether you use PHP
; on your server or not.
; http://php.net/expose-php
; 确定是否向外界公开服务器上安装了 PHP，在 HTTP 标头中包含 PHP 版本号（例如：X-Powered-By: PHP/7.3.33）。
expose_php = Off
```

## 资源限制

```ini
;;;;;;;;;;;;;;;;;;;
; Resource Limits ;
;;;;;;;;;;;;;;;;;;;

; Maximum execution time of each script, in seconds
; http://php.net/max-execution-time
; Note: This directive is hardcoded to 0 for the CLI SAPI
; 这设置了脚本被解析器中止之前允许的最大执行时间，单位秒。
; 这有助于防止写得不好的脚本占尽服务器资源。默认设置为 30。
; 从命令行运行 PHP 时，默认设置为 0。
max_execution_time = 300

; Maximum amount of memory a script may consume (128MB)
; http://php.net/memory-limit
; 设置了允许脚本分配的最大内存量，以字节为单位。
; 这有助于防止写得不好的脚本吃掉服务器上所有可用的内存。
; 请注意，如果不需要内存限制，请将此指令设置为 -1。
memory_limit = 1024M
```

## 错误处理和日志记录

```ini
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
; Error handling and logging ;
;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;
; Default Value: E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED
; Development Value: E_ALL
; Production Value: E_ALL & ~E_DEPRECATED & ~E_STRICT
; http://php.net/error-reporting
error_reporting = E_ALL & ~E_DEPRECATED & ~E_STRICT & ~E_NOTICE & ~E_WARNING

; Possible Values:
;   Off = Do not display any errors
;   stderr = Display errors to STDERR (affects only CGI/CLI binaries!)
;   On or stdout = Display errors to STDOUT
; Default Value: On
; Development Value: On
; Production Value: Off
; http://php.net/display-errors
display_errors = Off

; Default Value: Off
; Development Value: On
; Production Value: On
; http://php.net/log-errors
; cli模式不会加载 php-fpm 的配置，只能修改 php.ini 的内容，修改后无需重启 php
; 错误日志文件所属用户及组需要与执行 php 脚本的的用于与组一致
; php-fpm 中的配置 php_admin_value[error_log]、php_admin_flag[log_errors] 会覆盖当前配置
log_errors = On

; Log errors to specified file. PHP's default behavior is to leave this value
; empty.
; http://php.net/error-log
; Example:
;error_log = php_errors.log
; Log errors to syslog (Event Log on Windows).
;error_log = syslog
; 如果服务器中有多个版本，需加上版本号，示例：php73-cli.error.log
error_log = /var/log/php/php73.error.log
```

## 数据处理

```ini
;;;;;;;;;;;;;;;;;
; Data Handling ;
;;;;;;;;;;;;;;;;;

; Maximum size of POST data that PHP will accept.
; Its value may be 0 to disable the limit. It is ignored if POST data reading
; is disabled through enable_post_data_reading.
; http://php.net/post-max-size
; 设置允许 post 数据的最大大小。
; 此设置也会影响文件上传。要上传大文件，此值必须大于 upload_max_filesize。
; 一般来说，memory_limit 应该大于 post_max_size。
post_max_size = 50M
```

## 路径和目录

```ini
;;;;;;;;;;;;;;;;;;;;;;;;;
; Paths and Directories ;
;;;;;;;;;;;;;;;;;;;;;;;;;

; cgi.fix_pathinfo provides *real* PATH_INFO/PATH_TRANSLATED support for CGI.  PHP's
; previous behaviour was to set PATH_TRANSLATED to SCRIPT_FILENAME, and to not grok
; what PATH_INFO is.  For more information on PATH_INFO, see the cgi specs.  Setting
; this to 1 will cause PHP CGI to fix its paths to conform to the spec.  A setting
; of zero causes PHP to behave as before.  Default is 1.  You should fix your scripts
; to use SCRIPT_FILENAME rather than PATH_TRANSLATED.
; http://php.net/cgi.fix-pathinfo
cgi.fix_pathinfo = 0
```

## 文件上传

```ini
;;;;;;;;;;;;;;;;
; File Uploads ;
;;;;;;;;;;;;;;;;

; Maximum allowed size for uploaded files.
; http://php.net/upload-max-filesize
; 上传文件的最大大小。
upload_max_filesize = 50M

; Maximum number of files that can be uploaded via a single request
; 允许同时上传的最大文件数。提交时留空的上传字段不计入此限制。
max_file_uploads = 20
```

## 动态扩展

新增的 [redis] 和 [mongodb] 配置项在配置文件 php.ini 的末尾添加。

```ini
;;;;;;;;;;;;;;;;;;;;;;
; Dynamic Extensions ;
;;;;;;;;;;;;;;;;;;;;;;

[Date]
; Defines the default timezone used by the date functions
; http://php.net/date.timezone
date.timezone = Asia/Shanghai
```

## 配置集合

## 参考资料

- [php.ini 核心指令说明](https://www.php.net/manual/zh/ini.core.php)