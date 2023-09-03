import React, { useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiSave } from 'react-icons/fi';
import useApisContext from '~/hooks/hookContext/useApisContext';
import ModalBase from '~/components/modal/ModalBase';
import ButtonBase from '~/components/button/ButtonBase';
import moment from 'moment';
import TabsBase from '~/components/tabs/TabsBase';
import { TabPanel } from '@mui/lab';
import InfoTab from './InfoTab';
import { useForm } from 'react-hook-form';
import DescriptionTab from './DescriptionTab';
import DetailsTab from './DetailsTab';

export default function FormPNK({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const schema = yup.object({
    kho: yup
      .object()
      .typeError('Vui lòng chọn kho')
      .required('Vui lòng chọn kho'),
    ngay_nhap_hang: yup
      .date()
      .typeError('Vui lòng chọn ngày nhập hàng')
      .required('Vui lòng chọn ngày nhập hàng'),
    ngay_ct: yup
      .date()
      .typeError('Vui lòng chọn ngay chứng từ')
      .required('Vui lòng chọn ngay chứng từ'),
  });
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
    register,
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          kho: {
            ma_kho: defaultValues?.ma_kho,
            ten_kho: defaultValues?.ten_kho,
          },
          nha_cung_cap: {
            ma_ncc: defaultValues?.ma_ncc,
            ten_ncc: defaultValues?.ten_ncc,
          },
          trang_thai: defaultValues.ma_trang_thai ? {
            ma_trang_thai: defaultValues.ma_trang_thai,
            ten_trang_thai: defaultValues.ten_trang_thai
          } : null,
          ngay_ct: moment(defaultValues.ngay_ct).format('YYYY-MM-DD'),
          ngay_nhap_hang: moment(defaultValues.ngay_nhap_hang).format(
            'YYYY-MM-DD'
          ),
        }
      : {
          ngay_ct: moment().format('YYYY-MM-DD'),
          ngay_nhap_hang: moment().format('YYYY-MM-DD'),
        },
    resolver: yupResolver(schema),
  });
  const { asyncPostData } = useApisContext();
  const [details, setDetails] = useState(defaultValues?.details || []);
  const tabRef = useRef();

  const generateDataPost = (values) => {
    const { kho, nha_cung_cap, trang_thai, ...data } = values;
    const result = {
      ...data,
      ma_kho: kho?.ma_kho || '',
      ten_kho: kho?.ten_kho || '',
      ma_ncc: nha_cung_cap?.ma_ncc || '',
      ten_ncc: nha_cung_cap?.ten_ncc || '',
      ma_trang_thai: trang_thai?.ma_trang_thai || '',
      ten_trang_thai: trang_thai?.ten_trang_thai || '',
      details,
    };
    return result;
  };

  const handleSave = async (values) => {
    const method = isEdit ? 'put' : 'post';
    const dataPost = generateDataPost(values);
    await asyncPostData('dmpnk', dataPost, method).then((resp) => {
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
      width="900px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Tạo'} phiếu nhập kho`}
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
          { label: 'Chi tiết nhập', value: '2' },
          { label: 'Diễn giải', value: '3' },
        ]}
        ref={tabRef}
      >
        <TabPanel value="1" sx={{ padding: '10px 0 0 0' }}>
          <InfoTab
            register={register}
            control={control}
            isEdit={isEdit}
            errors={errors}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '10px 0 0 0' }}>
          <DetailsTab
            details={details}
            setDetails={setDetails}
            isEditMaster={isEdit}
          />
        </TabPanel>
        <TabPanel value="3" sx={{ padding: '10px 0 0 0' }}>
          <DescriptionTab register={register} />
        </TabPanel>
      </TabsBase>
    </ModalBase>
  );
}
