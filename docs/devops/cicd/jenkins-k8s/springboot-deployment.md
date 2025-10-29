```yaml
---
kind: Deployment
apiVersion: apps/v1
metadata:
  name: ${APP_NAME}-${MODULE_NAME} # 部署名称，由应用名和模块名组成
  namespace: ${REGISTRY_NAMESPACE} # 命名空间
  labels:
    app: ${APP_NAME}-${MODULE_NAME} # 标签，用于标识应用
spec:
  replicas: 1 # 副本数量
  selector:
    matchLabels:
      app: ${APP_NAME}-${MODULE_NAME} # 匹配的标签
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: ${APP_NAME}-${MODULE_NAME} # 模板标签
    spec:
      volumes:
        - name: host-time # 挂载主机时间
          hostPath:
            path: /etc/localtime # 主机时间路径
            type: ''
        - name: localdata # 临时数据存储卷
          emptyDir: {}
      initContainers:
        - name: code-init # 初始化容器名称
          image: ${REGISTRY}/${REGISTRY_NAMESPACE}/${APP_NAME}-${MODULE_NAME}:${VERSION_NUMBER} # 初始化容器镜像
          command:
            - sh
          args:
            - '-c'
            - cp /code/${JAR_NAME} /localdata # 将代码复制到临时目录
          ports:
            - name: http-80 # 暴露的端口名称
              containerPort: 80 # 容器端口
              protocol: TCP # 协议
          resources: {} # 资源限制
          volumeMounts:
            - name: host-time # 挂载主机时间卷
              readOnly: true
              mountPath: /etc/localtime # 挂载路径
            - name: localdata # 挂载临时数据卷
              mountPath: /localdata # 挂载路径
          imagePullPolicy: IfNotPresent # 镜像拉取策略
      containers:
        - name: java # 主容器名称
          image: 'openjdk:8u275-jre' # 主容器镜像
          command:
            - sh
          args:
            - '-c'
            - >-
              java -jar -Xms256m -Xmx256m
              -Dspring.profiles.active=${PROFILES_ACTIVE} -Dserver.port=80
              /code/${JAR_NAME} # 启动 Java 应用的命令
          ports:
            - name: http-80 # 暴露的端口名称
              containerPort: 80 # 容器端口
              protocol: TCP # 协议
          env:
            - name: TZ # 设置时区环境变量
              value: Asia/Shanghai # 时区值
          resources: {} # 资源限制
          volumeMounts:
            - name: host-time # 挂载主机时间卷
              readOnly: true
              mountPath: /etc/localtime # 挂载路径
            - name: localdata # 挂载临时数据卷
              mountPath: /code # 挂载路径
          imagePullPolicy: IfNotPresent # 镜像拉取策略
      restartPolicy: Always # 重启策略
      terminationGracePeriodSeconds: 30 # 优雅终止时间
      dnsPolicy: ClusterFirst # DNS 策略
      imagePullSecrets:
        - name: harbor-registry-secret # 镜像拉取密钥
  strategy:
    type: RollingUpdate # 滚动更新策略
    rollingUpdate:
      maxUnavailable: 25% # 最大不可用副本数
      maxSurge: 25% # 最大新增副本数
  revisionHistoryLimit: 10 # 修订历史限制
  progressDeadlineSeconds: 600 # 更新进度超时时间
```
