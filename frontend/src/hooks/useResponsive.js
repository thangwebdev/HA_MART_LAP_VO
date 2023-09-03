import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';

export default function useResponsive({ matchKey = 'up', breakpoint = 'md' }) {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints[matchKey](breakpoint));
  return matches;
}
