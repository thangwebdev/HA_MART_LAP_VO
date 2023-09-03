import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterSelectApi from '../FilterSelectApi';

function FilterPKK({ setCondition }) {
  const [filter, setFilter] = useState({
   ma_phieu: "",
   kho: null,
   hanghoa: null,
   ma_ct: ""
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
    if(filter.hanghoa){
        condition.ma_vt = filter.hanghoa.ma_vt;
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

     
    </Stack>
  );
}

export default FilterPKK;
