import { useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, Typography, CardHeader, Stack, Button, Grid, Box } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

import { PATH_DASHBOARD } from '../../../../routes/paths';

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
  const { bio, location, email, roleSkillSet, company, reportTo, bucket, source, designation } = project;
  const [seeMore, setSeeMore] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const editHandler = () => {
    navigate(`${PATH_DASHBOARD.network.editContact}`, {
      state: project
    });
  };

  return (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        {bio && (
          <Stack>
            <Typography variant="body2">{bio}</Typography>
            <Button>See more</Button>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: 1
              }}
            >
              <CopyToClipboard text={bio} onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}>
                <Button
                  size="small"
                  onClick={() => {}}
                  variant={'outlined'}
                  color={'inherit'}
                  style={{ marginRight: 10 }}
                >
                  Copy
                </Button>
              </CopyToClipboard>
              <Button size="small" onClick={editHandler} variant={'outlined'} color={'inherit'}>
                Edit
              </Button>
            </Box>
          </Stack>
        )}

        <Stack direction="row">
          {project?.title && location && (
            <>
              <IconStyle icon={'eva:pin-fill'} />
              <Typography variant="body2">
                Live at &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {location}
                </Link>
              </Typography>
            </>
          )}
        </Stack>

        {email && (
          <Stack direction="row">
            <IconStyle icon={'eva:email-fill'} />
            <Typography variant="body2">{email}</Typography>
          </Stack>
        )}

        {project?.fullName ? (
          <>
            <Stack direction="row">
              <IconStyle icon={'ic:round-business-center'} />
              <Typography variant="body2">
                Bucket &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {bucket}
                </Link>
              </Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={'ic:round-business-center'} />
              <Typography variant="body2">
                {/* {roleSkillSet} at &nbsp; */}
                {designation}at &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {company}
                </Link>
              </Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={'ic:round-business-center'} />
              <Typography variant="body2">
                Report to &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {reportTo}
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row">
              <IconStyle icon={'ic:round-business-center'} />
              <Typography variant="body2">
                Direct Report &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {/* {reportTo} */}
                </Link>
              </Typography>
            </Stack>

            <Stack direction="row">
              <IconStyle icon={'eva:eye-fill'} />
              <Typography variant="body2">
                Conact By &nbsp;
                <Link component="span" variant="subtitle2" color="text.primary">
                  {source}
                </Link>
              </Typography>
            </Stack>
            <Stack direction="row">
              <Typography variant="body2">
                {project?.address}
                <Link component="span" variant="subtitle2" color="text.primary">
                  {location}
                </Link>
              </Typography>
            </Stack>
          </>
        ) : (
          <>
            {project?.phoneNumber && (
              <Stack direction="row">
                <IconStyle icon={'bx:bxs-phone'} />
                <Typography variant="body2">{project?.phoneNumber}</Typography>
              </Stack>
            )}
            {project?.bankAccountNo && (
              <Stack direction="row">
                <IconStyle icon={'ant-design:bank-filled'} />
                <Typography variant="body2">{project?.bankAccountNo}</Typography>
              </Stack>
            )}
            {project?.IFSCCode && (
              <Stack direction="row">
                <IconStyle icon={'ci:qr-code-1'} />
                <Typography variant="body2">{project?.IFSCCode}</Typography>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Card>
  );
}
