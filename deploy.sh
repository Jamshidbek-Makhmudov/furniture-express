#!/bin/bash

#PRODUCTION
git checkout main
git reset  --hard
git pull origin main
npm i 
pm2 start process.config.js --env production

pm2 logs Shopsy
 --lines 1000ls

#DEVELOPMENT
# pm2 start process.config.js --env development





#  sudo npm install --global vercel  
#  vercel login 
#  vercel
#  vercel --prod
