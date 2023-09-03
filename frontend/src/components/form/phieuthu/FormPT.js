import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSave } from 'react-icons/fi';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import ModalBase from '~/components/modal/ModalBase';
import moment from 'moment';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';
import TabsBase from '~/components/tabs/TabsBase';
import { TabPanel } from '@mui/lab';
import DescriptionTab from './DescriptionTab';
import InfoTab from './InfoTab';

const schemaBase = {
  kho: yup
    .object()
    .typeError('Vui lòng chọn kho')
    .required('Vui lòng chọn kho'),
  nhom_nguoi_nop: yup
    .object()
    .typeError('Vui lòng chọn nhóm người nộp')
    .required('Vui lòng chọn nhóm người nộp'),
  nguoi_nop: yup
    .object()
    .typeError('Vui lòng chọn người nộp')
    .required('Vui lòng chọn người nộp'),
  loai_phieu_thu: yup
    .object()
    .typeError('Vui lòng chọn loai phieu thu')
    .required('Vui lòng chọn loai phieu thu'),
  gia_tri: yup
    .number()
    .typeError('Vui lòng nhập số')
    .required('Vui lòng nhập giá trị'),
  ngay_ct: yup.date().required('Vui lòng chọn ngày chứng từ'),
  ngay_lap_phieu: yup.date().required('Vui lòng chọn ngày lập phiếu'),
};

function FormPT({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const [schema, setSchema] = useState(() => yup.object(schemaBase));
  const {
    register,
    handleSubmit,
    watch,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          kho: defaultValues.ma_kho
            ? {
                ma_kho: defaultValues?.ma_kho,
                ten_kho: defaultValues?.ten_kho,
              }
            : null,
          nhom_nguoi_nop: defaultValues.ma_nhom_nguoi_nop
            ? {
                ma_nhom_nguoi_nop: defaultValues?.ma_nhom_nguoi_nop,
                ten_nhom_nguoi_nop: defaultValues?.ten_nhom_nguoi_nop,
              }
            : null,
          nguoi_nop:
            defaultValues?.ma_nhom_nguoi_nop === 'ncc'
              ? {
                  ma_ncc: defaultValues?.ma_nguoi_nop,
                  ten_ncc: defaultValues?.ten_nguoi_nop,
                }
              : defaultValues?.ma_nhom_nguoi_nop === 'kh'
              ? {
                  ma_kh: defaultValues?.ma_nguoi_nop,
                  ten_kh: defaultValues?.ten_nguoi_nop,
                }
              : defaultValues.ten_nguoi_nop,
          phuong_thuc_thanh_toan: defaultValues.ma_pttt
            ? {
                ma_pttt: defaultValues?.ma_pttt,
                ten_pttt: defaultValues?.ten_pttt,
              }
            : null,
          loai_phieu_thu: defaultValues.ma_loai
            ? {
                ma_loai: defaultValues?.ma_loai,
                ten_loai: defaultValues?.ten_loai,
              }
            : null,
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_lap_phieu: moment(defaultValues.ngay_lap_phieu).format(
            'YYYY-MM-DD'
          ),
        }
      : {
          ngay_ct: moment().format('YYYY-MM-DD'),
          ngay_lap_phieu: moment().format('YYYY-MM-DD'),
        },

    resolver: yupResolver(schema),
  });
 
  const { asyncPostData } = useApisContext();
  const tabRef = useRef();
  const nhomNguoiNop = watch('nhom_nguoi_nop');

  const generateDataPost = (values) => {
    const {
      kho,
      nhom_nguoi_nop,
      nguoi_nop,
      loai_phieu_thu,
      phuong_thuc_thanh_toan,
      ...data
    } = values;
    const result = {
      ...data,
      ma_kho: kho?.ma_kho || '',
      ten_kho: kho?.ten_kho || '',
      ma_nhom_nguoi_nop: nhom_nguoi_nop?.ma_nhom_nguoi_nop || '',
      ten_nhom_nguoi_nop: nhom_nguoi_nop?.ten_nhom_nguoi_nop || '',
      ma_loai: loai_phieu_thu?.ma_loai || '',
      ten_loai: loai_phieu_thu?.ten_loai || '',
      ma_pttt: phuong_thuc_thanh_toan?.ma_pttt || '',
      ten_pttt: phuong_thuc_thanh_toan?.ten_pttt || '',
    };
    if (nguoi_nop) {
      if (typeof nguoi_nop === 'string') {
        result.ten_nguoi_nop = nguoi_nop || '';
      } else {
        if (nguoi_nop.ma_ncc) {
          result.ma_nguoi_nop = nguoi_nop.ma_ncc
          result.ten_nguoi_nop = nguoi_nop?.ten_ncc || '';
        } else {
          result.ma_nguoi_nop = nguoi_nop.ma_kh
          result.ten_nguoi_nop = nguoi_nop?.ten_kh;
        }
      }
    }

    return result;
  };
  useEffect(() => {
    if (nhomNguoiNop) {
      if (nhomNguoiNop?.ma_nhom_nguoi_nop === 'khac') {
        setSchema(
          yup.object({
            ...schemaBase,
            nguoi_nop: yup
              .string('Vui lòng nhập người nộp')
              .required('Vui lòng nhập người nộp'),
          })
        );
      } else {
        setSchema(yup.object(schemaBase));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nhomNguoiNop]);

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('dmpt', dataPost, method).then((resp) => {
      if (!resp.message) {
        handleClose();
        reset();
        setLoad((prev) => prev + 1);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      tabRef.current?.handleChange(null, '1');
    }
  }, [errors]);

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="700px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} Phiếu thu`}
      actions={[
        <ButtonBase
          key={v4()}
          onClick={handleSubmit(handleSave)}
          loading={isSubmitting}
          startIcon={<FiSave style={{ fontSize: '16px' }} />}
        >
          Lưu
        </ButtonBase>,
        <ButtonBase key={v4()} variant="outlined" onClick={handleClose}>
          Hủy
        </ButtonBase>,
      ]}
    >
      <TabsBase
        tabLabels={[
          { label: 'Thông tin', value: '1' },
          { label: 'Diễn giải', value: '2' },
        ]}
        ref={tabRef}
      >
        <TabPanel value="1" sx={{ padding: '10px 0 0 0' }}>
          <InfoTab
            register={register}
            control={control}
            isEdit={isEdit}
            nhomNguoiNop={nhomNguoiNop}
            errors={errors}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '10px 0 0 0' }}>
          <DescriptionTab register={register} />
        </TabPanel>
      </TabsBase>
    </ModalBase>
  );
}

export default FormPT;
