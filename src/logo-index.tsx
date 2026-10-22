import React from 'react';
import {Composition,registerRoot} from 'remotion';
import {BrandLogoQuiz} from './BrandLogoQuiz';
import data from './logo-data.json';
registerRoot(()=> <Composition id="MomoBrandLogos" component={BrandLogoQuiz} durationInFrames={data.durationInFrames} fps={30} width={1080} height={1920}/>);
