import React from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {loadFont} from "@remotion/google-fonts/Fredoka";
import type {Quiz} from "./quiz";
import {timing} from "./quiz";

const {fontFamily} = loadFont("normal", {weights: ["500", "600", "700"]});
const colors = {ink: "#321B57", cream: "#FFF8E7", yellow: "#FFD84D", pink: "#FF6B9C", mint: "#78E6C3", blue: "#67B7FF"};

const pop = (frame: number, fps: number, delay = 0) => spring({frame: frame - delay, fps, config: {damping: 11, stiffness: 180, mass: 0.7}});

const Bubble: React.FC<{size: number; left: number; top: number; color: string; drift: number}> = ({size, left, top, color, drift}) => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", width: size, height: size, left, top: top + Math.sin((frame + drift) / 22) * 18, borderRadius: "50%", background: color, opacity: 0.22}} />;
};

const Momoo: React.FC<{happy?: boolean}> = ({happy = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scale = pop(frame, fps);
  return (
    <div style={{transform: `scale(${scale}) rotate(${Math.sin(frame / 13) * 2}deg)`, width: 260, height: 230, position: "relative"}}>
      <div style={{position: "absolute", inset: "30px 8px 0", borderRadius: "48% 48% 44% 44%", background: "white", border: `12px solid ${colors.ink}`, boxShadow: "0 18px 0 #D9CAE8"}} />
      <div style={{position: "absolute", left: 30, top: 0, fontSize: 76, transform: "rotate(-25deg)"}}>🦋</div>
      <div style={{position: "absolute", right: 39, top: 67, width: 58, height: 72, borderRadius: "50%", background: colors.ink}} />
      <div style={{position: "absolute", left: 72, top: 95, width: 20, height: 30, borderRadius: "50%", background: colors.ink}} />
      <div style={{position: "absolute", left: 129, top: 94, width: 20, height: 30, borderRadius: "50%", background: colors.ink}} />
      <div style={{position: "absolute", left: 94, top: 135, fontSize: 56, color: colors.pink, fontWeight: 700}}>{happy ? "ᴗ" : "⌣"}</div>
    </div>
  );
};

const Choice: React.FC<{label: string; index: number; selected: boolean; reveal: boolean}> = ({label, index, selected, reveal}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entrance = pop(frame, fps, index * 6);
  const colorsByIndex = [colors.pink, colors.blue, colors.mint];
  return (
    <div style={{transform: `scale(${entrance})`, opacity: entrance, height: 150, display: "flex", alignItems: "center", gap: 28, padding: "0 38px", borderRadius: 40, border: `8px solid ${reveal && selected ? colors.ink : "white"}`, background: reveal && selected ? colors.yellow : colorsByIndex[index], color: colors.ink, fontSize: 54, fontWeight: 700, boxShadow: "0 18px 0 rgba(50,27,87,.18)"}}>
      <span style={{display: "grid", placeItems: "center", width: 76, height: 76, borderRadius: 24, background: "white"}}>{String.fromCharCode(65 + index)}</span>
      {label}
      {reveal && selected ? <span style={{marginLeft: "auto"}}>✓</span> : null}
    </div>
  );
};

export const QuizShort: React.FC<{quiz: Quiz}> = ({quiz}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = frame >= timing.revealStart;
  const count = Math.max(1, 3 - Math.floor((frame - timing.countdownStart) / 34));
  const progress = interpolate(frame, [0, timing.durationInFrames], [0, 1], {extrapolateRight: "clamp"});
  const shake = reveal ? Math.sin((frame - timing.revealStart) * 1.7) * interpolate(frame, [timing.revealStart, timing.revealStart + 16], [9, 0], {extrapolateRight: "clamp"}) : 0;
  return (
    <AbsoluteFill style={{fontFamily, background: colors.cream, color: colors.ink, overflow: "hidden"}}>
      <Bubble size={270} left={-90} top={190} color={colors.pink} drift={0} />
      <Bubble size={330} left={850} top={720} color={colors.blue} drift={8} />
      <Bubble size={250} left={-70} top={1450} color={colors.mint} drift={20} />
      <div style={{position: "absolute", top: 0, left: 0, height: 20, width: `${progress * 100}%`, background: colors.pink}} />
      <div style={{position: "absolute", inset: "72px 72px auto", display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div style={{fontSize: 42, fontWeight: 700}}>PLAY WITH <span style={{color: colors.pink}}>MOMOO</span></div>
        <div style={{background: colors.yellow, borderRadius: 999, padding: "16px 28px", fontSize: 34, fontWeight: 700}}>QUIZ TIME!</div>
      </div>
      <div style={{position: "absolute", top: 190, width: "100%", display: "grid", placeItems: "center"}}><Momoo happy={reveal} /></div>
      <Sequence from={timing.questionStart} layout="none">
        <div style={{position: "absolute", top: 475, left: 70, right: 70, textAlign: "center", transform: `translateX(${shake}px) scale(${pop(frame - timing.questionStart, fps)})`}}>
          <div style={{fontSize: 34, letterSpacing: 4, fontWeight: 700, color: colors.pink}}>{quiz.eyebrow}</div>
          <div style={{fontSize: 80, lineHeight: 1.07, fontWeight: 700, marginTop: 28}}>{quiz.question}</div>
        </div>
      </Sequence>
      <Sequence from={timing.choicesStart} layout="none">
        <div style={{position: "absolute", left: 85, right: 85, top: 760, display: "grid", gap: 34}}>
          {quiz.choices.map((choice, index) => <Choice key={choice} label={choice} index={index} selected={index === quiz.answerIndex} reveal={reveal} />)}
        </div>
      </Sequence>
      {frame >= timing.countdownStart && frame < timing.revealStart ? (
        <div style={{position: "absolute", bottom: 205, left: "50%", transform: `translateX(-50%) scale(${pop(frame - timing.countdownStart - (3 - count) * 34, fps)})`, width: 190, height: 190, display: "grid", placeItems: "center", borderRadius: "50%", background: colors.yellow, border: `10px solid ${colors.ink}`, fontSize: 100, fontWeight: 700}}>{count}</div>
      ) : null}
      {reveal ? <div style={{position: "absolute", bottom: 170, left: 70, right: 70, textAlign: "center", fontSize: 48, lineHeight: 1.12, fontWeight: 700, transform: `scale(${pop(frame - timing.revealStart, fps)})`}}>{frame < timing.ctaStart ? quiz.reveal : quiz.callToAction}</div> : null}
      <div style={{position: "absolute", bottom: 64, width: "100%", textAlign: "center", fontSize: 28, opacity: .65}}>Follow for a new brain boost every day ✨</div>
      <Audio src={staticFile("audio/quiz-01.mp3")} volume={1} pauseWhenBuffering />
    </AbsoluteFill>
  );
};
