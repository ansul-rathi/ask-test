'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import { Link } from '@/i18n/routing';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { EmptyContent } from '../components/EmptyContent';

// ----------------------------------------------------------------------

export default function Error() {
  return (
    <Container sx={{ my: 5 }}>
      <EmptyContent
        imgUrl=""
        slotProps={{}}
        description="The post you are looking for does not exist."
        filled
        title="Post not found!"
        action={
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon sx={{ fontSize: 16 }} />}
            sx={{ mt: 3 }}
          >
            Back to list
          </Button>
        }
        sx={{ py: 10 }}
      />
    </Container>
  );
}
