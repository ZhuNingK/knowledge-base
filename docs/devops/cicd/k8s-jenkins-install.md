# K8S集群内集成jenkins

创建一个名为jenkins的命名空间，便于环境区别

```bash
[root@master /]# kubectl create namespace jenkins
namespace/jenkins created
```

创建jenkins文件夹，便于存放yaml文件
```bash
[root@master /]# cd /data/
[root@master /]# mkdir jenkins
```

## 1 创建serviceAccount服务账户

:::tip
在Kubernetes中，Service Account（服务账户）是用来定义运行在Pod中的进程（容器）对Kubernetes API的访问权限的身份。
:::

```bash
vim jenkins-sa.yaml
```

```bash
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: jenkins
  namespace: jenkins
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: jenkins
rules:
- apiGroups:
  - '*'
  resources:
  - statefulsets
  - services
  - replicationcontrollers
  - replicasets
  - podtemplates
  - podsecuritypolicies
  - pods
  - pods/log
  - pods/exec
  - podpreset
  - poddisruptionbudget
  - persistentvolumes
  - persistentvolumeclaims
  - jobs
  - endpoints
  - deployments
  - deployments/scale
  - daemonsets
  - cronjobs
  - configmaps
  - namespaces
  - events
  - secrets
  verbs:
  - create
  - get
  - watch
  - delete
  - list
  - patch
  - update
- apiGroups:
  - ""
  resources:
  - nodes
  verbs:
  - get
  - list
  - watch
  - update
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  annotations:
    rbac.authorization.kubernetes.io/autoupdate: "true"
  labels:
    kubernetes.io/bootstrapping: rbac-defaults
  name: jenkins
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: jenkins
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: Group
  name: system:serviceaccounts:jenkins
```

创建服务账号

"jenkins-sa.yaml"创建"jenkins"clusterRole、"jenkins"ServiceAccount，并将"clusterRole"绑定到服务帐户。

```bash
[root@master /]# kubectl apply -f jenkins-sa.yaml

clusterrole.rbac.authorization.k8s.io/jenkins created
serviceaccount/jenkins created
clusterrolebinding.rbac.authorization.k8s.io/jenkins created
```

## 2 创建持久化清单

```bash
vim jenkins-pvc.yaml
```

```bash
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: jenkins-pvc
  namespace: jenkins
spec:
  storageClassName: nfs
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 100Gi
```

```bash
[root@master /]# kubectl apply -f jenkins-pvc.yaml

persistentvolumeclaim/jenkins-pvc created
```

## 3 创建deployment

```bash
vim jenkins-deployment.yaml
```

```bash
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jenkins
  namespace: jenkins
spec:
  replicas: 1
  selector:
    matchLabels:
      app: jenkins
  template:
    metadata:
      labels:
        app: jenkins
    spec:
      serviceAccountName: jenkins
      containers:
        - name: jenkins
          image: jenkins/jenkins:2.379
          ports:
          - containerPort: 8080
          - containerPort: 50000
          env:
          - name: TZ
            value: Asia/Shanghai
          volumeMounts:
          - name: jenkins-home
            mountPath: /var/jenkins_home
      volumes:
        - name: jenkins-home
          persistentVolumeClaim:
            claimName: jenkins-pvc     #指定前面创建的PVC
```

```bash
[root@master /]# kubectl apply -f jenkins-deployment.yaml

persistentvolumeclaim/jenkins-deployment created
```

## 4 创建service

```bash
vim jenkins-service.yaml
```

```bash
apiVersion: v1
kind: Service
metadata:
name: jenkins
namespace: jenkins
spec:
type: NodePort
ports:
- name: http
  port: 8080
  targetPort: 8080
  nodePort: 31400
- name: agent
  port: 50000
  targetPort: 50000
  nodePort: 31401
  selector:
  app: jenkins
```

```bash
[root@master /]# kubectl apply -f jenkins-service.yaml

persistentvolumeclaim/jenkins-service created
```

这个时候已经能访问了，master节点的IP:31400，http://10.1.0.26:31400/，线上建议配置ingress-nginx代理出来。

获取初始密码：

jenkins-5c467dd648-cqm4z（容器名）

```bash
[root@master /]# kubectl logs -f jenkins-5c467dd648-cqm4z -n jenkins
```

```bash
*************************************************************
*************************************************************
*************************************************************

Jenkins initial setup is required. An admin user has been created and a password generated.
Please use the following password to proceed to installation:

b0220b19ba96458bb19df873e2c86149

This may also be found at: /var/jenkins_home/secrets/initialAdminPassword

*************************************************************
*************************************************************
*************************************************************
```

## 5 参考资料

- [k8s安装jenkins](https://blog.csdn.net/qq_45589444/article/details/135160484)
- [k8s中部署Jenkins](https://blog.csdn.net/weixin_45623111/article/details/139226764)