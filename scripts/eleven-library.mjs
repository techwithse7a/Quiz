import fs from 'node:fs';
import {parseEnv} from 'node:util';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {ElevenLabsClient} from '@elevenlabs/elevenlabs-js';
const env=fs.existsSync('.env')?parseEnv(fs.readFileSync('.env','utf8')):{};
const key=env.ELEVENLABS_API_KEY||process.env.ELEVENLABS_API_KEY;
if(!key)throw Error('Save ELEVENLABS_API_KEY in the project root .env, not src/.env');
const client=new ElevenLabsClient({apiKey:key});
const json=p=>JSON.parse(fs.readFileSync(p,'utf8').replace(/^\uFEFF/,''));
const modelId='eleven_flash_v2_5',voiceSettings={stability:.5,similarityBoost:.75,speed:1.05};
const preferences=fs.existsSync('data/voice-settings.json')?json('data/voice-settings.json'):{};
try{
 try{await client.user.get({maxRetries:0});console.log('Account read access valid.');}catch(e){if(String(e.body?.detail?.message||e.message).includes('user_read'))console.log('Account-read permission absent; testing voice access independently.');else throw e;}
 const voices=await client.voices.getAll({}, {maxRetries:0});
 const requestedId=preferences.voiceId||env.ELEVENLABS_VOICE_ID||'JBFqnCBsd6RMkjVDRZzb';
 const voice=voices.voices.find(v=>v.voiceId===requestedId)||await client.voices.get(requestedId,{}, {maxRetries:0});
 if(!voice)throw Error('No suitable male voice available; set ELEVENLABS_VOICE_ID locally.');
 console.log('Voice:',voice.name,'Model:',modelId);
 if(process.argv.includes('--check'))process.exit(0);
 const manifest=json('data/logo-audio.json'),dir='public/audio-library/voice';fs.mkdirSync(dir,{recursive:true});
 const entries=Object.entries(manifest).map(([id,c])=>{const text=preferences.scriptOverrides?.[id]||c.text; if(!text)throw Error('Missing script '+id);const hash=createHash('sha256').update(JSON.stringify({text,voice:voice.voiceId,modelId,voiceSettings})).digest('hex');return {id,text,base:`${dir}/${hash}`};});
 const pending=entries.filter(e=>!fs.existsSync(e.base+'.mp3'));
 console.log('Cached:',entries.length-pending.length,'New clips:',pending.length,'New text characters:',pending.reduce((n,e)=>n+e.text.length,0));
 if(!process.argv.includes('--generate')){console.log('Dry run. Pass --generate to spend credits on missing clips only.');process.exit(0);}
 for(const e of entries){
  if(!fs.existsSync(e.base+'.mp3')){
   const stream=await client.textToSpeech.convert(voice.voiceId,{text:e.text,modelId,voiceSettings,outputFormat:'mp3_44100_128'},{maxRetries:0});
   const bytes=Buffer.from(await new Response(stream).arrayBuffer());if(bytes.length<100)throw Error('Empty speech output');fs.writeFileSync(e.base+'.mp3',bytes);
   fs.writeFileSync(e.base+'.json',JSON.stringify({text:e.text,voice:voice.name,voiceId:voice.voiceId,modelId,voiceSettings},null,2));
  }
  if(!fs.existsSync(e.base+'.wav'))execFileSync('node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe',['-v','error','-i',e.base+'.mp3','-c:a','pcm_s16le','-ar','48000','-ac','1','-y',e.base+'.wav']);
  const duration=Number(execFileSync('node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe',['-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',e.base+'.wav']));
  manifest[e.id]={file:(e.base+'.wav').replace('public/',''),text:e.text,duration,voice:voice.name,provider:'ElevenLabs',voiceId:voice.voiceId,modelId};console.log('Ready:',e.id);
 }
 fs.copyFileSync('data/logo-audio.json',`data/logo-audio-backup-${Date.now()}.json`);
 fs.writeFileSync('data/logo-audio.json',JSON.stringify(manifest,null,2));
 console.log('Library complete. Run logos:prepare then logos:audio.');
}catch(e){console.error('ElevenLabs stopped; no automatic retries.',e.statusCode||'',String(e.body?.detail?.message||e.message||'Request failed').replaceAll(key,'[REDACTED]'));process.exitCode=1;}
