# Linux - 通过LVM对磁盘进行动态扩容 (Linux的逻辑卷)

[引用 来源](https://www.cnblogs.com/shoufeng/p/10615452.html)

## 1 LVM是什么

### 1.1 概念解释

LVM(Logical Volume Manager), 逻辑卷管理, 是一种将一至多个硬盘的分区在逻辑上进行组合, 当成一个大硬盘来使用.
当硬盘空间不足时, 可以动态地添加其它硬盘的分区到已有的卷组中 —— 磁盘空间的动态管理.

### 1.2 为什么用LVM

LVM通常用于装备大量磁盘的系统, 比如服务器中的磁盘阵列.
但LVM同样适用于仅有一、两块硬盘的小系统.

#### 1.2.1 不使用LVM时的扩容思路

传统的文件系统是基于分区的, 一个文件系统对应一个分区, 这种方式比较直观, 但不易改变:

:::tip
(1) 不同的分区相互独立, 单独的文件不能跨分区存储, 容易出现硬盘的利用率不均衡;
(2) 当一个文件系统/分区装满时, 是不能对其进行扩容的, 只能采用重新分区/建立文件系统, 重新分区会丢失数据, 就要:
① 做数据的迁移和备份;
② 或者把分区中的数据移到另一个更大的分区中;
③ 或者采用符号连接的方式使用其它分区的空间 —— 都非常麻烦;
(3) 如果要把硬盘上的多个分区合并在一起使用, 只能采用重新分区的方式, —— 需要做好数据的备份与恢复.
:::

#### 1.2.2 使用LVM时的扩容思路

使用LVM时技术时, 情况有所不同:
:::tip
(1) 硬盘的多个分区由LVM统一管理为卷组, 可以很轻松地加入或移走某个分区 —— 也就是扩大或减小卷组的可用容量, 充分利用硬盘空间;
(2) 文件系统建立在逻辑卷上, 而逻辑卷可以根据需要改变大小(在卷组容量范围内)以满足要求;
(3) 文件系统建立在LVM上, 可以跨分区存储访问, 更加方便;
:::
- **强烈建议对拥有多个磁盘的系统, 使用LVM管理磁盘**

### 1.3 名词解释
:::tip
PV(Physical Volume): 物理卷, 处于LVM最底层, 可以是物理硬盘或者分区;
PP(Physical Extend): 物理区域, PV中可以用于分配的最小存储单元, 可以在创建PV的时候指定, 如1M, 2M, 4M, 8M…..组成同一VG中所有PV的PE大小应该相同;
VG(Volume Group): 卷组, 建立在PV之上, 可以含有一个到多个PV;
LV(Logical Volume): 逻辑卷, 建立在VG之上, 相当于原来分区的概念, 不过大小可以动态改变.
:::

## 2 普通的挂载磁盘方法

### 2.1 创建分区的主要操作

- 查看分区情况 - `fdisk -l`

```bash
[root@localhost ~]# fdisk -l

Disk /dev/sda: 299.0 GB, 298999349248 bytes			# 磁盘/dev/sda
255 heads, 63 sectors/track, 36351 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x4d69fe0e

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *           1          26      204800   83  Linux		# 分为2个区, sda1
Partition 1 does not end on cylinder boundary.
/dev/sda2              26       36352   291785728   8e  Linux LVM	# sda2

# 磁盘/dev/sdb没有分区
Disk /dev/sdb: 4000.0 GB, 3999999721472 bytes
255 heads, 63 sectors/track, 486305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

......
```

- 查看已有磁盘 - `lsblk`

```bash
[root@localhost ~]# lsblk 
NAME                       MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda                          8:0    0 278.5G  0 disk 
├─sda1                       8:1    0   200M  0 part /boot
└─sda2                       8:2    0 278.3G  0 part 
  └─VolGroup-LogVol (dm-0) 253:0    0   1.9T  0 lvm  /		# LVM类型的分区
sdb                          8:32   0   3.7T  0 disk 		# 还没有分区的新磁盘

```

- 对新磁盘进行分区 - `fdisk /dev/sdb`

```bash
[root@localhost ~]# fdisk /dev/sdb 
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0xf91f8c4c.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.

Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)

WARNING: The size of this disk is 4.0 TB (4000225165312 bytes).
DOS partition table format can not be used on drives for volumes
larger than (2199023255040 bytes) for 512-byte sectors. Use parted(1) and GUID 
partition table format (GPT).


WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
         switch off the mode (command 'c') and change display units to
         sectors (command 'u').

Command (m for help): n				# n 表示新建分区
Command action
   e   extended
   p   primary partition (1-4)
p									# p 表示分区类型为主分区, 主分区只有1-4种选择
Partition number (1-4): 1			# 主分区的编号
First cylinder (1-486333, default 1): 	# 开始扇区号, 直接回车, 使用默认值1
Using default value 1

# 结束扇区号, 使用默认值 --- 这里只加载了新磁盘的一半(2T), 所以还需要再次创建分区/dev/sdb2使用剩下的一半.
Last cylinder, +cylinders or +size{K,M,G} (1-267349, default 267349): 	
Using default value 267349

Command (m for help):  w			#  将上述设置写入分区表并退出
The partition table has been altered!

Calling ioctl() to re-read partition table.
Syncing disks.
```

- 再次查看分区情况 - `fdisk -l`

```bash
[root@localhost ~]# fdisk -l 

Disk /dev/sda: 299.0 GB, 298999349248 bytes
255 heads, 63 sectors/track, 36351 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x4d69fe0e

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *           1          26      204800   83  Linux
Partition 1 does not end on cylinder boundary.
/dev/sda2              26       36352   291785728   8e  Linux LVM

# /dev/sdb磁盘: 
Disk /dev/sdb: 4000.0 GB, 3999999721472 bytes
255 heads, 63 sectors/track, 486305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x8f3043b5

# 多出来的分区/dev/sdb1
   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1               1      267349  2147480811   83  Linux

......
```

- 查看当前分区表中的分区信息 - `cat /proc/partitions`

```bash
[root@localhost ~]# cat /proc/partitions 
major minor  #blocks  name

   8        0   291991552  sda
   8        1      204800  sda1
   8        2   291785728  sda2
   8       32  3906249728  sdb		# 添加的新磁盘
   8       33  2147480811  sdb1		# 创建的新分区
 253        0  2046660608  dm-0
```

如果创建完之后，`cat /proc/partitions` 查看不到对应的分区, 使用 `parprobe` 刷新命令即可:
```bash
[root@localhost ~]# partprobe /dev/sdc
```

### 2.2 格式化分区

- 格式化新分区 - ` mkfs -t`
这里建议将新分区格式化为`ext4`文件类型, 还有`ext2`, `ext3`等文件类型,区别请参考博客 [`ext2`、`ext3`与`ext4`的区别](https://blog.csdn.net/macrossdzh/article/details/5973639).

```bash
[root@localhost ~]# mkfs -t ext4 /dev/sdb1
mke2fs 1.41.12 (17-May-2010)
Filesystem label=
OS type: Linux
Block size=4096 (log=2)
Fragment size=4096 (log=2)
Stride=0 blocks, Stripe width=0 blocks
134217728 inodes, 536870202 blocks
26843510 blocks (5.00%) reserved for the super user
First data block=0
Maximum filesystem blocks=4294967296
16384 block groups
32768 blocks per group, 32768 fragments per group
8192 inodes per group
Superblock backups stored on blocks: 
        32768, 98304, 163840, 229376, 294912, 819200, 884736, 1605632, 2654208, 
        4096000, 7962624, 11239424, 20480000, 23887872, 71663616, 78675968, 
        102400000, 214990848, 512000000

Writing inode tables:  8874/16384
```

- 等待一小会后, 将出现下述提示, 说明格式化完成:

```bash
Writing inode tables: done                            
Creating journal (32768 blocks): done
Writing superblocks and filesystem accounting information:  done

This filesystem will be automatically checked every 26 mounts or
180 days, whichever comes first.  Use tune2fs -c or -i to override.
```

### 2.3 挂载新分区

- 创建目录, 并将 `/dev/sdb1`挂在到该目录下:

```bash
[root@localhost /]# mkdir data && cd /data
[root@localhost data]# mount /dev/sdc1 /data
```

- 查看挂载是否成功:

```bash
[root@localhost data]# df -l
Filesystem                   1K-blocks       Used  Available Use% Mounted on
/dev/mapper/VolGroup-LogVol  286901696   18601728  253726196   7% /
tmpfs                         66020980          0   66020980   0% /dev/shm
/dev/sda1                       495844      33476     436768   8% /boot

# 挂载成功: 
/dev/sdb1                   2113784984     202776 2006208168   1% /data
```

### 2.4 设置开机自动挂载

- 编辑`/etc/fstab`文件, 添加如下内容:

```bash
[root@localhost data]# vim /etc/fstab

# 文件内容如下: 
# /etc/fstab
# Created by anaconda on Wed Sep 12 10:41:40 2018
#
# Accessible filesystems, by reference, are maintained under '/dev/disk'
# See man pages fstab(5), findfs(8), mount(8) and/or blkid(8) for more info
#
/dev/mapper/VolGroup-LogVol  /                     ext4    defaults        1 1
/dev/sdb1                    /data                 ext4    defaults        1 1
UUID=22b1d425-d050-43c3-a735-06d48bbb9051 /boot    ext4    defaults        1 2 
tmpfs                        /dev/shm              tmpfs   defaults        0 0
devpts                       /dev/pts              devpts  gid=5,mode=620  0 0
sysfs                        /sys                  sysfs   defaults        0 0
proc                         /proc                 proc    defaults        0 0
```

## 3 LVM方式挂载磁盘 - 推荐

### 3.1 查看磁盘容量信息

```bash
[root@localhost ~]# df -h
Filesystem               Size  Used  Avail  Use%  Mounted on
/dev/mapper/VG-LogVol    1.9T  1.8T    61G   97%  /			 # LVM卷组-逻辑卷
tmpfs                     63G     0    63G    0%  /dev/shm
/dev/sda1                485M   40M   421M    9%  /boot

```

### 3.2 查看磁盘扇区信息

```bash
[root@localhost ~]# fdisk -l

Disk /dev/sda: 299.0 GB, 298999349248 bytes			# 磁盘/dev/sda
255 heads, 63 sectors/track, 36351 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x4d69fe0e

   Device Boot      Start         End      Blocks   Id  System
/dev/sda1   *           1          26      204800   83  Linux		# 分为2个区, sda1
Partition 1 does not end on cylinder boundary.
/dev/sda2              26       36352   291785728   8e  Linux LVM	# LVM类型的sda2

# 新添加的磁盘/dev/sdb, 没有分区
Disk /dev/sdb: 4000.0 GB, 3999999721472 bytes
255 heads, 63 sectors/track, 486305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000

# LVM格式的卷组信息: 
Disk /dev/mapper/VolGroup-LogVol: 4294 MB, 4294967296 bytes
255 heads, 63 sectors/track, 522 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x00000000
```

### 3.3 创建分区

```bash
[root@localhost ~]# fdisk /dev/sdb
Device contains neither a valid DOS partition table, nor Sun, SGI or OSF disklabel
Building a new DOS disklabel with disk identifier 0x5b3d66ba.
Changes will remain in memory only, until you decide to write them.
After that, of course, the previous content won't be recoverable.

Warning: invalid flag 0x0000 of partition table 4 will be corrected by w(rite)

WARNING: The size of this disk is 4.0 TB (3999999721472 bytes).
DOS partition table format can not be used on drives for volumes
larger than (2199023255040 bytes) for 512-byte sectors. Use parted(1) and GUID 
partition table format (GPT).


WARNING: DOS-compatible mode is deprecated. It's strongly recommended to
         switch off the mode (command 'c') and change display units to
         sectors (command 'u').

Command (m for help): n			# 添加分区
Command action
   e   extended
   p   primary partition (1-4)
p								# 添加主分区
Partition number (1-4): 1		# 1号主分区, 即/dev/sdb1
First cylinder (1-486305, default 1):               
Using default value 1
Last cylinder, +cylinders or +size{K,M,G} (1-267349, default 267349): 486305
Value out of range.
Last cylinder, +cylinders or +size{K,M,G} (1-267349, default 267349): 
Using default value 267349

Command (m for help): n			# 继续添加分区
Command action
   e   extended
   p   primary partition (1-4)
p
Partition number (1-4): 2		# 2号主分区, 即/dev/sdc2
First cylinder (267350-486305, default 267350): 
Using default value 267350
Last cylinder, +cylinders or +size{K,M,G} (267350-486305, default 486305): 
Using default value 486305

Command (m for help): p			# 打印分区信息: 

Disk /dev/sdb: 4000.0 GB, 3999999721472 bytes
255 heads, 63 sectors/track, 486305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x5b3d66ba

   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1               1      267349  2147480811   83  Linux
/dev/sdb2          267350      486305  1758764070   83  Linux

Command (m for help): t			# 转换类型
Partition number (1-4): 1
Partition number (1-4): 1			# 修改/dev/sdb1为Linux LVM类型: 
Hex code (type L to list codes): L 	# 查看可用类型: 

 0  Empty           24  NEC DOS         81  Minix / old Lin bf  Solaris        
 1  FAT12           39  Plan 9          82  Linux swap / So c1  DRDOS/sec (FAT-
 2  XENIX root      3c  PartitionMagic  83  Linux           c4  DRDOS/sec (FAT-
 3  XENIX usr       40  Venix 80286     84  OS/2 hidden C:  c6  DRDOS/sec (FAT-
 4  FAT16 <32M      41  PPC PReP Boot   85  Linux extended  c7  Syrinx         
 5  Extended        42  SFS             86  NTFS volume set da  Non-FS data    
 6  FAT16           4d  QNX4.x          87  NTFS volume set db  CP/M / CTOS / .
 7  HPFS/NTFS       4e  QNX4.x 2nd part 88  Linux plaintext de  Dell Utility   
 8  AIX             4f  QNX4.x 3rd part 8e  Linux LVM       df  BootIt         
 9  AIX bootable    50  OnTrack DM      93  Amoeba          e1  DOS access     
 a  OS/2 Boot Manag 51  OnTrack DM6 Aux 94  Amoeba BBT      e3  DOS R/O        
 b  W95 FAT32       52  CP/M            9f  BSD/OS          e4  SpeedStor      
 c  W95 FAT32 (LBA) 53  OnTrack DM6 Aux a0  IBM Thinkpad hi eb  BeOS fs        
 e  W95 FAT16 (LBA) 54  OnTrackDM6      a5  FreeBSD         ee  GPT            
 f  W95 Ext'd (LBA) 55  EZ-Drive        a6  OpenBSD         ef  EFI (FAT-12/16/
10  OPUS            56  Golden Bow      a7  NeXTSTEP        f0  Linux/PA-RISC b
11  Hidden FAT12    5c  Priam Edisk     a8  Darwin UFS      f1  SpeedStor      
12  Compaq diagnost 61  SpeedStor       a9  NetBSD          f4  SpeedStor      
14  Hidden FAT16 <3 63  GNU HURD or Sys ab  Darwin boot     f2  DOS secondary  
16  Hidden FAT16    64  Novell Netware  af  HFS / HFS+      fb  VMware VMFS    
17  Hidden HPFS/NTF 65  Novell Netware  b7  BSDI fs         fc  VMware VMKCORE 
18  AST SmartSleep  70  DiskSecure Mult b8  BSDI swap       fd  Linux raid auto
1b  Hidden W95 FAT3 75  PC/IX           bb  Boot Wizard hid fe  LANstep        
1c  Hidden W95 FAT3 80  Old Minix       be  Solaris boot    ff  BBT            
1e  Hidden W95 FAT1
Hex code (type L to list codes): 8e		# 修改为8e, 即Linux LVM类型
Changed system type of partition 1 to 8e (Linux LVM)

Command (m for help): t
Partition number (1-4): 2				# 修改/dev/sdc2为Linux LVM类型
Hex code (type L to list codes): 8e
Changed system type of partition 2 to 8e (Linux LVM)

Command (m for help): p					# 再次查看相关信息: 

Disk /dev/sdc: 4000.0 GB, 3999999721472 bytes
255 heads, 63 sectors/track, 486305 cylinders
Units = cylinders of 16065 * 512 = 8225280 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disk identifier: 0x5b3d66ba

   Device Boot      Start         End      Blocks   Id  System
/dev/sdb1               1      267349  2147480811   8e  Linux LVM	# Id已改变
/dev/sdb2          267350      486305  1758764070   8e  Linux LVM

Command (m for help): w					# 保存并退出
The partition table has been altered! 	# 修改成功

Calling ioctl() to re-read partition table.
Syncing disks.

```

### 3.4 创建物理卷(PV)

- 使用`pvcreate`命令创建物理卷:

```bash
[root@localhost ~]# pvcreate /dev/sdb1
  Physical volume "/dev/sdb1" successfully created
[root@localhost ~]# pvcreate /dev/sdb2
  Physical volume "/dev/sdb2" successfully created
```

### 3.5 扩展卷组(VG)

- 使用`vgextend`命令将新创建的物理卷添加到已有的卷组中:

```bash
# 查看已有卷组, 发现该卷组就是需要扩容的卷组, 就不必再次创建卷组, 而是直接扩展卷组即可: 
[root@localhost ~]# vgs
  VG       #PV #LV #SN Attr   VSize VFree
  VolGroup   2   2   0 wz--n- 1.91t    0 

# 扩展卷组: 
[root@localhost ~]# vgextend VolGroup /dev/sdb1
  Volume group "VolGroup" successfully extended
[root@localhost ~]# vgextend VolGroup /dev/sdb2
  Volume group "VolGroup" successfully extended
```

>说明: 如果出现下述无法挂载物理磁盘到卷组中的信息, 说明这块物理磁盘已经挂载了, 需要先卸载, 然后再执行创建分区+卷组的操作:

```bash
[root@localhost /]# vgextend VolGroup /dev/sdb1 
  No physical volume label read from /dev/sdb1
  Physical volume /dev/sdb1 not found
  Can't open /dev/sdb1 exclusively.  Mounted filesystem?
  Unable to add physical volume '/dev/sdb1' to volume group 'VolGroup'.
```

### 3.6 扩展逻辑卷(LV)

- 使用`lvextend`命令扩展逻辑卷:

```bash
# 扩展逻辑卷, 即扩容: 
[root@localhost ~]# lvextend -l +100%FREE /dev/mapper/VolGroup-LogVol 
  Extending logical volume lv_root to 5.54 TiB
  Logical volume lv_root successfully resized

# 上述命令是将所有的空闲空间都扩容到逻辑卷中, 也可指定扩容的大小: 
lvextend -l +100G /dev/mapper/VolGroup-LogVol 
```

### 3.7 查看磁盘卷组信息

- 使用`vgs`和`lvs`命令查看卷组和逻辑卷信息:

```bash
[root@localhost ~]# lsblk 
NAME                        MAJ:MIN RM   SIZE RO  TYPE  MOUNTPOINT
sda                           8:0    0 278.5G  0  disk  
├─sda1                        8:1    0   500M  0  part  /boot
└─sda2                        8:2    0   278G  0  part  
  ├─VolGroup-LogVol (dm-0)  253:0    0   5.6T  0  lvm   /
sdb                           8:16   0   1.6T  0  disk  
└─sdb1                        8:17   0   1.6T  0  part  
  └─VolGroup-LogVol (dm-0)  253:0    0   5.6T  0  lvm   /
sdc                           8:32   0   3.7T  0  disk  
├─sdc1                        8:33   0     2T  0  part  
│ └─VolGroup-LogVol (dm-0)  253:0    0   5.6T  0  lvm   /
└─sdc2                        8:34   0   1.7T  0  part  
  └─VolGroup-LogVol (dm-0)  253:0    0   5.6T  0  lvm   /
```

### 3.8 调整文件系统的大小

```bash
# CentOS 7重新读取磁盘大小: 
[root@localhost ~]# xfs_growfs /dev/mapper/VolGroup-LogVol 
xfs_growfs: /dev/mapper/VolGroup-LogVol is not a mounted XFS filesystem

# CentOS 6.5重新读取磁盘大小: 
# ext4格式, resize2fs会遍历整个磁盘, 速度比较慢, 但是不影响读写数据, 可以令其在后台运行. 
[root@localhost ~]# resize2fs /dev/mapper/VolGroup-LogVol 
resize2fs 1.41.12 (17-May-2010)
Filesystem at /dev/mapper/VolGroup-LogVol is mounted on /; on-line resizing required
old desc_blocks = 122, new_desc_blocks = 355
Performing an on-line resize of /dev/mapper/VolGroup-lv_root to 1487098880 (4k) blocks.

# 等了差不多20分钟, 出来了下面这货: 
 The filesystem on /dev/mapper/VolGroup-LogVol is now 1487098880 blocks long.
 
# 赶紧看下扩容成果吧: 
[root@localhost ~]#   df -h
Filesystem                    Size  Used Avail Use%  Mounted on
/dev/mapper/VolGroup-LogVol   5.5T  1.8T  3.5T  34%  /			# 扩容成功
tmpfs                          63G     0   63G   0%  /dev/shm
/dev/sda1                     485M   40M  421M   9%  /boot
```

### 3.9 附录 - 创建卷组

- 对应 [3.5] 节的扩展卷组, 如果卷组不存在, 则需要创建之. 下述VolGroup是卷组名称.

```bash
vgcreate VolGroup /dev/sdb1
# 创建逻辑卷, 名称为: mylv. (操作系统中将产生: /dev/VolGroup/mylv目录)
# 将当前卷组中的100G空间分配到逻辑卷中
lvcreate -L 100G VolGroup -n mylv
# 或将当前卷组中的所有空闲空间全都分配到逻辑卷中:  
lvcreate -l +100%FREE VolGroup -n mylv

# 格式化逻辑卷组: 
mkfs -t ext4 /dev/VolGroup/mylv

# 挂载卷组到指定目录下, 如果是挂载到根目录, 则无需向/etc/fstab文件中添加启动项. 
mount -t ext4 /dev/VolGroup/mylv /data
```

# 4 参考资料
- [Linux的LVM详解](https://blog.csdn.net/Jerry_1126/article/details/45769565)
- [ext2、ext3与ext4的区别](https://blog.csdn.net/macrossdzh/article/details/5973639)
- [Linux 下挂载硬盘的方法](https://blog.csdn.net/tianlesoftware/article/details/5642883)
- [linux磁盘管理、新增磁盘、分区、挂载](https://www.cnblogs.com/alylee/p/Linux_disk_management_partition_mount.html)