#!/bin/sh
# 清理 exFAT/NTFS 卷上的 macOS 元数据垃圾文件。
# 作用：._xxx 是 AppleDouble 伴生文件（资源叉/扩展属性），
#      其中 ._xxx.js 会被微信开发者工具的 Babel 当源码解析，
#      直接报 "Unexpected character" 导致整包编译失败。
# 用法：./clean-appledouble.sh

cd "$(dirname "$0")" || exit 1

before=$(find . -name "._*" -not -path "./.git/*" | wc -l | tr -d ' ')
find . -name "._*" -not -path "./.git/*" -delete
find . -name ".DS_Store" -not -path "./.git/*" -delete
after=$(find . -name "._*" -not -path "./.git/*" | wc -l | tr -d ' ')

echo "AppleDouble 文件：${before} -> ${after}"
echo "完成，重新编译即可。"
