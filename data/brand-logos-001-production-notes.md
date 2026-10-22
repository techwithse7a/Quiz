# Brand logos 001 — review draft

Ten-question, no-options logo quiz for Play With Momo. Layout follows the supplied reference's answer-board format; no competitor graphics or audio reused.

## Voice status

ElevenLabs requests failed with an account-level Free Tier access restriction; some other requests were rate-limited. The draft uses Microsoft David Desktop (male, en-US) consistently for all clips, at rate 2. This is a review voice, not the requested final ElevenLabs quality. One successful ElevenLabs clip was not mixed in, preserving voice consistency.

## Production

- `npm run logos:prepare`: validate selected items against local history, export assets, rebuild duration-aware timeline.
- `npm run logos:studio`: preview.
- `npm run logos:render`: render draft.
- `node scripts/build-hyperframes.mjs`: export matching HyperFrames project.
- `npx hyperframes preview hyperframes/brand-logos-001`: preview HTML version.
- `node scripts/build-logo-quiz.mjs --no-challenge`: remove optional opening challenge and shift all subsequent audio/visuals together.
- `--allow-repeat`: explicitly override previous-episode duplicate protection.

Replace entries in `logo-audio.json` with new narration file paths and measured durations, then prepare again. Captions are phrase-level, timed to each audio clip, not word-level karaoke.

The persistent history includes this draft; no imported back catalog was available. Logo geometry is sourced from Simple Icons, with original source URLs and individual license metadata in the quiz JSON. Monochrome renditions are used. No music is included in this draft. No automatic publishing exists.
