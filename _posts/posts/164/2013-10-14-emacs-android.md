---
layout: post
uri: /posts/164
permalink: /posts/164/index.html
title: 【快速参考】用Emacs做Android开发环境
category:
tag:
description:
disqus: false
lang: zh
---

之前在学校的课上一直在用Eclipse学习Android开发。虽说Eclipse对Android开发工具链的集成是极好的，无奈JVM太耗内存了，再加上Android emulator本身又是一个吃内存的大户，对于我这种常年Chrome开着几十个标签的人来说实在是伤不起，于是最近就回到了Emacs+命令行刀耕火种的时代……



## 1. 安装Android SDK

Arch用户从AUR安装[android-sdk](https://aur.archlinux.org/packages/android-sdk/)和[android-sdk-platform-tools](https://aur.archlinux.org/packages/android-sdk-platform-tools/)。

当前用户获得对`/opt/android-sdk`的权限：

    $ chown -R $USER /opt/android-sdk

打开Android SDK Manager，安装和升级SDK：

    $ android

打开Android Virtual Device Manager，创建用于仿真的AVD：

    $ android avd



## 2. `android`常用命令

列出当前所有可用的AVD：

    $ android list avd

列出当前所有可用的Android targets：

    $ android list targets

在指定路径下创建一个新的Android项目，使用指定的target ID：

    $ android create project \
    --target <target_ID> \
    --name <your_project_name> \
    --path path/to/your/project \
    --activity <your_activity_name> \
    --package <your_package_namespace>

升级项目。当API升级后使用：

    $ android update project \
    --name <project_name> --target <target_ID> \
    --path <path_to_your_project>

为了在命令行下使用Apache Ant构建Android项目，需要执行以下命令生成一个可用的`build.xml`：（Eclipse中创建的项目没有`build.xml`）

    $ android update project -p .



## 3. `ant`常用命令

构建项目的debug版本：

    $ ant debug

构建release版本：

    $ ant release

构建测试：

    $ ant test

安装debug版本到AVD：

    $ ant installd

安装release版本到AVD：

    $ ant installr

安装测试到AVD：

    $ ant installt

卸载：

    $ ant uninstall

清理：

    $ ant clean



## 4. `emulator`常用命令

打开一个AVD仿真器：（假定设备名为`My_Galaxy_Nexus`）

    $ emulator -avd My_Galaxy_Nexus

### 利用KVM加速Intel Atom仿真

在Linux x86/64平台上，可以利用QEMU的KVM支持对Intel Atom的仿真进行加速。要有相应的内核模块：（仅限于支持KVM的机器在仿真Intel Atom AVD的情况下）

    # modprobe kvm kvm_intel

`-qemu -m 512 -enable-kvm`参数选项激活KVM加速。如需同时打开GPU加速，则`-gpu on`选项应放在前面（所有`-qemu`后续的参数会被传递给QEMU）：

    $ emulator -avd My_Galaxy_Nexus -gpu on -qemu -m 512 -enable-kvm

### 仿真器快捷键

* 旋转方向： __Ctrl-F11__
* 全屏： __Alt-Enter__
* Home： __Home__
* Menu： __F2__ / __PgUp__
* Star： __Shift-F2__ / __PgDn__
* 返回： __Esc__
* 接听： __F3__
* 挂断： __F4__
* 搜索： __F5__
* 电源键： __F7__



## 5. `adb`常用命令

安装apk到当前AVD：（需要有活动中的AVD仿真器进程）

    $ adb install HelloWorld.apk

查看Logcat：

    $ adb logcat

更多有用的`adb`命令[参见这里](http://developer.android.com/tools/help/adb.html)。



## 6. Emacs android-mode命令参考

Emacs的android-mode可以从[MELPA](http://melpa.milkbox.net/#/android-mode)或者[Marmalade](http://marmalade-repo.org/packages/android-mode)安装：（AUR：[emacs-android-git](https://aur.archlinux.org/packages/emacs-android-git/)）

```tcl
M-x package-install android-mode
```

安装后在Emacs配置文件中设定所使用Android SDK的位置和默认AVD的名称：

```cl
(require 'android-mode)
(setq android-mode-sdk-dir "/opt/android-sdk/")
(setq android-mode-avd "My_Galaxy_Nexus")
```

### 项目构建

以下命令中的`"build"`均可替换成`ant`或`maven`（指定使用Ant或Maven构建项目）。

构建项目的debug版本：

```tcl
M-x android-build-debug
```

或

```sh
C-c C-c c
```

构建测试：

```tcl
M-x android-build-test
```
```sh
C-c C-c t
```

安装到AVD：

```tcl
M-x android-build-install
```
```sh
C-c C-c i
```

重新安装：

```tcl
M-x android-build-reinstall
```
```sh
C-c C-c r
```

卸载：

```tcl
M-x android-build-uninstall
```
```sh
C-c C-c u
```

清理：

```tcl
M-x android-build-clean
```
```sh
C-c C-c C
```

### Android仿真

开启AVD仿真器：

```tcl
M-x android-start-emulator
```
```sh
C-c C-c e
```

在仿真器中启动当前app：

```tcl
M-x android-start-app
```
```sh
C-c C-c a
```

启动DDMS（Dalvik Debug Monitor Service）：

```tcl
M-x android-start-ddms
```
```sh
C-c C-c d
```

启动Logcat：

```tcl
M-x android-logcat
```
```sh
C-c C-c l
```

### KVM与GPU加速

`android-start-emulator`命令（`C-c C-c e`）在启动时是不带任何参数的。想要加上KVM和GPU加速选项的话，可以重新自定义该命令（必须放在导入`android-mode.el`之后）：

```cl
;; Redefine android-start-emulator to use KVM and GPU acceleration
(defun android-start-emulator ()
  "Launch Android emulator."
  (interactive)
  (let ((avd (or (and (not (string= android-mode-avd "")) android-mode-avd)
                 (completing-read "Android Virtual Device: "
                                  (android-list-avd)))))
    (unless (android-start-exclusive-command
             (concat "*android-emulator-" avd "*")
             (concat (android-tool-path "emulator")
                     " -avd " avd " -gpu on -qemu -m 512 -enable-kvm"))
      (message (concat "emulator " avd " already running")))))
```


