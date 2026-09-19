import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

// Typography for the rendered model output
const markdownSx = {
  maxWidth: '75ch',
  '& > *:first-child': { mt: 0 },
  '& > *:last-child': { mb: 0 },
  '& h1, & h2, & h3, & h4': { mt: 3, mb: 1, lineHeight: 1.3, fontWeight: 600 },
  '& h1': { fontSize: '1.4rem' },
  '& h2': { fontSize: '1.2rem' },
  '& h3, & h4': { fontSize: '1.05rem' },
  '& p': { my: 1.5, lineHeight: 1.7 },
  '& ul, & ol': { pl: 3, my: 1.5 },
  '& li': { mb: 0.75, lineHeight: 1.7 },
  '& strong': { fontWeight: 600 },
  '& a': { color: 'primary.main' },
  '& blockquote': {
    borderLeft: '3px solid',
    borderColor: 'divider',
    m: 0,
    my: 1.5,
    pl: 2,
    color: 'text.secondary',
  },
  '& code': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    fontSize: '0.875em',
    bgcolor: 'action.hover',
    px: 0.5,
    borderRadius: 0.5,
  },
  '& pre': {
    bgcolor: 'action.hover',
    p: 1.5,
    borderRadius: 1,
    overflowX: 'auto',
    '& code': { bgcolor: 'transparent', p: 0 },
  },
};

const markdownComponents = {
  // Open links in a new tab so the app state isn't lost
  a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
};

export default function AnalysisResult({ analysis, onReset }) {
  const { fileName, answer, thinking, durationSec } = analysis;
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const wordCount = answer.trim().split(/\s+/).length;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(answer);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be unavailable (non-secure context); nothing useful to show
    }
  };

  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={1.5}
        sx={{ px: 3, py: 2 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 600 }}>
            {fileName}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
            <Chip size="small" variant="outlined" label={`${wordCount} words`} />
            <Chip size="small" variant="outlined" label={`${durationSec}s`} />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={handleCopy}>
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button size="small" onClick={onReset}>
            Clear
          </Button>
        </Stack>
      </Stack>

      <Divider />

      {/* Answer */}
      <Box sx={{ px: 3, py: 2.5 }}>
        <Box sx={markdownSx}>
          <ReactMarkdown components={markdownComponents}>{answer}</ReactMarkdown>
        </Box>
      </Box>

      {/* Processing steps: secondary information, collapsed by default */}
      {thinking?.length > 0 && (
        <>
          <Divider />
          <Accordion disableGutters elevation={0} square sx={{ '&::before': { display: 'none' } }}>
            <AccordionSummary sx={{ px: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Processing steps
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: 3, pt: 0 }}>
              <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
                {thinking.map((step, i) => (
                  <Typography component="li" variant="body2" color="text.secondary" key={i}>
                    {step}
                  </Typography>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </>
      )}
    </Paper>
  );
}