import React from 'react';
import { Container, CssBaseline, Stack, ThemeProvider, Typography } from '@mui/material';

import theme from './theme';
import usePdfAnalysis from './hooks/usePdfAnalysis';
import UploadZone from './components/UploadZone';
import LoadingState from './components/LoadingState';
import ErrorAlert from './components/ErrorAlert';
import AnalysisResult from './components/AnalysisResult';

export default function App() {
  const { file, status, analysis, error, elapsed, analyze, retry, cancel, reset } =
    usePdfAnalysis();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }} gutterBottom>
          PDF Analysis App
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Add a PDF to get a summary of what's inside.
        </Typography>

        <Stack spacing={3}>
          <UploadZone file={file} disabled={status === 'loading'} onFile={analyze} />

          {status === 'loading' && (
            <LoadingState fileName={file?.name} elapsed={elapsed} onCancel={cancel} />
          )}

          {status === 'error' && (
            <ErrorAlert message={error} onRetry={file ? retry : undefined} />
          )}

          {status === 'success' && analysis && (
            <AnalysisResult analysis={analysis} onReset={reset} />
          )}
        </Stack>
      </Container>
    </ThemeProvider>
  );
}