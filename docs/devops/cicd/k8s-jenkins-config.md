# K8S集群内Jenkins连接K8S集群配置(待完善)

## 1 Jenkins安装插件

插件:

kubernetes

pipeline

docker pipeline

docker

Kubernetes Cli

Config File Provider

Pipeline Utility Steps

Jenkins源: https://mirrors.tuna.tsinghua.edu.cn/jenkins/updates/update-center.json

## 2 云配置
Dashboard > 系统管理 > 节点管理 > configureClouds

参考：[https://github.com/jenkinsci/kubernetes-plugin]

配置完成之后点击连接测试，即可看到提示连接成功和集群版本的信息

这里是配置连接 Kubernetes 集群，启动 Jenkins Slave 代理的相关配置。

*   名称：kubernetes
*   Kubernetes 地址：`kubernetes.default`(默认集群内调用 k8s api 地址)
*   禁用 HTTPS 证书检查：勾选 (不验证 https)
*   凭据：新增凭据—>Secret text—>Secret 设置 kubernetes 的 Token (进入 k8s dashboard 的 token 等都行)
*   Jenkins 地址：`http://jenkins.jenkins:8080`(用于代理与 Jenkins 连接的地址，用的是 k8s 集群中 jenkins 服务的地址为 `http://jenkins 服务名. jenkins 所在 namespace:jenkins 端口号 / jenkins 后缀`
*   其他：默认即可

## 3 Template 模板配置
这里配置 Jenkins Slave 在 kubernetes 集群中启动的 Pod 的配置，这里将设置三个Pod Template，分别是：

*   base：用于拉取代码、打包推送docker镜像与执行kubectl命令
*   nodejs：用于打包vue项目
*   Maven：用于 Maven 编译、打包。

### Pod Template配置

#### base

设置Raw YAML for the Pod

```bash
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-role.kubernetes.io/worker
            operator: In
            values:
            - ci
  tolerations:
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "NoSchedule"
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "PreferNoSchedule"
  containers:
  - name: "base"
    resources:
      requests:
        ephemeral-storage: "1Gi"
      limits:
        ephemeral-storage: "10Gi"
  securityContext:
    fsGroup: 1000
```

#### nodejs

设置Raw YAML for the Pod

```bash
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-role.kubernetes.io/worker
            operator: In
            values:
            - ci
  tolerations:
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "NoSchedule"
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "PreferNoSchedule"
  containers:
  - name: "nodejs"
    resources:
      requests:
        ephemeral-storage: "1Gi"
      limits:
        ephemeral-storage: "10Gi"
  securityContext:
    fsGroup: 1000
```

#### maven

设置Raw YAML for the Pod

```bash
spec:
  affinity:
    nodeAffinity:
      preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 1
        preference:
          matchExpressions:
          - key: node-role.kubernetes.io/worker
            operator: In
            values:
            - ci
  tolerations:
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "NoSchedule"
  - key: "node.kubernetes.io/ci"
    operator: "Exists"
    effect: "PreferNoSchedule"
  containers:
  - name: "maven"
    resources:
      requests:
        ephemeral-storage: "1Gi"
      limits:
        ephemeral-storage: "10Gi"
    volumeMounts:
    - name: config-volume
      mountPath: /opt/apache-maven-3.5.3/conf/settings.xml
      subPath: settings.xml
  volumes:
    - name: config-volume
      configMap:
        name: ks-devops-agent
        items:
        - key: MavenSetting
          path: settings.xml
  securityContext:
    fsGroup: 1000
```

## 4 Pipline配置

vue项目

```bash
pipeline {
  agent {
    kubernetes {
      inheritFrom 'nodejs base'
      yaml """
spec:
  containers:
  - name: pnpm
    image: ianwalter/pnpm
    tty: true
"""
    }
  }

  environment {
    KUBECONFIG_CREDENTIAL_ID = "*************"
    REGISTRY = "*************"
    REGISTRY_NAMESPACE = "*************"
    APP_NAME = "*************"
  }

  stages {
    stage('clone code') {
      agent none
      steps {
        container('base') {
          git(url: '*************', credentialsId: 'gitlab-credential', branch: 'master', changelog: true, poll: false)
        }
      }
    }

    stage('package') {
      agent none
      when {
        environment name: 'METHOD', value: 'deploy'
      }
      steps {
        container('pnpm') {
          sh '''
          node -v
          npm config set registry https://registry.npmmirror.com && npm config set sass_binary_site https://npmmirror.com/mirrors/node-sass
          pnpm install --no-frozen-lockfile
          echo ==========================================================
          pnpm run build
          '''
        }
      }
    }

    stage('build & push') {
      agent none
      when {
        environment name: 'METHOD', value: 'deploy'
      }
      steps {
        container('base') {
          sh '''
          cat >Dockerfile << EOF
FROM busybox

COPY dist /dist
EOF'''
          sh '''
          docker build -f Dockerfile -t ${REGISTRY}/${REGISTRY_NAMESPACE}/${APP_NAME}:${BUILD_NUMBER} .
          '''
          withCredentials([usernamePassword(credentialsId : 'harbor-credential' ,passwordVariable : 'DOCKER_PASSWORD' ,usernameVariable : 'DOCKER_USERNAME' ,)]) {
            sh 'echo "${DOCKER_PASSWORD}" | docker login ${REGISTRY} -u "${DOCKER_USERNAME}" --password-stdin'
            sh 'docker push ${REGISTRY}/${REGISTRY_NAMESPACE}/${APP_NAME}:${BUILD_NUMBER}'
          }
        }
      }
    }

    stage('deploy to k8s') {
      agent none
      when {
        environment name: 'METHOD', value: 'deploy'
      }
      environment {
        VERSION_NUMBER = "${BUILD_NUMBER}"
      }
      steps {
        container ('base') {
            withKubeConfig([credentialsId: "${env.KUBECONFIG_CREDENTIAL_ID}", serverUrl: 'https://kubernetes.default']) {
            sh 'envsubst < k8s/deployment.yaml | kubectl apply -f -'
            sh 'envsubst < k8s/service.yaml | kubectl apply -f -'
          }
        }
      }
    }

    stage('rollback') {
      agent none
      when {
        environment name: 'METHOD', value: 'rollback'
      }
      environment {
        VERSION_NUMBER = "${ROLLBACK_VERSION}"
      }
      steps {
        container ('base') {
            withKubeConfig([credentialsId: "${env.KUBECONFIG_CREDENTIAL_ID}", serverUrl: 'https://kubernetes.default']) {
            sh 'envsubst < k8s/deployment.yaml | kubectl apply -f -'
            sh 'envsubst < k8s/service.yaml | kubectl apply -f -'
          }
        }
      }
    }
  }
}
```
