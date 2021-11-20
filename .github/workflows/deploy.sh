ssh root@139.59.238.28 "cd ~/nemo-ai && git pull && yarn install && yarn build && pm2 restart core-ui && exit"
