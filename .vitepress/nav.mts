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
            text: "Java",
            items: [
                { text: "Spring框架", link: "/docs/java/spring/spring.md" },
                { text: "Mybatis", link: "/docs/java/mybatis/mybatis.md" },
            ],
        },
        {
            text: "database",
            link: '/docs/database/base.md'
        },
    ]

}

export default createNav