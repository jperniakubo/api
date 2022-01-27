#!/bin/bash
### Automation steps ###
# Inside the project PROJECT
cd /home/PROJECT
# Remove older node_modules
# rm -rf node_modules
# Install Dependencies
npm install --save
# Update PM2
pm2 update
# Kill Last Process
npm run serve:kill
# Run the build Project
pm2 start ecosystem.config.js --env %ENV
pm2 save