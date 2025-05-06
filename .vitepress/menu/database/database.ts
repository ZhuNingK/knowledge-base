// write your menu in here
const DatabaseMenu = [
    {
        text: 'SQL',
        collapsed: false,
        items: [
            { text: "数据库", link: "/docs/database/base.md" },
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