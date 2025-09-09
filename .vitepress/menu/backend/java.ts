// write your menu in here
const JavaMenu = [
    {
        text: 'Spring',
        collapsed: false,
        items: [
            {
                text: 'Springboot',
                collapsed: false,
                items: [
                    {
                        text: "Bean的生命周期",
                        link: "/docs/backend/java/framework/spring/springboot-life-cycle.md",
                    },
                    {
                        text: "Springboot注解",
                        link: "/docs/backend/java/framework/spring/springboot-annotation.md",
                    },
                ]
            },
        ],
    },
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
                        link: "/docs/backend/java/middleware/redis/redisson.md",
                    }
                ]
            },
        ],
    },
    {
        text: 'MinIO',
        collapsed: false,
        items: [
            {
                text: 'MinIO',
                collapsed: false,
                items: [
                    {
                        text: "MinIO工具类",
                        link: "/docs/backend/java/middleware/minio/minio-util.md",
                    }
                ]
            },
        ],
    }
]

export default JavaMenu;