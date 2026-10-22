import fs from 'node:fs';
export function readWav(file){
 const b=fs.readFileSync(file);let rate,channels,raw;
 for(let o=12;o+8<=b.length;){const size=b.readUInt32LE(o+4),tag=b.toString('ascii',o,o+4);
 if(tag==='fmt '){if(b.readUInt16LE(o+8)!==1||b.readUInt16LE(o+22)!==16)throw Error('Expected PCM16: '+file);channels=b.readUInt16LE(o+10);rate=b.readUInt32LE(o+12);}
 if(tag==='data')raw=b.subarray(o+8,Math.min(b.length,o+8+size));o+=8+size+(size%2);}
 if(!raw||!rate)throw Error('Invalid WAV: '+file);
 const samples=new Float32Array(raw.length/2/channels);
 for(let i=0;i<samples.length;i++)for(let c=0;c<channels;c++)samples[i]+=raw.readInt16LE((i*channels+c)*2)/32768/channels;
 return {samples,rate};
}
export function levels(samples){let peak=0,sum=0;for(const x of samples){peak=Math.max(peak,Math.abs(x));sum+=x*x;}return {peakDb:20*Math.log10(peak||1e-12),rmsDb:10*Math.log10(sum/samples.length||1e-12)};}
export function writeWav(file,samples,rate){const b=Buffer.alloc(44+samples.length*2);b.write('RIFF');b.writeUInt32LE(b.length-8,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(rate,24);b.writeUInt32LE(rate*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(samples.length*2,40);samples.forEach((x,i)=>b.writeInt16LE(Math.round(Math.max(-1,Math.min(1,x))*32767),44+i*2));fs.writeFileSync(file,b);}
