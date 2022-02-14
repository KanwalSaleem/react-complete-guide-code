import PropTypes from 'prop-types';
import { useState, useRef, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Link,
  Card,
  Stack,
  Paper,
  Avatar,
  Checkbox,
  TextField,
  Typography,
  CardHeader,
  IconButton,
  AvatarGroup,
  InputAdornment,
  FormControlLabel,
  Switch
} from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fShortenNumber } from '../../../../utils/formatNumber';
// components
// import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import MyAvatar from '../../../../components/MyAvatar';
import EmojiPicker from '../../../../components/EmojiPicker';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { project } from 'deck.gl';
import { APIURL } from '../../../../constants/ApiUrl';
// ----------------------------------------------------------------------

ProfilePostCard.propTypes = {
  post: PropTypes.object,
  project: PropTypes.object,
  getPostComment: PropTypes.object
};

export default function ProfilePostCard({ post, project, getPostComment }) {
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  const { user } = useAuth();
  const commentInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isLiked, setLiked] = useState(post?.isLiked);
  // const [likes, setLikes] = useState(post.personLikes.length);
  const [message, setMessage] = useState('');
  // const hasComments = post.comments.length > 0;

  const handleLike = () => {
    setLiked(true);
    // setLikes((prevLikes) => prevLikes + 1);
  };

  const handleUnlike = () => {
    setLiked(false);
    // setLikes((prevLikes) => prevLikes - 1);
  };

  const handleChangeMessage = (value) => {
    setMessage(value);
  };

  const handleClickAttach = () => {
    fileInputRef.current?.click();
  };

  const handleClickComment = () => {
    commentInputRef.current?.focus();
  };

  const commentHandler = useCallback(async () => {
    try {
      const response = await fetch(`${APIURL}/contact_comment`, {
        method: 'POST',
        body: JSON.stringify({
          comment: commentInputRef.current.value,
          contactId: project?._id,
          masterCommentId: post?._id
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
        commentInputRef.current.value = null;
        enqueueSnackbar('Comment posted successfully', { variant: 'success' });
        getPostComment();
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  }, [enqueueSnackbar, getPostComment, post?._id, project?._id, token]);

  const handlePinned = useCallback(async () => {
    try {
      const response = await fetch(`${APIURL}/contact_comment/${post?._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          isPinned: !post?.isPinned
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
        getPostComment();
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [post?._id, post?.isPinned, token]);

  return (
    <Card>
      <CardHeader
        disableTypography
        avatar={<MyAvatar />}
        title={
          <Link to="#" variant="subtitle2" color="text.primary" component={RouterLink}>
            {user?.firstName} {user?.lastName}
          </Link>
        }
        subheader={
          <Typography variant="caption" sx={{ display: 'block', color: 'text.secondary' }}>
            {fDate(post.createdAt)}
          </Typography>
        }
        action={
          <Stack flexDirection="row" alignItems="center">
            <Typography variant="body1">Pinned</Typography>
            <Switch checked={post?.isPinned} onChange={handlePinned} />
            <IconButton>
              <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
            </IconButton>
          </Stack>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        <Typography variant="body1">{post?.comment}</Typography>

        {post?.subComments?.length > 0 && (
          <Stack spacing={1.5}>
            {post?.subComments.map((comment) => (
              <Stack key={comment._id} direction="row" spacing={2}>
                {/* <Avatar alt={comment?.author?.name} src={comment?.author?.avatarUrl} /> */}
                <MyAvatar />
                <Paper sx={{ p: 1.5, flexGrow: 1, bgcolor: 'background.neutral' }}>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ mb: 0.5 }}
                  >
                    <Typography variant="subtitle2">
                      {' '}
                      {user?.firstName} {user?.lastName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                      {fDate(comment.createdAt)}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {comment.comment}
                  </Typography>
                </Paper>
              </Stack>
            ))}
          </Stack>
        )}

        <Stack direction="row" alignItems="center">
          <MyAvatar />

          <TextField
            fullWidth
            size="small"
            inputRef={commentInputRef}
            placeholder="Write a comment…"
            onChange={(event) => handleChangeMessage(event.target.value)}
            InputProps={
              {
                // endAdornment: (
                //   <InputAdornment position="end">
                //     <IconButton size="small" onClick={handleClickAttach}>
                //       <Iconify
                //         icon={'ic:round-add-photo-alternate'}
                //         width={24}
                //         height={24}
                //       />
                //     </IconButton>
                //     {/* <EmojiPicker
                //       alignRight
                //       value={message}
                //       setValue={setMessage}
                //     /> */}
                //   </InputAdornment>
                // ),
              }
            }
            sx={{
              ml: 2,
              mr: 1,
              '& fieldset': {
                borderWidth: `1px !important`,
                borderColor: (theme) => `${theme.palette.grey[500_32]} !important`
              }
            }}
          />
          <IconButton onClick={commentHandler}>
            <Iconify icon={'ic:round-send'} width={24} height={24} />
          </IconButton>
          {/* <input type="file" ref={fileInputRef} style={{ display: 'none' }} /> */}
        </Stack>
      </Stack>
    </Card>
  );
}
