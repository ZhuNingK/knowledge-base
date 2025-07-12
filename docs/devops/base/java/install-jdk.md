# JDK安装

- [Java Development Kit 8 Update Release Notes](https://www.oracle.com/java/technologies/javase/8u-relnotes.html)
- [Listing of Java Development Kit 11 Release Notes](https://www.oracle.com/java/technologies/javase/11u-relnotes.html)

:::tip
- 所有源码包下载到 /usr/local/src 中
- 软件安装到 /usr/local 中，并以软件名及主次版本号命名，如 java8
- **如果系统环境中需要同时存在 JDK8 和 JDK11，环境变量默认使用 JDK8**
- **业务开发中，团队约定使用 JDK8（`jdk-8u*-linux-x64.tar.gz`）**
:::

## 一、基于tar.gz包安装JDK8

### 0x01.下载

:::tip
- 官网下载需要登录，地址：https://www.oracle.com/java/technologies/downloads/#java8
- 截止2023年7月，JDK8 最新稳定版为 jdk-8u371-linux-x64.tar.gz
:::

:::warning
软件包下载比较慢的情况下，可下载团队软件库中对应的安装包。命令示例：`wget <Software Download Link> -O <Software Package Name>`。
:::

```bash
cd /usr/local/src
```

### 0x02.安装

```bash
tar zxf jdk-8u371-linux-x64.tar.gz
mv jdk1.8.0_371 /usr/local/jdk8
```

### 0x03.添加环境变量

```bash
echo 'PATH=$PATH:/usr/local/jdk8/bin
export PATH' >> /etc/profile

echo 'JAVA_HOME=/usr/local/jdk8' >> /etc/profile

# 刷新环境变量
source /etc/profile
```

### 0x04.验证是否安装成功

```bash
java -version
```

:::tip 输出如下内容
java version "1.8.0_371" <br>
Java(TM) SE Runtime Environment (build 1.8.0_371-b11) <br>
Java HotSpot(TM) 64-Bit Server VM (build 25.371-b11, mixed mode)
:::

## 二、基于tar.gz包安装JDK11

### 0x01.下载

:::tip
- 官网下载需要登录，地址：https://www.oracle.com/java/technologies/downloads/#java11
- 截止2025年6月2日，JDK11 最新稳定版为 11.0.27
:::

:::warning
软件包下载比较慢的情况下，可下载团队软件库中对应的安装包。命令示例：`wget <Software Download Link> -O <Software Package Name>`。
:::

```bash
cd /usr/local/src
```

### 0x02.安装

```bash
tar zxf jdk-11.0.27_linux-x64_bin.tar.gz
cp -r jdk-11.0.27 /usr/local/jdk11
```

### 0x03.添加环境变量

:::warning
约定在添加JDK11环境变量前，先检查/etc/profile文件中是否已配置JDK8的环境变量。若存在JDK8的配置，请确保新增JDK11环境变量时保留原有配置，避免覆盖JDK8的相关设置。
:::

```bash
echo 'PATH=$PATH:/usr/local/jdk11/bin
export PATH' >> /etc/profile
echo 'JAVA_HOME=/usr/local/jdk11' >> /etc/profile
```

刷新环境变量
```bash
source /etc/profile
```

### 0x04.验证是否安装成功

```bash
/usr/local/jdk11/bin/java -version
```
:::tip 输出如下内容
```vim
java version "11.0.27" 2025-04-15 LTS
Java(TM) SE Runtime Environment 18.9 (build 11.0.27+8-LTS-232)
Java HotSpot(TM) 64-Bit Server VM 18.9 (build 11.0.27+8-LTS-232, mixed mode)
```
:::

## 三、参考资料