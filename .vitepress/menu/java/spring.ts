// write your menu in here
const SpringMenu = [
    {
        text: 'Spring',
        collapsed: false,
        items: [
            { text: "Spring框架", link: "/docs/java/spring/spring.md" },
            {
                text: 'Springboot',
                collapsed: false,
                items: [
                    {
                        text: "Bean的生命周期",
                        link: "/docs/java/spring/springboot_life_cycle.md",
                    },
                    {
                        text: "Springboot注解",
                        link: "/docs/java/spring/springboot_annotation.md",
                    },
                ]
            },
        ],
    }
]

export default SpringMenu;