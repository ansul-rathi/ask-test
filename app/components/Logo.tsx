// material
import { Box, SxProps } from '@mui/material';
// import useAuth from '../hooks/useAuth';

// ----------------------------------------------------------------------

type LogoProps = {
  sx?: SxProps;
};

export default function Logo({ sx}: LogoProps) {
  // const { businessSelected = {} } = useSelector((state) => state.business);
  // return <Image component="img" src="/favicon/servicepluglogo.png" alt="Serviceplug-logo" sx={{ height: 40, ...sx }} />;
  return (
    <Box sx={{ cursor: 'pointer', height: '82px', ...sx }} component="img" src="/Images/logo.jpeg">
      {/* <Typography sx={{ fontSize: '30px', color: 'secondary.main', fontWeight: 700, ...sx,  }}>
        Service<span style={{ color: '#1FCC79' }}>Plug</span>
      </Typography>
      {!hideSubtitle && (
        <Typography sx={{ color: '#fff', fontSize: '13px', ...subTitleSx }}>Connecting Local Experts</Typography>
      )} */}
    </Box>
  );
}
