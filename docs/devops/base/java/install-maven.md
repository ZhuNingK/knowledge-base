# Maven 安装及配置

Apache Maven是一个软件项目管理和理解工具。Maven基于项目对象模型(POM)的概念，可以从一个中心信息段管理项目的构建、报告和文档。

- 官网下载地址：https://archive.apache.org/dist/maven/maven-3
- Maven Releases History：https://maven.apache.org/docs/history.html#maven-3-8-x

:::tip 约定
- 源码包统一放置于 /usr/local/src 目录
- 软件安装到 /usr/local 中，并以软件名及主次版本号命名，如 apache-maven-3.9
- 截止2023年7月27日，Maven 3.8.x+ 系列最新版本为 v3.9.3
:::


## 下载tar.gz安装包并安装

:::tip 镜像地址
- 清华大学开源软件镜像站：https://mirrors.tuna.tsinghua.edu.cn/apache/maven/maven-3
:::

```bash
cd /usr/local/src
wget https://archive.apache.org/dist/maven/maven-3/3.9.3/binaries/apache-maven-3.9.3-bin.tar.gz
tar -zxvf apache-maven-3.9.3-bin.tar.gz
cp -r /usr/local/src/apache-maven-3.9.3 /usr/local/apache-maven-3.9
```

## 添加并刷新环境变量

```bash
echo '
PATH=$PATH:/usr/local/apache-maven-3.9/bin
export PATH' >> /etc/profile

# 刷新环境变量
source /etc/profile
```

## 常用命令

```bash
# 查看 mvn 的版本
mvn -v
```

## 修改镜像地址


修改 /usr/local/apache-maven-3.9/conf/settings.xml 文件中的`mirrors`块


```xml
<mirrors>

。。。。。。

<mirror>
    <id>aliyunmaven</id>
    <mirrorOf>*</mirrorOf>
    <name>阿里云公共仓库</name>
    <url>https://maven.aliyun.com/repository/public</url>
</mirror>

。。。。。。

</mirrors>
```

## 参考资料

- https://developer.aliyun.com/mvn/guide