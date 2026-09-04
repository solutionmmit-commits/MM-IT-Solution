const fs=require('fs');
const c=fs.readFileSync('E:/VS Code Program/Program 1/cms.js','utf8');
// Find second 'en:' (the translation dict en section)
const firstEn=c.indexOf('en:');
const enStart=c.indexOf('en:',firstEn+1);
let depth=1;
let idx=enStart;
while(depth>0 && idx<c.length){
  if(c[idx]==='{')depth++;
  if(c[idx]==='}')depth--;
  idx++;
}
const enSection=c.substring(enStart+3,idx);
const hasOffline=enSection.includes('services.offline');
console.log('services.offline in EN section:', hasOffline);
if(!hasOffline){
  const keys=enSection.match(/"[a-z.]+\":/g)||[];
  console.log('Total EN keys:', keys.length);
  // Check for services. keys
  const svcKeys=keys.filter(k=>k.includes('services.'));
  console.log('services. keys in EN:', svcKeys);
}
// Also check if index.html has the English fallback text in services.offline.desc
const idx2=fs.readFileSync('E:/VS Code Program/Program 1/index.html','utf8');
const m=idx2.match(/data-i18n="services\.offline\.desc"[^>]*>([^<]+)</);
if(m) console.log('offline.desc fallback:', m[1]);
const m2=idx2.match(/data-i18n="services\.offline\.tag"[^>]*>([^<]+)</);
if(m2) console.log('offline.tag fallback:', m2[1]);
const m3=idx2.match(/data-i18n="services\.offline\.title"[^>]*>([^<]+)</);
if(m3) console.log('offline.title fallback:', m3[1]);