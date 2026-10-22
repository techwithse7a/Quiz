import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import * as icons from 'simple-icons';
const root=process.cwd();
const dir='public/brand-logos-001';
fs.mkdirSync(dir,{recursive:true});fs.mkdirSync('data',{recursive:true});
const selected=['Apple','Nike','Spotify','Mcdonalds','Adidas','Snapchat','Playstation','Shell','Puma','Pinterest'];
const names=['Apple','Nike','Spotify',"McDonald’s",'Adidas','Snapchat','PlayStation','Shell','Puma','Pinterest'];
const historyFile='data/history.json';
const history=fs.existsSync(historyFile)?JSON.parse(fs.readFileSync(historyFile)):[];
const repeats=selected.filter(id=>history.some(h=>h.id!=='brand-logos-001'&&h.items.includes(id.toLowerCase())));
if(repeats.length&&!process.argv.includes('--allow-repeat'))throw Error('Previously used: '+repeats.join(', '));
const questions=selected.map((key,i)=>{
 const icon=icons['si'+key];if(!icon)throw Error('Missing source icon '+key);
 const asset=`brand-logos-001/${key.toLowerCase()}.svg`;
 fs.writeFileSync('public/'+asset,icon.svg.replace('<svg ',`<svg fill="#${icon.hex}" `));
 return {id:key.toLowerCase(),answer:names[i],asset,source:icon.source,library:'Simple Icons',license:icon.license??{type:'Not supplied by source; trademark rights reserved'},guidelines:icon.guidelines??null};
});
const audioFile='data/logo-audio.json';
const audio=fs.existsSync(audioFile)?JSON.parse(fs.readFileSync(audioFile,'utf8').replace(/^\uFEFF/,'')):{};
const config={fps:30,width:1080,height:1920,guessSeconds:3.5,revealSeconds:1.35,challengeEnabled:!process.argv.includes('--no-challenge'),musicEnabled:false,voice:audio.intro?.voice??'Todd - Clear, Engaging and Educational',voiceId:audio.intro?.voiceId??null,speechSpeed:1,background:'#102653',accent:'#E828FF',answerColor:'#8DFF68'};
const events=[];let cursor=0;
function add(kind,text,seconds,clip,index=-1){const a=audio[clip];if(kind==='engagement'&&a?.text)text=a.text;const duration=Math.ceil(Math.max(seconds,a?.duration??0)*30)+ (a?6:0);events.push({kind,text,start:cursor,duration,index,audio:a?.file??null});cursor+=duration;}
add('intro','Can you name ten brand logos? Let’s find out!',3,'intro');
if(config.challengeEnabled)add('challenge','Think you can get a perfect ten?',2,'challenge');
questions.forEach((q,i)=>{if(i===9)add('engagement','Final question! Can you get this one?',2,'final');add('guess',`LOGO #${i+1}`,config.guessSeconds,null,i);add('reveal',q.answer,config.revealSeconds,`a${i+1}`,i);if(i===2)add('engagement','Three down! How many have you guessed?',2,'engage3');if(i===5)add('engagement','Keep going! Remember your score!',2,'engage6');});
add('outro','How many did you get right? Comment your score, and follow Play With Momo!',4,'outro');
const quiz={id:'brand-logos-001',brand:'Play With Momo',category:'brand-logos',title:'Can You Guess All 10 Brand Logos?',createdAt:new Date().toISOString(),config,questions,events,durationInFrames:cursor};
fs.writeFileSync('data/brand-logos-001.json',JSON.stringify(quiz,null,2));
fs.writeFileSync('src/logo-data.json',JSON.stringify(quiz,null,2));
fs.writeFileSync('data/brand-logos-001-youtube.md','# Can You Guess All 10 Brand Logos? 👀 | Play With Momo\n\nTen logos. No options. How many can you recognize before the timer runs out?\n\nComment your score out of 10 and follow Play With Momo for more quizzes!\n\n#LogoQuiz #GuessTheLogo #Quiz #Shorts\n\nBrand marks belong to their respective owners. No affiliation or endorsement.');
if(!history.some(h=>h.id===quiz.id)){history.push({id:quiz.id,status:'draft',category:quiz.category,date:quiz.createdAt,title:quiz.title,items:questions.map(q=>q.id),assets:questions.map(q=>({asset:q.asset,source:q.source}))});fs.writeFileSync(historyFile,JSON.stringify(history,null,2));}
const missing=events.filter(e=>e.kind!=='guess'&&!e.audio).map(e=>e.text);
const report={questions:questions.length,unique:new Set(questions.map(q=>q.id)).size,assetsPresent:questions.every(q=>fs.existsSync('public/'+q.asset)),unwantedRepeats:repeats,missingNarration:missing,durationSeconds:cursor/30,resolution:'1080x1920',captionMode:'Phrase-level captions use the same event boundaries as narration',status:missing.length?'draft-missing-narration':'ready-for-render',warnings:['Individual trademark permissions are not granted by the icon-library license.','No prior published-video history was supplied; duplicate prevention covers local records.']};
fs.writeFileSync('data/brand-logos-001-validation.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
