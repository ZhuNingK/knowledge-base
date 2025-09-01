// write your menu in here
const SpringMenu = [
    {
        text: 'Spring',
        collapsed: false,
        items: [
            { text: "Spring", link: "/docs/backend/spring/spring.md" },
            {
                text: 'Springboot',
                collapsed: false,
                items: [
                    {
                        text: "Bean的生命周期",
                        link: "/docs/backend/spring/springboot-life-cycle.md",
                    },
                    {
                        text: "Springboot注解",
                        link: "/docs/backend/spring/springboot-annotation.md",
                    },
                ]
            },
        ],
    }
]

export default SpringMenu;