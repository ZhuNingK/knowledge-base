// write your menu in here
const RedisMenu = [
    {
        text: 'Redis',
        collapsed: false,
        items: [
            {
                text: 'Redisson',
                collapsed: false,
                items: [
                    {
                        text: "分布式锁-看门狗",
                        link: "/docs/backend/redis/redisson.md",
                    }
                ]
            },
        ],
    }
]

export default RedisMenu;