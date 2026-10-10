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
- Alibaba/Qwen climbs from the bottom of the ranking to second place; neighboring rows move continuously to make room.
- A frame-driven perspective camera follows the highlighted row, then pulls back and straightens for the complete leaderboard.
- Warm neutral lighting, row-dependent blur, a mint highlight, a green shadow, and a growing score underline recreate the reference appearance.
- The extracted reference audio is included as `public/reference-audio.m4a` to retain the original rhythm. Brand marks are approximate typographic symbols.

All animations use Remotion's frame clock and interpolation. `src/Composition.tsx` contains the editable data and keyframes. The labels and scores reproduce the supplied reference and are not live ranking data.

## Reference observations

The supplied reference contains an 8-second vertical shot, a cream/gray background and an oblique white ranking table. The blue Alibaba symbol and mint row remain the visual focus. The climb happens in the first 3 seconds; the camera holds close before pulling back during seconds 5.7–7.4. The last half second holds the final layout.

## Validation

The project passed TypeScript and lint checks and was rendered as a complete 240-frame video. Early, middle and final frames were compared to the reference contact sheet. Rendering metadata was checked for 1080 × 1920, 30 fps, 8 seconds and an AAC audio stream.

## Security

Temporary download signatures and repository-binding credentials are deliberately excluded from the project. No network credentials are needed to preview or render.

Remotion licensing: https://www.remotion.dev/license
