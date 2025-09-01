// nav.mts
const createNav = () => {
    return [
        {
            text: "首页", link: '/'
        },
        {
            text: "Devops",
            link: "/docs/devops/base/base.md"
        },
        {
            text: "中间件",
            link: "/docs/middleware/base.md"
        },
        {
            text: "后端",
            items: [
                {text: "Spring框架", link: "/docs/backend/spring/spring.md"},
                {text: "Mybatis", link: "/docs/backend/mybatis/mybatis.md"},
                {text: 'Redis', link: '/docs/backend/redis/redis.md'},
            ],
        },
        {
            text: "database",
            link: '/docs/database/base.md'
        },
    ]

}

export default createNav