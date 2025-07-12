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
      }
    ],
  }
]

export default middlewareMenu;
