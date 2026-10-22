export type Quiz = {
  eyebrow: string;
  question: string;
  choices: [string, string, string];
  answerIndex: 0 | 1 | 2;
  reveal: string;
  callToAction: string;
};

export const quiz: Quiz = {
  eyebrow: "ONLY SHARP EYES GET THIS",
  question: "Which animal can taste with its feet?",
  choices: ["Butterfly", "Penguin", "Dolphin"],
  answerIndex: 0,
  reveal: "Butterflies taste with sensors on their feet!",
  callToAction: "Did you get it? Comment your score!",
};

export const timing = {
  fps: 30,
  questionStart: 42,
  choicesStart: 92,
  countdownStart: 360,
  revealStart: 474,
  ctaStart: 600,
  durationInFrames: 720,
};
