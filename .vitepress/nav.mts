// nav.mts
const createNav = () => {
    return [
        {
            text: "首页", link: '/'
        },
        {
            text: "Devops",
            items: [
                {text: "基础运维", link: "/docs/devops/base/base.md"},
                {text: "容器", link: "/docs/devops/container/base.md"},
                {text: "CI/CD", link: "/docs/devops/cicd/jenkins-install.md"},
                {text: "监控", link: "/docs/devops/monitor/prometheus/config/prometheus-install.md"},
            ],
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