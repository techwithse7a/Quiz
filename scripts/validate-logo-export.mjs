import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
const base='node_modules/@remotion/compositor-win32-x64-msvc/';
const video='out/play-with-momo-brand-logos-001.mp4';
const data=JSON.parse(fs.readFileSync('data/brand-logos-001.json'));
const report=JSON.parse(fs.readFileSync('data/brand-logos-001-validation.json'));
const meta=JSON.parse(execFileSync(base+'ffprobe.exe',['-v','error','-show_streams','-show_format','-of','json',video]));
execFileSync(base+'ffmpeg.exe',['-v','error','-i',video,'-c:v','rawvideo','-c:a','pcm_s16le','-f','null','-'],{stdio:['ignore','pipe','pipe']});
const v=meta.streams.find(s=>s.codec_type==='video'),a=meta.streams.find(s=>s.codec_type==='audio');
if(v.width!==1080||v.height!==1920||!a)throw Error('Invalid dimensions or missing audio');
if(Math.abs(Number(meta.format.duration)-data.durationInFrames/30)>.15)throw Error('Export duration mismatch');
const manifest=JSON.parse(fs.readFileSync('data/logo-audio.json','utf8').replace(/^\uFEFF/,''));
const levels={};
for(const [id,clip] of Object.entries(manifest)){
 const wav=fs.readFileSync('public/'+clip.file);let raw;
 for(let offset=12;offset+8<=wav.length;){const tag=wav.toString('ascii',offset,offset+4),size=wav.readUInt32LE(offset+4);if(tag==='fmt '&&(wav.readUInt16LE(offset+8)!==1||wav.readUInt16LE(offset+22)!==16))throw Error('Expected 16-bit PCM');if(tag==='data'){raw=wav.subarray(offset+8,offset+8+size);break;}offset+=8+size+(size%2);}
 if(!raw)throw Error('Missing WAV samples');
 let peak=0,sum=0;for(let i=0;i<raw.length;i+=2){const val=raw.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(val));sum+=val*val;}
 levels[id]={peakDb:20*Math.log10(peak),rmsDb:10*Math.log10(sum/(raw.length/2))};
 if(peak===0||peak>=.9999)throw Error('Silent or clipped source clip '+id);
}
report.export={file:video,codec:v.codec_name,audio:a.codec_name,width:v.width,height:v.height,duration:Number(meta.format.duration),fullDecodePassed:true};
report.audioLevels=levels;report.narrationProvider='Windows Speech — Microsoft David Desktop (draft substitute)';
report.status='review-draft';report.warnings.push('ElevenLabs account restriction prevented final-quality narration. Local male draft narration is used consistently.','HyperFrames companion is linted, not MP4-rendered; the delivered MP4 uses Remotion.');
fs.writeFileSync('data/brand-logos-001-validation.json',JSON.stringify(report,null,2));
for(const e of data.events.filter(e=>e.kind==='guess'))execFileSync(base+'ffmpeg.exe',['-v','error','-ss',String((e.start+50)/30),'-i',video,'-frames:v','1','-y',`out/logo-check-${e.index+1}.png`]);
execFileSync(base+'ffmpeg.exe',['-v','error','-ss',String((data.events.at(-1).start+30)/30),'-i',video,'-frames:v','1','-y','out/logo-outro.png']);
console.log(JSON.stringify({export:report.export,status:report.status,audioClipsChecked:Object.keys(levels).length},null,2));
