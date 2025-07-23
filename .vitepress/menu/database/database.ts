// write your menu in here
const DatabaseMenu = [
    {
        text: 'SQL',
        collapsed: false,
        items: [
            {
                text: "MYSQL",
                collapsed: true,
                items: [
                    {
                        text: "安装Mysql8.0",
                        link: "docs/database/mysql/install-mysql8.0.md"
                    },
                    {
                        text: "MYSQL基础命令",
                        link: "/docs/database/mysql/base-mysql8.0.md"
                    }
                ]
            },
            {
                text: '达梦数据基础',
                collapsed: false,
                items: [
                    {
                        text: "达梦数据基础命令",
                        link: "/docs/database/dm/base.md",
                    },
                ]
            },
        ],
    }
]

export default DatabaseMenu;