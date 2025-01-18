#!/bin/bash

# Add echo to show progress
echo "Starting localization sync..."

# Add error handling and set working directory
cd "$(dirname "$0")/.." || exit 1

# Execute with timeout and error handling
npx vue-i18n-extract report \
  --add=true \
  --remove=true \
  --vueFiles './**/*.{js,vue}' \
  --languageFiles './assets/locales/*.json' \
  --exclude betting_result \
  --exclude deposit_withdrawal_result \
  --exclude currency \
  --exclude form \
  --exclude portfolio \
  --exclude event_detail \
  --exclude setting.wager \
  --exclude general.en \
  --exclude general.ja \
  --exclude form \
  --exclude setting.notifications || {
    echo "Error: Localization sync failed"
    exit 1
  }

echo "Localization sync completed successfully"
