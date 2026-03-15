# Webflow GitHub Integration

This folder is ready to be deployed to GitHub Pages and embedded into Webflow.

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
2. Enable GitHub Pages for the repository by letting the included workflow deploy from `main`.
3. The included snippets already point to `https://clothboi.github.io/Colour-palette/`.
4. If your GitHub username or repository name changes later, update those URLs in the snippet files.
5. Paste the head snippet into Webflow custom code in the head.
6. Paste the footer snippet into Webflow custom code before `</body>`.
7. Paste `webflow-html-snippet.html` into an Embed component on the page.
8. Publish the site in Webflow.

## Notes

- The app is scoped under `.webflow-palette-embed` to avoid clashing with Webflow styles.
- The script initializes every `[data-webflow-palette]` instance on the page, so the component can be reused.
- The recommended embed is a single container div, so future UI updates can come from GitHub without manually updating the Webflow Embed block again.
- Older embeds that already contain the full markup still continue to work.
- The repository now includes a GitHub Pages deployment workflow like the moodboard project, so future pushes create a visible Pages deploy in GitHub Actions.
- Once Webflow points at the Pages URLs, most future app iterations should only require a GitHub push and a browser refresh.
