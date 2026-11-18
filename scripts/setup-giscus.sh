#!/usr/bin/env bash
#
# 生成 / 更新 data/giscus.yaml 里的 repoId、category、categoryId
#
# 前置条件（需要手动做一次）：
#   1. 仓库开启 Discussions：Settings → General → Features → Discussions
#   2. 安装 giscus App：https://giscus.app → Install，勾选目标仓库
#   3. 建一个讨论分类（默认名 Comments）：仓库 Discussions 页面右上角 Categories
#
# 用法：
#   scripts/setup-giscus.sh [owner/name] [分类名]
#
set -euo pipefail

REPO="${1:-ifindv/ifindv.github.io}"
CATEGORY="${2:-Comments}"

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${ROOT}/data/giscus.yaml"
API="https://giscus.app/api/discussions/categories?repo=${REPO}"

if [ ! -f "${OUT}" ]; then
  echo "✗ 找不到 ${OUT}" >&2
  exit 1
fi

echo "→ 查询 ${REPO} 的 giscus 配置…"
RESP="$(curl -sSL --max-time 20 "${API}")"

RESP="${RESP}" REPO="${REPO}" CATEGORY="${CATEGORY}" TARGET="${OUT}" python3 - <<'PY'
import json
import os
import re
import sys

repo = os.environ["REPO"]
category = os.environ["CATEGORY"]
target = os.environ["TARGET"]
raw = os.environ["RESP"]

try:
    data = json.loads(raw)
except json.JSONDecodeError:
    print(f"✗ giscus API 返回异常：\n{raw}", file=sys.stderr)
    sys.exit(1)

if data.get("error"):
    print(
        f"""✗ {data["error"]}

请先完成以下准备：
  1. 仓库开启 Discussions
     {repo} → Settings → General → Features → Discussions
  2. 安装 giscus App 并授权该仓库
     https://giscus.app → Install""",
        file=sys.stderr,
    )
    sys.exit(1)

categories = data.get("categories", [])
by_name = {c["name"].lower(): c["id"] for c in categories}

if category.lower() not in by_name:
    print(f"✗ 分类 “{category}” 不存在。当前可用分类：", file=sys.stderr)
    for c in categories:
        print(f"    - {c['name']}", file=sys.stderr)
    print(
        f"""
  在 {repo} → Discussions → 右上角 Categories 新建一个名为 “{category}” 的分类，
  或者换个已有分类重跑：scripts/setup-giscus.sh {repo} "分类名"
""",
        file=sys.stderr,
    )
    sys.exit(1)

repo_id = data["repositoryId"]
category_id = by_name[category.lower()]

with open(target, encoding="utf-8") as f:
    text = f.read()

for key, value in (
    ("repoId", repo_id),
    ("category", category),
    ("categoryId", category_id),
):
    pattern = rf'^(?P<prefix>{key}:[ \t]*)(?P<quote>["\']?)(?P<value>.*?)(?P=quote)[ \t]*$'
    text, count = re.subn(
        pattern, lambda m: f'{m.group("prefix")}"{value}"', text, count=1, flags=re.M
    )
    if count == 0:
        text += f'\n{key}: "{value}"\n'

with open(target, "w", encoding="utf-8") as f:
    f.write(text)

print(f"→ 已写入 {target}")
print(f"    repoId     = {repo_id}")
print(f"    category   = {category}")
print(f"    categoryId = {category_id}")
PY

echo
echo "✓ 完成。跑一次 hugo 构建确认：hugo --minify"
