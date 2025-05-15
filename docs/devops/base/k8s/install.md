# 多节点安装

## 概念

多节点集群由至少一个主节点和一个工作节点组成。可以使用任何节点作为**任务机**来执行安装任务，也可以在安装之前或之后根据需要新增节点（例如，为了实现高可用性）。

- **Control plane node**：主节点，通常托管控制平面，控制和管理整个系统。
- **Worker node**：工作节点，运行部署在工作节点上的实际应用程序。

## 步骤 1：准备 Linux 主机

请参见下表列出的硬件和操作系统要求。在本教程所演示多节点安装示例中，需要按照下列要求准备至少三台主机。如果节点的资源充足，也可以将 [KubeSphere 容器平台](https://kubesphere.com.cn/)安装在两个节点上。

### 系统要求

| 系统                                                         | 最低要求（每个节点）             |
| :----------------------------------------------------------- | :------------------------------- |
| **Ubuntu** *16.04，18.04，20.04*                             | CPU：2 核，内存：4 G，硬盘：40 G |
| **Debian** *Buster，Stretch*                                 | CPU：2 核，内存：4 G，硬盘：40 G |
| **CentOS** *7*.x                                             | CPU：2 核，内存：4 G，硬盘：40 G |
| **Red Hat Enterprise Linux** *7*                             | CPU：2 核，内存：4 G，硬盘：40 G |
| **SUSE Linux Enterprise Server** *15* **/openSUSE Leap** *15.2* | CPU：2 核，内存：4 G，硬盘：40 G |

> [!NOTE]
>
> - `/var/lib/docker` 路径主要用于存储容器数据，在使用和操作过程中数据量会逐渐增加。因此，在生产环境中，建议为 `/var/lib/docker` 单独挂载一个硬盘。
> - CPU 必须为 x86_64，暂时不支持 Arm 架构的 CPU。

### 节点要求

- 所有节点必须都能通过 `SSH` 访问。
- 所有节点时间同步。
- 所有节点都应使用 `sudo`/`curl`/`openssl`/`tar`。

### 容器运行时

集群必须有一个可用的容器运行时。如果使用 KubeKey 搭建集群，KubeKey 会默认安装最新版本的 Docker。也可以在创建集群前手动安装 Docker 或其他容器运行时。

| 支持的容器运行时              | 版本    |
| :---------------------------- | :------ |
| Docker                        | 19.3.8+ |
| containerd                    | 最新版  |
| CRI-O（试验版，未经充分测试） | 最新版  |
| iSula（试验版，未经充分测试） | 最新版  |

### 依赖项要求

KubeKey 可以一同安装 Kubernetes 和 KubeSphere。根据要安装的 Kubernetes 版本，需要安装的依赖项可能会不同。可以参考下表，查看是否需要提前在节点上安装相关依赖项。

| 依赖项      | Kubernetes 版本 ≥ 1.18 | Kubernetes 版本 < 1.18 |
| :---------- | :--------------------- | :--------------------- |
| `socat`     | 必须                   | 可选，但建议安装       |
| `conntrack` | 必须                   | 可选，但建议安装       |
| `ebtables`  | 可选，但建议安装       | 可选，但建议安装       |
| `ipset`     | 可选，但建议安装       | 可选，但建议安装       |

### 网络和 DNS 要求

- 请确保 `/etc/resolv.conf` 中的 DNS 地址可用，否则，可能会导致集群中的 DNS 出现问题。
- 如果网络配置使用防火墙规则或安全组，请务必确保基础设施组件可以通过特定端口相互通信。建议关闭防火墙。有关更多信息，请参见[端口要求](https://kubesphere.io/zh/docs/v3.3/installing-on-linux/introduction/port-firewall/)。
- 支持的 CNI 插件：Calico 和 Flannel。其他插件也适用（例如 Cilium 和 Kube-OVN 等），但请注意它们未经充分测试。 

> [!TIP]
>
> - 建议使用干净的操作系统（即不安装任何其他软件）。否则，可能会产生冲突。
> - 如果从 `dockerhub.io` 下载镜像时遇到问题，建议提前准备仓库的镜像地址（即加速器）。请参见[为安装配置加速器](https://kubesphere.io/zh/docs/v3.4/faq/installation/configure-booster/)或[为 Docker Daemon 配置仓库镜像](https://docs.docker.com/registry/recipes/mirror/#configure-the-docker-daemon)。

本示例包括以下三台主机，其中主节点充当任务机。

| 主机 IP     | 主机名 | 角色                |
| :---------- | :----- | :------------------ |
| 192.168.0.1 | master | control plane, etcd |
| 192.168.0.2 | node1  | worker              |
| 192.168.0.3 | node2  | worker              |
| 192.168.0.4 | node3  | worker              |

## 步骤 2：下载 KubeKey

请按照以下步骤下载 [KubeKey](https://kubesphere.io/zh/docs/v3.4/installing-on-linux/introduction/kubekey)。

```shell
cd /usr/local/src
#访问Github/Googleapi受限
export KKZONE=cn
curl -sfL https://get-kk.kubesphere.io | VERSION=v3.0.13 sh -
```

> [!NOTE]
>
> 下载 KubeKey 后，如果将其传输至访问 Googleapis 同样受限的新机器，请在执行以下步骤之前务必再次执行 `export KKZONE=cn` 命令

------



> [!NOTE]
>
> 执行以上命令会下载最新版 KubeKey，可以修改命令中的版本号下载指定版本。

为 `kk` 添加可执行权限：

```shell
chmod +x kk
```

## 步骤 3：创建集群

对于多节点安装，需要通过指定配置文件来创建集群。

### 1. 创建示例配置文件

命令如下：

```shell
sudo yum install -y conntrack-tools socat
which conntrack  # 应该返回 /usr/bin/conntrack
which socat      # 应该返回 /usr/bin/socat

# 指定kubernetes和kubeSphere版本号，创建相关配置文件
./kk create config --with-kubernetes v1.22.12 --with-kubesphere v3.4.1 -f /usr/local/src/config-sample.yaml
```

> [!NOTE]
>
> - 安装 KubeSphere 3.4 的建议 Kubernetes 版本：v1.20.x、v1.21.x、* v1.22.x、* v1.23.x、* v1.24.x、* v1.25.x 和 * v1.26.x。带星号的版本可能出现边缘节点部分功能不可用的情况。因此，如需使用边缘节点，推荐安装 v1.23。如果不指定 Kubernetes 版本，KubeKey 将默认安装 Kubernetes v1.23.10。有关受支持的 Kubernetes 版本的更多信息，请参见[支持矩阵](https://kubesphere.io/zh/docs/v3.4/installing-on-linux/introduction/kubekey/#支持矩阵)。
> - 如果在此步骤的命令中不添加标志 `--with-kubesphere`，则不会部署 KubeSphere，只能使用配置文件中的 `addons` 字段安装，或者在后续使用 `./kk create cluster` 命令时再次添加这个标志。
> - 如果添加标志 `--with-kubesphere` 时不指定 KubeSphere 版本，则会安装最新版本的 KubeSphere。

### 2. 编辑配置文件

如果不更改名称，那么将创建默认文件 `config-sample.yaml`。编辑文件，以下是多节点集群（具有一个主节点）配置文件的示例。

> [!note]
>
> 若要自定义 Kubernetes 相关参数，请参考 [Kubernetes 集群配置](https://kubesphere.io/zh/docs/v3.4/installing-on-linux/introduction/vars/)。

```yaml
apiVersion: kubekey.kubesphere.io/v1alpha2
kind: Cluster
metadata:
  name: sample
spec:
  hosts:
  - {name: master, address: 192.168.0.1, internalAddress: 10.87.9.7, user: root, password: "TestPassword"}
  - {name: node1, address: 192.168.0.2, internalAddress: 10.87.9.8, user: root, password: "TestPassword"}
  - {name: node2, address: 192.168.0.3, internalAddress: 10.87.9.9, user: root, password: "TestPassword"}
  - {name: node3, address: 192.168.0.4, internalAddress: 10.87.9.10, user: root, password: "TestPassword"}
  roleGroups:
    etcd:
    - master
    control-plane: 
    - master
    worker:
    - node1
    - node2
    - node3
  controlPlaneEndpoint:
    ## Internal loadbalancer for apiservers 
    # internalLoadbalancer: haproxy

    domain: lb.kubesphere.local
    address: ""
    port: 6443
  kubernetes:
    version: v1.22.0
    clusterName: cluster.local
    autoRenewCerts: true
    containerManager: docker
  etcd:
    type: kubekey
  network:
    plugin: calico
    kubePodsCIDR: 10.233.64.0/18
    kubeServiceCIDR: 10.233.0.0/18
    ## multus support. https://github.com/k8snetworkplumbingwg/multus-cni
    multusCNI:
      enabled: false
  registry:
    privateRegistry: ""
    namespaceOverride: ""
    registryMirrors: []
    insecureRegistries: []
  addons: []
```

#### 主机

请参照上方示例在 `hosts` 下列出所有机器并添加详细信息。

`name`：实例的主机名。

`address`：任务机和其他实例通过 SSH 相互连接所使用的 IP 地址。根据环境，可以是公有 IP 地址或私有 IP 地址。例如，一些云平台为每个实例提供一个公有 IP 地址，用于通过 SSH 访问。在这种情况下，可以在该字段填入这个公有 IP 地址。

`internalAddress`：实例的私有 IP 地址。

- 使用密码登录示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, port: 8022, user: ubuntu, password: Testing123}
  ```


> [!NOTE]
>
> 在本教程中，端口 `22` 是 SSH 的默认端口，因此无需将它添加至该 YAML 文件中。否则，需要在 IP 地址后添加对应端口号，如上所示。



- 默认 root 用户示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, password: Testing123}
  ```

- 使用 SSH 密钥的无密码登录示例：

  ```yaml
  hosts:
    - {name: master, address: 192.168.0.2, internalAddress: 192.168.0.2, privateKeyPath: "~/.ssh/id_rsa"}
  ```


> [!TIP]
>
> - 在安装 KubeSphere 之前，可以使用 `hosts` 下提供的信息（例如 IP 地址和密码）通过 SSH 的方式测试任务机和其他实例之间的网络连接。
>
> - 在安装前，请确保端口 `6443` 没有被其他服务占用，否则在安装时会产生冲突（`6443` 为 API 服务器的默认端口）。

#### roleGroups

- `etcd`：etcd 节点名称
- `control-plane`：主节点名称
- `worker`：工作节点名称

#### controlPlaneEndpoint（仅适用于高可用安装）

需要在 `controlPlaneEndpoint` 部分为高可用集群提供外部负载均衡器信息。当且仅当安装多个主节点时，才需要准备和配置外部负载均衡器。请注意，`config-sample.yaml` 中的地址和端口应缩进两个空格，`address` 应为负载均衡器地址。有关详细信息，请参见[高可用配置](https://kubesphere.io/zh/docs/v3.4/installing-on-linux/high-availability-configurations/ha-configuration/)。

#### addons

可以在 `config-sample.yaml` 的 `addons` 字段下指定存储，从而自定义持久化存储插件，例如 NFS 客户端、Ceph RBD、GlusterFS 等。有关更多信息，请参见[持久化存储配置](https://kubesphere.io/zh/docs/v3.4/installing-on-linux/persistent-storage-configurations/understand-persistent-storage/)。

KubeSphere 会默认安装 [OpenEBS](https://openebs.io/)，为开发和测试环境配置 [LocalPV](https://kubernetes.io/docs/concepts/storage/volumes/#local)，方便新用户使用。在本多节点安装示例中，使用了默认存储类型（本地存储卷）。对于生产环境，可以使用 Ceph/GlusterFS/CSI 或者商业存储产品作为持久化存储解决方案。

> [!TIP]
>
> - 可以编辑配置文件，启用多集群功能。有关更多信息，请参见[多集群管理](https://kubesphere.io/zh/docs/v3.4/multicluster-management/)。
>
> - 也可以选择要安装的组件。有关更多信息，请参见[启用可插拔组件](https://kubesphere.io/zh/docs/v3.4/pluggable-components/)。有关完整的 `config-sample.yaml` 文件的示例，请参见[此文件](https://github.com/kubesphere/kubekey/blob/release-2.2/docs/config-example.md)。

完成编辑后，请保存文件。

### 3. 使用配置文件创建集群

```shell
# kubesphere 针对主流系统
# 类似于centos系统环境变量/usr/bin kylin openEuler 系统环境变量不包含/usr/bin
# 安装过程中需要通过kubectl 执行命令导致阻塞
# 存在docker镜像远程仓库不可用的情况，替换docker镜像源地址
whereis kubectl
kubectl: /usr/local/bin/kubectl
cp  /usr/local/bin/kubectl /usr/bin/
kubectl  get ns
```

> [!tip]
>
> * 查看kubectl文件位置，若存在则复制，不存在则执行创建集群命令，到阻塞处查看kubectl文件位置，进行复制。
> * 执行卸载kubernetes和kubeSphere命令后重新创建集群。

```shell
# 根据配置文件创建集群
cd /usr/local/src
export KKZONE=cn
./kk create cluster -f config-sample.yaml

# 根据配置文件卸载kubernetes和kubeSphere
./kk delete cluster -f config-sample.yaml
```

> [!note]
>
> 如果使用其他名称，则需要将上面的 `config-sample.yaml` 更改为自己的文件。

### 4. 验证安装

通过 `<NodeIP:30880` 使用默认帐户和密码 (`admin/P@88w0rd`) 访问 KubeSphere 的 Web 控制台。

> [!note]
>
> 若要访问控制台，需要根据环境配置端口转发规则。还请确保在安全组中打开了端口 `30880`。
