import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterSelectApi from '../FilterSelectApi';
import moment from 'moment';
import FilterRadios from '../FilterRadios';

const expires = [
  {
    label: 'Tất cả',
    value: ''
  },
  {
    label: '1 tháng tới',
    value: '1'
  },
  {
    label: '2 tháng tới',
    value: '2'
  },
  {
    label: '3 tháng tới',
    value: '3'
  },
  {
    label: '4 tháng tới',
    value: '4'
  },
  {
    label: '5 tháng tới',
    value: '5'
  },
  {
    label: '6 tháng tới',
    value: '6'
  },
]

function FilterLo({ setCondition }) {
  const [filter, setFilter] = useState({
    lo: '',
    vat_tu: null,
    expire: ''
  });

  useEffect(() => {
    const condition = {}
    if(filter.lo) {
      condition.$or = [
        { ma_lo: { $regex: filter.lo.split(' ').join('.*'), $options: 'i' } },
        { ten_lo: { $regex: filter.lo.split(' ').join('.*'), $options: 'i' } },
        { $text: { $search: filter.lo } },
      ]
    }
    if(filter.vat_tu) {
      condition.ma_vt = filter.vat_tu.ma_vt
    }
    if(filter.expire) {
      const currentDate = moment().add(Number(filter.expire), 'months').toDate()
      condition.han_su_dung = { $lte: currentDate }
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã, tên lô"
        onSearch={(value) => setFilter({ lo: value })}
      />
      <FilterSelectApi
        title="Hàng hóa"
        apiCode="dmvt"
        value={
          filter.vat_tu
            ? { ma_vt: filter.vat_tu.ma_vt, ten_vt: filter.vat_tu.ten_vt }
            : null
        }
        searchFileds={['ma_vt', 'ten_vt']}
        getOptionLabel={(option) => option.ten_vt}
        onSelect={(value) => setFilter({ ...filter, vat_tu: value })}
      />
      <FilterRadios
        title='Sắp hết hạn'
        values={expires}
        defaultValue=''
        onChange={value => {
          setFilter({...filter, expire: value})
        }}
      />
    </Stack>
  );
}

export default FilterLo;
