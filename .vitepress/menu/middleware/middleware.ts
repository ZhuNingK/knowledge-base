// write your menu in here
const middlewareMenu = [
    {
        text: '中间件',
        collapsed: false,
        items: [
            {
                text: 'redis',
                collapsed: true,
                items: [
                    {
                        text: 'redis安装',
                        link: '/docs/middleware/redis/install-redis.md',
                    },
                    {
                        text: 'Redis Cluster 配置',
                        link: '/docs/middleware/redis/redis-cluster.md',
                    },
                ]
            },
            {
                text: 'nacos',
                collapsed: true,
                items: [
                    {
                        text: 'Nacos2.2单机安装',
                        link: '/docs/middleware/nacos/install-nacos2.2.md',
                    },
                    {
                        text: 'Nacos2.5单机安装',
                        link: '/docs/middleware/nacos/install-nacos2.5.md',
                    },
                    {
                        text: 'Nacos集群安装',
                        link: '/docs/middleware/nacos/cluster.md',
                    },
                ]
            },
            {
                text: 'RabbitMQ',
                collapsed: true,
                items: [
                    {
                        text: 'RabbitMQ介绍',
                        link: '/docs/middleware/rabbitmq/introduction.md',
                    },
                    {
                        text: '单节点RabbitMQ3.11安装',
                        link: '/docs/middleware/rabbitmq/install-3.11.md',
                    },
                    {
                        text: 'RabbitMQ镜像集群的搭建及配置',
                        link: '/docs/middleware/rabbitmq/mirror-queues.md',
                    },
                    {
                        text: 'RabbitMQ 延迟队列插件安装',
                        link: '/docs/middleware/rabbitmq/delayed-message-plugin.md'
                    }
                ]
            },
            {
                text: 'Elasticsearch',
                collapsed: true,
                items: [
                    {
                        text: '单节点 Elasticsearch7.17 部署',
                        link: '/docs/middleware/elastic/install-es7.17.md',
                    },
                    {
                        text: 'Elasticsearch7.17集群搭建',
                        link: '/docs/middleware/elastic/install-es7.17-cluster.md',
                    },
                    {
                        text: '单节点 Elasticsearch8.14 部署',
                        link: '/docs/middleware/elastic/install-es8.14.md'
                    },
                    {
                        text: 'Analysis-IK分词插件安装',
                        link: '/docs/middleware/elastic/install-es-analysis-ik.md',
                    },
                    {
                        text: '单节点kibana安装',
                        link: '/docs/middleware/elastic/install-kibana.md'
                    },
                    {
                        text: '单节点kibana8.14安装',
                        link: '/docs/middleware/elastic/install-kibana8.14.md'
                    }
                ]
            },
            {
                text: 'Minio',
                collapsed: true,
                items: [
                    {
                        text: 'Minio单节点安装',
                        link: '/docs/middleware/minio/deploy-minio-snsd.md',
                    },
                ]
            }
        ],
    }
]

export default middlewareMenu;
