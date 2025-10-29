```yaml
---
kind: Service # 定义 Kubernetes Service 资源
apiVersion: v1 # 使用的 API 版本
metadata:
  name: ${APP_NAME}-${MODULE_NAME}-svc # Service 的名称，使用变量替换
  namespace: ${REGISTRY_NAMESPACE} # Service 所属的命名空间
  labels:
    app: ${APP_NAME}-${MODULE_NAME}-svc # 标签，用于标识该 Service
spec:
  ports:
    - name: http-80 # 端口名称
      protocol: TCP # 使用的协议
      port: 80 # Service 暴露的端口
      targetPort: 80 # 后端 Pod 的目标端口
  selector:
    app: ${APP_NAME}-${MODULE_NAME} # 选择器，用于匹配目标 Pod
  type: NodePort # Service 类型，暴露为 NodePort
  sessionAffinity: None # 会话亲和性设置
  externalTrafficPolicy: Cluster # 外部流量策略
```
