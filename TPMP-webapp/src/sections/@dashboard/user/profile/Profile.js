import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid, Stack } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from './ProfilePostCard';
import ProfilePostInput from './ProfilePostInput';
import ProfileFollowInfo from './ProfileFollowInfo';
import ProfileSocialInfo from './ProfileSocialInfo';
import useAuth from 'src/hooks/useAuth';
import axios from 'axios';
import { APIURL } from '../../../../constants/ApiUrl';
// import AllContactList from '../../../components/_dashboard/network/contacts/AllContactList';
import AllContactList from '../../../../components/_dashboard/network/contacts/AllContactList';

Profile.propTypes = {
  myProfile: PropTypes.object,
  posts: PropTypes.array,
  project: PropTypes.object,
  userType: PropTypes.string
};

export default function Profile({ myProfile, posts, project, userType }) {
  const { token } = useAuth();
  const [contactsList, setContactsList] = useState([]);
  const [postCommentList, setPostCommentList] = useState([]);

  const GetContactList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/contact?page=1000&limit=0&searchString&companyId=${project?._id}`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        throw new Error(response);
      }

      setContactsList(response.data.data.data);
    } catch (e) {
      console.log(e.message);
    }
  }, [project?._id, token]);

  const GetPostComment = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/contact_comment?page=1&limit=1000&searchString&contactId=${project?._id}`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        setPostCommentList([]);
        throw new Error(response);
      } else {
        setPostCommentList(response.data.data.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [project?._id, token]);

  useEffect(() => {
    GetPostComment();
    GetContactList();
  }, [GetContactList, GetPostComment]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileFollowInfo project={project} />
          <ProfileAbout profile={myProfile} project={project} />
          {project?.fullName && <ProfileSocialInfo profile={myProfile} project={project} />}
        </Stack>
      </Grid>

      {userType === 'company' ? (
        <Grid container spacing={3} item xs={12} md={12} marginTop={3}>
          {contactsList.map((project, index) => (
            <Grid
              key={project._id}
              item
              xs={12}
              sm={6}
              md={6}
              lg={4}
              // onClick={() =>
              //   navigate('/dashboard/network/ContactProfile', {
              //     state: { project }
              //   })
              // }
            >
              <AllContactList project={project} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <ProfilePostInput project={project} getPostComment={GetPostComment} />
            {postCommentList.length > 0 &&
              postCommentList.map((post) => (
                <ProfilePostCard key={post._id} post={post} project={project} getPostComment={GetPostComment} />
              ))}
          </Stack>
        </Grid>
      )}
    </Grid>
  );
}
