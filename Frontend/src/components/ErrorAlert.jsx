import React from 'react';
import { Alert, AlertTitle, Button } from '@mui/material';

export default function ErrorAlert({ message, onRetry }) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Try again
          </Button>
        ) : undefined
      }
    >
      <AlertTitle>Analysis failed</AlertTitle>
      {message}
    </Alert>
  );
}