import React, { useState } from 'react';
import FilterBox from './FilterBox';
import TextInput from '../input/TextInput';
import { Stack } from '@mui/material';
import ButtonBase from '../button/ButtonBase';
import { useEffect } from 'react';

function FilterTimeFromTo({
  title,
  defaultTimeFrom,
  defaultTimeTo,
  onSearch = () => {},
}) {
  const [dot, setDot] = useState(false);
  const [time, setTime] = useState({
    timeFrom: defaultTimeFrom || '',
    timeTo: defaultTimeTo || '',
  });

  const handleTimeChange = ({ target: { name, value } }) => {
    setTime({ ...time, [name]: value });
  };
  const handleFilterTime = () => {
    onSearch(time);
    setDot(!!time.timeFrom || !!time.timeTo);
  };
  useEffect(() => {
    if (time.timeFrom || time.timeTo) {
      setDot(true);
    }
    onSearch(time);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FilterBox title={title} dot={dot}>
      <Stack spacing="10px" sx={{ padding: '10px 0' }}>
        <TextInput
          label="Từ ngày"
          type="date"
          name="timeFrom"
          value={time.timeFrom}
          onChange={handleTimeChange}
        />
        <TextInput
          label="Đến ngày"
          type="date"
          name="timeTo"
          value={time.timeTo}
          onChange={handleTimeChange}
        />
        <ButtonBase onClick={handleFilterTime}>Lọc</ButtonBase>
      </Stack>
    </FilterBox>
  );
}

export default FilterTimeFromTo;
