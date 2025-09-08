# Linux服务器基础操作

## 一、LVM分盘

### Step1：使用fdisk创建分区

```bash
# 检查磁盘挂载状态
lsblk -f
# 对新磁盘 /dev/sdb 进行分区操作
fdisk /dev/sdb
```

进入fdisk命令交互：

```bash
# 创建一个新分区
n
# 创建主分区（primary）
p
# 设置为分区号1
1
# 更改新分区的类型（默认是Linux分区）
t
# 查看所有支持的分区类型
L
# 设置分区类型为 Linux LVM（代码为8e）
8e
# 写入磁盘并退出 fdisk
w
```

### Step2：创建物理卷

```bash
pvcreate /dev/sdb1
```

> 将新建的 /dev/sdb1 分区初始化为 LVM 的物理卷（PV）。

### Step3：将物理卷扩展到已有的卷组

```bash
vgextend openeuler /dev/sdb1
```

> 将刚刚创建的物理卷 /dev/sdb1 添加到名为 openeuler 的卷组中。

### Step4：创建逻辑卷

```bash
lvcreate -l +100%FREE -n data openeuler
```

> 从 openeuler 卷组中创建一个名为 data 的逻辑卷，使用卷组中的所有剩余空间（100%FREE）。

### Step5：

```bash
mkfs.ext4 /dev/mapper/openeuler-data
```

> 将逻辑卷格式化为 ext4 文件系统，设备路径为 /dev/mapper/openeuler-data。

### Step6：挂载逻辑卷

```bash
# 创建挂载点 /data
mkdir -p /data
# 将逻辑卷挂载到/data目录
mount /dev/mapper/openeuler-data /data
```

------

### Step7：设置开机自动挂载

```bash
echo "/dev/mapper/openeuler-data /data ext4 defaults 1 2" >> /etc/fstab
```

> 将挂载信息写入 /etc/fstab，确保下次开机自动挂载。


## LVM磁盘扩容
### Step1：查看当前逻辑卷信息

```bash
lsblk -f
```
