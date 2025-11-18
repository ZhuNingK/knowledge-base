# Composer 安装

Composer 是 PHP 用来管理依赖（dependency）关系的工具。你可以在自己的项目中声明所依赖的外部工具库（libraries），Composer 会帮你安装这些依赖的库文件。

官网：https://getcomposer.org/

阿里云 Composer 全量镜像：https://developer.aliyun.com/composer

## 下载&安装

> 安装前需确保已经安装了 PHP（打开命令行窗口并执行 `php -v` 查看是否正确输出版本号）。

```bash
cd /usr/local/src
```

下载安装脚本
```bash
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
```

执行安装过程
```bash
php composer-setup.php
```

删除安装脚本
```bash
php -r "unlink('composer-setup.php');"
```

## 设置全局变量

将 Composer 安装到系统环境变量 PATH 所包含的路径下面，然后就能够在命令行窗口中直接执行 composer 命令了。

> 前提：/usr/local/php73/bin 已注入到全局路径中

```bash
mv composer.phar /usr/local/php73/bin/composer
```

查看版本
```bash
composer --version
```

输出如下内容
```vim
  ______
  / ____/___  ____ ___  ____  ____  ________  _____
 / /   / __ \/ __ `__ \/ __ \/ __ \/ ___/ _ \/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ (__  )  __/ /
\____/\____/_/ /_/ /_/ .___/\____/____/\___/_/
                    /_/
Composer version 2.5.5 2023-03-21 11:50:05
```