import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterNhanVien({ setCondition }) {
  const [filter, setFilter] = useState({
    nhan_vien: '',
    email: '',
  });

  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_nv: {
                $regex: filter.nhan_vien.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_nv: {
                $regex: filter.nhan_vien.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.nhan_vien } },
          ],
        },
      ],
    };
    if (filter.email) {
      condition.email = {
        $regex: filter.email.split(' ').join('.*'),
        $options: 'i',
      };
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên nhân viên"
        onSearch={(value) => setFilter({ ...filter, nhan_vien: value })}
      />
      <FilterSearch
        title="Email"
        onSearch={(value) => setFilter({ ...filter, email: value })}
      />
    </Stack>
  );
}

export default FilterNhanVien;
