import React, { useState, useEffect, forwardRef } from 'react';
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DataTable from 'react-data-table-component';
import { FaTrash, FaTrashRestore } from 'react-icons/fa';
import { RiFileDamageFill, RiChatHistoryFill } from 'react-icons/ri';
import { TiArrowBack } from 'react-icons/ti';
import useApisContext from '~/hooks/hookContext/useApisContext';
import useConfirmContext from '~/hooks/hookContext/useConfirmContext';
import { useNavigate } from 'react-router-dom';
import useResponsive from '~/hooks/useResponsive';

function TableBase(
  {
    maDanhMuc,
    uniquekey,
    columns,
    data,
    title,
    onChangePage,
    onChangeRowsPerPage,
    onRowClicked,
    onSelectedRowsChange,
    progressPending = false,
    paginationTotalRows,
    paginationPerPage = 20,
    fixedHeaderScrollHeight,
    loadData = () => {},
    isDeleted = false,
    isOpenDm,
  },
  ref
) {
  const theme = useTheme();
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const { asyncDelete, asyncDestroy, asyncRestore } = useApisContext();
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const confirmContext = useConfirmContext();
  const navigate = useNavigate();

  // handle selected row change
  const handleSelectedRowsChange = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
    onSelectedRowsChange?.(selectedRows);
  };
  // handle delete row
  const handleDeleteRow = async () => {
    if (selectedRows && selectedRows.length > 0) {
      const dataPost = {
        uniqueValues: selectedRows.map((item) => item[uniquekey]),
      };
      const resp = await asyncDelete(maDanhMuc, dataPost);
      if (!resp?.message) {
        handleSelectedRowsChange({ selectedRows: [] });
        setToggleCleared(!toggleCleared);
        loadData();
      }
    } else {
      return;
    }
  };
  // handle destroy row
  const handleDestroyRow = async () => {
    if (selectedRows && selectedRows.length > 0) {
      const dataPost = {
        uniqueValues: selectedRows.map((item) => item[uniquekey]),
      };
      const resp = await asyncDestroy(maDanhMuc, dataPost);
      if (!resp?.message) {
        handleSelectedRowsChange({ selectedRows: [] });
        setToggleCleared(!toggleCleared);
        loadData();
      }
    } else {
      return;
    }
  };
  // handle restore
  const handleRestore = async () => {
    if (selectedRows && selectedRows.length > 0) {
      const dataPost = {
        uniqueValues: selectedRows.map((item) => item[uniquekey]),
      };
      const resp = await asyncRestore(maDanhMuc, dataPost);
      if (!resp?.message) {
        handleSelectedRowsChange({ selectedRows: [] });
        setToggleCleared(!toggleCleared);
        loadData();
      }
    } else {
      return;
    }
  };

  // render delete button
  const renderDeleteButton = () => {
    return (
      <Tooltip placement="top" title="Chuyển vào thùng rác" arrow>
        <IconButton
          ref={ref}
          sx={{
            backgroundColor: 'error.main',
            color: 'whitish.pureWhite',
            borderRadius: '4px',
            '&:hover': { backgroundColor: 'error.main' },
          }}
          onClick={() =>
            confirmContext({
              title: 'Xác nhận',
              onConfirm: handleDeleteRow,
              content: (
                <Box sx={{ padding: '0 10px' }}>
                  <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
                    Bạn có chắc muốn chuyển{' '}
                    <b>
                      {selectedRows.length < data.length
                        ? selectedRows.length
                        : 'tất cả'}
                    </b>{' '}
                    {title} <br /> vào thùng rác không ?
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '12px',
                      textAlign: 'left',
                      fontStyle: 'italic',
                      color: 'primary.main',
                      marginTop: '10px',
                    }}
                  >
                    Lưu ý: sau khi đồng ý, {title} sẽ được chuyển vào thùng rác.
                    Bạn có thể vào thùng rác để khôi phục lại.
                  </Typography>
                </Box>
              ),
            })
          }
        >
          <FaTrash fontSize="14px" />
        </IconButton>
      </Tooltip>
    );
  };

  useEffect(() => {
    handleSelectedRowsChange({ selectedRows: [] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [maDanhMuc]);

  return (
    <>
    <Box sx={{position: 'fixed', top: 0, left: 0, visibility: 'hidden'}}>{renderDeleteButton()}</Box>
    <DataTable
      fixedHeader
      fixedHeaderScrollHeight={fixedHeaderScrollHeight}
      persistTableHead
      actions={
        mdMatches ? (
          <Stack
            direction="row"
            alignItems="center"
            spacing="10px"
            sx={{ height: '34px' }}
          >
            {isOpenDm ? (
              <>{selectedRows?.length > 0 && renderDeleteButton()}</>
            ) : (
              <>
                <Tooltip placement="top" title="Quay lại" arrow>
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{
                      backgroundColor: 'primary.second',
                      color: 'whitish.pureWhite',
                      borderRadius: '4px',
                      '&:hover': { backgroundColor: 'primary.second' },
                    }}
                  >
                    <TiArrowBack fontSize="14px" />
                  </IconButton>
                </Tooltip>
                {selectedRows && selectedRows.length > 0 && (
                  <>
                    {isDeleted ? (
                      <Tooltip placement="top" title="Xóa vĩnh viễn" arrow>
                        <IconButton
                          onClick={() =>
                            confirmContext({
                              title: 'Xác nhận',
                              onConfirm: handleDestroyRow,
                              content: (
                                <Box sx={{ padding: '0 10px' }}>
                                  <Typography
                                    sx={{
                                      fontSize: '14px',
                                      textAlign: 'center',
                                    }}
                                  >
                                    Bạn có chắc muốn xóa vĩnh viễn{' '}
                                    <b>
                                      {selectedRows.length < data.length
                                        ? selectedRows.length
                                        : 'tất cả'}
                                    </b>{' '}
                                    {title} <br /> đã chọn không ?
                                  </Typography>
                                  <Typography
                                    sx={{
                                      fontSize: '12px',
                                      textAlign: 'left',
                                      fontStyle: 'italic',
                                      color: 'primary.main',
                                      marginTop: '10px',
                                    }}
                                  >
                                    Lưu ý: sau khi đồng ý, {title} sẽ bị xóa
                                    vĩnh viễn và không thể khôi phục lại được.
                                  </Typography>
                                </Box>
                              ),
                            })
                          }
                          sx={{
                            backgroundColor: 'error.main',
                            color: 'whitish.pureWhite',
                            borderRadius: '4px',
                            '&:hover': { backgroundColor: 'error.main' },
                          }}
                        >
                          <RiFileDamageFill fontSize="14px" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      renderDeleteButton()
                    )}
                  </>
                )}
                {isDeleted ? (
                  <>
                    {selectedRows?.length > 0 && (
                      <Tooltip placement="top" title="Khôi phục" arrow>
                        <IconButton
                          onClick={handleRestore}
                          sx={{
                            backgroundColor: 'secondary.main',
                            color: 'whitish.pureWhite',
                            borderRadius: '4px',
                            '&:hover': { backgroundColor: 'secondary.main' },
                          }}
                        >
                          <FaTrashRestore fontSize="14px" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </>
                ) : (
                  <Tooltip placement="top" title="Xem thùng rác" arrow>
                    <IconButton
                      onClick={() => navigate('restore')}
                      sx={{
                        backgroundColor: 'secondary.main',
                        color: 'whitish.pureWhite',
                        borderRadius: '4px',
                        '&:hover': { backgroundColor: 'secondary.main' },
                      }}
                    >
                      <RiChatHistoryFill fontSize="14px" />
                    </IconButton>
                  </Tooltip>
                )}
              </>
            )}
          </Stack>
        ) : null
      }
      noContextMenu
      columns={columns}
      data={data}
      pointerOnHover
      highlightOnHover
      striped
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      onRowClicked={onRowClicked}
      selectableRows
      clearSelectedRows={toggleCleared}
      onSelectedRowsChange={handleSelectedRowsChange}
      responsive 
      pagination
      paginationServer
      paginationTotalRows={paginationTotalRows}
      paginationPerPage={paginationPerPage}
      paginationDefaultPage={1}
      paginationRowsPerPageOptions={[20, 50, 100, 500]}
      paginationComponentOptions={{
        rowsPerPageText: 'Dòng trên bảng',
        rangeSeparatorText: 'trên',
      }}
      progressPending={progressPending}
      progressComponent={
        <Box
          sx={{
            width: '100%',
            height: '100px',
            paddingTop: '20px',
            textAlign: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      }
      noDataComponent={
        <Typography
          sx={{ fontSize: '13px', textAlign: 'center', padding: '20px 0' }}
        >
          {title ? `Không có ${title}` : 'Không có dữ liệu'}
        </Typography>
      }
      customStyles={{
        headCells: {
          style: {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.whitish.pureWhite,
          },
        },
      }}
    />
    </>
  );
}

export default forwardRef(TableBase);
