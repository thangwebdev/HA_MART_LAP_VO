import React, { useMemo } from 'react';
import {
  Avatar,
  Box,
  Grid,
  MenuItem,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useBillContext } from '~/pages/bill/Bill';
import useSnackbarContext from '~/hooks/hookContext/useSnackbarContext';
import useApisContext from '~/hooks/hookContext/useApisContext';
import { useEffect } from 'react';
import { numeralCustom } from '~/utils/helpers';
import ProductImage from '~/assets/img/product.png';
import { PUBLIC_URL } from '~/utils/constants';
import MenuBase from '~/components/menu/MenuBase';
import useResponsive from '~/hooks/useResponsive';

function ProductList({ maNvt }) {
  const mdMatches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const { search } = useBillContext();
  const { asyncGetList } = useApisContext();
  const alertSnackbar = useSnackbarContext();
  const [count, setCount] = useState(0);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 12,
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getProducts = async () => {
    try {
      setLoading(true);
      const condition = {
        $or: [
          { ma_vt: { $regex: search.split(' ').join('.*') } },
          { ten_vt: { $regex: search.split(' ').join('.*') } },
          { $text: { $search: search } },
        ],
        page: filter.page,
        limit: filter.limit,
      };
      if (maNvt) {
        condition.ma_nvt = maNvt;
      }
      const resp = await asyncGetList('dmvt', condition);
      setProducts(resp.data);
      setCount(resp.count);
    } catch (error) {
      alertSnackbar('error', error?.messge || 'Inernal server error');
    } finally {
      setLoading(false);
    }
  };

  const totalPage = useMemo(() => {
    let result = Math.floor(count / filter.limit);
    if (count % filter.limit > 0) {
      result++;
    }
    return result;
  }, [count, filter.limit]);

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filter]);
  useEffect(() => {
    setFilter({page: 1, limit: 12})
  }, [maNvt])

  return (
    <Stack sx={{ flexGrow: 1 }} justifyContent="space-between">
      <Box
        className="custome-scrolly"
        sx={{
          width: '100%',
          padding: '5px',
          maxHeight: mdMatches
            ? 'calc(100vh - 50px - 50px - 42px - 42px - 46px - 20px)'
            : 'calc(100vh - 40px - 46px - 42px)',
          overflow: 'auto',
        }}
      >
        {products?.length > 0 ? (
          <Grid container spacing="5px" sx={{ alignContent: 'flex-start' }}>
            {loading && (
              <>
                {Array(12).map((_, index) => (
                  <Grid key={index} item xs={6} sm={4} md={3}>
                    <Skeleton
                      width={210}
                      height={60}
                      variant="rounded"
                      animation="wave"
                    />
                  </Grid>
                ))}
              </>
            )}
            {products.map((product) => (
              <Grid key={product.ma_vt} item xs={4} sm={3} md={3}>
                <ProductItem data={product} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography
            sx={{
              textAlign: 'center',
              padding: '10px',
              fontSize: '13px',
              fontStyle: 'italic',
            }}
          >
            Không có sản phẩm
          </Typography>
        )}
      </Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        sx={{ height: '42px', borderTop: '1px dashed #ededed' }}
      >
        {!!totalPage && (
          <Pagination
            count={totalPage || 0}
            variant="outlined"
            color="primary"
            size="medium"
            page={filter.page}
            onChange={(_, value) => setFilter({ ...filter, page: value })}
          />
        )}
      </Stack>
    </Stack>
  );
}

export default ProductList;

function ProductItem({ data }) {
  const { add } = useBillContext();
  const alertSnackbar = useSnackbarContext();
  const [anchorMenu, setAnchorMenu] = useState();

  const handleCloseMenu = () => setAnchorMenu(null);
  const showAlert = () => {
    alertSnackbar('success', `Đã thêm '${data.ten_vt}'`);
  };

  const handleProductClick = async (e) => {
    if (data?.ds_dvt.length > 0) {
      setAnchorMenu(e.currentTarget);
    } else {
      const resp = await add({
        product: data,
        dvt: {
          ma_dvt: data.ma_dvt,
          ten_dvt: data.ten_dvt,
          gia_ban: data.gia_ban_le,
        },
      });
      if(resp?.message) {
        alertSnackbar('error', resp.message)
      }else {

        showAlert();
      }
    }
  };

  const image = useMemo(() => {
    if (data.hinh_anh1) {
      return `${PUBLIC_URL}/${data.hinh_anh1}`;
    } else if (data.hinh_anh2) {
      return `${PUBLIC_URL}/${data.hinh_anh2}`;
    } else if (data.hinh_anh3) {
      return `${PUBLIC_URL}/${data.hinh_anh3}`;
    } else {
      return null;
    }
  }, [data]);

  const dvts = useMemo(() => {
    const result = [{ ma_dvt: data.ma_dvt, ten_dvt: data.ten_dvt }];
    if (data?.ds_dvt?.length > 0) {
      data.ds_dvt.forEach((dvt) => {
        result.push({ ma_dvt: dvt.ma_dvt, ten_dvt: dvt.ten_dvt });
      });
    }
    return result;
  }, [data]);

  return (
    <>
      {data?.ds_dvt?.length > 0 && (
        <MenuBase
          anchorEl={anchorMenu}
          open={!!anchorMenu}
          handleClose={() => setAnchorMenu(null)}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ minWidth: '100px' }}>
            {dvts.map((dvt) => (
              <MenuItem
                key={dvt.ma_dvt}
                onClick={async () => {
                  const resp = await add({
                    product: data,
                    dvt: {
                      ma_dvt: dvt.ma_dvt,
                      ten_dvt: dvt.ten_dvt,
                      gia_ban: dvt.gia_ban_qd,
                    },
                  });
                  if(resp?.message) {
                    alertSnackbar('error', resp.message)
                  }else {

                    showAlert();
                  }
                  handleCloseMenu();
                }}
                sx={{ fontSize: '13px', padding: '5px 8px' }}
              >
                {dvt.ten_dvt}
              </MenuItem>
            ))}
          </Box>
        </MenuBase>
      )}
      <Stack
        onClick={handleProductClick}
        sx={{
          width: '100%',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all linear 0.1s',
          '&:hover': {
            backgroundColor: 'primary.fif',
            '& .MuiAvatar-root': { transform: 'scale(1.1)' },
          },
        }}
        alignItems="center"
        spacing="5px"
      >
        <Box
          sx={{
            width: '100%',
            paddingTop: '80%',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '6px 6px 0 0',
          }}
        >
          <Avatar
            src={image || ProductImage}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              borderRadius: '6px 6px 0 0',
              '& img': {
                objectFit: 'contain',
              },
            }}
          />
        </Box>
        <Stack
          spacing="5px"
          alignItems="center"
          sx={{ padding: '0 5px 5px 5px' }}
        >
          <Typography
            sx={{
              fontSize: '13px',
              lineHeight: '13px',
              fontWeight: 500,
              color: 'secondary.main',
            }}
          >
            {numeralCustom(data.gia_ban_le).format()}
          </Typography>
          <Typography
            sx={{ fontSize: '13px', lineHeight: '13px', textAlign: 'center' }}
          >
            {data.ten_vt}
          </Typography>
        </Stack>
      </Stack>
    </>
  );
}
