# kubectl

## 启用 kubectl 自动补全

KubeKey 不会启用 kubectl 自动补全功能，请参见以下内容并将其打开：

> [!note]
>
> 请确保已安装 bash-autocompletion 并可以正常工作。

```shell
# Install bash-completion
apt-get install bash-completion
# Source the completion script in your ~/.bashrc file
echo 'source <(kubectl completion bash)' >>~/.bashrc
# Add the completion script to the /etc/bash_completion.d directory
kubectl completion bash >/etc/bash_completion.d/kubectl
```

详细信息[见此](https://kubernetes.io/docs/tasks/tools/install-kubectl/#enabling-shell-autocompletion)。

## kubectl常用命令

```bash

```

