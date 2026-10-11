# Ranking Rise / 排名攀升动效

A Remotion recreation of the reference leaderboard animation for recording `8850561c-1ae6-4f37-97a7-4f2032acf773`.

## Run

```sh
npm ci
npm run dev
```

Open the Studio URL and select **RankingRise**.

## Render

```sh
npm run render
npm run render:still
```

The MP4 is written to `out/ranking-rise.mp4`. Format: 1080 × 1920, 30 fps, 240 frames / 8 seconds, H.264 with AAC audio.

## Implementation

- The leaderboard, navigation, labels, score bars, and brand marks are authored with React and CSS. The reference MP4 is never used as the rendered picture.
- The custom highlighted label 长鑫国际 climbs from the bottom of the ranking to second place; neighboring rows move continuously to make room.
- A frame-driven perspective camera follows the highlighted row, then pulls back and straightens for the complete leaderboard.
- Warm neutral lighting, row-dependent blur, a mint highlight, a green shadow, and a growing score underline recreate the reference appearance.
- The current soundtrack is an original procedural instrumental with synchronized motion sound design. Its score and motion stems are included under `public/audio/`. Brand marks are approximate typographic symbols.

All animations use Remotion's frame clock and interpolation. `src/Composition.tsx` contains the editable data and keyframes. The company labels use Chinese A-share companies and exchange codes; 长鑫国际 is a user-requested custom display name without a stock code. Scores are illustrative animation values inherited from the reference, not market data. A locally bundled Noto Sans SC font subset keeps Chinese typography consistent across systems.

## Reference observations

The supplied reference contains an 8-second vertical shot, a cream/gray background and an oblique white ranking table. The blue Alibaba symbol and mint row remain the visual focus. The climb happens in the first 3 seconds; the camera holds close before pulling back during seconds 5.7–7.4. The last half second holds the final layout.

## Validation

The project passed TypeScript and lint checks and was rendered as a complete 240-frame video. Early, middle and final frames were compared to the reference contact sheet. Rendering metadata was checked for 1080 × 1920, 30 fps, 8 seconds and an AAC audio stream.

## Security

Temporary download signatures and repository-binding credentials are deliberately excluded from the project. No network credentials are needed to preview or render.

Remotion licensing: https://www.remotion.dev/license

## Chinese company edition

The leaderboard includes 贵州茅台 (600519), 中国平安 (601318), 招商银行 (600036), 中芯国际 (688981), 海光信息 (688041), 寒武纪 (688256), 隆基绿能 (601012), 中国移动 (600941), 长江电力 (600900), 中微公司 (688012), and the custom highlighted display name 长鑫国际. The highlighted name is reproduced exactly as requested and is not assigned another company’s ticker.

The local Noto Sans SC font subset is distributed under the SIL Open Font License; see `public/fonts/OFL.txt`.

## Original smooth soundtrack

The current edition uses a custom 8-second, 120 BPM instrumental score rather than the reference audio. Warm D-major chord pads, soft plucked melody, understated bass and percussion follow the half-second ranking rhythm. Noise-filtered stereo sweeps follow the row transitions at 0.25, 0.85, 1.35, 1.9, 2.4 and 2.9 seconds and the camera pullback from 5.7 to 7.4 seconds. Soft chord accents mark the second-place arrival and final hold; the ending fades without a hard cut.

All notes, percussion and sweeps are synthesized from scratch using Node.js, with no third-party music samples. The mix measures approximately -14.4 LUFS integrated and -2 dBFS true peak before video encoding.

```sh
npm run audio:generate
npm run render
```

`public/audio/smooth-score.wav` and `slide-sound-design.wav` are independently editable Remotion audio layers. `smooth-full-mix.wav` is an audition mix. The reproducible synthesis source is `scripts/generate-audio.mjs`. The archived reference audio remains available but is not used in the current composition.
