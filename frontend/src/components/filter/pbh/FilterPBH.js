import { Stack } from '@mui/material';
import React from 'react';
import FilterSearch from '../FilterSearch';
import { useState } from 'react';
import { useEffect } from 'react';
import FilterSelectApi from '../FilterSelectApi';
import FilterTimeFromTo from '../FilterTimeFromTo';
import FilterRadios from '../FilterRadios';

const trangThais = [
  { value: '', label: 'Tất cả' },
  { value: '1', label: 'Đang có khách' },
  { value: '2', label: 'Đã thanh toán' },
  { value: '3', label: 'Hủy' },
];

function FilterPBH({ setCondition }) {
  const [filter, setFilter] = useState({
    ma_phieu: '',
    ma_ct: '',
    kho: null,
    hanghoa: null,
    kenhban: null,
    khachhang: null,
    pttt: null,
    timeFromCt: '',
    timeToCt: '',
    ma_trang_thai: 0,
  });

  useEffect(() => {
    const condition = {};
    if (filter.ma_phieu) {
      condition.ma_phieu = {
        $regex: filter.ma_phieu,
        $options: 'i',
      };
    }
    if (filter.ma_ct) {
      condition.ma_ct = {
        $regex: filter.ma_ct,
        $options: 'i',
      };
    }

    if (filter.kho) {
      condition.ma_kho = filter.kho.ma_kho;
    }
    if (filter.hanghoa) {
      condition.details = {
        $elemMatch: {
          ma_vt: filter.hanghoa.ma_vt,
        },
      };
    }
    if (filter.kenhban) {
      condition.ma_kenh = filter.kenhban.ma_kenh;
    }
    if (filter.khachhang) {
      condition.ma_kh = filter.khachhang.ma_kh;
    }
    if (filter.ma_trang_thai) {
      condition.ma_trang_thai = filter.ma_trang_thai;
    }
    if (filter.pttt) {
      condition.ma_pttt = filter.pttt.ma_pttt;
    }
    if (filter.timeFromCt || filter.timeToCt) {
      const startDate = new Date(filter.timeFromCt);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(filter.timeToCt);
      endDate.setHours(0, 0, 0, 0);
      if (filter.timeFromCt && filter.timeToCt) {
        condition.ngay_ct = { $gte: startDate, $lte: endDate };
      } else if (filter.timeFromCt) {
        condition.ngay_ct = { $gte: startDate };
      } else if (filter.timeToCt) {
        condition.ngay_ct = { $lte: endDate };
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
      <FilterRadios
        title="Trạng thái"
        values={trangThais}
        defaultValue=''
        onChange={(value) => {
          setFilter({ ...filter, ma_trang_thai: value });
        }}
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
      <FilterSelectApi
        title="Hàng Hóa"
        apiCode="dmvt"
        value={
          filter.hanghoa
            ? { ma_vt: filter.hanghoa.ma_vt, ten_vt: filter.hanghoa.ten_vt }
            : null
        }
        searchFileds={['ma_vt', 'ten_vt']}
        getOptionLabel={(option) => option.ten_vt}
        onSelect={(value) => setFilter({ ...filter, hanghoa: value })}
      />
      <FilterSelectApi
        title="Khách hàng"
        apiCode="dmkh"
        value={
          filter.khachhang
            ? {
                ma_kh: filter.khachhang.ma_kh,
                ten_kh: filter.khachhang.ten_kh,
              }
            : null
        }
        searchFileds={['ma_kh', 'ten_kh']}
        getOptionLabel={(option) => option.ten_kh}
        onSelect={(value) => setFilter({ ...filter, khachhang: value })}
      />
      <FilterSelectApi
        title="Kênh bán"
        apiCode="dmkb"
        value={
          filter.kenhban
            ? {
                ma_kenh: filter.kenhban.ma_kenh,
                ten_kenh: filter.kenhban.ten_kenh,
              }
            : null
        }
        searchFileds={['ma_kenh', 'ten_kenh']}
        getOptionLabel={(option) => option.ten_kenh}
        onSelect={(value) => setFilter({ ...filter, kenhban: value })}
      />
      <FilterSelectApi
        title="Phương thức thanh toán"
        apiCode="dmpttt"
        value={
          filter.pttt
            ? {
                ma_pttt: filter.pttt.ma_pttt,
                ten_pttt: filter.pttt.ten_pttt,
              }
            : null
        }
        searchFileds={['ma_pttt', 'ten_pttt']}
        getOptionLabel={(option) => option.ten_pttt}
        onSelect={(value) => setFilter({ ...filter, pttt: value })}
      />
      <FilterTimeFromTo
        title="Ngày chứng từ"
        onSearch={(time) =>
          setFilter({
            ...filter,
            timeFromCt: time.timeFrom,
            timeToCt: time.timeTo,
          })
        }
      />
    </Stack>
  );
}

export default FilterPBH;
