import React from "react";
import {Composition} from "remotion";
import {QuizShort} from "./QuizShort";
import {quiz, timing} from "./quiz";
import {BrandLogoQuiz} from './BrandLogoQuiz';
import logoData from './logo-data.json';

export const RemotionRoot: React.FC = () => (
  <><Composition id="MomoBrandLogos" component={BrandLogoQuiz} durationInFrames={logoData.durationInFrames} fps={30} width={1080} height={1920}/><Composition
    id="MomooQuizShort"
    component={QuizShort}
    durationInFrames={timing.durationInFrames}
    fps={timing.fps}
    width={1080}
    height={1920}
    defaultProps={{quiz}}
  /></>
);
