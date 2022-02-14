import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { Icon } from '@iconify/react';
import Label from '../../../../components/Label';
import { sentenceCase } from 'change-case';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ProfilePrimary.propTypes = {
  profile: PropTypes.object,
  project: PropTypes.object
};

export default function ProfilePrimary({ profile, project }) {
  const { authorId, commissioningPartnerPocId, commissioningPartnerCompanyId, stage, requirement } = project;
  const theme = useTheme();
  return (
    <Card>
      <CardHeader title="Primary Details" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {authorId.length > 0 && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Typography variant="body2">
              {authorId.map((item) => {
                return <p>{item.fullName}</p>;
              })}
            </Typography>
          </Stack>
        )}
        {commissioningPartnerCompanyId?.title && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Typography variant="body2">
              {commissioningPartnerPocId?.fullName} {commissioningPartnerCompanyId?.title}
            </Typography>
          </Stack>
        )}
        {stage && (
          <Stack direction="row">
            <IconStyle icon={'ic:round-business-center'} />
            <Typography variant="body2">{stage}</Typography>
            {/* <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'success'}
          >
            {sentenceCase('commisioned')}
          </Label> */}
          </Stack>
        )}

        {requirement.length > 0 && (
          <Stack direction="row">
            <IconStyle icon={'ic:sharp-expand-more'} />
            <Typography variant="body2">
              {requirement.map((item) => {
                return <p>{item}</p>;
              })}
            </Typography>
          </Stack>
        )}
        {/* <Stack direction="row">
          <Label variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'} color={'info'}>
            {sentenceCase('writers')}
          </Label>
          <Label
            style={{ marginLeft: 15 }}
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={'info'}
          >
            {sentenceCase('director')}
          </Label>
        </Stack> */}
      </Stack>
    </Card>
  );
}
