# Nginx生产配置

------

## 1.HTTP&HTTPS

### 1.http强制跳转到https

```vim
server {
    listen      80;
    serv er_name www.interal-domain.com; #非特殊情况，禁止使用模糊匹配
    rewrite ^(.*) https://$server_name$1 permanent;
}
```

> [!TIP]
>
> 除了使用 rewrite 将请求过来的 http URL 直接重写成 https，还可以使用 `return 301 https://$host$request_uri;` 实现。

### 2.禁止http访问

代理服务器前置设备或软件没有卸载 SSL，约定禁止 http 访问（在最外层代理服务器配置）；如果后续需要 http 可访问（默认自动跳转到 https），可针对具体项目启用 http 服务。

```vim
server {
    listen      80;
    server_name www.internal-domain.com; #非特殊情况，禁止使用模糊匹配
    return      403;
}
```

------

## 2.URL重写

Nginx 的 rewrite 功能需要 PCRE 软件的支持，即通过 perl 兼容正则表达式语句进行规则匹配。

rewrite 指令可以放在 server、location、if 块之内，在 server 块下会优先执行 rewrite 部分，然后才会去匹配 location 块。

rewrite 最后一项 flag 参数有 last、break、redirect、permanent，其中 last 和 break 当出现在 location 之外时，两者的作用是一致的，它们会跳过所有的在它们之后的 rewrite 模块中的指令，去选择自己匹配的 location；redirect 返回 302 临时重定向，地址栏显示重定向后的 url，爬虫不会更新 url（因为是临时的）；permanent 返回 301 永久重定向，地址栏显示重定向后的url，爬虫更新 url。

> [!TIP]
>
> server 块中需要使用到 last 或 break 的时候，统一使用 last。

```vim
# 原有的”关于我们“地址永久重定向到新的地址
rewrite ^/static/html/about.html$ /about permanent;

# http 请求永久重定向到 https
rewrite ^(.*) https://$server_name$1 permanent;

# 原有的图片路径重写到新的路径
rewrite ^/attaches/image/(.*)/(.*)$ http://upload.domain.com/storage/images/$1/$2;

# 旧版的分享稿件重写到新的地址
rewrite ^/news/oshare/graphtext/(.*) https://$server_name/news/share/$1;

# 默认的 favicon.ico 统一指向到文件系统中
rewrite ^/favicon.ico$ https://demo-fs.domain.com/favicon.ico;

# 访问 PHP 探针默认跳转到入口文件
rewrite ^/(t.php|phpinfo.php|info.php) /index.php last;
```

> [!NOTE]
>
> Rewrite Syntax: http://nginx.org/en/docs/http/ngx_http_rewrite_module.html#rewrite

------

## 3.跨域资源共享配置

> [!TIP]
>
> - 只需在代理服务器的 Nginx 配置中进行设置。
> - 当系统没有软件负载情况下，才可以通过代码来解决跨域问题。

尽管我们可以通过后端语言（如：Java、Python、PHP、Nodejs等）解决浏览器跨域问题，但如果浏览器脚本内发起发起跨源 HTTP 请求资源文件（如图片、视频等），或者使用 drawImage() 将跨源的图片或视频画面绘制到 canvas 中，仍然需要使用 Nginx 进行跨域配置。在日常开发中，如果开发和运维人员都在使用各自的方式处理跨域问题，会导致定位难、职责不明确等问题。

> [!WARNING]
>
> - 由于权限问题，Nginx 在写入临时数据时出错，可能会引发跨域问题。
> - 后端代码逻辑异常（如未捕获的异常导致500错误）可能会导致跨域失败。因为如果响应不包含适当的CORS头，即使是错误信息，也会被浏览器阻止而显示跨域问题。

> [!TIP]
>
> 跨源资源共享（CORS）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其他源（域、协议或端口），使得浏览器允许这些源访问加载自己的资源。
>
> 跨源资源共享标准新增了一组 HTTP 标头字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。
>
> 摘录自：https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS

### 1.cors.conf

**在 server 块的配置中引入配置文件**，示例：`include /usr/local/nginx1.26/conf/cors.conf;`

> [!IMPORTANT]
>
> include 指令配置在 location 指令之前

