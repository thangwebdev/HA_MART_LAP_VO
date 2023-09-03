import React from 'react';
import styled from 'styled-components';
import { useTheme } from '@mui/material/styles';

const Input = styled.input`
  border: none;
  outline: none;
  border-bottom: 1px solid #ccc;
  width: ${(props) => props.width};
  font-size: 12px;
  text-align: ${(props) => props.textAlign};
  &:focus {
    border-width: 1.5px;
    border-color: ${(props) => props.borderFocus};
  }
`;

function InputPrice({
  width = '40px',
  textAlign = 'center',
  defaultValue,
  value,
  onChange,
  ...props
}) {
  const theme = useTheme();
  return (
    <Input
      width={width}
      textAlign={textAlign}
      borderFocus={theme.palette.primary.main}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
}

export default InputPrice;
