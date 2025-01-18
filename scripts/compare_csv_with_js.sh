#!/bin/bash

csv_file="./scripts/locales.csv"
ja_js_file="./assets/locales/ja.js"
en_js_file="./assets/locales/en.js"
output_file="./scripts/output_file.txt"

# 清空輸出檔案
> "$output_file"

# 使用 awk 讀取 CSV 檔案的每一行
awk -v RS='"' 'NR % 2 == 0 { gsub(/\n/, "") } { printf("%s%s", $0, RT) }' "$csv_file" | while IFS=, read -r ja en
do
  # 在 ja.js 中尋找相同的文字
  if grep -z -q -F "$ja" "$ja_js_file"; then
    echo "找到匹配的文字: $ja"
  else
    echo "未找到匹配的文字: $ja" >> "$output_file"
  fi
done
