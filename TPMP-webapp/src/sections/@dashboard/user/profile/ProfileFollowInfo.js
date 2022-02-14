import PropTypes from 'prop-types';
// @mui
import { Card, Stack, Typography, Divider } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

ProfileFollowInfo.propTypes = {
  project: PropTypes.object
};

export default function ProfileFollowInfo({ project }) {
  return (
    <Card sx={{ py: 3 }}>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />}>
        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            {project?.fullName ? (project?.deals ? project?.deals : '-') : project?.titles ? project?.title : '-'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {project?.fullName ? 'Ongoing Deals' : 'Titles'}
          </Typography>
        </Stack>

        <Stack width={1} textAlign="center">
          <Typography variant="h4">
            {project?.fullName
              ? project?.projects
                ? project?.projects
                : '-'
              : project?.contacts
              ? project?.contacts
              : '-'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {project?.fullName ? 'Ongoing Projects' : 'Contacts'}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
