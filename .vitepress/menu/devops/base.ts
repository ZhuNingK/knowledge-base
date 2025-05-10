// write your menu in here
const devopsMenu = [
  {
    text: '基础运维',
    collapsed: false,
    items: [
      {
        text: 'linux',
        collapsed: false,
        items: [
          {
            text: 'linux磁盘挂载',
            link: '/docs/devops/base/linux/LVM.md',
          },
        ]
      },
      {
        text: 'nginx',
        collapsed: false,
        items: [
          {
            text: 'nginx+lua安装',
            link: '/docs/devops/base/nginx/nginx+lua_install.md',
          },
          {
            text: 'nginx基础配置',
            link: 'docs/devops/base/nginx/configuration.md',
          },
          {
            text: 'nginx生产应用',
            link: 'docs/devops/base/nginx/prod.md',
          }
        ]
      },
      {
        text: 'docker',
        collapsed: false,
        items: [
          {
            text: 'docker安装',
            link: '/docs/devops/base/docker/docker-install.md',
          },
          {
            text: 'docker-compose安装',
            link: '/docs/devops/base/docker/docker-compose-install.md',
          }
        ]
      },
      {
        text: 'harbor',
        collapsed: false,
        items: [
          {
            text: 'harbor安装',
            link: '/docs/devops/base/harbor/install.md',
          }
        ]
      },
      {
        text: 'k8s',
        collapsed: false,
        items: [
          {
            text: 'kubeSphere多节点安装',
            link: '/docs/devops/base/k8s/install.md',
          },
          {
            text: 'jenkins+K8s流水线',
            collapsed: false,
            items: [
              {
                text: 'springboot项目-deployment',
                link: '/docs/devops/base/k8s/jenkins/springboot/deployment.md',
              },
              {
                text: 'springboot项目-service',
                link: '/docs/devops/base/k8s/jenkins/springboot/service.md',
              }
            ]
          }
        ]
      },
      {
        text: 'jenkins',
        collapsed: false,
        items: [
          {
            text: 'k8s流水线',
            link: '/docs/devops/base/jenkins/k8s/workflow.md',
          }]
      },
      {
        text: 'nfs',
        collapsed: false,
        items: [
          {
            text: 'nfs安装',
            link: '/docs/devops/base/nfs/install.md',
          }
        ]
      }
    ],
  }
]

export default devopsMenu;
