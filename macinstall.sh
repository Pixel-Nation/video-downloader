#!/usr/bin/env bash
# -*- coding: utf-8 -*-

mkdir videodownloader
cd ./videodownloader
curl "https://raw.githubusercontent.com/Pixel-Nation/video-downloader/main/index.js" > "./index.js"
curl "https://raw.githubusercontent.com/Pixel-Nation/video-downloader/main/package.json" > "./package.json"
npm i

echo "\n\n# YGET\nalias \"yget=node $PWD/index.js\"" >> ~/.zshrc
source ~/.zshrc
