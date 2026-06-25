## SCHVIZ Layout Bugs

- For SCHVIZ layout regressions, run the sciblog fundamentals page locally at `http://localhost:8081/tutorials/fundamentals`, use Playwright to capture Firefox and Chromium screenshots, and inspect the exported images. The current probe script is `spec/probe-schviz-live.js`, which writes screenshots to `/tmp/firefox-fundamentals-live.png` and `/tmp/chromium-fundamentals-live.png`.
