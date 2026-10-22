import fs from 'node:fs';
import {readWav,writeWav,levels} from './logo-audio-utils.mjs';
const q=JSON.parse(fs.readFileSync('src/logo-data.json'));
const style=JSON.parse(fs.readFileSync('src/logo-style.json'));
const rate=48000,mix=new Float32Array(Math.ceil(q.durationInFrames/q.config.fps*rate));
let speechCount=0,ticks=0,chimes=0;
fs.mkdirSync('public/audio-library/effects',{recursive:true});
const effectCache=new Map();
function tone(start,duration,frequency,gain){
 const file=`public/audio-library/effects/tone-${frequency}-${duration}.wav`;
 if(!effectCache.has(file)){
  if(!fs.existsSync(file)){const samples=new Float32Array(Math.round(duration*rate));for(let i=0;i<samples.length;i++){const t=i/rate; samples[i]=Math.sin(2*Math.PI*frequency*t)*Math.min(1,t/.006)*Math.exp(-t*9/duration);}writeWav(file,samples,rate);}
  effectCache.set(file,readWav(file).samples);
 }
 const samples=effectCache.get(file);for(let i=0;i<samples.length;i++){const dest=Math.round(start*rate)+i;if(dest>=mix.length)break;mix[dest]+=samples[i]*gain*style.sfxVolume;}
}
for(const e of q.events){const start=e.start/q.config.fps,duration=e.duration/q.config.fps;
 if(e.audio){const {samples,rate:sourceRate}=readWav('public/'+e.audio);if(samples.length/sourceRate>duration+.02)throw Error('Narration exceeds slot: '+e.audio);
 const rms=Math.pow(10,levels(samples).rmsDb/20);if(rms<.0001)throw Error('Silent narration '+e.audio);
 const gain=Math.min(5,.15/rms)*style.voiceVolume;
 for(let i=0;i<Math.floor(samples.length*rate/sourceRate);i++){const pos=i*sourceRate/rate,j=Math.min(samples.length-1,Math.floor(pos)),value=samples[j]*(1-(pos-j))+(samples[Math.min(j+1,samples.length-1)]||0)*(pos-j);mix[Math.round(start*rate)+i]+=Math.tanh(value*gain/0.8)*0.8;}speechCount++;
 }
 if(e.kind==='guess'){for(let t=.1;t<duration-.1;t+=1){tone(start+t,.12,1100,.24);ticks++;}}
 if(e.kind==='reveal'){tone(start,.32,660,.23);tone(start+.09,.38,880,.2);chimes++;}
 if(['intro','engagement','outro'].includes(e.kind))tone(start,.18,440,.12);
}
for(let i=0;i<mix.length;i++){if(!Number.isFinite(mix[i]))throw Error('Invalid sample at '+i);mix[i]=Math.max(-.89,Math.min(.89,mix[i]));}
writeWav('public/brand-logos-001/audio/full-mix.wav',mix,rate);
const report={speechCount,ticks,chimes,duration:mix.length/rate,...levels(mix),voice:q.config.voice,soundEffects:'Cached locally synthesized original countdown ticks and reveal chimes; zero API credits'};
fs.writeFileSync('data/logo-audio-mix-report.json',JSON.stringify(report,null,2));console.log(report);
