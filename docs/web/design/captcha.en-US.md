### When to use

Use slide puzzle captcha when login, registration, comment submission, SMS-code sending, sensitive confirmation, or other flows need to distinguish human operations from automated requests. Captcha should be an additional risk-control challenge and should not repeatedly interrupt low-risk or high-frequency interactions.

### Common usage

##### Basic slide puzzle

The user drags the slider and moves a real image puzzle piece to the target cutout in the background. The puzzle piece should be a transparent image returned by the server, or a canvas-clipped block from the background at runtime. The style layer only hosts the image, synchronizes movement, and displays status. It should not draw a fake puzzle shape with CSS.

##### Background with cutout

Prefer a generated background image that already includes the target cutout, shadow, or mask. The frontend only renders the target area according to `targetLeft` and `targetTop` returned by the server. This keeps the cutout, puzzle piece, and verification coordinates from the same challenge asset.

##### Keep configuration flexible

Do not hard-code the number of cutouts, pass tolerance, or verification strategy in the style layer. Single-cutout, multiple-cutout, different puzzle sizes, and different tolerance rules should be described by component props or server-side challenge data. The frontend style should only provide composable target areas, real puzzle pieces, and status feedback.

##### Refresh and retry

Keep the refresh action available when assets fail to load, verification fails, or the challenge expires. Refreshing should request a new background, puzzle piece, captcha token, and target position instead of reusing the previous challenge data.

### Recommended and discouraged usage

##### Recommended

| Scenario                                   | Description                                                                               |
| ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| Use a real clipped image piece             | The piece texture matches the background, so users can judge the target position clearly. |
| Verify on the server                       | Submit drag distance, trail, and token to the server for the final verification result.   |
| Provide clear success and failure feedback | Continue the flow after success, and allow retry or refresh after failure.                |

##### Discouraged

| Scenario                                                 | Risk                                                                                            |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Draw a fixed-color puzzle piece with CSS                 | The dragged object is not part of the image, which breaks the slide puzzle logic.               |
| Verify only on the client                                | Pass conditions are easy to expose and should not be treated as reliable security verification. |
| Use unrelated sources for cutout, piece, and coordinates | Users may align the puzzle visually but still fail server verification.                         |

### Use with other components

Captcha is commonly used with login forms, registration forms, secondary confirmation dialogs, and SMS-code sending buttons. Prefer showing it after a high-risk action is triggered instead of blocking the main flow during page initialization.

## Similar components

| Component          | When to use                                                                                                 |
| :----------------- | :---------------------------------------------------------------------------------------------------------- |
| [Slider](./slider) | Use it to select values from a continuous or discrete range. It does not provide security verification.     |
| [Form](./form)     | Use it to collect, validate, and submit business data. Captcha can be triggered before or after submission. |
| [Dialog](./dialog) | Use it when captcha needs to interrupt the current flow or act as part of a secondary confirmation.         |
