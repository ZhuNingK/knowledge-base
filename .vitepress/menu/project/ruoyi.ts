// write your menu in here
const RuoyiMenu = [
    {
        text: 'Ruoyi',
        collapsed: false,
        items: [
            { text: "Ruoyi框架", link: "/docs/project/ruoyi/ruoyi.md" },
            {
                text: 'ruoyi前后端分离',
                collapsed: false,
                items: [
                    {
                        text: "system模块",
                        link: "/docs/project/ruoyi/system/base.md",
                    },
                ]
            },
        ],
    }
]

export default RuoyiMenu;