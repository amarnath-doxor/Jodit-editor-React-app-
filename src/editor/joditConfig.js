// Full-featured Jodit configuration.
// jodit-react imports "jodit/esm/plugins/all.js", so every plugin listed here is available.

// Every built-in toolbar control, grouped. '|' = separator, '\n' = line break.
export const FULL_TOOLBAR = [
  'source', '|',
  'undo', 'redo', '|',
  'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'eraser', '|',
  'ul', 'ol', 'indent', 'outdent', 'align', '|',
  'font', 'fontsize', 'paragraph', 'lineHeight', 'brush', 'classSpan', 'copyformat', '|',
  '\n',
  'image', 'file', 'video', 'link', 'unlink', 'table', 'hr', 'symbols', '|',
  'cut', 'copy', 'paste', 'selectall', '|',
  'find', 'spellcheck', 'speechRecognize', '|',
  'fullsize', 'preview', 'print', '|',
  'insertDate', 'templates', '|',
  'about',
];

// Custom toolbar buttons, registered as controls and placed in FULL_TOOLBAR by name.
const customControls = {
  insertDate: {
    tooltip: 'Insert current date/time',
    text: '📅 Date',
    exec: (editor) => {
      editor.s.insertHTML(`<span>${new Date().toLocaleString()}</span>&nbsp;`);
    },
  },
  templates: {
    text: 'Templates',
    tooltip: 'Insert a predefined block',
    list: {
      note: 'Info note',
      warning: 'Warning box',
      checklist: 'Checklist',
      signature: 'Signature',
    },
    childTemplate: (editor, key, value) => `<span>${value}</span>`,
    // childExec (not exec) so clicking the main button opens the list instead of doing nothing
    childExec: (editor, _current, { control }) => {
      const key = control.args?.[0];
      const blocks = {
        note: '<p style="padding:12px;border-left:4px solid #1976d2;background:#e3f2fd;">ℹ️ <strong>Note:</strong> Write your note here.</p>',
        warning: '<p style="padding:12px;border-left:4px solid #ed6c02;background:#fff3e0;">⚠️ <strong>Warning:</strong> Something needs attention.</p>',
        checklist: '<ul><li>☐ First task</li><li>☐ Second task</li><li>☑ Done task</li></ul>',
        signature: '<p>Best regards,<br><strong>Your Name</strong><br><em>Your Title</em></p>',
      };
      if (key && blocks[key]) editor.s.insertHTML(blocks[key]);
    },
  },
};

/**
 * Build a Jodit config from the demo's UI options.
 * Keep the result memoized — a new config object re-creates the editor.
 */
export function buildJoditConfig({
  readonly,
  dark,
  toolbarButtonSize,
  height,
  placeholder,
  limitChars,
  showStats,
}) {
  return {
    readonly,
    theme: dark ? 'dark' : 'default',
    language: 'en',
    placeholder,
    toolbarButtonSize, // 'tiny' | 'xsmall' | 'small' | 'middle' | 'large'

    // Size & resizing
    height,
    minHeight: 250,
    allowResizeY: true,
    allowResizeX: false,

    // Toolbar
    buttons: FULL_TOOLBAR,
    buttonsMD: FULL_TOOLBAR,
    buttonsSM: FULL_TOOLBAR,
    buttonsXS: FULL_TOOLBAR,
    toolbarAdaptive: false,
    toolbarSticky: true,
    toolbarStickyOffset: 64, // below the MUI AppBar
    controls: customControls,
    showTooltip: true,

    // Status bar
    statusbar: true,
    showCharsCounter: showStats,
    showWordsCounter: showStats,
    showXPathInStatusbar: showStats,

    // Limits (limit plugin)
    limitChars: limitChars > 0 ? limitChars : false,
    limitHTML: false,

    // Paste / clipboard behaviour
    askBeforePasteHTML: true,
    askBeforePasteFromWord: true,
    defaultActionOnPaste: 'insert_clear_html',

    // Images, files, media – no server needed: files are inlined as base64
    uploader: {
      insertImageAsBase64URI: true,
      imagesExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    },
    enableDragAndDropFileToEditor: true,
    image: {
      openOnDblClick: true,
      editSrc: true,
      editTitle: true,
      editAlt: true,
      editLink: true,
      editSize: true,
      editMargins: true,
      editClass: true,
      editStyle: true,
      editId: true,
      editAlign: true,
      useImageEditor: false, // requires a filebrowser backend
    },
    link: {
      followOnDblClick: false,
      processVideoLink: true, // pasting a YouTube/Vimeo link embeds the player
      processPastedLink: true,
      openInNewTabCheckbox: true,
      noFollowCheckbox: true,
    },

    // Tables
    table: {
      selectionCellStyle: 'border: 1px double #1e88e5 !important;',
      useExtraClassesOptions: true,
    },

    // Misc features
    spellcheck: true,
    iframe: false,
    enter: 'p',
    useSearch: true,
    colorPickerDefaultTab: 'background',
    disablePlugins: [], // e.g. ['ai-assistant'] to turn something off
    showPlaceholder: true,
    saveModeInStorage: false,
    beautifyHTML: true,
    history: { enable: true, maxHistoryLength: 200 },
  };
}
