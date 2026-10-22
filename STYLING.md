# Play With Momo: style and audio controls

## Reusable audio library

Requested voice and CTA scripts are in `data/voice-settings.json`. George is selected. The like-after-3 and subscribe-after-6 scripts are in `scriptOverrides`; after generation, `logos:prepare` synchronizes their captions and duration automatically. Do not assume editing scripts regenerates audio. Alex was tested but requires paid API access for library voices.

Poppins Bold is bundled through `@fontsource/poppins/700.css`, so it does not depend on a system font or runtime font download. Font size settings remain in `src/logo-style.json`. Card/caption spring animations are in `src/BrandLogoQuiz.tsx`.

Keep your API key only in the project root `.env` (never in `src` or `public`). Secret `.env` files are ignored by Git. Run `npm run voice:check` to test access, `npm run voice:plan` to count missing clips and characters without generating, and `npm run voice:generate` to generate only missing narration. Requests run sequentially without automatic retries. Successful MP3s are saved immediately, so restarting after a failure reuses completed work. Conversion to WAV happens locally.

Voice clips and metadata live in `public/audio-library/voice`; effects live in `public/audio-library/effects`. Keep this folder to preserve your cache. Identical text, voice, model and settings reuse the same clip across quizzes. New text or settings require new generation; free credits are not unlimited. The quiz manifest is switched only after all clips succeed. After successful generation run `npm run logos:prepare`, then `npm run logos:audio`, then render. Flash v2.5 is used with a single take per missing script. Effects consume no API credits.

The gold question-mark pattern uses `patternColor`, `patternOpacity` and `patternSpeed` (0 stops motion). The coral/maroon gradient remains editable through `background`. Your chosen title background is independent.

Edit `src/logo-style.json` for the Remotion video:

- `titleBackground`, `titleShadow`: banner colors (your pink-red shadow is preserved).
- `highlightColor`, `answerColor`: yellow accents and green answers.
- `background`: CSS background/gradient.
- `titleFontSize`, `captionFontSize`: text sizes in pixels.
- `fontFamily`: use a locally installed font.
- `logoSize`: logo width and height; keep it within the 532-pixel card.
- `patternOpacity`: background pattern strength, 0 to 1.
- `voiceVolume`, `sfxVolume`: audio gain; 0 mutes that layer. Defaults 1 and 0.65.

Run `npm run logos:studio` to preview. Visual settings update on save. After changing audio levels, run `npm run logos:audio` and reload the preview. Ensure the preview player and browser tab are unmuted.

Run `npm run logos:render` to export your updated design to `out/play-with-momo-brand-logos-001.mp4`. Then run `node scripts/check-logo-mix.mjs out/play-with-momo-brand-logos-001.mp4` to verify exported audio and playback decoding.

For moving elements or changing animations, edit `src/BrandLogoQuiz.tsx`. For hook text, questions, or timing, edit `scripts/build-logo-quiz.mjs`, then run `npm run logos:prepare` before previewing/rendering. New narration must match changed text; rebuilding the quiz does not synthesize new speech.

The delivered `out/play-with-momo-brand-logos-001-audio-fixed.mp4` preserves the existing rendered visuals and replaces its audio with the verified mix. The previous MP4 is kept unchanged.

## Voice status

## Use your own background image

Copy your JPG, PNG, or WebP into `public/backgrounds/`, then set these fields in `src/logo-style.json`:

```json
"backgroundImage": "backgrounds/my-background.jpg",
"backgroundImageFit": "cover",
"backgroundImagePosition": "center",
"backgroundImageDim": 0.2,
"patternOverImage": false
```

Use the path relative to `public`, not an absolute Windows path. `cover` fills the frame and may crop; `contain` keeps the whole image with the gradient showing around it. A 1080 × 1920 image works best. Dim controls the black overlay: 0 means unchanged brightness, 1 means black. The animated pattern is hidden over images unless enabled. Set `backgroundImage` to `""` to restore the original background. An incorrect filename produces a loading/render error rather than silently using a different image. This is a local-file workflow, not a browser upload form.

Preview with `npm run logos:studio`, then export with `npm run logos:render`. Existing MP4s do not change until rendered again.

## Narration provider

The current voice is ElevenLabs George, generated successfully through the local API key using Flash v2.5. The initial library contains 16 clips (337 script characters). The key allows voice listing and generation but lacks optional user_read account inspection; this does not prevent TTS. The Windows launcher supplements Node's CA list with certificates already trusted by Windows, without disabling TLS validation. The previous local narration manifest is backed up in `data/logo-audio-before-elevenlabs.json`.

Sound effects are original locally synthesized countdown ticks and reveal chimes. No music is enabled. The full mix is in `public/brand-logos-001/audio/full-mix.wav`.

The HyperFrames companion has its own CSS in `scripts/build-hyperframes.mjs`; Remotion style settings do not automatically update that CSS. Run `node scripts/build-hyperframes.mjs` to regenerate its HTML and copy the latest audio mix. The delivered MP4 is the Remotion version.
