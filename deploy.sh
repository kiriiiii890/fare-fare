#!/usr/bin/env bash
# Add, commit và push code lên GitHub — GitHub Actions (.github/workflows/deploy.yml)
# sẽ tự động build và deploy lên GitHub Pages sau khi push vào nhánh main.
#
# Cách dùng:
#   ./deploy.sh "nội dung commit"
#   ./deploy.sh               (dùng commit message mặc định kèm timestamp)

set -euo pipefail

BRANCH="main"
MESSAGE="${1:-Update $(date '+%Y-%m-%d %H:%M:%S')}"

if [[ -z $(git status --porcelain) ]]; then
  echo "Không có thay đổi nào để commit."
else
  git add -A
  git commit -m "$MESSAGE"
fi

git push origin "$BRANCH"

echo "Đã push lên $BRANCH. Theo dõi tiến trình build/deploy tại:"
REMOTE_URL=$(git config --get remote.origin.url)
REPO_PATH=$(echo "$REMOTE_URL" | sed -E 's#(git@github.com:|https://github.com/)##; s#\.git$##')
echo "https://github.com/$REPO_PATH/actions"
