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
        text: 'docker',
        collapsed: false,
        items: [
          {
            text: 'docker安装',
            link: '/docs/devops/base/docker/install.md',
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
