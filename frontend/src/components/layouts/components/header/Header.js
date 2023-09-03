import React from 'react';
import { Box, Container, Stack, Typography } from '@mui/material';
import styled from 'styled-components';
import Logo from '~/components/svgs/Logo';
import HeaderActions from './HeaderActions';
import { useNavigate } from 'react-router-dom';
import HeaderActionsMobile from './HeaderActionsMobile';
import useResponsive from '~/hooks/useResponsive';

function Header({ isAdmin = true }) {
  const matches = useResponsive({ matchKey: 'up', breakpoint: 'md' });
  const navigate = useNavigate();

  return (
    <HeaderWrapper component="header">
      <Container maxWidth="xl" sx={{ height: '100%' }}>
        <HeaderContainer direction="row">
          <HeaderLogo onClick={() => navigate('/')}>
            <Logo />
            <Typography sx={{ fontSize: '20px', fontWeight: 550 }}>
              HA Mart
            </Typography>
          </HeaderLogo>
          <>
            {!!matches ? (
              <HeaderActions isAdmin={isAdmin} />
            ) : (
              <HeaderActionsMobile isAdmin={isAdmin} />
            )}
          </>
        </HeaderContainer>
      </Container>
    </HeaderWrapper>
  );
}

export default Header;
const HeaderWrapper = styled(Box)`
  width: 100%;
  height: 50px;
`;
const HeaderContainer = styled(Stack)`
  height: 100%;
  align-items: center;
  justify-content: space-between;
`;
const HeaderLogo = styled(Box)`
  display: flex;
  align-items: flex-end;
  gap: 10px;
  cursor: pointer;
`;
