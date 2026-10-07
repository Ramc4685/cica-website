# UI verification

## Premium redesign, October 7, 2026

Before and after use a matching 390px viewport. The before image is the live
baseline `c2abb0f`; the after image is the local production export.

![Premium before](premium-before-mobile.png)
![Premium after](premium-after-mobile.png)
![Premium desktop](premium-desktop.png)

Chrome checks covered all twelve public content routes at effective widths of
320, 768 and 1100px: no horizontal overflow, one main heading per page and no
failed loaded images. Mobile navigation opened, closed on Escape and restored
focus. Unit tests cover accessible validation and submission states. CSS disables
decorative animation under reduced motion. These checks are not a screen-reader,
contrast or Core Web Vitals certification; physical device testing remains useful.

## Earlier launch fixes

Chrome screenshots captured October 7, 2026. Before: published prototype at a 390px viewport. After: consolidated static site at a narrower 320px viewport. The complete mobile menu and join action remain available after the fix.

![Before](mobile-before.png)
![After](mobile-after.png)

The after screenshot is a local build preview, not proof of production deployment. Contact required-field validation, admin notice and narrow Rules buttons were checked separately in Chrome.
