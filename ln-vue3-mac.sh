#!/bin/sh

rm -rf .cursor/rules/global-00-general.mdc
rm -rf .cursor/rules/global-01-frontend.mdc
rm -rf .cursor/rules/global-02-commit.mdc

ln -s /Users/lincenying/Library/CloudStorage/OneDrive-个人/Setting/cusor/Vue/rules/global-00-general.mdc .cursor/rules/global-00-general.mdc
ln -s /Users/lincenying/Library/CloudStorage/OneDrive-个人/Setting/cusor/Vue/rules/global-01-frontend.mdc .cursor/rules/global-01-frontend.mdc
ln -s /Users/lincenying/Library/CloudStorage/OneDrive-个人/Setting/cusor/Vue/rules/global-02-commit.mdc .cursor/rules/global-02-commit.mdc

grep -qxF '.cursor/rules/global*.mdc' .gitignore 2>/dev/null || echo '.cursor/rules/global*.mdc' >> .gitignore
