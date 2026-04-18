---
title: "Modern CLI Tools You Need in 2026: From ncdu to gdu, from ls to eza"
description: "A curated list of modern CLI tools for 2026 covering disk analysis, file browsing, search, and system monitoring"
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
lang: en
---

# Modern CLI Tools You Need in 2026: From ncdu to gdu, from ls to eza

If you're still using `ncdu`, `ls`, `cat`, `find`, `grep`, `top`, it's time to upgrade. The CLI tool ecosystem in 2026 is booming—numerous Rust/Go-powered modern tools are faster, prettier, and more user-friendly.

This article focuses on **fzf** and **gdu** as core tools, covering all aspects of daily development (disk cleanup, file browsing, search, navigation, system monitoring). These tools are lightweight, fast, and beautiful—perfect for your Debian + zsh + mise environment.

## 1. Disk Space Analysis (replacing ncdu / du)

### gdu (Highly Recommended)

Written in Go, faster than ncdu (especially on SSD), interactive TUI, mouse support, prettier colors, can delete files directly.

```bash
sudo apt install gdu
gdu /home/asus
```

Blog highlight: "Faster, more modern ncdu alternative."

### dust

Written in Rust, treemap + percentage display, intuitive and pretty (non-interactive but beautiful output).

```bash
sudo apt install dust
dust /home/asus
```

### duf

Replaces `df`, colorful partition overview at a glance.

```bash
sudo apt install duf
duf
```

**Recommended combo**: `duf` (overview) → `dust` (treemap) → `gdu` (interactive deletion).

## 2. Fuzzy Finder (fzf series, must-have!)

### fzf

Fuzzy find anything (history, files, processes, etc.).

```bash
sudo apt install fzf
source <(fzf --zsh)
```

Shortcuts: Ctrl+R (history), Ctrl+T (files).

### zoxide (Smart cd, fzf's best partner)

Remembers your frequently visited directories, `z proj` jumps to your project directory.

```bash
sudo apt install zoxide
eval "$(zoxide init zsh)"
```

## 3. File Listing & Browsing (replacing ls / tree)

### eza (Active fork of exa, most recommended)

Modern `ls` replacement with icons, Git status, colors, tree view.

```bash
sudo apt install eza
alias ls='eza --icons --git'
alias ll='eza -l --icons --git'
```

### yazi (Modern terminal file manager)

Similar to ranger but prettier, supports previewing images and videos (great for blog demos showing "file manager in terminal").

## 4. File Viewing & Diff (replacing cat / diff)

### bat (Highly Recommended)

`cat` + syntax highlighting + Git integration + paging.

```bash
sudo apt install bat
alias cat='bat'
```

### delta (Git diff powerhouse)

Beautifies git diff, side-by-side comparison, color highlighting.

```bash
cargo install git-delta
```

## 5. Search & Find (replacing find / grep)

### fd (Replacing find)

Faster, simpler, supports .gitignore.

```bash
sudo apt install fd-find
```

### ripgrep (rg) (Replacing grep)

Ultra-fast code search, automatically ignores .gitignore.

```bash
sudo apt install ripgrep
```

**fzf + fd + rg + bat** combo is unstoppable: fuzzy finding + fast search + beautiful preview.

## 6. System Monitoring (replacing top / htop)

### btop

Prettier resource monitoring (CPU, memory, disk, network), theme support.

```bash
sudo apt install btop
```

### fastfetch or neofetch (System info display)

```bash
sudo apt install fastfetch
```

## 7. Other Useful Tools (Productivity Boosters)

### tealdeer (tldr)

Simplifies man pages, shows practical examples only.

```bash
sudo apt install tealdeer
```

### starship

Cross-shell beautiful prompt (recommended for zsh).

```bash
curl -sS https://starship.rs/install.sh | sh
```

## One-Click Install Recommendation

```bash
sudo apt update
sudo apt install -y gdu dust duf eza bat fd-find ripgrep fzf zoxide btop tealdeer
```

Then add to your `~/.zshrc`:

```zsh
# fzf
source <(fzf --zsh)

# zoxide
eval "$(zoxide init zsh)"

# Alias examples
alias ls='eza --icons --git'
alias cat='bat'
```

After installing these tools, your terminal will be noticeably more modern and efficient!