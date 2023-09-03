import React from 'react';
import FilterBox from './FilterBox';
import { useState } from 'react';
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';

function FilterRadios({
  title,
  onChange = () => {},
  values = [{ value: '', label: '' }],
  defaultValue,
}) {
  const [value, setValue] = useState(defaultValue);

  const handleChange = (e) => {
    const value = e.target.value;
    setValue(value);
    onChange(value);
  };

  return (
    <FilterBox title={title}>
      <RadioGroup name="radio" value={value} onChange={handleChange}>
        {values.map((item) => (
          <FormControlLabel
            key={item.value}
            value={item.value}
            sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
            label={item.label}
            control={<Radio sx={{ padding: '6px' }} size="small" />}
          />
        ))}
      </RadioGroup>
    </FilterBox>
  );
}

export default FilterRadios;
