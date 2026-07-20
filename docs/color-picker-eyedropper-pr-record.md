# ColorPicker EyeDropper PR Record

## Issue

Closes Tencent/tdesign-common#2568.

## Background

ColorPicker currently requires users to adjust colors manually in the panel. In scenarios such as uploading a background image and matching a page background color, users need to sample a color directly.

## Solution

This PR provides a common EyeDropper implementation for ColorPicker:

- Native mode uses the browser `EyeDropper API` for screen-level color sampling.
- Fallback mode uses `html2canvas-pro` to capture the current page and reads pixels from canvas when native EyeDropper is unavailable.
- The native path remains the default and does not need the fallback behavior unless framework components request `mode: 'fallback'`.
- The button is placed before the color sliders so it is close to the color picking interaction without compressing format inputs.
- Unsupported, canceled, aborted, or failed picking resolves to `null` and should not trigger ColorPicker change events.

## API Suggestion For Framework Repositories

```ts
type EyeDropperConfig =
  | boolean
  | {
      mode?: 'native' | 'fallback';
      showPreview?: boolean;
    };
```

Recommended behavior:

- `false`: do not render the eyedropper button.
- `true`: use native EyeDropper only. Disable the button when unsupported.
- `{ mode: 'fallback' }`: use native EyeDropper first, then fall back to page-level canvas picking.
- Preserve alpha when `enableAlpha` is enabled because native EyeDropper returns opaque `#rrggbb`.
- In gradient mode, update the selected gradient stop instead of replacing the whole gradient value.
- Emit `context.trigger = 'eyedropper'` after successful picking.

## Compatibility Notes

Native EyeDropper can sample any visible screen area but is not supported by all browsers. Fallback mode is limited to the current page viewport and may be affected by cross-origin images, video, iframe content, WebGL, and complex CSS rendering.

## Verification

- `npm run test -- --run test/unit/color-picker/eyedropper.test.ts`
- `node_modules\\.bin\\tsc.cmd --noEmit`
