#!/bin/bash

ja_js_file="./assets/locales/ja.js"
en_js_file="./assets/locales/en.js"
csv_file="./scripts/locales.csv"
output_file="./scripts/output_file.txt"
output_file_en="./scripts/output_file_en.txt"

# 清空輸出檔案
> "$output_file"
> "$output_file_en"

# 讀取 ja.js 檔案的每一行
while IFS= read -r line
do
  # 檢查行是否符合 key: 'value', 的格式
  if [[ $line =~ ^[[:space:]]*[[:alnum:]_]+:[[:space:]]*\'.*\',$ ]]; then
    # 使用 awk 和 sed 來找出 key 和 value
    key=$(echo "$line" | awk -F: '{print $1}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    value=$(echo "$line" | awk -F\' '{print $2}')

    # 在 locales.csv 中尋找相同的文字
    if grep -q -F "$value" "$csv_file"; then
      echo "找到匹配的文字: $value"
    else
      echo "未找到匹配的文字: $value" >> "$output_file"
    fi
  fi
done < "$ja_js_file"

# 讀取 en.js 檔案的每一行
while IFS= read -r line
do
  # 檢查行是否符合 key: 'value', 的格式
  if [[ $line =~ ^[[:space:]]*[[:alnum:]_]+:[[:space:]]*\'.*\',$ ]]; then
    # 使用 awk 和 sed 來找出 key 和 value
    key=$(echo "$line" | awk -F: '{print $1}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    value=$(echo "$line" | awk -F\' '{print $2}')

    # 在 locales.csv 中尋找相同的文字
    if grep -q -F "$value" "$csv_file"; then
      echo "找到匹配的文字: $value"
    else
      echo "未找到匹配的文字: $value" >> "$output_file_en"
    fi
  fi
done < "$en_js_file"
