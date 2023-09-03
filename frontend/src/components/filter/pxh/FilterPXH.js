import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterTimeFromTo from '../FilterTimeFromTo';
import FilterSelectApi from '../FilterSelectApi';

function FilterPXH({ setCondition }) {
  const [filter, setFilter] = useState({
    pxh: '',
    chungTu: '',
    vatTu: null,
    kho: null,
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    const condition = {
      $or: [
        {
          ma_phieu: { $regex: filter.pxh.split(' ').join('.*'), $options: 'i' },
        },
      ],
    };
    if (filter.chungTu) {
      condition.ma_ct = {
        $regex: filter.chungTu.split(' ').join('.*'),
        $options: 'i',
      };
    }
    if (filter.kho) {
      condition.ma_kho = filter.kho.ma_kho;
    }
    if (filter.timeFrom || filter.timeTo) {
      if (filter.timeFrom && filter.timeTo) {
        condition.ngay_xuat_hang = {
          $gte: filter.timeFrom,
          $lte: filter.timeTo,
        };
      } else if (filter.timeFrom) {
        condition.ngay_xuat_hang = { $gte: filter.timeFrom };
      } else if (filter.timeTo) {
        condition.ngay_xuat_hang = { $lte: filter.timeTo };
      }
    }
    if (filter.vatTu) {
      condition.details = {
        $elemMatch: {
          ma_vt: filter.vatTu.ma_vt,
        },
      };
    }
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã phiếu"
        onSearch={(value) => setFilter({ ...filter, pxh: value })}
      />
      <FilterSearch
        title="Mã chứng từ"
        onSearch={(value) => setFilter({ ...filter, chungTu: value })}
      />
      <FilterSelectApi
        title="Hàng hóa"
        apiCode="dmvt"
        value={
          filter.vatTu
            ? { ma_vt: filter.vatTu.ma_vt, ten_vt: filter.vatTu.ten_vt }
            : null
        }
        searchFileds={['ma_vt', 'ten_vt']}
        getOptionLabel={(option) => option.ten_vt}
        onSelect={(value) => setFilter({ ...filter, vatTu: value })}
      />
      <FilterSelectApi
        title="Kho"
        apiCode="dmkho"
        value={
          filter.kho
            ? { ma_kho: filter.kho.ma_kho, ten_kho: filter.kho.ten_kho }
            : null
        }
        searchFileds={['ma_kho', 'ten_kho']}
        getOptionLabel={(option) => option.ten_kho}
        onSelect={(value) => setFilter({ ...filter, kho: value })}
      />
      <FilterTimeFromTo
        title="Ngày xuất hàng"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />
    </Stack>
  );
}

export default FilterPXH;
