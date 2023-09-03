import React, { useState, useMemo } from 'react';
import DataTable from 'react-data-table-component';
import { useTheme } from '@mui/material/styles';
import { Box, CircularProgress, IconButton, Typography } from '@mui/material';
import { FaTrash } from 'react-icons/fa';
import { cloneDeep } from 'lodash';

function TableDisplay({
  columns,
  data,
  pagination,
  paginationTotalRows,
  paginationPerPage,
  onChangePage = () => {},
  onChangeRowsPerPage = () => {},
  title,
  progressPending = false,
  onRowClicked,
  handleDelete,
  uniqueKey,
  fixedHeaderScrollHeight = '300px',
}) {
  const theme = useTheme();
  const [hoveredRowId, setHoveredRowId] = useState(null);

  const handleRowHover = (data) => {
    setHoveredRowId(data[uniqueKey]);
  };

  const handleRowHoverEnd = () => {
    setHoveredRowId(null);
  };

  const selfColumns = useMemo(() => {
    if (handleDelete) {
      const columnsCopy = cloneDeep(columns);
      columnsCopy.splice(1, 0, {
        width: '10px',
        compact: true,
        cell: (row) => (
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <Box
              sx={{
                display: row[uniqueKey] === hoveredRowId ? 'block' : 'none',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <IconButton
                onClick={() => handleDelete(row)}
                sx={{
                  color: '#fff',
                  borderRadius: '4px',
                  backgroundColor: 'error.main',
                  width: '25px',
                  height: '25px',
                  '&:hover': {
                    backgroundColor: 'error.main',
                  },
                }}
              >
                <FaTrash fontSize="14px" />
              </IconButton>
            </Box>
          </Box>
        ),
      });
      return columnsCopy;
    } else {
      return columns;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, hoveredRowId]);

  return (
    <DataTable
      persistTableHead
      fixedHeader
      fixedHeaderScrollHeight={fixedHeaderScrollHeight}
      striped
      pointerOnHover
      highlightOnHover
      onRowClicked={onRowClicked}
      onRowMouseEnter={handleRowHover}
      onRowMouseLeave={handleRowHoverEnd}
      columns={selfColumns}
      data={data}
      // pagination start
      pagination={pagination}
      paginationTotalRows={paginationTotalRows}
      paginationPerPage={paginationPerPage}
      paginationDefaultPage={1}
      paginationRowsPerPageOptions={[20, 50, 100, 500]}
      paginationComponentOptions={{
        rowsPerPageText: 'Dòng trên bảng',
        rangeSeparatorText: 'trên',
      }}
      onChangePage={onChangePage}
      onChangeRowsPerPage={onChangeRowsPerPage}
      // pagination end
      // process start
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
      // process end
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
  );
}

export default TableDisplay;
