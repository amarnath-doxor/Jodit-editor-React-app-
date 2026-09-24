const svgImage =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="120"><rect width="100%" height="100%" rx="12" fill="#1976d2"/><text x="50%" y="55%" fill="#fff" font-family="Arial" font-size="22" text-anchor="middle">Double-click me</text></svg>',
  );

export const SAMPLE_HTML = `
<h1>Welcome to Jodit + MUI</h1>
<p>This is a <strong>fully featured</strong> <em>WYSIWYG</em> editor with <u>every</u> toolbar button enabled.
Try <span style="background-color:#fff59d;">highlighting</span>, <span style="color:#d32f2f;">colors</span>,
<sup>superscript</sup> and <sub>subscript</sub>.</p>
<h2>Lists</h2>
<ul><li>Bullet item one</li><li>Bullet item two<ul><li>Nested item</li></ul></li></ul>
<ol><li>First step</li><li>Second step</li></ol>
<h2>Table</h2>
<table style="width:100%;border-collapse:collapse;">
  <tbody>
    <tr><th style="border:1px solid #ccc;padding:6px;">Feature</th><th style="border:1px solid #ccc;padding:6px;">Status</th></tr>
    <tr><td style="border:1px solid #ccc;padding:6px;">Tables (select & resize cells)</td><td style="border:1px solid #ccc;padding:6px;">✅</td></tr>
    <tr><td style="border:1px solid #ccc;padding:6px;">Images (base64 upload)</td><td style="border:1px solid #ccc;padding:6px;">✅</td></tr>
    <tr><td style="border:1px solid #ccc;padding:6px;">Find &amp; replace (Ctrl+F / Ctrl+R)</td><td style="border:1px solid #ccc;padding:6px;">✅</td></tr>
  </tbody>
</table>
<h2>Image</h2>
<p><img src="${svgImage}" alt="Sample" width="320" height="120"></p>
<blockquote>Blockquote: use the paragraph dropdown to change block formats.</blockquote>
<p>Visit <a href="https://xdsoft.net/jodit/" target="_blank" rel="noopener noreferrer">the Jodit docs</a> for more options.</p>
`.trim();
