import { useRef, useCallback } from 'react';
// @mui
import { Box, Card, Button, TextField, IconButton } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import useAuth from '../../../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { APIURL } from '../../../../constants/ApiUrl';
// ----------------------------------------------------------------------

ProjectPostInput.propTypes = {
  project: PropTypes.object,
  getPostComment: PropTypes.func
};

export default function ProjectPostInput({ project, getPostComment }) {
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);
  const postCommentRef = useRef(null);
  const { token } = useAuth();
  const handleAttach = () => {
    fileInputRef.current?.click();
  };

  const postHandler = useCallback(async () => {
    try {
      const response = await fetch(`${APIURL}/contact_comment`, {
        method: 'POST',
        body: JSON.stringify({
          comment: postCommentRef.current.value,
          contactId: project?._id
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
        enqueueSnackbar('Comment posted successfully', { variant: 'success' });
        getPostComment();
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, getPostComment, project?._id, token]);

  return (
    <Card sx={{ p: 3 }}>
      <TextField
        inputRef={postCommentRef}
        multiline
        fullWidth
        rows={4}
        placeholder="Share what you are thinking here..."
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
        <Button variant="contained" onClick={postHandler}>
          Post
        </Button>
      </Box>

      <input ref={fileInputRef} type="file" style={{ display: 'none' }} />
    </Card>
  );
}
