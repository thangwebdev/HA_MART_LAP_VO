import React, { useState, lazy, Suspense, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { v4 } from 'uuid';
import ButtonBase from '~/components/button/ButtonBase';
import ModalBase from '~/components/modal/ModalBase';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useApisContext from '~/hooks/hookContext/useApisContext';
import TabsBase from '~/components/tabs/TabsBase';
import { FiSave } from 'react-icons/fi';
import { Skeleton, TabPanel } from '@mui/lab';
import InfoTab from './InfoTab';
import { useEffect } from 'react';
import DinhMucTonTab from './DinhMucTonTab';
const DescriptionTab = lazy(() => import('./DescriptionTab'));
const ImageTab = lazy(() => import('./ImageTab'));
const LoTab = lazy(() => import('./LoTab'));
const KhoTab = lazy(() => import('./KhoTab'));

const schema = yup.object({
  // ma_vt: yup.string().required('Vui lòng nhập mã hàng hóa'),
  ten_vt: yup.string().required('Vui lòng nhập tên hàng hóa'),
});

function FormProduct({
  open,
  handleClose,
  setLoad = () => {},
  defaultValues,
  isEdit = false,
}) {
  const [thumbnails, setThumbnails] = useState({
    hinh_anh1: null,
    hinh_anh2: null,
    hinh_anh3: null,
  });
  const [dvts, setDvts] = useState(defaultValues?.ds_dvt || []);
  const [tonKhoBanDau, setTonKhoBanDau] = useState(
    defaultValues?.ton_kho_ban_dau || []
  );
  const { asyncPostData, uploadFile } = useApisContext();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          nhom_vat_tu: defaultValues.ma_nvt
            ? { ma_nvt: defaultValues.ma_nvt, ten_nvt: defaultValues.ten_nvt }
            : null,
          don_vi_tinh: defaultValues.ma_dvt
            ? { ma_dvt: defaultValues.ma_dvt, ten_dvt: defaultValues.ten_dvt }
            : null,
        }
      : {
          ma_vt: '',
          ten_vt: '',
          barcode: '',
          ten_tat: '',
          nhom_vat_tu: null,
          don_vi_tinh: null,
          gia_ban_le: 0,
          xuat_xu: '',
          theo_doi_lo: false,
        },
    resolver: yupResolver(schema),
  });
  const tabRef = useRef();

  const uploadThumbnail = async (values) => {
    let count = 0;
    await Object.entries(thumbnails).forEach(async (entry) => {
      count += 1;
      const file = entry[1];
      if (file !== null) {
        const formData = new FormData();
        if (file !== undefined) {
          formData.append('thumbnail', file, file?.name);
        }
        formData.append('stt', entry[0]);
        formData.append('ma_vt', values.ma_vt);
        await uploadFile(
          formData,
          '/upload/product/thumbnail',
          'product',
          'v1'
        );
        if (count === 3) {
          setLoad((prev) => prev + 1);
        }
      }
    });
  };
  const convertDataToPost = (values) => {
    const { nhom_vat_tu, don_vi_tinh, ...fields } = values;
    const result = { ...fields };
    result.ma_nvt = nhom_vat_tu?.ma_nvt || '';
    result.ten_nvt = nhom_vat_tu?.ten_nvt || '';
    result.ma_dvt = don_vi_tinh?.ma_dvt || '';
    result.ten_dvt = don_vi_tinh?.ten_dvt || '';
    result.ds_dvt = dvts;
    result.ton_kho_ban_dau = tonKhoBanDau;
    return result;
  };

  // handle save
  const handleSave = async (values) => {
    const dataPost = convertDataToPost(values);
    const method = isEdit ? 'put' : 'post';
    return await asyncPostData('dmvt', dataPost, method)
      .then((resp) => {
        if (!resp.message) {
          handleClose();
          reset();
        }
      })
      .then(() => {
        let upload = false;
        Object.values(thumbnails).forEach((item) => {
          if (item !== null) {
            upload = true;
          }
        });
        if (upload) {
          uploadThumbnail(values);
        } else {
          setLoad((prev) => prev + 1);
        }
      });
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      tabRef.current.handleChange(null, '1');
    }
  }, [errors]);

  return (
    <ModalBase
      open={open}
      handleClose={handleClose}
      width="800px"
      title={`${isEdit ? 'Chỉnh sửa' : 'Thêm'} hàng hóa`}
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
          { label: 'Định mức tồn', value: '2' },
          { label: 'Mô tả', value: '3' },
          { label: 'Hình ảnh', value: '4' },
          {
            label: isEdit && defaultValues?.theo_doi_lo ? 'Lô hàng' : '',
            value: '5',
          },
          { label: defaultValues?.ma_vt ? 'Thẻ kho' : '', value: '6' },
        ]}
        ref={tabRef}
      >
        <TabPanel value="1" sx={{ padding: '10px 0 0 0' }}>
          <InfoTab
            control={control}
            register={register}
            errors={errors}
            isEdit={isEdit}
            dvts={dvts}
            setDvts={setDvts}
            tonKhoBanDau={tonKhoBanDau}
            setTonKhoBanDau={setTonKhoBanDau}
          />
        </TabPanel>
        <TabPanel value="2" sx={{ padding: '10px 0 0 0' }}>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="40px" />}
          >
            <DinhMucTonTab register={register} />
          </Suspense>
        </TabPanel>
        <TabPanel value="3" sx={{ padding: '10px 0 0 0' }}>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="40px" />}
          >
            <DescriptionTab register={register} />
          </Suspense>
        </TabPanel>
        <TabPanel value="4" sx={{ padding: '10px 0 0 0' }}>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="40px" />}
          >
            <ImageTab
              setThumbnails={setThumbnails}
              defaultValues={defaultValues}
            />
          </Suspense>
        </TabPanel>
        <TabPanel value="5" sx={{ padding: '10px 0 0 0' }}>
          <Suspense
            fallback={<Skeleton variant="rounded" width="100%" height="40px" />}
          >
            {isEdit && defaultValues?.theo_doi_lo && (
              <LoTab maVt={defaultValues?.ma_vt} />
            )}
          </Suspense>
        </TabPanel>
        {defaultValues?.ma_vt && (
          <TabPanel value="6" sx={{ padding: '10px 0 0 0' }}>
            <Suspense
              fallback={
                <Skeleton variant="rounded" width="100%" height="40px" />
              }
            >
              <KhoTab
                maVt={defaultValues?.ma_vt}
                theoDoiLo={defaultValues?.theo_doi_lo}
              />
            </Suspense>
          </TabPanel>
        )}
      </TabsBase>
    </ModalBase>
  );
}

export default FormProduct;
