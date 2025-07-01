'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography } from '@mui/material';
import { CheckCircleOutline } from '@mui/icons-material';
import { useTranslations } from "next-intl";


const Success: React.FC = () => {
  const t = useTranslations('Surgery');
  const router = useRouter();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // router.push('/');
    }
  }, [seconds, router]);

  return (
    <Card
      sx={{
        display: 'grid',
        placeItems: 'center',
        margin: 0,
        minHeight: { xs: '50vh', md: '40vh' },
        minWidth: { xs: '80vw', md: '50vw' },
        borderWidth: 4,
        animation: 'appear 1s ease-out forwards',
        '@keyframes appear': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        '@keyframes tick': {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      {seconds > 0 ? (
        <Typography
          variant="h1"
          sx={{
            fontSize: '6rem',
            color: 'green',
            animation: 'tick 2s ease-out forwards',
          }}
        >
          <CheckCircleOutline sx={{ fontSize: 'inherit', color: 'green' }} />
        </Typography>
      ) : (
        <Typography
          variant="body1"
          sx={{
            fontSize: '1rem',
            color: 'blue',
            marginTop: '1rem',
            padding: 10,
            textAlign: 'left',
          }}
        >
          <strong>{t('dayOf')}</strong>
          <ul>
            <li>{t('looseClothing')}</li>
            <li>{t('licensedDriver')}</li>
            <li>{t('fasting')}</li>
            <li>{t('noPiercings')}</li>
            <li>{t('noMakeup')}</li>
          </ul>
          <strong>{t('afterSurgery')}</strong>
          <p>{t('afterSurgeryText')}</p>
          <ul>
            <li>{t('drowsiness')}</li>
            <li>{t('impairedCognition')}</li>
            <li>{t('fatigue')}</li>
            <li>{t('nausea')}</li>
          </ul>
          <strong>{t('safetyGuidelines')}</strong>
          <ul>
            <li>{t('noAlcohol')}</li>
            <li>{t('noIllicitStimulants')}</li>
            <li>{t('noMachinery')}</li>
          </ul>
          <p>{t('regionalAnesthetics')}</p>
          <p>{t('contactSurgeon')}</p>
          <p>{t('goToER')}</p>
        </Typography>
      )}
    </Card>
  );
};

export default Success;
