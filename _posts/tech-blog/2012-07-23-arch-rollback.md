---
layout: post
category: tech-blog
title: Arch Linux Rollback安装笔记
description: 
disqus: true
---

本文依照我至今为止四次在Dell Latitude E6420笔记本上安装Arch Linux的过程中所记录的零碎笔记整理而成。

本文之所以存在，目的是作为个人备忘，以便将来再次把系统玩崩溃重装时参考（毕竟纸上写的笔记不易整理和保存）。第一不追求什么逻辑性，第二不追求技术上的正确性。

在本文写作时，Arch的[2012.07.15版镜像](http://www.archlinux.org/news/install-media-20120715-released/)刚好发布。但文中的安装方式依然基于[2011.08.19版镜像](http://www.archlinux.org/news/20110819-installation-media/)，原因很简单：自从Linux 3.3.7之后的内核，在Dell Latitude E6420上无法正常关机和重启，经验证内核参数`reboot=pci`也不能解决该问题。2012.07.15包含3.4.4版的内核，故无法在我当前的笔记本上使用。

但是，由于2011.08.19版的软件库略显陈旧，本文采取了使用rollback到3.3.8发布之前的时间点、即2012年6月8日的Arch软件库的安装方式。感谢伟大的[ARM（Arch Rollback Machine）](http://arm.konnichi.com/)为此提供了可能。

需要注意的是，在初始安装阶段我仍然使用了2011.08.19提供的AIF（Arch Installation Framework）方式。在最新的2012.07.15光盘镜像中，官方已经放弃了对AIF的支持，取而代之以若干辅助安装的Bash脚本。

***

## 1. 准备阶段

### 1.1. 下载镜像文件

下载Arch的“Current Release”：2011.08.19的[Core Image](http://www.archlinux.org/download/)。

不能用Netinstall Image，因为在安装阶段有可能会意外地连不上Custom的ARM服务器，这样一来就只能通过官方的最新镜像来安装，于是后面降级就会遇到困难。

__（注：随着2012.07.15的发布，如今所有archlinux-2011.08.19的iso文件都已经从官方源中消失了。）__

### 1.2. 创建可引导的U盘

使用[LinuxLive USB Creator](http://www.linuxliveusb.com/)。

UNetbootin现在变得不太靠谱，某些发行版的镜像写进去引导不了（这其中包括Arch），故不推荐。

Win32 Image Writer和dd for windows具有极大的危险性，用来处理U盘没问题，如果用它来处理移动硬盘的某个分区可能会导致整个移动硬盘的分区表被破坏！（参见我的[惨痛教训](http://blog.soimort.org/2012/04/archcodejam.html)）LinuxLive和UNetbootin都可以用来写入镜像到单独的移动硬盘分区。

### 1.3. 重启，从U盘引导进入用于安装的核心系统

***

## 2. 初始安装阶段

### 2.1. 卸载PC扬声器模块（可选）

就是控制台下每次按错键都会发出的“哔——哔”警告声，这玩意实在是太吵了。我每次都首先把它关掉。

    # rmmod pcspkr

### 2.2. 改变键盘布局和控制台字体（可选）

如果一定要使用非英语的键盘布局（比如瑞典语键盘什么的），可以通过

    # km

来设置。控制台字体这东西改不改个人觉得意义不大，反正文本终端下的点阵字体都一样丑。

### 2.3. 查看官方安装手册（可选）

Alt+F2打开新的虚拟控制台，

    # less /usr/share/aif/docs/official_installation_guide_en

Alt+F1返回原控制台。

### 2.4. 进入AIF安装框架

    # /arch/setup

Alt+F7可以随时查看安装过程中的控制台输出，Alt+F1返回。

### 2.5. Select source / 选择源

选择core-local一项即可。

### 2.6. Select editor / 选择编辑器

选择nano或vi。

### 2.7. Set clock / 设置时钟

为了避免不必要的混乱，推荐把Linux下的硬件时钟模式设置为UTC（时区设成自己当前的时区就可以），Windows下亦统一使用UTC作为当前时区（反正Windows不是有世界时钟的桌面小插件嘛）。

### 2.8. Prepare hard drive(s) / 准备硬盘

选择“3 Manually configure block devices, filesystems and mountpoints”。

使用dev识别设备分区，好处是名称容易记住（`/dev/sda3`之类），缺点是将来内核升级的时候设备名有可能会变化。

uuid难以被人类记住，好处是它不会随着内核的升级改变（但重新格式化分区仍然会改变该分区的uuid）。使用label则意味着必须给每个分区定一个卷标且在将来不能轻易修改。

选择用于安装Arch的硬盘分区和挂载点，最少仅需要一个用于挂载`/`的分区。根据实际情况可以增加单独的`/boot`、`/tmp`、`/usr`、`/var`分区和swap交换分区。如果想要用作`/home`的分区原来保存有重要数据的话，安全起见这里可以先不用设置`/home`的挂载分区（以后再手动改fstab）。

AIF里只能把已有的分区格式化。调整分区大小、划分新的分区等工作应当在安装前使用cfdisk、GParted等工具完成。

### 2.9. Select packages / 选择软件包

#### 2.9.1. Select bootloader / 选择启动引导器

选择bootloader，这里是GRUB Legacy和syslinux。先选GRUB Legacy，以后再升级。（如果以前的系统有单独的`/boot`分区和现成的bootloader，则可跳过此步）

__（注：最新的2012.07.15应该已经用GRUB 2取代了GRUB Legacy）__

#### 2.9.2. Select package groups / 选择软件包组

选择base。base-devel包含开发工具。先选，以后再升级。

#### 2.9.3. Select packages / 选择软件包

不用选了直接确认。以后再安装。

### 2.10. Install packages / 安装软件包

等待。（安装过程很快）

### 2.11. Configure system / 配置系统

#### 2.11.1. /etc/rc.conf（系统基础设置）

比较重要的有两件事。一是设置HOSTNAME：

    HOSTNAME="Foo"

通常情况下使用动态地址分配（DHCP）上网，需要设置：

    interface=eth0

其他的配置选项（如HARDWARECLOCK、TIMEZONE、LOCALE、KEYMAP、DAEMONS）已经自动生成，这里暂时无须修改。

#### 2.11.2. /etc/fstab（文件系统挂载点）

假定某分区设备名为`/dev/sda9`，使用ext4文件系统，挂载到`/home`，则增加一行：

    /dev/sda9 /home ext4 defaults 0 1

#### 2.11.3. /etc/mkinitcpio.conf

暂时无须修改。

#### 2.11.4. /etc/modprobe.d/modprobe.conf（内核模块黑名单）

暂时无须修改。也可以直接在这一步里屏蔽掉不想要的内核模块（例如pcspkr）。

#### 2.11.5. /etc/resolv.conf

若使用DHCP则无须修改。dhcpcd每次会自动写入相应的DNS服务器地址。

#### 2.11.6. /etc/hosts

已经自动生成，最好确认一下这里的hostname与前面`/etc/rc.conf`中的设置是否一致。

#### 2.11.7. /etc/locale.gen（本地化设置）

通过去除注释选择想要的本地化类型（用于glibc等支持本地化的软件包）。

可以在以后再修改并使用

    # locale-gen

生成。通过

    # locale -a

查看所有当前可用的本地化类型。

#### 2.11.8. /etc/pacman.conf（Pacman设置）

这里暂时不要做任何修改（后面会对pacman进行升级）。

#### 2.11.9. /etc/pacman.d/mirrorlist（镜像设置）

这一步非常重要。注释掉其他所有行，添加一行ARM的源地址：

    Server = http://arm.konnichi.com/2012/06/08/$repo/os/$arch

`http://arm.konnichi.com`后面的URL显示了想要rollback到的时间点。

#### 2.11.10. 设置root密码

### 2.12. Install bootloader / 安装启动引导器

若使用GRUB Legacy，`/boot/grub/menu.lst`会被自动生成，只需确认一下即可。

安装到`/dev/sda`（硬盘设备）。

### 2.13. 重启，引导进入硬盘上的Arch系统

    # reboot

***

## 3. 升级阶段

### 3.1. 检测网络是否正常（适用于DHCP）

检测IP地址：

    # ip addr

检测网络连通：（是否能连接上ARM的服务器）

    # ping -c 3 arm.konnichi.com

如遇到问题可以使用`# /etc/rc.d/network restart`和`# dhcpcd eth0`重启网络（如果之前`/etc/rc.conf`设置正确，`interface=eth0`，MODULES中包含有network一项，则dhcpcd应当能够正常工作）

### 3.2. 开始升级软件包

由于当前系统的软件包过于老旧，全系统升级的命令

    # pacman -Syu

会导致一些依赖性问题，故不要使用。我们将逐一升级系统中的软件包。

### 3.3. 升级pacman数据库

首先执行：

    # pacman -Syy

从ARM获取目标时间点的软件包数据库。

### 3.4. 升级pacman

然后便可以升级pacman自身：

    # pacman -Sf pacman

此命令会同时升级glibc、linux-api-headers等依赖库。-f命令行参数是必须的。

如果有`/etc/pacman.conf.pacnew`生成则拿它覆盖掉原有的`/etc/pacman.conf`。

官方的说明提示是通过

    # pacman-key --init
    # pacman-key --populate archlinux

来创建初始密钥。这并不适用于我们从ARM获取的软件包，所以为了避开Pacman 4这套新引入的签名验证机制，直接在`/etc/pacman.conf`里使用如下配置：

    SigLevel = Optional TrustAll

同时通过去除注释打开`[multilib]`（如果在x86_64的Arch下需要用到32位库的话，multilib里的许多包至关重要）。

重新执行：

    # pacman -Syy

以获取属于multilib的软件包数据库。

### 3.5. 升级kmod

    # pacman -S kmod

以取代原有的module-init-tools。

### 3.6. 升级systemd-tools

    # pacman -Sf systemd-tools

以取代原有的udev。此命令会同时升级hwid等依赖库。-f命令行参数是必须的。

### 3.7. 升级initscripts

通过升级kmod和systemd-tools，我们已经完成了对initscripts依赖的升级。

现在升级

    # pacman -Sf initscripts

重启之后Linux启动阶段sysctl会提示出现奇怪的“`-p/etc/sysctl.conf`参数错误”。

这个问题仿佛是从`initscripts-2012.05.1-1`开始引入的，直到`initscripts-2012.05.1-3`都存在。经检查，发现问题出在`/usr/lib/initscripts/arch-sysctl`里面的

    sysctl -q -p"$path"

显然原来应该是

    sysctl -q -p "$path"

`-p`和`"$path"`之间不知何故少了一个空格（之前的版本一直是有的，不知道为什么到了2012.05.1之后就消失了）。

解决方法是不要使用当前时间点（2012.06.08）的`initscripts-2012.05.1-3`，而使用更新后（2012.06.10）的`initscripts-2012.06.1-1`来作升级：

    # pacman -U http://arm.konnichi.com/2012/06/10/core/os/x86_64/initscripts-2012.06.1-1-any.pkg.tar.xz

升级后用`/etc/rc.conf.pacnew`来取代原来的`/etc/rc.conf`（原来的设置要手动保留）。

此外，`/etc/rc.conf`中的LOCALE设置不再生效，新的LOCALE设置需要在`/etc/locale.conf`中进行。

### 3.8. 升级filesystem

    # pacman -Sf filesystem

### 3.9. 升级linux-firmware

    # pacman -S linux-firmware

### 3.10. 升级mkinitscpio

    # pacman -Sf mkinitcpio

此命令会同时升级util-linux等依赖库。-f命令行参数是必须的。

### 3.11. 升级linux

升级mkinitscpio完成后，接下来便可以进行linux内核的升级（旧版本的mkinitscpio无法用于较新的linux，会导致生成内核模块错误无法启动）：

    # pacman -S linux

### 3.12. 升级其他软件包

剩余的软件包可以直接进行全系统升级（dhcpcd除外）：

    # pacman -Syu --ignore dhcpcd

### 3.13. 可能的错误：dhcpcd无法连接IPv4

较新版本的dhcpcd会直接使用IPv6，导致用户在仅支持IPv4的情形下无法正常连接到网络。

    dhcpcd[*]: eth0: sending IPv6 Router Solicitation

通过`# ip addr`命令显示的eth0没有分配到IPv4地址（inet）。

如果前一步不慎升级了dhcpcd，则降级到旧版本的dhcpcd可以解决该问题：

    # pacman -U http://arm.konnichi.com/2011/08/19/core/os/x86_64/dhcpcd-5.2.12-1-x86_64.pkg.tar.xz

可能需要在有网络连接的电脑上手动下载该软件包。

### 3.14. 可能的错误：启动时syslog-ng提示找不到/usr/lib/libpcre.so.0

这是由于使用了较旧的pcre库所致。进行了包括pcre在内的全系统升级后重启应该可以消除该错误提示。

### 3.15. 可能的错误：启动时/etc/rc.sysinit提示mountpoint: command not found

这是一个非常诡异的错误，在网上可以搜到不少类似的情况，我自己也遇到过两次。

`/bin/mountpoint`是包含在util-linux包内的文件，这个包之前是安装过的，在全系统升级之前`/bin/mountpoint`也经确认是存在的，但升级之后有可能会神秘消失。原因不明，疑似升级某个包（怀疑是sysvinit？）时导致的bug。

解决方法是重新安装一遍util-linux：

    # pacman -S util-linux

### 3.16. 升级到GRUB 2

可以直接使用当前时间点extra库的grub2-bios包进行升级（会移除已有的grub包）：

    # pacman -S grub2-bios

也可以使用最新的grub-bios进行升级（已移到core库）。手动从镜像下载grub-bios、grub-common、freetype2和fuse这四个包进行安装（后两个包属于extra库）。

### 3.17. 安装GRUB 2

升级到GRUB 2必须执行以下的手动安装步骤（即使`/boot/grub/grub.cfg`已经存在）：

    # grub-mkconfig -o /boot/grub/grub.cfg
    # grub-install /dev/sda

如果要对GRUB进行配置（例如添加Windows引导选项，修改GRUB颜色、背景主题），可以修改`/etc/default/grub`和`/etc/grub.d/40_custom`这两个文件，然后通过执行`# grub-mkconfig -o /boot/grub/grub.cfg`重新生成新的`grub.cfg`。不要直接去修改`grub.cfg`。

### 3.18. 重启，确认GRUB 2引导正常

    # reboot

如此，得到了一个较新的最小化系统。

### 3.19. 可能的错误：GRUB进入引导界面前一闪而过的错误提示：error: file '/boot/grub/locale/en.mo.gz' not found

直接拷贝如下文件即可：

    # cp /boot/grub/locale/en@quot.mo /boot/grub/locale/en_US.mo

### 3.20. 附：GRUB的手动引导

如果忘记在GRUB 2中写入某OS的引导选项或者引导选项错误，需要手动引导则可以简单地使用类似如下命令（假设要引导的是位于分区表第5个分区上的Arch Linux）：

    > insmod ext2
    > set root='hd0,msdos5'
    > linux /boot/vmlinuz-linux
    > initrd /boot/initramfs-linux.img
    > boot

若要引导的是位于分区表的第2个分区上的Windows：

    > insmod ntfs
    > set root='hd0,msdos2'
    > chainloader +1
    > boot

若使用GRUB Legacy，与之类似（注意GRUB Legacy的设备编号从0开始，即第2个分区实际上是`(hd0,1)`）：

    > root (hd0,1)
    > chainloader +1
    > boot

***

## 4. 配置阶段

### 4.1. 添加控制台下的鼠标支持（可选）

如果需要经常在控制台下进行工作，添加鼠标支持可能会比较有用。

安装GPM：

    # pacman -S gpm

同时在`/etc/rc.conf`中添加相应启动守护进程：

    DAEMONS=(... gpm)

### 4.2. 设置模块黑名单（可选）

有些内核模块可能并不总是我们需要的。对于我而言，PC扬声器和触摸板属于“完全没用”之列。（PC扬声器的报警声很烦人；触摸板会严重干扰键盘输入）

我曾经花了很长时间寻找我的笔记本上触摸板属于哪个驱动，结果发现是psmouse模块。

以前可以通过`/etc/rc.conf`中的MODULES变量屏蔽模块。现在唯一的方式是在`/etc/modprobe.d/modprobe.conf`（如果没有则创建）中设置黑名单：

    blacklist pcspkr
    blacklist psmouse

将来临时需要用到这些模块时，可以手动加载：

    # modprobe psmouse

不需要时再卸载：

    # rmmod psmouse

### 4.3. NTFS分区的读写支持

安装NTFS-3G：

    # pacman -S ntfs-3g

在`/etc/fstab`中挂载NTFS分区时，应当使用ntfs-3g而不是ntfs。

### 4.4. 添加用户、设置权限

总是用root账户来执行日常操作是不可取的。应当添加一个自己的用户：

    # adduser

注意把用户添加到合适的组（audio, games, lp, optical, power, scanner, storage, video, wheel）。

如果忘记添加到某个组，以后可以直接编辑`/etc/group`。

然后为了使用户可以执行sudo操作，还需安装：

    # pacman -S sudo

执行

    # visudo

来编辑用户的sudo权限（实际上是`/etc/sudoers`这个文件）。可以将

    root ALL=(ALL) ALL
    %wheel ALL=(ALL) ALL

两行去注释。

注意：非root用户执行某些程序必须使用sudo，否则不会报错但无法正常使用，例如util-linux中的fdisk、cfdisk。

***

## 5. 桌面阶段

### 5.1. 安装常用字体

安装一些常用的字体（后者“文泉驿正黑”提供必要的中文支持）：

    # pacman -S ttf-dejavu wqy-zenhei

当然也可以安装opendesktop-fonts等其他字体。

### 5.2. 安装显卡驱动、3D支持和Xorg

    # pacman -S xf86-video-intel mesa mesa-demos xorg-server xorg-xinit xorg-utils xorg-server-utils

也可以直接安装Xorg全部组件：

    # pacman -S xorg

为了测试X，需要有：

    # pacman -S xorg-twm xorg-xclock xterm

执行：

    # startx

或

    # xinit

进入TWM窗口管理器，测试X是否运行正常。

如果当前用户主目录下有`~/.xinitrc`，则启动时会读取此文件内容。xinit可以向该脚本传递参数。

通过`# exit`或`# pkill X`退出X。（后者会报出一个运行错误）

### 5.3. 安装声卡设备驱动

默认的Arch内核构建里已经包含了ALSA，故一般没有必要再安装它。

    # pacman -S alsa-utils

安装后通过

    # alsamixer

来取消静音。可以使用

    # speaker-test -c 2

进行测试。

### 5.4. 安装电源管理框架

    # pacman -S pm-utils

用于在命令行下休眠和进入省电模式。

### 5.5. 安装Openbox桌面管理器（可选）

安装Openbox：

    # pacman -S openbox

Openbox的配置位于`~/.config/openbox`下的`menu.xml`、`rc.xml`、`autostart`三个文件。

其他配置桌面可能会用到的组件：

    # pacman -S obconf obmenu menumaker openbox-themes xcompmgr xscreensaver feh conky tint2

tint2的图形化配置程序tint2conf需要pygtk：

    # pacman -S pygtk

安装D-Bus和ConsoleKit：

    # pacman -S dbus consolekit

必须在`/etc/rc.conf`中添加相应的守护进程：

    DAEMONS=(... dbus)

创建`~/.xinitrc`文件：

    tint2 &
    exec ck-launch-session dbus-launch --sh-syntax --exit-with-session openbox-session

执行：

    # startx

或

    # xinit

进入Openbox（附带启动tint2）。

### 5.6. 安装GNOME（可选）

    # pacman -S gnome gnome-extra

如果要想在系统启动完毕后自动进入图形界面，修改`/etc/inittab`中的运行级即可：

    # Boot to console
    #id:3:initdefault:
    # Boot to X11
    id:5:initdefault:

并且设置登录管理器为GDM：

    x:respawn:/usr/sbin/gdm -nodaemon

如果要在GDM启动时同时启动其他组件（例如tint2），则在`~/.xprofile`中（注意不是`~/.xinitrc`）添加：

    tint2 &

### 5.7. 安装PolicyKit和NetworkManager

若使用Openbox：安装polkit和networkmanager以在桌面环境下取代network管理网络：

    # pacman -S networkmanager

polkit作为依赖会被自动安装。

若使用GNOME，则networkmanager（和dbus、polkit）很可能已经作为依赖被安装。

需要手动在`/etc/rc.conf`中删除network守护进程，添加：

    DAEMONS=(... dbus networkmanager)

注意networkmanager必须出现在dbus之后。

### 5.8. 调整键盘映射（可选）

有时候可能需要修改键盘上某些键的位置。

使用

    # xmodmap -pke > ~/.Xmodmap

生成映射表文件并进行修改。

若使用Openbox，在`~/.xinitrc`中启动窗口管理器的命令前添加一行：

    xmodmap $HOME/.Xmodmap

若使用GNOME，则xmodmap会在进入X时自动应用用户主目录下的`~/.Xmodmap`映射表。

### 5.9. 安装iBus输入法

    # pacman -S ibus ibus-qt ibus-pinyin ibus-anthy

若使用Openbox，在`~/.xinitrc`中启动窗口管理器前添加一行：

    ibus-daemon -x -d

若使用GNOME，则ibus-daemon会在进入X时自动启动，不需要修改任何配置文件。

***

## 6. 常见问题

#### Linux下写入NTFS分区里的内容在重启进入Windows后消失了

Windows休眠到硬盘后，不要在Linux下对相应的NTFS分区进行写操作。

#### 启动时sdhci-pci提示“Invalid iomem size. You may experience problems.”

最简单的解决办法是禁用sdhci和sdhci_pci模块，在`/etc/modprobe.d/modprobe.conf`中添加黑名单：

    blacklist sdhci
    blacklist sdhci_pci

#### 禁用IPv6

在内核加载时直接禁用。在`/etc/modprobe.d/modprobe.conf`中添加一行：

    alias net-pf-10 off

#### 明明是可执行文件双击后却没反应，命令行下执行却提示文件找不到

如果权限没问题的话，这可能是试图在x86_64系统上执行32位程序却缺少相应库所导致的。

用ldd查看该文件是否“not a dynamic executable”。如果是，安装multilib中的各种32位库，也可以直接安装wine（wine的依赖关系基本包含了所有常用的32位库）。

#### RAR格式文件打不开

安装p7zip。

#### 需要更多有用的GNOME设置

安装gnome-tweak-tool。

#### GDM和GNOME使用X11光标而不是GNOME的光标样式

在`/usr/share/icons/default/index.theme`中写入：（如果不存在则创建）

    [Icon Theme]
    Inherits=Adwaita

或者直接从AUR安装[gnome-cursors-fix](https://aur.archlinux.org/packages.php?ID=52925)这个包。

#### iBus输入法不能输入，总是显示“No input window”

记得要在ibus-setup的Preferences - Input Method中手动添加已安装的输入法（它们不会自动出现在列表中），然后重启iBus。

#### GNOME集成的即时通讯工具不能用，总是显示一个叉

安装telepathy。

#### 从GNOME登录Google帐号的时候总提示密码错误

说明你开通了Google的双步验证机制。不要使用Google帐号的密码，而使用Google提供的Application-specific password就好了。（其实App Engine和Google Talk也都是使用这个密码的）

#### 浏览器无法播放Flash

安装flashplugin。

适用于Chromium和Firefox，但是不知为何GNOME Web并不支持。

#### 某些CJK字体无法正常显示出来

安装opendesktop-fonts。注意：会覆盖原来的文泉驿字体。

#### VLC播放视频时画面和音轨略不同步

这是PulseAudio自2.0以来引入的一个bug（特性？），目前好像只针对VLC存在，其他播放器正常。

[https://bugs.freedesktop.org/show_bug.cgi?id=50024](https://bugs.freedesktop.org/show_bug.cgi?id=50024)

可以退回到2.0以前的pulseaudio和libpulse，或者使用我自己的一个PulseAudio fork：

[https://github.com/soimort/pulseaudio-vlc-friendly](https://github.com/soimort/pulseaudio-vlc-friendly)

#### GitHub网页上的字体貌似比起以前有明显的锯齿失真（？）

但愿这不是我的错觉。

降级ttf-freefont到版本20100919-2。



