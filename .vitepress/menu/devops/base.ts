// write your menu in here
const devopsMenu = [
    {
        text: '基础运维',
        collapsed: false,
        items: [
            {
                text: 'linux',
                collapsed: true,
                items: [
                    {
                        text: 'lvm磁盘挂载',
                        link: '/docs/devops/base/linux/lvm.md',
                    },
                    {
                        text: 'lvm磁盘扩容',
                        link: '/docs/devops/base/linux/lvm-extend.md',
                    }
                ]
            },
            {
                text: 'init-server-os',
                collapsed: true,
                items: [
                    {
                        text: '初始化操作系统',
                        link: '/docs/devops/base/server-os/init-os.md',
                    },
                    {
                        text: 'openSSL升级',
                        link: '/docs/devops/base/server-os/upgrade-openssl.md',
                    },
                    {
                        text: 'openSSH升级',
                        link: '/docs/devops/base/server-os/upgrade-openssh.md',
                    },
                    {
                        text: '系统配置优化',
                        link: '/docs/devops/base/server-os/optimization.md',
                    }
                ]
            },
            {
                text: 'java',
                collapsed: true,
                items: [
                    {
                        text: 'java安装',
                        link: '/docs/devops/base/java/install-jdk.md',
                    },
                    {
                        text: 'Maven 安装及配置',
                        link: '/docs/devops/base/java/install-maven.md',
                    }
                ]
            },
            {
                text: 'nginx',
                collapsed: true,
                items: [
                    {
                        text: 'nginx安装',
                        link: '/docs/devops/base/nginx/install.md',
                    },
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
                text: 'harbor',
                collapsed: true,
                items: [
                    {
                        text: 'harbor安装',
                        link: '/docs/devops/base/harbor/install.md',
                    }
                ]
            },
            {
                text: 'jenkins',
                collapsed: true,
                items: [
                    {
                        text: 'k8s流水线',
                        link: '/docs/devops/base/jenkins/k8s/workflow.md',
                    }]
            },
            {
                text: 'nfs',
                collapsed: true,
                items: [
                    {
                        text: 'nfs安装',
                        link: '/docs/devops/base/nfs/install.md',
                    }
                ]
            },
            {
                text: 'ansible',
                collapsed: true,
                items: [
                    {
                        text: 'ansible安装',
                        link: '/docs/devops/base/ansiable/ansible-install.md',
                    },

                ]
            },
            {
                text: 'supervisor',
                collapsed: true,
                items: [
                    {
                        text: 'supervisor安装',
                        link: '/docs/devops/base/supervisor/supervisor-install.md',
                    },
                    {
                        text: 'supervisor配置',
                        link: '/docs/devops/base/supervisor/supervisor-config.md',
                    }
                ]
            }
        ],
    }
]

export default devopsMenu;
