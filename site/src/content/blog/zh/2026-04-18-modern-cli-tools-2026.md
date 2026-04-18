---
title: 2026 年必装的现代 CLI 工具：从 ncdu 到 gdu，从 ls 到 eza
description: 推荐一批 2026 年现代 CLI 工具，覆盖磁盘分析、文件浏览、搜索、系统监控等场景。这些工具都轻量、快速、美观，让终端从「可用」变成「享受」。
pubDatetime: 2026-04-18T00:00:00Z
modDatetime: 2026-04-18T00:00:00Z
draft: false
tags:
  - CLI
  - Tooling
  - Linux
  - Terminal
  - fzf
  - eza
  - bat
lang: zh
---

# 2026 年必装的现代 CLI 工具：从 ncdu 到 gdu，从 ls 到 eza

如果你还在用 `ncdu`、`ls`、`cat`、`find`、`grep`、`top`，是时候升级了。2026 年的 CLI 工具生态空前繁荣，大量 Rust/Go 编写的现代工具横空出世——更快、更漂亮、更易用。

本文以 **fzf** 和 **gdu** 为核心，覆盖开发者日常的各个方面（磁盘清理、文件浏览、搜索、导航、系统监控等）。这些工具都轻量、快速、美观，非常适合 Debian + zsh + mise 开发环境。

## 1. 磁盘空间分析（代替 ncdu / du）

### gdu（强烈推荐）

Go 编写，比 ncdu 更快（尤其是 SSD），交互式 TUI，支持鼠标、颜色更漂亮、可直接删除。

```bash
sudo apt install gdu
gdu /home/asus
```

博客亮点：「更快、更现代的 ncdu 替代品」。

### dust

Rust 编写，树状图 + 百分比显示，直观好看（非交互式，但输出美观）。

```bash
sudo apt install dust
dust /home/asus
```

### duf

代替 `df`，彩色、分区概览，一目了然。

```bash
sudo apt install duf
duf
```

**推荐组合**：`duf`（概览）→ `dust`（树状）→ `gdu`（交互删除）。

## 2. 模糊查找神器（fzf 系列，必装！）

### fzf

模糊查找一切（历史命令、文件、进程等）。

```bash
sudo apt install fzf
source <(fzf --zsh)
```

快捷键：Ctrl+R（历史）、Ctrl+T（文件）。

### zoxide（智能 cd，fzf 好搭档）

记住你常去的目录，`z proj` 就能跳到项目目录。

```bash
sudo apt install zoxide
eval "$(zoxide init zsh)"
```

## 3. 文件列表 & 浏览（代替 ls / tree）

### eza（exa 的活跃 fork，最推荐）

`ls` 的现代替代，带图标、Git 状态、颜色、树状显示。

```bash
sudo apt install eza
alias ls='eza --icons --git'
alias ll='eza -l --icons --git'
```

### yazi（现代终端文件管理器）

类似 ranger，但更漂亮、支持预览图片、视频（适合博客演示「终端里的文件管理器」）。

## 4. 文件查看 & 差异（代替 cat / diff）

### bat（超级推荐）

`cat` + 语法高亮 + Git 集成 + 分页。

```bash
sudo apt install bat
alias cat='bat'
```

### delta（git diff 神器）

美化 git diff，侧边对比、颜色高亮。

```bash
cargo install git-delta
```

## 5. 搜索 & 查找（代替 find / grep）

### fd（代替 find）

更快、更简单，支持 .gitignore。

```bash
sudo apt install fd-find
```

### ripgrep (rg)（代替 grep）

超快代码搜索，自动忽略 .gitignore。

```bash
sudo apt install ripgrep
```

**fzf + fd + rg + bat** 组合无敌：模糊查找 + 快速搜索 + 美观预览。

## 6. 系统监控（代替 top / htop）

### btop

更漂亮、资源监控（CPU、内存、磁盘、网络），支持主题。

```bash
sudo apt install btop
```

### fastfetch 或 neofetch（系统信息展示）

```bash
sudo apt install fastfetch
```

## 7. 其他实用工具（提升生产力）

### tealdeer (tldr)

简化 man 页面，只看实用例子。

```bash
sudo apt install tealdeer
```

### starship

跨 shell 漂亮提示符（推荐加到 zsh）。

```bash
curl -sS https://starship.rs/install.sh | sh
```

## 一键安装推荐

```bash
sudo apt update
sudo apt install -y gdu dust duf eza bat fd-find ripgrep fzf zoxide btop tealdeer
```

然后在 `~/.zshrc` 添加常用配置：

```zsh
# fzf
source <(fzf --zsh)

# zoxide
eval "$(zoxide init zsh)"

# 别名示例
alias ls='eza --icons --git'
alias cat='bat'
```

这些工具装好后，你的终端会明显更现代、更高效！