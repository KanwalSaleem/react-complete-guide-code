import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ExternalLinks.propTypes = {
  profile: PropTypes.object,
  project: PropTypes.object
};

export default function ExternalLinks({ profile, project }) {
  const { googleDriveUrl } = project;

  return (
    <Card>
      <CardHeader title="External Links" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {googleDriveUrl ? (
          <Stack direction="row" alignItems="center">
            <IconStyle icon={'logos:google-drive'} />
            <Link
              component="span"
              variant="body2"
              color="text.primary"
              noWrap
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(`${googleDriveUrl}`)}
            >
              {googleDriveUrl}
            </Link>
          </Stack>
        ) : (
          '-'
        )}
      </Stack>
    </Card>
  );
}
