import { useRef, useCallback } from 'react';
// @mui
import { Box, Card, Button, TextField, IconButton, Grid, Typography } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { APIURL } from '../../../../constants/ApiUrl';
import Label from '../../../../components/Label';
import { sentenceCase } from 'change-case';
import { useTheme } from '@mui/material/styles';

// ----------------------------------------------------------------------

ProjectRequirementInput.propTypes = {
  project: PropTypes.object,
  getPostComment: PropTypes.func,
  getProjectData: PropTypes.func
};

export default function ProjectRequirementInput({ project, getPostComment, getProjectData }) {
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const postCommentRef = useRef(null);
  const { token } = useAuth();
  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const postHandler = useCallback(async () => {
    try {
      const response = await fetch(`${APIURL}/project/${project._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          projectRequirements: postCommentRef.current.value
        }),
        headers: {
          'x-auth-token': token,
          'Content-Type': 'application/json'
        }
      });
      const resData = await response.json();
      if (resData.statusCode !== 200) {
        throw new Error(resData.message);
      } else {
        postCommentRef.current.value = null;
        enqueueSnackbar('Saved successfully', { variant: 'success' });
        getProjectData();
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, project._id, token]);

  return project.projectRequirements ? (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" noWrap>
          Requirements for the project:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* <Iconify icon={'bi:person-fill'} sx={{ width: 18, height: 18, mr: 0.5, flexShrink: 0 }} /> */}
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {project?.projectRequirements}
          </Typography>
        </Box>
      </Box>
    </Card>
  ) : (
    <Card sx={{ p: 3 }}>
      <TextField
        inputRef={postCommentRef}
        multiline
        fullWidth
        rows={4}
        placeholder="Requirements for the project:"
        sx={{
          '& fieldset': {
            borderWidth: `1px !important`,
            borderColor: (theme) => `${theme.palette.grey[500_32]} !important`
          }
        }}
      />

      <Box
        sx={{
          mt: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex' }}>
          {/* <IconButton size="small" onClick={handleAttach} sx={{ mr: 1 }}>
            <Iconify icon={'ic:round-add-photo-alternate'} width={24} height={24} />
          </IconButton>
          <IconButton size="small" onClick={handleAttach}>
            <Iconify icon={'eva:attach-2-fill'} width={24} height={24} />
          </IconButton> */}
        </Box>

        {/* <Grid>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('writers')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('director')}
          </Label>

          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('producer')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('actor')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('showrunner')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('financing')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('paltform')}
          </Label>
          <Label
            style={{ marginLeft: 10 }}
            variant={theme.palette.mode === 'ghost'}
            // color={(availabilityStatus === 'Unavailable' && 'error') || 'success'}
            color={'info'}
          >
            {sentenceCase('actor')}
          </Label>
        </Grid> */}

        <Button variant="contained" onClick={postHandler}>
          Save
        </Button>
      </Box>

      <input ref={fileInputRef} type="file" style={{ display: 'none' }} />
    </Card>
  );
}
