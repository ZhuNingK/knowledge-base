# Analysis-IK分词插件安装

Github: https://github.com/infinilabs/analysis-ik

官网下载地址：https://release.infinilabs.com/analysis-ik/stable/

:::warning
- 下载的 IK 分词器版本必须与已安装的 Elasticsearch 版本相匹配。如果在 GitHub 上未能找到 Elasticsearch 版本相匹配的 IK 分词器，可访问[官方网站](https://release.infinilabs.com/analysis-ik/stable/)进行下载。（查看Elasticsearch版本：`/usr/local/elasticsearch7.17/bin/elasticsearch -V`）
:::

:::tip
相同版本的 analysis-ik 可通过复制存量项目中的软件包实现安装。
:::

## 一、下载并安装

以 elasticsearch-analysis-ik-7.17.24 为例。

### 0x01.下载并解压安装包

```bash
cd /usr/local/src
wget https://release.infinilabs.com/analysis-ik/stable/elasticsearch-analysis-ik-7.17.24.zip
unzip -o elasticsearch-analysis-ik-7.17.24.zip -d ./elasticsearch-analysis-ik-7.17.24
mv ./elasticsearch-analysis-ik-7.17.24 /usr/local/elasticsearch7.17/plugins/elasticsearch-analysis-ik
```
### 0x02.重启Elasticsearch

```bash
systemctl restart elasticsearch7.17
``` 

### 0x03.查看插件列表

```bash
/usr/local/elasticsearch7.17/bin/elasticsearch-plugin list
```

## 二、测试验证分词

```bash
curl -u elastic:'<pwd>' \
    -X POST localhost:9200/_analyze?pretty \
    -H 'Content-Type: application/json' \
    -d'{"analyzer": "ik_smart", "text": "中华人民共和国国歌"}'
```

## 三、参考资料

- https://blog.csdn.net/weixin_43304253/article/details/129807485
- https://github.com/infinilabs/analysis-ik