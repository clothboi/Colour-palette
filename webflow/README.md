# Webflow GitHub Integration

This folder is ready to be hosted from GitHub and embedded into Webflow.

## Files

- `webflow-html-snippet.html`
  Paste into a Webflow Embed element where the tool should render. The hosted script injects the full app markup automatically.
- `webflow-head-snippet.html`
  Paste into Webflow page settings or site settings head code.
- `webflow-footer-snippet.html`
  Paste into Webflow page settings or site settings footer code.
- `webflow-styles.css`
  Hosted stylesheet for the embed.
- `webflow-script.js`
  Hosted JavaScript for the embed.

## Publish with GitHub

1. Push this project to a public GitHub repository.
2. The included snippets already point to `clothboi/Colour-palette`.
3. If your GitHub username or repository name changes later, update those URLs in the snippet files.
4. Paste the head snippet into Webflow custom code in the head.
5. Paste the footer snippet into Webflow custom code before `</body>`.
6. Paste `webflow-html-snippet.html` into an Embed component on the page.
7. Publish the site in Webflow.

## Notes

- The app is scoped under `.webflow-palette-embed` to avoid clashing with Webflow styles.
- The script now initializes every `[data-webflow-palette]` instance on the page, so the component can be reused.
- The recommended embed is now just a single container div, so future UI updates can come from GitHub without manually updating the Webflow Embed block again.
- Older embeds that already contain the full markup still continue to work.
- If the embed ever disappears after a push, refresh the asset URLs in Webflow with a new `?v=` value to bypass jsDelivr cache.
- The asset URLs use [jsDelivr](https://www.jsdelivr.com/github), which serves files directly from GitHub repositories.
