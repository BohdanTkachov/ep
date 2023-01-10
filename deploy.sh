#zero downtime deployment nextjs

echo "Deploy starting..."

git checkout prod
git pull origin prod

rm -rf node_modules
npm install --production || exit

BUILD_DIR=temp npm run build || exit

if [ ! -d "temp" ]; then
  echo '\033[31m temp Directory does not exist!\033[0m'  
  exit 1;
fi

rm -rf .next

mv temp .next

pm2 reload ~/pm2.config.js --only frontend_nextjs --update-env

echo "Deploy done."
