import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Link,
  Card,
  Typography,
  CardHeader,
  Stack,
  Switch,
  Avatar,
  Box,
  IconButton,
  Button,
  Grid
} from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import { Icon } from '@iconify/react';
import Label from '../../../../components/Label';
import { sentenceCase } from 'change-case';
import { useTheme } from '@mui/material/styles';
import moment from 'moment';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ProfileAdministrative.propTypes = {
  profile: PropTypes.object,
  project: PropTypes.object
};

export default function ProfileAdministrative({ profile, project }) {
  const {
    visibility,
    stageUpdatedAt,
    commissioningPartnerPocId,
    commissioningPartnerCompanyId,
    priority,
    stage,
    requirement
  } = project;
  const theme = useTheme();

  const visibilityHandler = () => {};

  return (
    <Card>
      <CardHeader title="Administrative Details" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack direction="row" alignItems="center">
          <Switch checked={visibility} onChange={visibilityHandler} />
          <Typography variant="body2">Visibility</Typography>
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconStyle icon={'ant-design:check-circle-filled'} />
          <Typography variant="body2">Tulsea Agent</Typography>
          <Avatar
            alt={'Tulsea agent'}
            src={''}
            sx={{
              marginLeft: 2,

              width: { xs: 30, md: 30 },
              height: { xs: 30, md: 30 }
            }}
          />
        </Stack>
        <Stack direction="row" alignItems="center">
          <IconStyle icon={'ant-design:check-circle-filled'} />
          <Typography variant="body2">Followed By</Typography>
          <Avatar
            alt={'Followed By'}
            src={''}
            sx={{
              marginLeft: 2,
              width: { xs: 30, md: 30 },
              height: { xs: 30, md: 30 }
            }}
          />
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'ant-design:check-circle-filled'} />
          <Typography variant="body2">Updated on:</Typography>
          <Typography variant="body2" marginLeft={0.5}>
            {moment(stageUpdatedAt).format('DD/MMMM/YYYY')}
          </Typography>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'ant-design:check-circle-filled'} alignItems="center" />
          <Typography variant="body2">Edited by</Typography>
          <Avatar
            alt={'Edited by'}
            src={''}
            sx={{
              marginLeft: 2,
              width: { xs: 30, md: 30 },
              height: { xs: 30, md: 30 }
            }}
          />

          {/* <Stack
            direction="row"
            justifyContent="center"
            style={{
              backgroundColor: 'red',
              marginLeft: 5,
              width: 30,
              height: 30,
              borderRadius: 30,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <IconStyle icon={'ant-design:check-circle-filled'} />
          </Stack> */}
          <Box
            borderRadius="50%"
            justifyContent="center"
            alignItems="center"
            alignContent="center"
            style={{
              paddingLeft: 1,
              paddingTop: 0.5,
              width: 30,
              height: 30,
              backgroundColor: 'white',
              marginLeft: 5,
              borderStyle: 'dashed',
              borderWidth: 1,
              borderColor: '#D3D3D3'
            }}
          >
            <Icon icon={'carbon:add'} color="#646664" width={25} height={25} onClick={{}} />
          </Box>
        </Stack>
        <Stack direction="row">
          <IconStyle icon={'ic:round-business-center'} />
          <Typography variant="body2">Priority</Typography>
          {priority && (
            <Label
              style={{ marginLeft: 10 }}
              variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
              // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
              color={'success'}
            >
              {sentenceCase(priority)}
            </Label>
          )}
        </Stack>
      </Stack>
    </Card>
  );
}
