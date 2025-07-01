'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import RouterLink from 'next/link';
import PageNotFoundIllustration from '../assets/PageNotFoundIllustration';



// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
      <Container >
        <div >
          <Typography variant="h3" sx={{ mb: 2 }}>
            Sorry, page not found!
          </Typography>
        </div>

        <div >
          <Typography sx={{ color: 'text.secondary' }}>
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve mistyped the URL? Be
            sure to check your spelling.
          </Typography>
        </div>

        <div >
          <PageNotFoundIllustration sx={{ my: { xs: 5, sm: 10 } }} />
        </div>

        <Button component={RouterLink} href="/" size="large" variant="contained">
          Go to home
        </Button>
      </Container>
  );
}