```vim
add_header Access-Control-Allow-Origin *;
add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
add_header Access-Control-Allow-Headers 'Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Access-Control-Allow-Origin,X-Authorization,X-Timestamp,X-Nonce,X-Terminal,X-Signature';
add_header 'Access-Control-Allow-Credentials' 'true';

# 修复CORS 允许任意来源携带认证信息漏洞
#add_header Access-Control-Allow-Origin * always;
add_header 'Access-Control-Allow-Origin' $http_origin;
add_header Access-Control-Allow-Methods GET,POST,OPTIONS,PUT,DELETE,PATCH always;
add_header Access-Control-Allow-Headers 'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,X-Auth-Token,authtoken,x-authtoken,Cache-Control,Content-Type,access-control-allow-origin,Authorization,X-Authorization,dept_id,x-terminal,content-encoding,ignorecanceltoken,x-signature,x-timestamp,x-nonce,x-token,x-appid,x-debug-token' always;
#add_header 'Access-Control-Allow-Credentials' 'true' always;
add_header 'Access-Control-Allow-Credentials' 'true';
```


Access-Control-Allow-Headers 标头字段用于预检请求的响应。其指明了实际请求中允许携带的标头字段。这个标头是服务器端对浏览器端 Access-Control-Request-Headers 标头的响应（实际操作中可参照具体的报错信息，将未允许的 header 添加到该字段中）。

### 2.cors_options.conf

**在 location 块中引入配置文件**，如果 server 块中有多个 location，每个 location 块都需要配置。示例：`include /usr/local/nginx1.26/conf/cors_options.conf;`

> [!WARNING]
>
> server 块中引入 cors_options.conf 会报错

```vim
if ($request_method = 'OPTIONS') {
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods GET,POST,OPTIONS;
    add_header Access-Control-Allow-Headers 'Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Access-Control-Allow-Origin,X-Authorization,X-Timestamp,X-Nonce,X-Terminal,X-Signature';
    add_header 'Access-Control-Max-Age' 1728000; #在有效期内不用发出另一条预检请求
    add_header 'Content-Length' 0;
    return 204;
}
```

------

## 4.禁止访问的场景

### 1..forbidden.conf

将 Nginx 禁止访问的地址统一配置在 `/usr/local/nginx1.26/conf/forbidden.conf` 文件中，并在 `server` 块的配置中通过 `include` 指令引入。

```vim
# 访问示例 https://internal-domain.com/.htaccess
# 访问示例 https://internal-domain.com/.env
# 访问示例 https://internal-domain.com/.git
# 访问示例 https://internal-domain.com/.well-known
location ~* /.(htaccess|env|svn|git|well-known|DS_Store) {
    return 403;
}
location ~ /\. {
    deny all;
}

# 访问示例 https://internal-domain.com/api/actuator
# 访问示例 https://internal-domain.com/api/druid/basic.json
# 访问示例 https://internal-domain.com/api/swagger-ui.html
location ~* /(cgi-bin|debug|actuator|druid|swagger|graphql) {
    deny all;
}

# 访问示例 https://internal-domain.com/api/index.asp
# 访问示例 https://internal-domain.com/upload/index.jsp
location ~* \.(asp|ashx|jsp|aspx)$ {
    deny all;
}

# 访问示例 https://internal-domain.com/composer.lock
# 访问示例 https://internal-domain.com/package.json
location ~* /(composer.json|composer.lock|package.json|package-lock.json|web.config) {
    deny all;
}

# 访问示例 https://internal-domain.com/phpmyadmin
location ~* /(wcm|phpmyadmin|Adstxt|sitemap|robots|javascript) {
    deny all;
}

# 访问示例 https://internal-domain.com/vendor/composer/installed.json
location ~* /(vendor)/ {
    deny all;
}

# 访问示例 https://internal-domain.com/phpinfo.php
location ~* /(t.php|test.php|info.php|phpinfo.php) {
    deny all;
}
```

### 2.禁止PHP文件访问

为了防止 `attaches` 目录下的 PHP 文件被访问，在 `server` 块中添加以下配置：

```vim
location ~* ^/attaches/.*\.(php|php5)$ {
    deny all;
}
```

### 3.禁止搜索引擎爬虫访问

打开 Nginx 的配置文件，在 server 块中添加以下内容：

```vim
if ($http_user_agent ~* (googlebot|bingbot|yahoo|baiduspider|yandex|duckduckbot) ) {
    return 403;
}
```