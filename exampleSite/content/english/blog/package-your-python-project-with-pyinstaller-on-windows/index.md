---
title: use pyinstaller to package a python project
description: transform your python application into .exe format, avoid
  complecated dependencies, make it easy to share
date: 2025-07-17T11:16:00.000+08:00
image: /images/uploads/img-summer-1.png
categories:
  - python
author: ifindv
tags:
  - pyinstaller
draft: false
---
##  demo project structure

```
LmtAuto/
|── conf
|   |── map_intall_path
|   |── ssh_account
|   |── svn_account
|   |── svn_url_for_each_branch
|
|── image
|
|── module
|   |── config.py
|   |── pack.py
|   |── ssh.py
|   |── svn.py
|   |── wiki.py
|
|── template
|   |── bzy_temp_patch_upgrade
|   |── README.txt
|
|── tmp
|
|── wiki
|   |── edisks
|   |── issues
|   |── platforms
|   |── release_notes
|   |── release_packs
|   |── solutions
|
|── main.py
|
|── README.md
```

## packge your project with pyinstaller

```
# install pyinstaller first
pip install pyinstaller

# generate initial .spec file
pyinstaller --name=LmtAuto --onefile --noconsole main.py

# when modify .spec file done, package your application with command:
pyinstaller LmtAuto.spec

# waitting command finish, check your app in dist directory
```

## demo .spec file 

```
# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

def get_data_files():
    data_files = [
        ('conf', 'conf'),
        
        ('template/bzy_temp_patch_upgrade', 'template'),
        ('template/README.txt', 'template'),
        
        ('wiki/edisks/*', 'wiki/edisks'),
        ('wiki/issues/*', 'wiki/issues'),
        ('wiki/platforms/*', 'wiki/platforms'),
        ('wiki/release_notes/*', 'wiki/release_notes'),
        ('wiki/release_packs/*', 'wiki/release_packs'),
        ('wiki/solutions/*', 'wiki/solutions'),
        
        ('images/*', 'images'),
    ]
    return data_files

a = Analysis(
    ['main.py'],
    pathex=['/path/to/your/project'], ######## modify
    binaries=[],
    datas=get_data_files(), ######### important
    hiddenimports=[],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='LmtAuto',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
)
```

##
