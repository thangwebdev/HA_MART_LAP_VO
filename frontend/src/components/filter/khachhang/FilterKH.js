import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';

function FilterKH({ setCondition }) {
  const [filter, setFilter] = useState({
    khachHang: '',
    sdt: '',
    email: '',
  });

  useEffect(() => {
    const condition = {
      $and: [
        {
          $or: [
            {
              ma_kh: {
                $regex: filter.khachHang.split(' ').join('.*'),
                $options: 'i',
              },
            },
            {
              ten_kh: {
                $regex: filter.khachHang.split(' ').join('.*'),
                $options: 'i',
              },
            },
            { $text: { $search: filter.khachHang } },
          ],
        },
      ],
    };
    if (filter.sdt) {
      condition.sdt = {
        $regex: filter.sdt,
        $options: 'i',
      };
    }
    if (filter.email) {
      condition.email = {
        $regex: filter.email,
        $options: 'i',
      };
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên khách hàng"
        onSearch={(value) => setFilter({ ...filter, khachHang: value })}
      />
      <FilterSearch
        title="Số điện thoại"
        onSearch={(value) => setFilter({ ...filter, sdt: value })}
      />
      <FilterSearch
        title="Email"
        onSearch={(value) => setFilter({ ...filter, email: value })}
      />
    </Stack>
  );
}

export default FilterKH;
