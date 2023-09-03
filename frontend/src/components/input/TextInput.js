import {
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { v4 } from 'uuid';

function TextInput({
  type = 'text',
  name,
  value,
  onChange,
  label,
  errorMessage,
  required = false,
  placeholder,
  disabled = false,
  textFieldSx = {},
  register = () => {},
  defaultValue,
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
      <TextField
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        defaultValue={defaultValue}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        {...register(name)}
        inputProps={type === 'number' ? { min: 0 } : {}}
        fullWidth
        sx={{
          backgroundColor: '#fff',
          borderRadius: '6px',
          '& .MuiInputBase-root': {
            height: '42px',
            '& input': {
              height: '100%',
            },
          },
          '& .MuiInputBase-input': { padding: '0 10px', fontSize: '13px' },
          ...textFieldSx,
        }}
        variant="outlined"
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

export default TextInput;
