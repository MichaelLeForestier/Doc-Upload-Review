import React from 'react';
import { Button, LinearProgress, Paper, Stack, Typography } from '@mui/material';

const formatElapsed = (seconds) =>
  seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

export default function LoadingState({ fileName, elapsed, onCancel }) {
  return (
    <Paper variant="outlined" sx={{ p: 3 }} role="status" aria-live="polite">
      <Stack direction="row" justifyContent="space-between" spacing={2}>
        <Typography noWrap sx={{ minWidth: 0, fontWeight: 600 }}>
          Analyzing {fileName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
          {formatElapsed(elapsed)}
        </Typography>
      </Stack>

      <LinearProgress sx={{ my: 2 }} />

      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
        <Typography variant="body2" color="text.secondary">
          {elapsed >= 10
            ? 'Local models can take a minute, especially on the first run while the model loads.'
            : 'Reading the PDF and asking the model.'}
        </Typography>
        <Button size="small" onClick={onCancel} sx={{ flexShrink: 0 }}>
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
}