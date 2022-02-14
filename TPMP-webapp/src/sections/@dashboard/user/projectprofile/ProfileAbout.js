import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack } from '@mui/material';
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

ProfileAbout.propTypes = {
  profile: PropTypes.object,
  project: PropTypes.object
};

export default function ProfileAbout({ profile, project }) {
  const { logLine, genre, description, availableMaterial } = project;

  return (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {logLine && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Typography variant="body2">{logLine}</Typography>
          </Stack>
        )}
        {genre.length > 0 && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Stack>
              {genre.map((item) => (
                <Typography variant="body2">{item}</Typography>
              ))}
            </Stack>
          </Stack>
        )}

        {description && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Typography variant="body2">{description}</Typography>
          </Stack>
        )}

        {availableMaterial.length > 0 && (
          <Stack direction="row">
            <IconStyle icon={'akar-icons:chevron-right'} />
            <Stack>
              {availableMaterial.map((item) => (
                <Typography variant="body2">{item}</Typography>
              ))}
            </Stack>
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
