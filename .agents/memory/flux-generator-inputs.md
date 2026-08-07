---
name: Flux generator inputs
description: The generator is intentionally client-only; advanced prompt settings and reference-image metadata stay in the browser.
---

The Flux generator keeps all prompt settings and the selected reference image in browser state. The generated text includes the reference filename and intended image-to-image role, but no image bytes are uploaded or sent to a service.

**Why:** The current product is a standalone executable HTML-style app without an image-generation provider or storage integration.

**How to apply:** Preserve browser-local behavior unless the user explicitly requests an image-generation API, persistent uploads, or server-side reference-image processing.