import React, { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { SiMicrosoftexcel } from 'react-icons/si';
import ButtonBase from '~/components/button/ButtonBase';
import { TbTableExport } from 'react-icons/tb';
import TableBase from '~/components/table/TableBase';
import useApisContext from '~/hooks/hookContext/useApisContext';
import ModalImportExcel from '../modal/ModalImportExcel';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import useResponsive from '~/hooks/useResponsive';
import { BiFilterAlt, BiPlusCircle } from 'react-icons/bi';
import ButtonOption from '../button/ButtonOption';
import MenuBase from '../menu/MenuBase';
import { useMemo } from 'react';
import { BsTrash } from 'react-icons/bs';
import { useRef } from 'react';

function ListBase({
  title,
  maDanhMuc,
  uniqueKey,
  columns,
  Form,
  Filter,
  isDeleted = false,
  isOpenDm = false,
  fixedHeaderScrollHeight,
  filterHeight,
}) {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const { asyncGetList, asyncGetListDeleted } = useApisContext();
  const [data, setData] = useState([]);
  const [load, setLoad] = useState(1);
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [defaultValues, setDefaultValues] = useState();
  const [condition, setCondition] = useState({});
  const [filter, setFilter] = useState({});
  const [openExcel, setOpenExcel] = useState(false);
  const [anchorMenuFiter, setAnchorMenuFilter] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [paginationOption, setPaginationOption] = useState({
    limit: 20,
    page: 1,
    totalRows: 0,
  });

  const btnDeleteRef = useRef();

  // row per page change
  const handleRowPerPageChange = (value) => {
    setPaginationOption({ ...paginationOption, limit: value });
  };
  // handle row clicked
  const handleRowClicked = (data) => {
    setDefaultValues(data);
    setOpenForm(true);
    setIsEdit(true);
  };
  // get products
  const getListData = async () => {
    setLoading(true);
    const funcGetList = isDeleted ? asyncGetListDeleted : asyncGetList;
    const resp = await funcGetList(maDanhMuc, {
      limit: paginationOption.limit,
      page: paginationOption.page,
      ...condition,
    });
    if (resp) {
      setData(resp.data);
      setPaginationOption({ ...paginationOption, totalRows: resp.count });
    }
    setLoading(false);
  };
  const exportToExcel = () => {
    // Tạo danh sách cột dựa trên columnDefs của bảng
    const columnsHeader = columns.map((column) => {
      return {
        label: column.name,
        key: column.selector,
      };
    });
    // Tạo workbook và worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data, { header: columnsHeader });

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dữ liệu');

    // Xuất workbook thành file Excel
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const excelData = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    saveAs(excelData, `export_${maDanhMuc}.xlsx`);
  };

  // handle delete
  const handleDelete = () => {
    btnDeleteRef?.current?.click()  
  }

  const showDot = useMemo(() => {
    const values = Object.values(filter);
    const isValue = values.some((item) => !!item !== false);
    return isValue;
  }, [filter]);

  useEffect(() => {
    getListData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationOption.limit, paginationOption.page, condition, load]);
  useEffect(() => {
    setCondition({});
    setPaginationOption({ limit: 20, page: 1, totalRows: 0 });
    setLoad(load + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maDanhMuc]);

  return (
    <>
      {openForm && (
        <Form
          open={openForm}
          handleClose={() => {
            setOpenForm(false);
            setDefaultValues(null);
          }}
          setLoad={setLoad}
          defaultValues={defaultValues}
          isEdit={isEdit}
        />
      )}
      {openExcel && (
        <ModalImportExcel
          open={openExcel}
          handleClose={() => setOpenExcel(false)}
          maDm={maDanhMuc}
          setLoad={setLoad}
        />
      )}
      {!mdMatches && (
        <MenuBase
          keepMounted
          anchorEl={anchorMenuFiter}
          open={!!anchorMenuFiter}
          handleClose={() => setAnchorMenuFilter(null)}
        >
          <Box
            className="custome-scrolly"
            sx={{
              width: '240px',
              minHeight: '100px',
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            <Filter setCondition={setCondition} onFilterChange={setFilter} />
          </Box>
        </MenuBase>
      )}
      <Box sx={{ padding: '10px 0' }}>
        <Grid container spacing="10px" alignItems="flex-start">
          {mdMatches ? (
            <Grid item xs={0} md={2.5}>
              <Box
                className="custome-scrolly"
                sx={{
                  width: '100%',
                  height: filterHeight || 'calc(100vh - 50px - 42px - 20px)',
                  overflow: 'auto',
                  padding: '1px',
                }}
              >
                {Filter && <Filter setCondition={setCondition} />}
              </Box>
            </Grid>
          ) : null}
          <Grid item xs={12} md={9.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography sx={{ fontSize: '20px', fontWeight: 500 }}>
                {`${isDeleted ? 'Khôi phục' : 'Danh sách'} ${title}`}
              </Typography>
              {mdMatches ? (
                <Stack direction="row" spacing="10px">
                  {!isDeleted && (
                    <>
                      <ButtonBase
                        startIcon={<AiOutlinePlusCircle fontSize="14px" />}
                        onClick={() => {
                          setOpenForm(true);
                          setIsEdit(false);
                        }}
                      >
                        Thêm mới
                      </ButtonBase>
                      <ButtonBase
                        startIcon={<SiMicrosoftexcel fontSize="14px" />}
                        onClick={() => setOpenExcel(true)}
                      >
                        Nhập từ excel
                      </ButtonBase>
                    </>
                  )}
                  {data?.length > 0 && (
                    <ButtonBase
                      startIcon={<TbTableExport fontSize="14px" />}
                      onClick={exportToExcel}
                    >
                      Xuất ra excel
                    </ButtonBase>
                  )}
                </Stack>
              ) : null}
            </Stack>
            {!mdMatches && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing="5px"
                sx={{
                  height: '52px',
                  padding: '5px 0px',
                }}
              >
                <Stack direction="row" alignItems="center" spacing="5px">
                  <Badge variant={showDot ? 'dot' : ''} color="secondary">
                    <IconButton
                      onClick={(e) => setAnchorMenuFilter(e.currentTarget)}
                      sx={{
                        position: 'relative',
                        backgroundColor: 'primary.main',
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        color: 'whitish.pureWhite',
                        '&:hover': { backgroundColor: 'primary.main' },
                      }}
                    >
                      <BiFilterAlt size={16} />
                    </IconButton>
                  </Badge>
                  {selectedRows.length > 0 && (
                    <IconButton
                      onClick={handleDelete}
                      sx={{
                        position: 'relative',
                        backgroundColor: 'error.main',
                        width: '36px',
                        height: '36px',
                        borderRadius: '4px',
                        color: 'whitish.pureWhite',
                        '&:hover': { backgroundColor: 'error.main' },
                      }}
                    >
                      <BsTrash size={16} />
                    </IconButton>
                  )}
                </Stack>
                <Stack direction="row" alignItems="center">
                  <ButtonOption
                    startIcon={<BiPlusCircle size={14} />}
                    style={{ borderRadius: '4px' }}
                    onClick={() => {
                      setOpenForm(true);
                      setIsEdit(false);
                    }}
                  >
                    Mới
                  </ButtonOption>
                  <Divider orientation="vertical" sx={{ height: '14px' }} />

                  <Divider orientation="vertical" sx={{ height: '14px' }} />
                  <ButtonOption
                    startIcon={<SiMicrosoftexcel size={14} />}
                    style={{ borderRadius: '4px' }}
                    onClick={() => setOpenExcel(true)}
                  >
                    Nhập
                  </ButtonOption>
                  <Divider orientation="vertical" sx={{ height: '14px' }} />
                  <ButtonOption
                    startIcon={<TbTableExport size={14} />}
                    style={{ borderRadius: '4px' }}
                    onClick={exportToExcel}
                  >
                    Xuất
                  </ButtonOption>
                </Stack>
              </Stack>
            )}
            <Box>
              <TableBase
                maDanhMuc={maDanhMuc}
                uniquekey={uniqueKey}
                columns={columns || []}
                data={data}
                title={title}
                progressPending={loading}
                paginationTotalRows={paginationOption.totalRows}
                paginationPerPage={paginationOption.limit}
                onChangeRowsPerPage={handleRowPerPageChange}
                onChangePage={(value) =>
                  setPaginationOption({ ...paginationOption, page: value })
                }
                onSelectedRowsChange={setSelectedRows}
                onRowClicked={handleRowClicked}
                loadData={getListData}
                isDeleted={isDeleted}
                fixedHeaderScrollHeight={
                  fixedHeaderScrollHeight ||
                  `calc(100vh - 50px - ${
                    !!mdMatches ? '42px - 56px' : '52px'
                  } - 34px - 34px - 20px - 18px)`
                }
                isOpenDm={isOpenDm}
                ref={btnDeleteRef}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ListBase;
