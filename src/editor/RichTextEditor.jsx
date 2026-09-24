import { forwardRef, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { Box } from '@mui/material';
import { buildJoditConfig } from './joditConfig';

/**
 * Thin MUI-friendly wrapper around jodit-react.
 * The forwarded ref receives the Jodit instance (editor.s, editor.value, editor.execCommand, ...).
 */
const RichTextEditor = forwardRef(function RichTextEditor(
  { value, onChange, onBlur, options },
  ref,
) {
  // Re-create the config only when an option actually changes.
  const config = useMemo(
    () => buildJoditConfig(options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      options.readonly,
      options.dark,
      options.toolbarButtonSize,
      options.height,
      options.placeholder,
      options.limitChars,
      options.showStats,
    ],
  );

  return (
    <Box
      sx={{
        '& .jodit-container': { borderRadius: 1 },
        '& .jodit-wysiwyg': { fontFamily: 'Roboto, Arial, sans-serif' },
      }}
    >
      <JoditEditor
        ref={ref}
        value={value}
        config={config}
        tabIndex={1}
        onChange={onChange}
        onBlur={onBlur}
      />
    </Box>
  );
});

export default RichTextEditor;
