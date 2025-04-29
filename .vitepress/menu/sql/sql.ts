// write your menu in here
const SQLMenu = [
    {
        text: 'SQL',
        collapsed: false,
        items: [
            { text: "数据库", link: "/docs/sql/base.md" },
            {
                text: '达梦数据基础',
                collapsed: false,
                items: [
                    {
                        text: "达梦数据基础命令",
                        link: "/docs/sql/dm/base.md",
                    },
                ]
            },
        ],
    }
]

export default SQLMenu;