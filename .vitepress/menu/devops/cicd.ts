// write your menu in here
const CICDMenu = [
    {
        text: '安装配置',
        collapsed: false,
        items: [
            {
                text: '安装Jenkins',
                link: '/docs/devops/cicd/jenkins-install.md',
            },
            {
                text: 'K8S集群内集成jenkins',
                link: '/docs/devops/cicd/k8s-jenkins-install.md',
            },
            {
                text: 'K8S集群内的Jenkins连接K8S集群配置',
                link: '/docs/devops/cicd/k8s-jenkins-config.md',
            },
        ],
    },
    {
        text: 'jenkins集成K8S',
        collapsed: false,
        items: [
            {
                text: 'springboot-deployment',
                link: '/docs/devops/cicd/jenkins-k8s/springboot-deployment.md',
            },
            {
                text: 'springboot-service.md',
                link: '/docs/devops/cicd/jenkins-k8s/springboot-service.md',
            }
        ],
    }
]

export default CICDMenu;
