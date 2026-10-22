import React from 'react';
import '@fontsource/poppins/700.css';
import {AbsoluteFill,Audio,Img,staticFile,useCurrentFrame,spring} from 'remotion';
import data from './logo-data.json';
import theme from './logo-style.json';

const ink='#060D23';
const outlined={WebkitTextStroke:'3px '+ink,paintOrder:'stroke fill' as const,textShadow:'0 5px 0 #060D23'};
export const BrandLogoQuiz:React.FC=()=>{
 const frame=useCurrentFrame();
 const event=data.events.find(e=>frame>=e.start&&frame<e.start+e.duration)??data.events[data.events.length-1];
 const local=frame-event.start;
 const guessing=event.kind==='guess',reveal=event.kind==='reveal';
 const question=data.questions[event.index];
 const completed=data.events.filter(e=>e.kind==='reveal'&&frame>=e.start).map(e=>e.index);
 const scale=spring({frame:local,fps:30,config:{damping:11,stiffness:250,mass:.7}});
 const remaining=1-local/event.duration;
 const intro=event.kind==='intro'||event.kind==='challenge';
 const backgroundImage=theme.backgroundImage.trim();
 return <AbsoluteFill style={{background:theme.background,color:'white',fontFamily:theme.fontFamily,fontWeight:theme.fontWeight,overflow:'hidden'}}>
  {backgroundImage&&<AbsoluteFill>
   <Img src={staticFile(backgroundImage)} style={{width:'100%',height:'100%',objectFit:theme.backgroundImageFit==='contain'?'contain':'cover',objectPosition:theme.backgroundImagePosition}}/>
   <AbsoluteFill style={{background:'black',opacity:Math.max(0,Math.min(1,theme.backgroundImageDim))}}/>
  </AbsoluteFill>}
  {(!backgroundImage||theme.patternOverImage)&&<AbsoluteFill style={{opacity:theme.patternOpacity,pointerEvents:'none',transform:`translateY(${(frame*theme.patternSpeed)%180-180}px)`}}>
   {Array.from({length:84},(_,i)=><div key={i} style={{position:'absolute',left:(i%7)*180-60,top:Math.floor(i/7)*180,fontFamily:theme.fontFamily,fontWeight:700,fontSize:110,color:theme.patternColor,transform:`rotate(${i%2?20:-20}deg)`}}>?</div>)}
  </AbsoluteFill>}
  <div style={{position:'absolute',top:90,left:62,fontFamily:theme.fontFamily,fontSize:30,fontWeight:700,letterSpacing:5,color:'#98D5FF'}}>PLAY WITH <span style={{color:theme.highlightColor}}>MOMO</span></div>
  <div style={{position:'absolute',top:160,left:48,right:48,borderRadius:28,padding:'22px 8px',background:theme.titleBackground,boxShadow:`0 12px 0 ${theme.titleShadow}`,textAlign:'center',fontSize:theme.titleFontSize,color:theme.highlightColor,...outlined}}>GUESS THE LOGO</div>
  <div style={{position:'absolute',top:315,left:66,right:66,height:170,display:'flex',alignItems:'center',justifyContent:'center',textAlign:'center',fontSize:theme.captionFontSize,lineHeight:1.12,...outlined}}>
   {guessing?<span>LOGO <span style={{color:theme.highlightColor}}>#{event.index+1}</span> <span style={{fontSize:32,letterSpacing:4}}> / 10</span></span>:<span style={{transform:`translateY(${(1-scale)*22}px) scale(${.65+.35*scale})`}}>{event.text}</span>}
  </div>
  {guessing&&<div style={{position:'absolute',top:493,left:80,right:80,height:34,background:'#F5F9FF',borderRadius:30,padding:5,boxShadow:'0 5px 0 #060D23'}}><div style={{height:24,borderRadius:24,width:`${remaining*100}%`,background:remaining>.5?'#86FF55':remaining>.25?'#FFE450':'#FF655B'}}/></div>}
  <div style={{position:'absolute',top:580,left:70,width:400,display:'grid',gap:16}}>{data.questions.map((q,i)=><div key={q.id} style={{height:85,display:'flex',alignItems:'center',gap:14,fontSize:48,...outlined,color:completed.includes(i)?theme.answerColor:'#FFFFFF'}}><span style={{width:75,fontSize:65}}>{i+1}.</span><span style={{fontSize:q.answer.length>10?30:38}}>{completed.includes(i)?q.answer:(event.index===i?'?':'')}</span></div>)}</div>
  {question&&(guessing||reveal)&&<div style={{position:'absolute',left:482,top:635,width:532,height:650,transform:`translateY(${(1-scale)*55}px) scale(${.65+scale*.35})`,background:'white',borderRadius:46,border:`9px solid ${reveal?theme.answerColor:'#D9E6FF'}`,boxShadow:'0 22px 0 rgba(0,0,0,.3)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:45}}><Img src={staticFile(question.asset)} style={{width:theme.logoSize,height:theme.logoSize,objectFit:'contain'}}/>{reveal&&<div style={{color:'#14214A',fontFamily:theme.fontFamily,fontWeight:700,fontSize:question.answer.length>10?36:44,textAlign:'center'}}>✓ {question.answer}</div>}</div>}
  {(intro||event.kind==='engagement'||event.kind==='outro')&&<div style={{position:'absolute',left:500,right:65,top:700,textAlign:'center',transform:`scale(${.6+.4*scale})`}}><div style={{fontSize:190,color:theme.highlightColor,...outlined}}>{event.kind==='outro'?'?/10':intro?'10':'★'}</div><div style={{fontSize:48,lineHeight:1.25,...outlined}}>{intro?'LOGOS.\nNO OPTIONS.':event.kind==='outro'?'DROP YOUR SCORE':event.text.startsWith('Like')?'LIKE THE VIDEO':event.text.startsWith('Subscribe')?'SUBSCRIBE':'KEEP YOUR SCORE'}</div></div>}
  <div style={{position:'absolute',bottom:270,left:85,right:85,textAlign:'center',fontFamily:theme.fontFamily,fontWeight:700,fontSize:32,letterSpacing:4,color:'#8CB7E4'}}>{guessing?'CAN YOU NAME IT?':reveal?'GOT IT? +1 POINT':'PLAY • GUESS • SCORE'}</div>
  <div style={{position:'absolute',bottom:170,left:70,right:70,display:'flex',gap:12}}>{data.questions.map((q,i)=><div key={q.id} style={{flex:1,height:13,borderRadius:10,background:completed.includes(i)?theme.answerColor:event.index===i?theme.highlightColor:'#34486E'}}/>)}</div>
  <Audio src={staticFile('brand-logos-001/audio/full-mix.wav')}/>
 </AbsoluteFill>;
};
