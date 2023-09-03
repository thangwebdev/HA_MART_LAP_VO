import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterSelectApi from '../FilterSelectApi';
import FilterTimeFromTo from '../FilterTimeFromTo';

function FilterPT({ setCondition }) {
  const [filter, setFilter] = useState({
   ma_phieu: "",
   kho: null,
   nhom_nguoi_nop:null,
   ma_ct: "",
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
    
    if(filter.kho){
    condition.ma_kho = filter.kho.ma_kho;
    };
    if(filter.nhom_nguoi_nop){
        condition.ma_nhom_nguoi_nop = filter.nhom_nguoi_nop.ma_nhom_nguoi_nop;
    };
    if (filter.timeFrom || filter.timeTo) {
      if (filter.timeFrom && filter.timeTo) {
        condition.ngay_lap_phieu = {
          $gte: filter.timeFrom,
          $lte: filter.timeTo,
        };
      } else if (filter.timeFrom) {
        condition.ngay_lap_phieu = { $gte: filter.timeFrom };
      } else if (filter.timeTo) {
        condition.ngay_lap_phieu = { $lte: filter.timeTo };
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
        title="Kho"
        apiCode="dmkho"
        value={
          filter.kho
            ? { ma_kho: filter.kho.ma_kho, ten_kho: filter.kho.ten_kho}
            : null
        }
        searchFileds={['ma_kho', 'ten_kho']}
        getOptionLabel={(option) => option.ten_kho}
        onSelect={(value) => setFilter({ ...filter, kho: value })}
      />
       <FilterSelectApi
        title="Nhóm Người Nộp"
        apiCode="dmnnn"
        value={
          filter.nhom_nguoi_nop
            ? { ma_nhom_nguoi_nop: filter.nhom_nguoi_nop.ma_nhom_nguoi_nop, ten_nhom_nguoi_nop: filter.nhom_nguoi_nop.ten_nhom_nguoi_nop}
            : null
        }
        searchFileds={['ma_nhom_nguoi_nop', 'ten_nhom_nguoi_nop']}
        getOptionLabel={(option) => option.ten_nhom_nguoi_nop}
        onSelect={(value) => setFilter({ ...filter, nhom_nguoi_nop: value })}
      />
           <FilterTimeFromTo
        title="Ngày lập phiếu"
        onSearch={(time) => setFilter({ ...filter, ...time })}
      />


     
    </Stack>
  );
}

export default FilterPT;
