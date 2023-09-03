import {
  FormHelperText,
  InputLabel,
  Stack,
  TextareaAutosize,
  Typography,
} from '@mui/material';
import React from 'react';
import { v4 } from 'uuid';

function AreaInput({
  register = () => {},
  name,
  placeholder,
  label,
  required = false,
  errorMessage,
  ...props
}) {
  const id = v4();

  return (
    <Stack
      spacing="5px"
      sx={{ width: '100%' }}
      alignItems="flex-start"
      {...props}
    >
      {label && (
        <InputLabel htmlFor={id} sx={{ fontSize: '13px', cursor: 'pointer' }}>
          {label}{' '}
          {required && (
            <Typography
              component="span"
              sx={{ color: 'error.main', fontSize: '12px' }}
            >
              *
            </Typography>
          )}
        </InputLabel>
      )}
      <TextareaAutosize
        {...register(name)}
        placeholder={placeholder}
        style={{
          width: '100%',
          border: '1px solid #ccc',
          outline: 'none',
          minHeight: '50px',
          borderRadius: '4px',
          padding: '5px',
        }}
      />
      {errorMessage && (
        <FormHelperText
          error
          sx={{
            fontSize: '12px',
            fontStyle: 'italic',
            color: 'error.main',
            lineHeight: '13px',
            paddingLeft: '5px',
          }}
        >
          {errorMessage}
        </FormHelperText>
      )}
    </Stack>
  );
}

export default AreaInput;
