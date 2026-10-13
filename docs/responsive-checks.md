# Responsive verification

Checked the live page in the Codex in-app browser at 23 viewport combinations, covering phone, tablet, desktop, breakpoint boundaries, and landscape layouts.

Requested widths: 320, 360, 375, 390, 414, 480, 620, 621, 640, 760, 761, 768, 800, 801, 820, 900, 901, 1024, 1280, 1440, and 1920 CSS pixels. Landscape checks: 844 × 390 and 1024 × 600. The browser rounded a few odd widths up by one CSS pixel.

After the fixes, all checked layouts passed horizontal text-fit, form-field containment, and trust-card text containment checks. Heading typography stayed consistent. Decorative artwork deliberately extends beyond some card boundaries and is clipped within those cards.

Verified mobile menu opening, closing after an anchor link, and closing when resizing to desktop. Verified the landscape project-preview dialog stays within the viewport and can be closed.

Changes:

- Trust-card client text wraps instead of being clipped on narrow cards.
- Portfolio cards flow normally when viewport height is 600px or less, so landscape users can scroll through complete cards.
- Mobile navigation resets when crossing into desktop width.
- Footer controls provide 44px touch targets.
- The tablet introduction text column can shrink without forcing overflow.

Production build and JavaScript syntax checks passed. These are browser viewport checks; physical-device and separate browser-engine testing were not performed. Estimate and newsletter forms remain UI previews.
