import { CircularProgress, Stack } from '@mui/material';
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import BillLayout from '~/components/layouts/BillLayout';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import MainLayout from './components/Main/MainLayout';
import { createContext } from 'react';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useLocalStorage from '~/hooks/useLocalStorage';
import { cloneDeep } from 'lodash';
import ModalBase from '~/components/modal/ModalBase';
import { useCallback } from 'react';

const BillContext = createContext();

export const useBillContext = () => {
  const value = useContext(BillContext);
  if (!value) throw new Error('Bill context must be used inside Bill provider');
  return value;
};

function Bill() {
  const alertSnackbar = useSnackbarContext();
  const { asyncGetList, asyncPostData } = useApisContext();
  const [loading, setLoading] = useState(false);
  const [khoSelected, setKhoSelected] = useLocalStorage(
    'kho_active',
    undefined
  );
  const [fullScreen, setFullScreen] = useState(() => {
    if (document.fullscreenElement) {
      return true;
    } else {
      return false;
    }
  });
  const [search, setSearch] = useState('');
  const [khos, setKhos] = useState([]);
  const [pbhs, setPbhs] = useState([]);
  const [pbhSelected, setPbhSelected] = useLocalStorage(
    'pbh_active',
    undefined
  );
  const [openPayment, setOpenPayment] = useState(false);

  const barcodeRef = useRef('');

  // get product by barcode
  const handleGetProductByBarcode = async (barcode) => {
    try {
      setLoading(true);
      const resp = await asyncGetList('dmvt', { $or: [
        {barcode},
        {ds_dvt: { $elemMatch: { barcode } }}
      ],
      });
      if (resp.data.length > 0) {
        const product = resp.data[0];
        let dvt = {}
        if(product.barcode !== barcode) {
          const matchDvt = product.ds_dvt.find(item => item.barcode === barcode)
          dvt = {ma_dvt: matchDvt.ma_dvt, ten_dvt: matchDvt.ten_dvt}
        }else {
         dvt =  { ma_dvt: product.ma_dvt, ten_dvt: product.ten_dvt }
        }
        await add({
          product,
          dvt,
        });
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
      barcodeRef.current = '';
    }
  };

  // them vao detail
  const add = async ({ product, dvt, sl = 1, plus = true }) => {
    const pbhClone = cloneDeep(pbhSelected);
    const productSelected = pbhClone.details.find(
      (item) => item.ma_vt === product.ma_vt && item.ma_dvt === dvt.ma_dvt
    );
    if (productSelected) {
      if (plus) {
        productSelected.sl_xuat += sl;
      } else {
        productSelected.sl_xuat = sl;
      }
      if (productSelected.sl_xuat < 1) {
        productSelected.sl_xuat = 1;
      }
    } else {
      const newDetail = {
        ma_vt: product.ma_vt,
        ten_vt: product.ten_vt,
        ma_dvt: dvt.ma_dvt,
        ten_dvt: dvt.ten_dvt,
        sl_xuat: plus ? 1 : sl,
        don_gia: dvt.gia_ban,
        theo_doi_lo: product.theo_doi_lo,
        hinh_anh:
          product.hinh_anh1 || product.hinh_anh2 || product.hinh_anh3 || '',
      };
      if (newDetail.sl_xuat < 1) {
        newDetail.sl_xuat = 1;
      }
      pbhClone.details.push(newDetail);
    }
    return await updatePbh(pbhClone);
  };

  const deleteDetail = async (detail) => {
    const pbhSelectedClone = cloneDeep(pbhSelected);
    pbhSelectedClone.details = pbhSelectedClone.details.filter((item) => {
      if (item.ma_vt !== detail.ma_vt) {
        return true;
      } else {
        if (item.ma_dvt === detail.ma_dvt) {
          return false;
        } else {
          return true;
        }
      }
    });
    await updatePbh(pbhSelectedClone);
  };

  // tao phieu ban hang moi
  const createPbh = async () => {
    try {
      const pbhPost = {
        ma_kho: khoSelected.ma_kho,
        ten_kho: khoSelected.ten_kho,
        ma_trang_thai: 1,
        ten_trang_thai: 'Đang có khách',
        ngay_lap_phieu: new Date().setHours(0, 0, 0, 0),
        ngay_ct: new Date().setHours(0, 0, 0, 0),
      };
      const resp = await asyncPostData('dmpbh', pbhPost);
      setPbhSelected(resp);
      await getPbhs();
      return resp;
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    }
  };
  // cap nhat phieu ban hang
  const updatePbh = async (newPbh) => {
    try {
      const pbhClone = cloneDeep(newPbh);
      const tienHang = pbhClone.details.reduce((acc, item) => {
        return acc + item.don_gia * item.sl_xuat;
      }, 0);
      pbhClone.tien_hang = tienHang;
      setLoading(true);
      const resp = await asyncPostData('dmpbh', pbhClone, 'put');
      await getPbhs();
      return resp;
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  // handle payment
  const handlePayment = useCallback(async () => {
    let error = false;
    if (pbhSelected?.tien_thu < pbhSelected?.t_thanh_tien) {
      error = true;
      alertSnackbar('error', 'Số tiền nhận chưa đủ');
      return;
    }
    if (!pbhSelected?.ma_pttt) {
      error = true;
      alertSnackbar('error', 'Vui lòng chọn phương thức thanh toán');
      return;
    }
    if (!error) {
      const pbhClone = cloneDeep(pbhSelected);
      pbhClone.ngay_ct = new Date().setHours(0, 0, 0, 0);
      pbhClone.ma_trang_thai = 2;
      pbhClone.ten_trang_thai = 'Đã thanh toán';
      await updatePbh(pbhClone);
      setOpenPayment(false);
      alertSnackbar('success', 'Thanh toán thành công');
    } else {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbhSelected]);

  // get pbh
  const getPbhs = async () => {
    try {
      setLoading(true);
      const condition = { ma_kho: khoSelected.ma_kho, ma_trang_thai: 1 };
      const resp = await asyncGetList('dmpbh', condition);
      if (resp && resp.data?.length === 0) {
        await createPbh();
      } else {
        setPbhs(resp.data);
      }
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };
  // get kho
  const getKhos = async () => {
    try {
      setLoading(true);
      const resp = await asyncGetList('dmkho');
      setKhos(resp.data);
    } catch (error) {
      alertSnackbar('error', error?.message || 'Internal server error');
    } finally {
      setLoading(false);
    }
  };

  // number product discounted
  const numberProductDiscounted = useMemo(() => {
    if (pbhSelected) {
      return pbhSelected?.details.reduce((acc, item) => {
        if (item.tien_ck > 0) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    } else {
      return null;
    }
  }, [pbhSelected]);

  useEffect(() => {
    if (khoSelected) {
      getPbhs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khoSelected]);
  useEffect(() => {
    if (pbhs.length > 0) {
      if (pbhSelected) {
        const pbhExisted = pbhs.find(
          (pbh) => pbh.ma_phieu === pbhSelected?.ma_phieu
        );
        if (!pbhExisted) {
          setPbhSelected(pbhs[0]);
        } else {
          setPbhSelected(pbhExisted);
        }
      } else {
        setPbhSelected(pbhs[0]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pbhs]);

  useEffect(() => {
    getKhos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (khos.length > 0) {
      if (!khoSelected) {
        setKhoSelected(khos[0]);
      } else {
        const maKhos = khos.map((kho) => kho.ma_kho);
        if (!maKhos.includes(khoSelected.ma_kho)) {
          setKhoSelected(khos[0]);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [khos, khoSelected]);

  useEffect(() => {
    const handleKeyUp = (e) => {
      if (e.key === 'F9') {
        if (!openPayment) {
          setOpenPayment(true);
        } else {
          handlePayment();
        }
      }
    };
    const handleScanner = async (e) => {
      const textInput = e.key || String.fromCharCode(e.keyCode);
      const targetName = e.target.localName;
      if (textInput && textInput.length === 1 && targetName !== 'input') {
        barcodeRef.current += textInput;
        if (barcodeRef.current.length === 13) {
          await handleGetProductByBarcode(barcodeRef.current);
        }
      }
    };
    document.addEventListener('keyup', handleKeyUp);
    document.addEventListener('keydown', handleScanner);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('keydown', handleScanner);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handlePayment, openPayment]);

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const providerState = {
    // value
    fullScreen,
    search,
    khos,
    khoSelected,
    pbhs,
    pbhSelected,
    numberProductDiscounted,
    openPayment,
    // function
    setFullScreen,
    setSearch,
    setKhoSelected,
    setPbhs,
    setPbhSelected,
    createPbh,
    getPbhs,
    updatePbh,
    add,
    deleteDetail,
    handlePayment,
    setOpenPayment,
  };

  return (
    <BillLayout>
      <BillContext.Provider value={providerState}>
        <Stack
          spacing="5px"
          sx={{ width: '100%', height: 'calc(100vh - 50px)', padding: '5px 0' }}
        >
          <ModalBase
            open={loading}
            ghost
            hideCloseIcon
            slotProps={{
              backdrop: { style: { backgroundColor: 'transparent' } },
            }}
          >
            <Stack alignItems="center" justifyContent="center">
              <CircularProgress />
            </Stack>
          </ModalBase>
          <Header />
          <MainLayout />
          <Footer />
        </Stack>
      </BillContext.Provider>
    </BillLayout>
  );
}

export default Bill;
