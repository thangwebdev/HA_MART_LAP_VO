import React from 'react';
import {
  Avatar,
  Box,
  Grid,
  List,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import DrawerBase from '~/components/drawer/DrawerBase';
import ProfileImage from '~/assets/img/profile.png';
import MenuItemBase from '~/components/menu/MenuItemBase';
import { useLocation, useNavigate } from 'react-router-dom';
import { menus } from '~/utils/menu';
import { MdLogout } from 'react-icons/md';
import { VscSymbolColor } from 'react-icons/vsc';
import { FiSettings } from 'react-icons/fi';
import { logoutUser } from '~/redux/actions/auth.action';
import { useDispatch, useSelector } from 'react-redux';
import Themes from '../header/Themes';
import { useGlobalTheme } from '~/context/themeContext';

function MenuMobile({ open, onClose = () => {} }) {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [, setThemeId] = useGlobalTheme();
  const userData = useSelector((state) => state.auth);

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <DrawerBase
      open={open}
      onClose={onClose}
      anchor="right"
      showHeader={false}
      paperStyle={{ width: '300px', maxWidth: '80vw' }}
      contentStyle={{ padding: '0px' }}
      zIndex={1}
    >
      <Stack sx={{ height: '100%' }} justifyContent="space-between">
        <Grid
          container
          component={MenuItem}
          sx={{
            flexShrink: 0,
            height: '70px',
            backgroundColor: 'primary.main',
            '&:hover': { backgroundColor: 'primary.main' },
          }}
        >
          <Grid item xs={3}>
            <Stack
              sx={{
                width: '100%',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Avatar
                sx={{ width: 50, height: 50 }}
                src={ProfileImage}
                alt="Profile image"
              />
            </Stack>
          </Grid>
          <Grid item xs={9}>
            <Stack
              sx={{ width: '100%', height: '100%' }}
              justifyContent="center"
            >
              <Typography
                sx={{
                  fontSize: '12px',
                  color: 'whitish.pureWhite',
                  fontStyle: 'italic',
                }}
              >
                Xin chào
              </Typography>
              <Typography sx={{ fontSize: '14px', color: 'whitish.pureWhite' }}>
                {userData?.user?.email || 'admin@gmail.com'}
              </Typography>
            </Stack>
          </Grid>
        </Grid>
        <Box
          className="hidden-scroll"
          sx={{
            height: 'calc(100% - 70px - 100px)',
            overflow: 'auto',
          }}
        >
          <List component="nav" sx={{ padding: '5px' }}>
            {menus.map((menu) => (
              <MenuItemBase
                key={menu.text}
                Icon={menu.icon}
                text={menu.text}
                sx={{ maxHeight: '42px', minHeight: '0px' }}
                onClick={
                  menu.path ? () => handleNavigate(menu.path) : undefined
                }
                active={
                  menu.path
                    ? location.pathname === menu.path
                    : menu.subs
                        .map((item) => item.path)
                        .includes(location.pathname)
                }
                subMenu={
                  menu.subs ? (
                    <List
                      component="nav"
                      sx={{
                        padding: '5px 0',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      {menu.subs.map((sub) => (
                        <MenuItemBase
                          key={sub.text}
                          Icon={sub.icon}
                          text={sub.text}
                          sx={{ maxHeight: '42px', minHeight: '0px' }}
                          onClick={
                            sub.path
                              ? () => handleNavigate(sub.path)
                              : undefined
                          }
                          active={
                            sub.path
                              ? location.pathname === sub.path
                              : sub.subs
                                  .map((item) => item.path)
                                  .includes(location.pathname)
                          }
                        />
                      ))}
                    </List>
                  ) : null
                }
              />
            ))}
          </List>
        </Box>
        <Stack
          sx={{
            padding: '10px',
            height: '142px',
            borderTop: '1px dashed',
            borderColor: '#ccc',
          }}
          spacing="5px"
        >
          <Themes
            renderButton={(onClick) => (
              <MenuItemBase
                onClick={(e) => onClick(e)}
                text="Chủ đề"
                Icon={<VscSymbolColor size={16} />}
                sx={{ maxHeight: '42px', minHeight: '0px' }}
              />
            )}
          />
          <MenuItemBase
            text="Thiết lập"
            Icon={<FiSettings size={16} />}
            sx={{ maxHeight: '42px', minHeight: '0px' }}
          />
          <MenuItemBase
            text="Đăng xuất"
            Icon={<MdLogout size={16} />}
            sx={{ maxHeight: '42px', minHeight: '0px' }}
            onClick={() => logoutUser(dispatch, setThemeId)}
          />
        </Stack>
      </Stack>
    </DrawerBase>
  );
}

export default MenuMobile;
