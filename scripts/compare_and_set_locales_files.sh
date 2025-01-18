#!/bin/bash

# 呼叫 compare_csv_with_js.sh
# 確認 locales.csv 中的日文翻譯在 ja.js 中是否存在
bash scripts/compare_csv_with_js.sh

# 呼叫 compare_js_with_csv.sh
# 確認 ja.js 中的日文翻譯在 locales.csv 中是否存在  
bash scripts/compare_js_with_csv.sh

# 呼叫 set_locales_en.sh
# 將 locales.csv 中的英文翻譯寫入 en.js
bash scripts/set_locales_en.sh
