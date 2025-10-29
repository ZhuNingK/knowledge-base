// write your menu in here
const ContainerMenu = [
    {
        text: '容器',
        collapsed: false,
        items: [
            {
                text: 'docker',
                collapsed: false,
                items: [
                    {
                        text: 'docker通过二进制文件安装',
                        link: '/docs/devops/container/docker/install-by-binaries.md',
                    },
                    {
                        text: 'docker通过yum安装',
                        link: '/docs/devops/container/docker/install-by-yum.md',
                    },
                    {
                        text: 'docker-compose安装',
                        link: '/docs/devops/container/docker/install-docker-compose.md',
                    },
                    {
                        text: 'docker常用命令',
                        link: '/docs/devops/container/docker/docker-commands.md',
                    }
                ]
            },
            {
                text: 'kubernetes',
                collapsed: false,
                items: [
                    {
                        text: 'kubernetes集群搭建',
                        link: '/docs/devops/container/kubernetes/kubernetes-install/Kubernetes-base-install.md',
                    },
                    {
                        text: 'kubernetes对接外部存储',
                        link: '/docs/devops/container/kubernetes/kubernetes-install/kubernetes-nfs.md',
                    },
                    {
                        text: 'kubernetes常用命令',
                        link: '/docs/devops/container/kubernetes/kubernetes-install/kubectl.md',
                    }
                ]
            },
            {
                text: 'helm',
                collapsed: false,
                items: [
                    {
                        text: 'helm安装',
                        link: '/docs/devops/container/helm/install-helm3-by-binaries.md',
                    }
                ]
            },

        ]
    }
]

export default ContainerMenu;
