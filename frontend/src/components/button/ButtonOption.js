import React, { useState, memo } from 'react';
import { Box, Menu, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import { v4 } from 'uuid';

function ButtonOption({
  children,
  startIcon,
  endIcon,
  notification = false,
  popupOptions,
  style,
  primary,
  active,
  menuColor = '#fff',
  menuWidth = '250px',
  onClick = () => {},
  ...props
}) {
  const theme = useTheme();
  const [anchorMenu, setAnchorMenu] = useState(null);

  const handleClick = (e) => {
    if (popupOptions?.length > 0) {
      setAnchorMenu(e.currentTarget);
    } else {
      onClick(e);
    }
  };

  return (
    <>
      <ButtonWrapper
        style={style}
        {...props}
        className={`${active ? 'active' : ''}`}
        onClick={handleClick}
        bgColor={primary ? theme.palette.primary.second : '#fff'}
        bgColorHover={primary ? theme.palette.primary.main : '#ededed'}
      >
        {startIcon && (
          <Icon
            style={{ color: primary ? theme.palette.whitish.pureWhite : '' }}
          >
            {startIcon}
          </Icon>
        )}
        {!!children && (
          <Typography
            sx={{ fontSize: '13px', color: primary ? 'whitish.pureWhite' : '' }}
          >
            {children}
          </Typography>
        )}
        {endIcon && (
          <Icon
            style={{ color: primary ? theme.palette.whitish.pureWhite : '' }}
          >
            {endIcon}
          </Icon>
        )}
        {notification && (
          <Notification sx={{ backgroundColor: 'secondary.main' }} />
        )}
      </ButtonWrapper>
      {popupOptions?.length > 0 && (
        <Menu
          open={!!anchorMenu}
          anchorEl={anchorMenu}
          onClose={() => setAnchorMenu(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          sx={{
            '& .MuiList-root': {
              padding: 0,
              backgroundColor: menuColor,
              width: menuWidth,
            },
          }}
        >
          {popupOptions.map(({ text, onClick, ...props }) => (
            <ButtonOption
              key={v4()}
              {...props}
              onClick={() => {
                onClick?.();
                setAnchorMenu(null);
              }}
            >
              {text}
            </ButtonOption>
          ))}
        </Menu>
      )}
    </>
  );
}

export default memo(ButtonOption);

const ButtonWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  /* background-color: ${(props) => props.bgColor}; */
  transition: all linear 0.1s;
  cursor: pointer;
  &:hover {
    background-color: ${(props) => props.bgColorHover};
  }
  &.active {
    background-color: ${(props) => props.bgColorHover};
  }
`;
const Icon = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Notification = styled(Box)`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
`;
