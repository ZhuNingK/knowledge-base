# RabbitMQ 延迟队列插件安装

- Community Plugins：https://www.rabbitmq.com/community-plugins
- Github Tags：https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/tags

:::tip 版本映射
- RabbitMQ v3.11.* => RabbitMQ Delayed Message Plugin v3.11.1
- RabbitMQ v3.12.* => RabbitMQ Delayed Message Plugin v3.12.0
- RabbitMQ v3.13.* => RabbitMQ Delayed Message Plugin v3.13.0
:::

本文档基于 RabbitMQ 3.11.x 版本，介绍延迟队列插件的安装与配置方法。

## 1.下载插件

> 下载与 RabbitMQ 版本兼容的 Delayed Message 插件。

```bash
cd /usr/local/src
wget https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/3.11.1/rabbitmq_delayed_message_exchange-3.11.1.ez
```

## 2.移动插件

打印插件目录
```bash
rabbitmq-plugins directories -s
```
:::tip 输出如下内容（部分）
Plugin archives directory: /usr/local/rabbitmq_server3.11/plugins
:::

```bash
mv /usr/local/src/rabbitmq_delayed_message_exchange-3.11.1.ez \
    /usr/local/rabbitmq_server3.11/plugins
```

## 3.启用插件

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

## 4.验证插件

```bash
rabbitmq-plugins list | grep rabbitmq_delayed
```
:::tip 输出如下内容
[E*] rabbitmq_delayed_message_exchange 3.11.1
:::

## 5.参考资料

- https://github.com/rabbitmq/rabbitmq-delayed-message-exchange?tab=readme-ov-file#installation