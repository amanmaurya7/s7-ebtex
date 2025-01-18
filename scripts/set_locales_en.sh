#!/bin/bash

csv_file="./scripts/locales.csv"
ja_js_file="./assets/locales/ja.js"
en_js_file="./assets/locales/en.js"
output_file_en="./scripts/output_file_en.txt"

# 定義 trim 函數
trim() {
  local var="$*"
  # 移除前面的空格
  var="${var#"${var%%[![:space:]]*}"}"
  # 移除後面的空格
  var="${var%"${var##*[![:space:]]}"}"   
  printf "%s" "$var"
}

# 清空輸出檔案
> "$output_file_en"

# 讀取 en.js 檔案的每一行
line_number=0
while IFS= read -r line
do
  line_number=$((line_number + 1))
  # 檢查行是否符合 key: 'value', 的格式
  if [[ $line =~ ^[[:space:]]*[[:alnum:]_]+:[[:space:]]*\'.*\',$ ]]; then
    # 使用 awk 和 sed 來找出 key 和 value
    key=$(echo "$line" | awk -F: '{print $1}' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

    # 輸出 key 和行數
    echo "$line_number,$key" >> "$output_file_en"
  fi
done < "$en_js_file"

# 在讀取 output_file_en 之前先將其內容儲存到一個變數
output_content=$(cat "$output_file_en")

# 清空輸出檔案
> "$output_file_en"

# 讀取 output_content 的每一行
echo "$output_content" | while IFS= read -r line
do
  # 從 line 中提取 key
  en_line_number=$(echo "$line" | cut -d, -f1)
  key=$(echo "$line" | cut -d, -f2)
  
  # 檢查 key 是否為空
  if [ -n "$key" ]; then
    # 初始化 found_first 變數
    found_first=false

    # 使用 grep 來找出 ja.js 中對應的行和行數，然後使用 awk 來提取 value 和行數
    line_and_values=$(grep -nE "\b$key:" "$ja_js_file" | grep ',$' | awk -F\' '{print $1 " " $2}')

    # 讀取 line_and_values 的每一行
    echo "$line_and_values" | while IFS= read -r line_and_value
    do
      if [ -n "$line_and_value" ]; then
        # 從 line_and_value 中提取行數和 value
        ja_line_number=$(echo "$line_and_value" | cut -d: -f1)
        value=$(echo "$line_and_value" | awk -F: '{for (i=3; i<=NF; i++) printf $i (i==NF ? "\n" : ":")}')

        if [[ "$ja_line_number" =~ ^[0-9]+$ ]]; then
          # 使用 trim 函數移除 value 中的空格
          value=$(trim "$value")

          # 使用 value 在 locales.csv 中搜尋對應的 en 值
          en_value=$(grep -E "^$value," "$csv_file" | awk -F',' '{for (i=2; i<=NF; i++) printf "%s", $i (i==NF ? "\n" : ",")}' | head -n 1 | sed -e 's/"//g')

          # 使用 trim 函數移除 en_value 中的空格
          en_value=$(trim "$en_value")
          en_value=$(echo "$en_value" | sed "s/'/\\\'/g")

          # 檢查 en_value 是否為空
          if [ -n "$en_value" ]; then
            if [ "$en_line_number" -ne "$ja_line_number" ]; then
              if [ $(($en_line_number - $ja_line_number)) -lt 10 ] && [ $(($ja_line_number - $en_line_number)) -lt 10 ]; then
                echo "[行數不匹配] en-$en_line_number/ja-$ja_line_number, $key, $value, $en_value"
              fi
            else
              # 檢查是否已經找到了第一個匹配
              if $found_first; then
                # 如果已經找到了第一個匹配，則輸出 "重複的結果: $en_value"
                echo "[重複] en-$en_line_number/ja-$ja_line_number: $key, $value, $en_value" >> "$output_file_en"
              else
                # 如果還沒有找到第一個匹配且 en_value 有值，則輸出 key、value、en_value 和行數，並將 found_first 設置為 true
                echo "$en_line_number: $key, $value, $en_value" >> "$output_file_en"
                # 使用 sed 命令修改 en.js 文件的第 en_line_number 行
                en_value_escaped=${en_value//&/\\&}
                sed -i "" "${en_line_number}s#^\([ ]*\).*#\1$key: '$en_value_escaped',#" $en_js_file
                found_first=true
              fi
            fi
          fi
        fi
      fi
    done
  fi
done