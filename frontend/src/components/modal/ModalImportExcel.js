import React, { useRef, useState } from 'react';
import ModalBase from './ModalBase';
import {
  Avatar,
  Checkbox,
  FormControlLabel,
  Stack,
  Typography,
} from '@mui/material';
import { PUBLIC_URL } from '~/utils/constants';
import ButtonBase from '../button/ButtonBase';
import { BsUpload } from 'react-icons/bs';
import ExcelIcon from '~/assets/img/excel.png';
import useApisContext from '~/hooks/hookContext/useApisContext';

function ModalImportExcel({ open, handleClose, maDm = 'dmvt', setLoad }) {
  const { uploadFile } = useApisContext();
  const inputFileRef = useRef();
  const [fileExcel, setFileExcel] = useState();
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = () => {
    inputFileRef.current.click();
  };
  const handleDownLoad = () => {
    const link = document.createElement('a');
    link.href = `${PUBLIC_URL}/uploads/excel/import_${maDm}.xlsx`;
    link.download = 'sample_dmvt.xlsx';
    link.click();
  };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileExcel(file);
  };
  const handleImportFile = async () => {
    if (!fileExcel) {
      return;
    }
    setLoading(true);
    const mode = checked ? 2 : 1;
    const formData = new FormData();
    formData.append('excel', fileExcel, fileExcel?.name);
    formData.append('mode', mode);
    const resp = await uploadFile(
      formData,
      `/danhmuc/${maDm}/import-excel`,
      'excel_tmp',
      'v1'
    );
    if (resp) {
      handleClose();
      setLoad((prev) => prev + 1);
    }
    setLoading(false);
  };

  return (
    <ModalBase
      width="500px"
      title="Nhập file excel"
      open={open}
      handleClose={handleClose}
      actions={[
        <ButtonBase key={1} onClick={handleImportFile} loading={loading}>
          Nhập
        </ButtonBase>,
        <ButtonBase key={2} variant="outlined" onClick={handleClose}>
          Hủy
        </ButtonBase>,
      ]}
    >
      <Stack alignItems="center">
        <Typography sx={{ fontSize: '13px', textAlign: 'center' }}>
          Bạn chưa có file mẫu? Hãy{' '}
          <Typography
            onClick={handleDownLoad}
            component="span"
            sx={{
              width: '100%',
              fontSize: '13px',
              color: 'primary.main',
              cursor: 'pointer',
              '&:hover': { color: 'secondary.main' },
            }}
          >
            tải về
          </Typography>{' '}
          và điền thông tin theo file mẫu.
        </Typography>
        <FormControlLabel
          label="Ghi đè nếu trùng mã"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '13px' } }}
          control={
            <Checkbox
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              size="small"
            />
          }
        />
        <Stack spacing={1} alignItems="center">
          <input
            hidden
            type="file"
            name="excel"
            accept=".xlsx, .xls"
            ref={inputFileRef}
            onChange={handleFileChange}
          />
          <ButtonBase
            onClick={handleUpload}
            startIcon={<BsUpload size="13px" />}
          >
            Tải lên
          </ButtonBase>
          {fileExcel && (
            <Stack alignItems="center">
              <Avatar src={ExcelIcon} sx={{ width: 100, height: 100 }} />
              <Typography sx={{ fontSize: '12px', color: 'primary.main' }}>
                {fileExcel.name}
              </Typography>
            </Stack>
          )}
        </Stack>
      </Stack>
    </ModalBase>
  );
}

export default ModalImportExcel;
