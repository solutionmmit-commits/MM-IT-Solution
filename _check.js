const fs=require('fs');
const c=fs.readFileSync('E:/VS Code Program/Program 1/offline-services.html','utf8');
const matches=c.match(/services\.offline\.[a-z.]+/g);
console.log('services.offline refs:', matches);
const all=c.match(/data-i18n="[^"]+"/g);
console.log('i18n tags:', all);