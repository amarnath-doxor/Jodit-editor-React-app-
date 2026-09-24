import { useMemo, useRef, useState } from 'react';
import {
  AppBar, Alert, Box, Button, ButtonGroup, Card, CardContent, CardHeader, Chip, Container,
  CssBaseline, Divider, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem,
  Paper, Select, Slider, Snackbar, Stack, Switch, Tab, Tabs, TextField, ThemeProvider, Toolbar,
  Tooltip, Typography, createTheme,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import EditNoteIcon from '@mui/icons-material/EditNote';
import RichTextEditor from './editor/RichTextEditor';
import { SAMPLE_HTML } from './sampleContent';

const STORAGE_KEY = 'jodit-demo-content';

function loadSaved() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function countStats(html) {
  const body = new DOMParser().parseFromString(html || '', 'text/html').body;
  const text = body.textContent || '';
  // textContent glues adjacent blocks together ("<p>a</p><p>b</p>" -> "ab"), so separate them before counting words
  body
    .querySelectorAll('p, div, ul, ol, li, table, tr, td, th, h1, h2, h3, h4, h5, h6, blockquote, pre, br')
    .forEach((el) => {
      el.before(' ');
      el.after(' ');
    });
  const spaced = body.textContent.trim();
  const words = spaced ? spaced.split(/\s+/).length : 0;
  return { chars: text.length, words, htmlLength: (html || '').length };
}

export default function App() {
  const editorRef = useRef(null);
  const [dark, setDark] = useState(false);
  const [content, setContent] = useState(() => loadSaved() ?? SAMPLE_HTML);
  const [lastBlur, setLastBlur] = useState(null);
  const [tab, setTab] = useState(0);
  const [toast, setToast] = useState('');

  // Editor options exposed in the settings panel
  const [readonly, setReadonly] = useState(false);
  const [showStats, setShowStats] = useState(true);
  const [toolbarButtonSize, setToolbarButtonSize] = useState('middle');
  const [height, setHeight] = useState(500);
  const [limitChars, setLimitChars] = useState(0);
  const [placeholder, setPlaceholder] = useState('Start typing something awesome...');

  const theme = useMemo(
    () => createTheme({ palette: { mode: dark ? 'dark' : 'light', primary: { main: '#1976d2' } } }),
    [dark],
  );

  const options = { readonly, dark, toolbarButtonSize, height, placeholder, limitChars, showStats };
  const stats = useMemo(() => countStats(content), [content]);

  // ---- Examples of driving the editor through its API (ref = Jodit instance) ----
  const insertAtCursor = (html) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.s.focus();
    editor.s.insertHTML(html);
  };

  const runCommand = (command, arg) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.s.focus();
    editor.execCommand(command, false, arg);
  };

  const copyHtml = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setToast('HTML copied to clipboard');
    } catch {
      setToast('Clipboard not available');
    }
  };

  const save = () => {
    try {
      localStorage.setItem(STORAGE_KEY, content);
      setToast('Saved to localStorage');
    } catch {
      setToast('Could not save');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="sticky" elevation={1}>
        <Toolbar>
          <EditNoteIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Jodit React + MUI
          </Typography>
          <Tooltip title={dark ? 'Light mode' : 'Dark mode'}>
            <IconButton color="inherit" onClick={() => setDark((d) => !d)}>
              {dark ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* ---------- Editor ---------- */}
          <Grid size={{ xs: 12, lg: 9 }}>
            <Card variant="outlined">
              <CardHeader
                title="Editor"
                subheader="Every toolbar button, custom buttons, base64 image upload, drag & drop, tables, find/replace, source mode, fullscreen, print..."
                action={
                  <Stack direction="row" spacing={1} sx={{ mt: 1, mr: 1 }}>
                    <Chip size="small" label={`${stats.words} words`} />
                    <Chip size="small" label={`${stats.chars} chars`} />
                  </Stack>
                }
              />
              <CardContent>
                <RichTextEditor
                  ref={editorRef}
                  value={content}
                  onChange={setContent}
                  onBlur={(v) => setLastBlur({ at: new Date().toLocaleTimeString(), length: v.length })}
                  options={options}
                />
                {/* Always rendered so the layout doesn't shift (and eat a click) on the first blur */}
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  {lastBlur
                    ? `onBlur fired at ${lastBlur.at} (${lastBlur.length} HTML chars)`
                    : 'onBlur has not fired yet'}
                </Typography>
              </CardContent>
            </Card>

            {/* ---------- Output ---------- */}
            <Card variant="outlined" sx={{ mt: 3 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
                <Tab label="Rendered output" />
                <Tab label="HTML source" />
                <Tab label="Stats" />
              </Tabs>
              <Divider />
              <CardContent>
                {tab === 0 && (
                  <Paper variant="outlined" sx={{ p: 2, overflow: 'auto', '& img': { maxWidth: '100%' }, '& table': { borderCollapse: 'collapse' }, '& td, & th': { border: 1, borderColor: 'divider', p: 1 } }}>
                    {/* Only render trusted HTML like this. Sanitize (e.g. DOMPurify) user-submitted content. */}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                  </Paper>
                )}
                {tab === 1 && (
                  <Box component="pre" sx={{ m: 0, p: 2, bgcolor: 'action.hover', borderRadius: 1, overflow: 'auto', maxHeight: 400, fontSize: 13, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                    {content}
                  </Box>
                )}
                {tab === 2 && (
                  <Stack direction="row" spacing={2}>
                    <Chip label={`Words: ${stats.words}`} color="primary" />
                    <Chip label={`Text chars: ${stats.chars}`} color="secondary" />
                    <Chip label={`HTML length: ${stats.htmlLength}`} />
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* ---------- Settings / API panel ---------- */}
          <Grid size={{ xs: 12, lg: 3 }}>
            <Stack spacing={3} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
              <Card variant="outlined">
                <CardHeader title="Editor options" slotProps={{ title: { variant: 'subtitle1' } }} />
                <CardContent>
                  <Stack spacing={2}>
                    <FormControlLabel control={<Switch checked={readonly} onChange={(e) => setReadonly(e.target.checked)} />} label="Read-only" />
                    <FormControlLabel control={<Switch checked={showStats} onChange={(e) => setShowStats(e.target.checked)} />} label="Status bar counters" />
                    <FormControlLabel control={<Switch checked={dark} onChange={(e) => setDark(e.target.checked)} />} label="Dark theme" />
                    <FormControl size="small" fullWidth>
                      <InputLabel>Toolbar size</InputLabel>
                      <Select label="Toolbar size" value={toolbarButtonSize} onChange={(e) => setToolbarButtonSize(e.target.value)}>
                        {['tiny', 'xsmall', 'small', 'middle', 'large'].map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Box>
                      <Typography variant="body2" gutterBottom>Height: {height}px</Typography>
                      <Slider size="small" min={250} max={900} step={50} value={height} onChange={(_, v) => setHeight(v)} />
                    </Box>
                    <TextField size="small" type="number" label="Char limit (0 = none)" value={limitChars} onChange={(e) => setLimitChars(Math.max(0, Number(e.target.value)))} />
                    <TextField size="small" label="Placeholder" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} />
                  </Stack>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardHeader title="Control via API" slotProps={{ title: { variant: 'subtitle1' } }} subheader="Uses the Jodit instance from the ref" />
                <CardContent>
                  <Stack spacing={1.5}>
                    <ButtonGroup size="small" fullWidth variant="outlined">
                      <Button onClick={() => runCommand('bold')}>Bold</Button>
                      <Button onClick={() => runCommand('italic')}>Italic</Button>
                      <Button onClick={() => runCommand('formatBlock', 'h2')}>H2</Button>
                    </ButtonGroup>
                    <ButtonGroup size="small" fullWidth variant="outlined">
                      <Button onClick={() => runCommand('undo')}>Undo</Button>
                      <Button onClick={() => runCommand('redo')}>Redo</Button>
                      <Button onClick={() => runCommand('selectall')}>Select all</Button>
                    </ButtonGroup>
                    <Button size="small" variant="outlined" onClick={() => insertAtCursor('<strong style="color:#1976d2">Hello from MUI!</strong>&nbsp;')}>
                      Insert HTML at cursor
                    </Button>
                    <Button size="small" variant="outlined" onClick={() => editorRef.current?.toggleFullSize()}>
                      Toggle fullscreen
                    </Button>
                    <Divider />
                    <Button size="small" variant="contained" startIcon={<SaveIcon />} onClick={save}>Save (localStorage)</Button>
                    <Button size="small" startIcon={<ContentCopyIcon />} onClick={copyHtml}>Copy HTML</Button>
                    <Button size="small" startIcon={<RestartAltIcon />} onClick={() => setContent(SAMPLE_HTML)}>Load sample</Button>
                    <Button size="small" color="error" startIcon={<DeleteSweepIcon />} onClick={() => setContent('')}>Clear</Button>
                  </Stack>
                </CardContent>
              </Card>

              <Alert severity="info" variant="outlined">
                Tip: paste a YouTube link, drop an image file, or double-click an image to edit its properties.
              </Alert>
            </Stack>
          </Grid>
        </Grid>
      </Container>

      <Snackbar open={!!toast} autoHideDuration={2500} onClose={() => setToast('')} message={toast} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} />
    </ThemeProvider>
  );
}
