// nav.mts
const createNav = () => {
    return [
        {
            text: "首页", link: '/'
        },
        {
            text: "Devops",
            items: [
                { text: "基础运维", link: "/docs/devops/base/base.md" },
            ],
        },
        {
            text: "Java",
            items: [
                { text: "Java自动化发布", link: "/docs/java/jenkins/jenkins.md" },
                { text: "Spring框架", link: "/docs/java/spring/spring.md" },
                { text: "Mybatis", link: "/docs/java/mybatis/mybatis.md" },
            ],
        },
        {
            text: "database",
            items: [
                { text: "DM数据库", link: "/docs/database/base.md" },
            ],
        },
        {
            text: "项目信息",
            items: [
                { text: "ruoyi", link: "/docs/project/ruoyi/ruoyi.md" },
            ],
        },
    ]

}

export default createNav