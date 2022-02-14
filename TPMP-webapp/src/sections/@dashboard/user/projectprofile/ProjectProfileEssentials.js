import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Grid, Stack, Avatar } from '@mui/material';
//
import ProfileAbout from './ProfileAbout';
import ProjectPostCard from './ProjectPostCard';
import ProjecPostInput from './ProjectPostInput';
import ProfileSocialInfo from '../profile/ProfileSocialInfo';
import ProfilePrimary from './ProfilePrimary';
import ExternalLinks from './ExternalLinks';
import ProfileAdministrative from './ProfileAdministrative';
import useAuth from 'src/hooks/useAuth';
import axios from 'axios';
import { APIURL } from '../../../../constants/ApiUrl';

// import AllContactList from '../../../components/_dashboard/network/contacts/AllContactList';
import AllContactList from '../../../../components/_dashboard/network/contacts/AllContactList';

ProjectProfileEssentials.propTypes = {
  myProfile: PropTypes.object,
  posts: PropTypes.array,
  project: PropTypes.object
};

export default function ProjectProfileEssentials({ myProfile, posts, project }) {
  const { token } = useAuth();
  const [contactsList, setContactsList] = useState([]);
  const [postCommentList, setPostCommentList] = useState([]);

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
  }, [GetPostComment]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Stack spacing={3}>
          <ProfileAbout profile={myProfile} project={project} />
          <ProfilePrimary profile={myProfile} project={project} />
          {/* <ProfileAdministrative profile={myProfile} project={project} /> */}
          <ExternalLinks profile={myProfile} project={project} />
        </Stack>
      </Grid>

      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          <ProjecPostInput project={project} getPostComment={GetPostComment} />
          {postCommentList.length > 0 &&
            postCommentList.map((post) => (
              <ProjectPostCard key={post._id} post={post} project={project} getPostComment={GetPostComment} />
            ))}
        </Stack>
      </Grid>
    </Grid>
  );
}
