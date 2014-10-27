---
layout: post
uri: /posts/122
permalink: /posts/122/index.html
title: RVM + Rails + Heroku开发环境搭建
category:
tag:
description:
disqus: false
lang: zh
---

<script>lock()</script>

说来惭愧，所有我跟过的在线课程，没有哪一门不是拖到作业截止日期之前的周末才拼命通宵补课赶作业的……

上学期曾经跟过[Udacity](http://www.udacity.com)的[Web Development](http://www.udacity.com/overview/Course/cs253/CourseRev/apr2012)（这门课是基于Python + Google App Engine），结果因为拖延半途而废。当然这多多少少和我不太喜欢GAE这个平台（因为它的语言限制加上GAE Datastore的不可移植性）也有关系，加上不想重新去适应Python 2.x。（估计Google会坚持在GAE上强推它自己的Go，对py3k的支持看来是无望了）

这学期因为决定了要考语言，放弃了感兴趣的[Computing for Data Analysis](https://www.coursera.org/course/compdata)、[Scala](https://www.coursera.org/course/progfun)和其他好几门在线课程，只跟下来了[edX](https://www.edx.org)的[CS169.1x (SaaS)](https://www.edx.org/courses/BerkeleyX/CS169.1x/2012_Fall)。闲话少说，UC Berkeley CS169用的是Ruby on Rails + Heroku，很对我的口味，简单统一的语言/框架（比起Ruby，想一想Python下鱼龙混杂的web框架、还有语言自身2/3版本不兼容带来的内耗和遗留问题）、简单的云平台（和AWS比起来，Heroku确实易用得多）。

尽管如此，要在RVM上安装Rails开发环境并且让程序最终在Heroku上成功跑起来，可能并没有想象中那么容易，值得在此记录一下。（事实上这东西折腾了我一个周末，比最后实际写代码的时间都要多……）

（p.s. 这个jekyll博客的所有帖子URL也都换成rails风格的了，看起来比以前清爽了许多哈哈）

## RVM的安装与使用

[RVM (Ruby Version Manager)](https://rvm.beginrescueend.com/)是一套用来管理不同版本的Ruby及其Gems的命令行工具。它允许你在同一个系统/用户下安装多个不同版本（或不同实现）的Ruby，而无须借助虚拟机。

安装RVM前，确保系统中已经装有curl和git。

如果当前系统下已经安装了Ruby，可以通过gem来安装RVM（将RVM作为系统Ruby的一个gem来管理和使用）。不推荐这种方法，现在应当使用官方提供的安装脚本独立地安装RVM：

    $ curl -L get.rvm.io | bash -s stable

安装完成后，手动将以下行添加到Shell的启动脚本（我的是`~/.zshrc`。根据实际情况当然也可以是`~/.bashrc`、`~/.bash_login`或者`~/.zprofile`）：

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

__注意：__在这里不需要再将RVM的bin目录手动添加到`$PATH`。也就是说，`PATH=$PATH:$HOME/.rvm/bin`这一行在`~/.zshrc`中并不是必需的。

如果在GNOME terminal + zsh中使用RVM，参考以下说明：

* __Integrating RVM with gnome-terminal:__ <https://rvm.io/integration/gnome-terminal/>

将custom command一项设置为`/bin/zsh --login`即可。

Shell启动脚本（例如`~/.zshrc`）修改后，打开一个新的terminal session（或执行`source ~/.zshrc`）。测试RVM是否安装成功：

    $ type rvm | head -n1

输出为：

    rvm is a shell function

表明安装已成功。

使用

    $ rvm notes

和

    $ rvm requirements

查看RVM的功能提示、依赖信息等等。以后每次升级过RVM后都应检查这些信息，以确保RVM能正常工作。

在Arch Linux中，运行RVM会出现类似如下的警告：

    BEWARE! rubygems "--user-install" option is not recommended
    for RVM installations.
    Double check your /etc/gemrc.
    You could remove this warning by adding 'export rvm_ignore_gemrc_issues=1'
    to your ~/.rvmrc

从`/etc/gemrc`中注释掉以下行：

    #gem: --user-install

让RVM决定所有gems的安装位置，而不是直接使用系统RubyGems的`$HOME/.gem/`。

查看所有可供安装的Ruby版本（包括MRI/YARV、Rubinius、REE、MacRuby、JRuby和IronRuby等不同实现）：

    $ rvm list known

新安装的RVM中没有任何可用的Ruby。使用`rvm install`命令进行安装。例如安装1.9.3-p286版本的MRI（官方Ruby）：

    $ rvm install 1.9.3-p286

设定某个版本为RVM的默认Ruby：

    $ rvm use 1.9.3-p286 --default
    Using .../.rvm/gems/ruby-1.9.3-p286

或者设定RVM在默认情况下不使用RVM中的Ruby，而使用系统Ruby：

    $ rvm use system --default
    Now using system ruby.

查看RVM中所有已安装的Ruby版本：

    $ rvm list
    
    rvm rubies
    
       jruby-1.6.8 [ x86_64 ]
    =* ruby-1.9.3-p286 [ x86_64 ]
    
    # => - current
    # =* - current && default
    #  * - default

`*`表示该版本为RVM默认Ruby，`=`表示该版本为RVM当前正在使用的Ruby。

切换到RVM的默认Ruby：

    $ rvm default

或者切换到某指定版本的RVM Ruby：（注意到RVM会自动在`$PATH`变量中添加相应版本Ruby的gems bin目录）

    $ rvm 1.9.3-p286
    $ rvm current
    ruby-1.9.3-p286
    $ which ruby
    .../.rvm/rubies/ruby-1.9.3-p286/bin/ruby
    $ echo $PATH
    .../.rvm/gems/ruby-1.9.3-p286/bin:
    .../.rvm/gems/ruby-1.9.3-p286@global/bin:
    .../.rvm/rubies/ruby-1.9.3-p286/bin:
    .../.rvm/bin:
    /usr/local/bin:/usr/bin:/bin:...

或者切换到系统Ruby（非RVM Ruby）：

    $ rvm system
    $ rvm current
    system
    $ which ruby
    /usr/bin/ruby
    $ echo $PATH
    /usr/local/bin:/usr/bin:/bin:...

更多关于RVM的使用，参见：

* __RVM - ArchWiki:__ <https://wiki.archlinux.org/index.php/RVM>

RVM的卸载（简单的说只要删除`~/.rvm`目录和`~/.rvmrc`，以及改回原来的Shell启动脚本即可）：

    $ rvm implode



## Gems和Bundler

查看系统Ruby的gems目录位置：

    $ rvm system
    $ rvm gemdir
    /usr/lib/ruby/gems/1.9.1

若系统`/etc/gemrc`中有`gem: --user-install`，或用户的`~/.gemrc`中显式设定了`gemhome: .../.gem/ruby/1.9.1`，则系统Ruby的gems位置是位于用户主目录下的`~/.gem`：

    $ rvm gemdir
    .../.gem/ruby/1.9.1

使用`rvm use`切换到RVM中的Ruby后，`rvm gemdir`的结果不应再是以上两种之一！此时的gems位置应该在用户主目录中的`~/.rvm`下，类似如下：

    $ rvm 1.9.3
    $ rvm gemdir
    .../.rvm/gems/ruby-1.9.3-p286

如果不是，则应该修改`/etc/gemrc`或`~/.gemrc`中的设置。

RVM中新安装的Ruby仅包含有限几个预装的gems：

    $ gem list
    
    *** LOCAL GEMS ***

通过命令

    $ rvm gemset empty

可以卸载当前Ruby的所有gems。

更多关于RVM下gemset的使用方法，参见：

* __Get started right with RVM:__ <http://sirupsen.com/get-started-right-with-rvm/>
* __Named Gem Sets:__ <https://rvm.io/gemsets/basics/>

[Bundler](http://gembundler.com/)是一套用于自动解决Ruby项目中各种gems依赖关系的工具。很多Ruby项目依赖于某些特定版本的gems，Bundler省去了在不同机器上部署时手动处理依赖的繁琐。它本身可以通过gem安装：

    $ gem install bundler

然后你就可以使用`bundle install`命令来构建很多常见的Ruby on Rails项目了（只要有`Gemfile`存在）。Bundler在构建过程中会自动解决需要的gems依赖（因此你无需再手动安装Rails）：

    $ bundle install --without production

`--without production`选项用于指定仅安装在开发环境下（而非生产环境）所需要的依赖。



## 解决存在bug的Gems依赖

理论上，`bundle install`命令可以自动完成从gems依赖安装到项目构建这一系列过程。但现实的状况是：所要构建的Rails项目中经常会出现所依赖的gems安装失败的情形。

这些gems包括：

* __linecache19 0.5.12__（ruby-debug19的依赖）
* __ruby-debug-base19 0.11.25__（ruby-debug19的依赖）
* __therubyracer 0.9.9__

貌似是因为在我的系统Ruby（1.9.3）上构建这些gems的native extensions所使用的库文件（1.9.1）不兼容所导致的。为什么Arch上的Ruby 1.9.3用的是Ruby 1.9.1的库文件？我也不知道……

Bundler错误信息之一（linecache19安装失败）：

    Installing linecache19 (0.5.12) with native extensions 
    Gem::Installer::ExtensionBuildError: ERROR:
    Failed to build gem native extension.
    
            /usr/bin/ruby extconf.rb 
    checking for vm_core.h... no
    /usr/lib/ruby/gems/1.9.1/gems/ruby_core_source-0.1.5/lib/ruby_core_source.rb:
    39: Use RbConfig instead of obsolete and deprecated Config.
    checking for vm_core.h... no
    *** extconf.rb failed ***
    Could not create Makefile due to some reason, probably lack of
    necessary libraries and/or headers.  Check the mkmf.log file for more
    details.  You may need configuration options.
    ...
    Gem files will remain installed in
    .../.bundler/tmp/32123/gems/linecache19-0.5.12 for inspection.
    Results logged to
    .../.bundler/tmp/32123/gems/linecache19-0.5.12/ext/trace_nums/gem_make.out
    An error occurred while installing linecache19 (0.5.12),
    and Bundler cannot continue.
    Make sure that `gem install linecache19 -v '0.5.12'`
    succeeds before bundling.

Bundler错误信息之二（ruby-debug-base19安装失败）：

    Installing ruby-debug-base19 (0.11.25) with native extensions 
    Gem::Installer::ExtensionBuildError: ERROR:
    Failed to build gem native extension.
    
            /usr/bin/ruby extconf.rb 
    checking for rb_method_entry_t.body in method.h... no
    checking for vm_core.h... no
    /usr/lib/ruby/gems/1.9.1/gems/ruby_core_source-0.1.5/lib/ruby_core_source.rb:
    39: Use RbConfig instead of obsolete and deprecated Config.
    checking for rb_method_entry_t.body in method.h... no
    checking for vm_core.h... no
    *** extconf.rb failed ***
    Could not create Makefile due to some reason, probably lack of
    necessary libraries and/or headers.  Check the mkmf.log file for more
    details.  You may need configuration options.
    ...
    Gem files will remain installed in
    .../.bundler/tmp/32432/gems/ruby-debug-base19-0.11.25 for inspection.
    Results logged to
    .../.bundler/tmp/32432/gems/ruby-debug-base19-0.11.25/ext/ruby_debug/gem_make.out
    An error occurred while installing ruby-debug-base19 (0.11.25),
    and Bundler cannot continue.
    Make sure that `gem install ruby-debug-base19 -v '0.11.25'`
    succeeds before bundling.

尝试了手动从gem安装：

    $ gem install linecache19 -v '0.5.12'
    $ gem install ruby-debug-base19 -v '0.11.25'

在构建native extensions这一步都会出错。参考了StackOverflow上的一篇帖子：

* __Error in “bundle install”:__ <http://stackoverflow.com/questions/10114416/error-in-bundle-install>

于是从AUR安装了Ruby 1.9.3的source（[ruby-source 1.9.3_p194-1](http://aur.archlinux.org/packages.php?ID=58447)），然后在gem安装时手动指定include目录：

    $ gem install linecache19 -- --with-ruby-include=/usr/src/ruby-1.9.3-p194/
    Fetching: archive-tar-minitar-0.5.2.gem (100%)
    Fetching: ruby_core_source-0.1.5.gem (100%)
    Fetching: linecache19-0.5.12.gem (100%)
    Building native extensions.  This could take a while...
    Successfully installed archive-tar-minitar-0.5.2
    Successfully installed ruby_core_source-0.1.5
    Successfully installed linecache19-0.5.12
    3 gems installed
    Installing ri documentation for archive-tar-minitar-0.5.2...
    Installing ri documentation for ruby_core_source-0.1.5...
    Installing ri documentation for linecache19-0.5.12...
    Installing RDoc documentation for archive-tar-minitar-0.5.2...
    Installing RDoc documentation for ruby_core_source-0.1.5...
    Installing RDoc documentation for linecache19-0.5.12...
    
    $ gem install ruby-debug-base19 -- --with-ruby-include=/usr/src/ruby-1.9.3-p194/

安装成功。

从gem安装therubyracer失败：

    $ gem install therubyracer -v '0.9.9'

参考StackOverflow上的另一篇帖子：

* __Why does therubyracer fails to build on my Debian:__ <http://stackoverflow.com/questions/8991963/why-does-therubyracer-fails-to-build-on-my-debian>

不过我估计是therubyracer 0.9.9（版本较旧）与最新的libv8不兼容的原因，

    $ gem list libv8
    
    *** LOCAL GEMS ***
    
    libv8 (3.11.8.3 x86_64-linux, 3.3.10.4 x86_64-linux)

移除了最新的libv8 3.11.8.3，默认使用之前Bundler自动安装的3.3.10.4：

    $ gem uninstall libv8 -v '3.11.8.3'
    Successfully uninstalled libv8-3.11.8.3-x86_64-linux

果然安装成功：

    $ gem install therubyracer -v '0.9.9'

Bundler这时也能成功构建了：

    $ bundle install --without production
    Fetching gem metadata from http://rubygems.org/.
    Error Bundler::HTTPError during request to dependency API
    Fetching full source index from http://rubygems.org/
    Enter your password to install the bundled RubyGems to your system: 
    Using rake (0.9.2.2) 
    Using multi_json (1.0.4) 
    Using activesupport (3.1.0) 
    Using bcrypt-ruby (3.0.1) 
    Using builder (3.0.0) 
    Using i18n (0.6.0) 
    Using activemodel (3.1.0) 
    Using erubis (2.7.0) 
    Using rack (1.3.5) 
    Using rack-cache (1.0.3) 
    Using rack-mount (0.8.3) 
    Using rack-test (0.6.1) 
    Using hike (1.2.1) 
    Using tilt (1.3.3) 
    Using sprockets (2.0.3) 
    Using actionpack (3.1.0) 
    Using mime-types (1.17.2) 
    Using polyglot (0.3.3) 
    Using treetop (1.4.10) 
    Using mail (2.3.0) 
    Using actionmailer (3.1.0) 
    Using arel (2.2.1) 
    Using tzinfo (0.3.31) 
    Using activerecord (3.1.0) 
    Using activeresource (3.1.0) 
    Using archive-tar-minitar (0.5.2) 
    Using coffee-script-source (1.2.0) 
    Using execjs (1.2.13) 
    Using coffee-script (2.2.0) 
    Using rack-ssl (1.3.2) 
    Using json (1.6.3) 
    Using rdoc (3.12) 
    Using thor (0.14.6) 
    Using railties (3.1.0) 
    Using coffee-rails (3.1.1) 
    Using columnize (0.3.5) 
    Using haml (3.1.4) 
    Using jquery-rails (1.0.19) 
    Using libv8 (3.3.10.4) 
    Using ruby_core_source (0.1.5) 
    Using linecache19 (0.5.12) 
    Using bundler (1.2.1) 
    Using rails (3.1.0) 
    Using ruby-debug-base19 (0.11.25) 
    Using ruby-debug19 (0.11.6) 
    Using sass (3.1.12) 
    Using sass-rails (3.1.5) 
    Using sqlite3 (1.3.5) 
    Using therubyracer (0.9.9) 
    Installing uglifier (1.2.2) 
    Your bundle is complete! Use `bundle show [gemname]` to see
    where a bundled gem is installed.

看起来问题是解决了。但是，运行Rails后却跳出以下“undefined symbol”的错误：

    rake aborted!
    .../gems/ruby-1.9.3-p286/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.so:
    undefined symbol: ruby_current_thread -
    .../gems/ruby-1.9.3-p286/gems/ruby-debug-base19-0.11.25/lib/ruby_debug.so

和[这篇文章](http://rails.vandenabeele.com/blog/2011/12/21/installing-ruby-debug19-with-ruby-1-dot-9-3-on-rvm/)中所说的现象一模一样。导致`ruby_debug.so`链接库错误的罪魁祸首就是这两个库：

* __linecache19 0.5.12__
* __ruby-debug-base19 0.11.25__

解决方法参考了：

* <http://rails.vandenabeele.com/blog/2011/12/21/installing-ruby-debug19-with-ruby-1-dot-9-3-on-rvm/>
* <http://stackoverflow.com/questions/8378277/cannot-use-ruby-debug19-with-1-9-3-p0>
* <http://blog.wyeworks.com/2011/11/1/ruby-1-9-3-and-ruby-debug/>
* <https://gist.github.com/1331533>

简而言之，下载这两个打过补丁的gems：

* __linecache19 0.5.13__ <http://rubyforge.org/frs/download.php/75414/linecache19-0.5.13.gem>
* __ruby-debug-base19 0.11.26__ <http://rubyforge.org/frs/download.php/75415/ruby-debug-base19-0.11.26.gem>

替换掉`RubyGems.org`上会导致错误的旧版本：

    $ gem install linecache19-0.5.13.gem
    $ gem install ruby-debug-base19-0.11.26.gem --
      --with-ruby-include=/usr/src/ruby-1.9.3-p194/

在`Gemfile`中指定使用新版本的gems：

    gem 'linecache19', '0.5.13'
    gem 'ruby-debug-base19', '0.11.26'

然后执行：

    $ bundle update

再次运行Rails server。现在可以正常工作了！



## Rails：找不到JavaScript运行时

当未在Bundler的`Gemfile`中指定使用的therubyracer时，直接运行Rails server可能会导致“Could not find a JavaScript runtime.”错误。

    $ rake
    rake aborted!
    Could not find a JavaScript runtime.
    See https://github.com/sstephenson/execjs for a list of available runtimes.
    
    (See full trace by running task with --trace)
    
    $ rails server
    .../.rvm/gems/ruby-1.9.3-p286/gems/execjs-1.4.0/lib/execjs/runtimes.rb:51:
    in `autodetect': Could not find a JavaScript runtime.
    See https://github.com/sstephenson/execjs for a list of available runtimes.
    (ExecJS::RuntimeUnavailable)

* <http://stackoverflow.com/questions/7092107/rails-3-1-error-could-not-find-a-javascript-runtime>
* <http://stackoverflow.com/questions/9202324/execjs-could-not-find-a-javascript-runtime-but-execjs-and-therubyracer-are-in>
* <http://stackoverflow.com/questions/6282307/execjs-and-could-not-find-a-javascript-runtime>

推荐的解决方法是安装Node.js以取代therubyracer作为JavaScript运行时环境：

    $ sudo pacman -S nodejs



## 部署到Heroku

你依然可以通过gem来安装[Heroku客户端](http://rubygems.org/gems/heroku)：

    $ gem install heroku

不过官方已经不再推荐使用gem安装。通过以下命令安装最新的[Heroku toolbelt](https://toolbelt.heroku.com/)：

    $ wget -qO- https://toolbelt.heroku.com/install-other.sh | sh

添加以下行到`~/.zshrc`（或其他类似地方）：

    PATH=/usr/local/heroku/bin:$PATH

检查Heroku toolbelt能否正常工作：

    $ heroku version

使用Heroku帐号进行登录、SSH验证：

    $ heroku login

GitHub上有许多Heroku提供的官方示例。例如Ruby：

    $ git clone git://github.com/heroku/ruby-sample.git
    $ cd ruby-sample

创建一个Heroku App（系统会分配一个随机生成的ID作为你的App的域名）：

    $ heroku create
    Creating arcane-tundra-6426... done, stack is cedar
    http://arcane-tundra-6426.herokuapp.com/ | git@heroku.com:arcane-tundra-6426.git
    Git remote heroku added

通过Git即可简单部署App到Heroku：

    $ git push heroku master

更多Heroku的文档参见：

* <https://devcenter.heroku.com/>
* __Getting Started with Heroku:__ <https://devcenter.heroku.com/articles/quickstart>
* __Getting Started with Ruby on Heroku:__ <https://devcenter.heroku.com/articles/ruby>
* __Getting Started with Rails 3.x on Heroku:__ <https://devcenter.heroku.com/articles/rails3>



## 其他重要事项

### RVM初始脚本的导入

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"

这一行应当添加到`~/.zshrc`或`~/.bashrc`的__末尾__，即必须在对`$GEM_HOME`和`$PATH`变量的设置之后。否则当设定了除system以外的RVM Ruby为默认Ruby时，启动新的shell session会导致各种环境变量值的混乱（`$GEM_HOME`、`$PATH`和`rvm current`、`rvm gemdir`的值不匹配），这可能会造成包括Heroku toolbelt在内的很多Ruby程序出错。

### Bundler和$GEM_HOME

在Arch Linux上，为了使Bundler能够正常工作，需要存在环境变量`$GEM_HOME`。否则执行`bundle install`会出现如下错误：

    Could not install to path `` because of an invalid symlink.
    Remove the symlink so the directory can be created.

若使用RVM Ruby，`$GEM_HOME`和`$GEM_PATH`变量的值会被自动设置，Bundler不会出错。

若使用`rvm system`命令切换到系统Ruby，`$GEM_HOME`和`$GEM_PATH`变量不知何故会丢失（变成空值）。暂时没有找到好的解决方法，只能手动`export $GEM_HOME`，或指定Bundler使用其他的路径：

    $ bundle install --path .bundle

### 一些有用的命令

查看当前RVM信息：

    $ rvm info

查看当前RubyGems环境：

    $ gem env

