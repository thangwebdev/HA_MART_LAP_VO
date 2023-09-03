import { FormGroup, FormHelperText, FormLabel, TextField } from '@mui/material';
import React, { useState } from 'react';
import { MdOutlineVisibility, MdOutlineVisibilityOff } from 'react-icons/md';
import { useGlobalTheme } from '../../context/themeContext';
import PropTypes from 'prop-types';

function InputForm({
  label = 'Label',
  isRequired = false,
  type = 'text',
  id = 'inputid',
  placeholder,
  register = () => {},
  name = '',
  errorMessage = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [darkMode] = useGlobalTheme();
  return (
    <FormGroup>
      <FormLabel
        htmlFor={id}
        sx={{
          width: 'fit-content',
          fontSize: '14px',
          fontWeight: 600,
          color: darkMode ? 'neutral.text3' : 'neutral.text2',
          marginBottom: '10px',
        }}
      >
        {label} {isRequired && <sup>*</sup>}
      </FormLabel>
      <TextField
        {...register(name)}
        type={type.toLowerCase() === 'password' ? (showPassword ? 'text' : 'password') : type}
        id={id}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'whitish.strockColor',
            },
          },
          '& .MuiOutlinedInput-root:hover': {
            '& fieldset': {
              borderColor: darkMode ? 'whitish.strockColor' : '',
            },
          },
        }}
        InputProps={
          type.toLowerCase() === 'password'
            ? {
                endAdornment: showPassword ? (
                  <MdOutlineVisibility
                    onClick={() => setShowPassword(false)}
                    style={{ cursor: 'pointer' }}
                    size={18}
                    color={darkMode ? '#fff' : '#4B5264'}
                  />
                ) : (
                  <MdOutlineVisibilityOff
                    onClick={() => setShowPassword(true)}
                    style={{ cursor: 'pointer' }}
                    size={18}
                    color={darkMode ? '#fff' : '#4B5264'}
                  />
                ),
                sx: { color: darkMode ? '#fff' : '' },
              }
            : { sx: { color: darkMode ? '#fff' : '' } }
        }
        className={darkMode ? 'textfield-darkmode' : ''}
        variant="outlined"
        placeholder={placeholder || ''}
      />
      {errorMessage && (
        <FormHelperText sx={{ fontStyle: 'italic' }} error>
          {errorMessage}
        </FormHelperText>
      )}
    </FormGroup>
  );
}

InputForm.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  isRequired: PropTypes.bool,
  id: PropTypes.string,
  placeholder: PropTypes.string,
  register: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default InputForm;
