//tìm theo mã phiếu, mã chứng từ, kho xuất, kho nhập, hàng hóa, ngày nhập kho, ngày xuất kho
import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterSelectApi from '../FilterSelectApi';
import FilterTimeFromTo from '../FilterTimeFromTo';

function FilterPXDC({ setCondition }) {
  const [filter, setFilter] = useState({
   ma_phieu: "",
   ma_ct: "",
   ngay_nhap_kho: '',
    ngay_xuat_kho: '',
    timeFrom: '',
    timeTo: '',
  });

  useEffect(() => {
    const condition = {
     
    };
    if(filter.ma_phieu){
        condition.ma_phieu = {
            $regex: filter.ma_phieu,$options:'i'
        }
    }
    if(filter.ma_ct){
        condition.ma_ct = {
            $regex: filter.ma_ct,$options:'i'
        }
    }
   
    if(filter.hanghoa){
        condition.ma_vt = filter.hanghoa.ma_vt;
    };
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
    setCondition(condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <Stack sx={{ width: '100%' }} spacing="10px">
      <FilterSearch
        title="Mã phiếu"
        onSearch={(value) => setFilter({ ...filter, ma_phieu: value })}
      />
      <FilterSearch
        title="Mã chứng từ"
        onSearch={(value) => setFilter({ ...filter, ma_ct: value })}
      />

       <FilterSelectApi
        title="Hàng Hóa"
        apiCode="dmvt"
        value={
          filter.hanghoa
            ? { ma_vt: filter.hanghoa.ma_vt, ten_vt: filter.hanghoa.ten_vt}
            : null
        }
        searchFileds={['ma_vt', 'ten_vt']}
        getOptionLabel={(option) => option.ten_vt}
        onSelect={(value) => setFilter({ ...filter, hanghoa: value })}
      />
    <FilterTimeFromTo
        title="Ngày nhập kho"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />
       <FilterTimeFromTo
        title="Ngày xuất kho"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />

     
    </Stack>
  );
}

export default FilterPXDC;
