// write your menu in here
const javaJenkinsMenu = [
    {
      text: 'java自动化发布配置',
      collapsed: false,
      items: [
        {
          text: 'k8s配置',
          collapsed: false,
          items: [
            {
              text: '部署配置',
              link: '/docs/java/jenkins/deployment.md',
            },
            {
              text: '服务配置',
              link: '/docs/java/jenkins/service.md',
            },
          ]
        },
      ],
    }
  ]
  
  export default javaJenkinsMenu;