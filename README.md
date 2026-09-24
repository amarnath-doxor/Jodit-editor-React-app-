# Jodit React + MUI demo

React 19 + Vite + MUI app showing a full-featured [jodit-react](https://github.com/jodit/jodit-react) editor.

```bash
npm install
npm run dev
```

## Files

- `src/editor/joditConfig.js` – full Jodit config: every toolbar button, custom `📅 Date` and `Templates` buttons,
  base64 image upload, drag & drop, paste handling, image/link/table options, char limit, status bar counters.
- `src/editor/RichTextEditor.jsx` – reusable wrapper; memoizes the config (a new config re-creates the editor) and
  forwards the Jodit instance through `ref`.
- `src/App.jsx` – MUI layout: options panel (read-only, dark theme, toolbar size, height, char limit, placeholder),
  API buttons (`execCommand`, `s.insertHTML`, fullscreen), rendered/HTML/stats tabs, save to localStorage.

## Using the editor instance

```js
const editorRef = useRef(null);
<RichTextEditor ref={editorRef} value={html} onChange={setHtml} options={...} />

editorRef.current.s.insertHTML('<b>hi</b>');       // insert at cursor
editorRef.current.execCommand('formatBlock', false, 'h2');
editorRef.current.value;                            // current HTML
```

> Rendering editor HTML with `dangerouslySetInnerHTML` is fine for trusted content; sanitize user-submitted HTML
> (e.g. with DOMPurify) before displaying it elsewhere.
