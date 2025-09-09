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
                {text: "java", link: "/docs/backend/java/jvm/base.md"},
            ],
        },
        {
            text: "database",
            link: '/docs/database/base.md'
        },
    ]

}

export default createNav