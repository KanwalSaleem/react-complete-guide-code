import PropTypes from 'prop-types';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { Box, Grid, Card, Button, Avatar, Typography, Stack, DialogTitle } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import ProfileAbout from './ProfileAbout';
import ProfilePostCard from '../profile/ProfilePostCard';
import ProfilePostInput from '../profile/ProfilePostInput';
import ProfileSocialInfo from '../profile/ProfileSocialInfo';
import ProfilePrimary from './ProfilePrimary';
import ExternalLinks from './ExternalLinks';
import ProfileAdministrative from './ProfileAdministrative';
import ProjectRequirementInput from './ProjectRequirementInput';
import useAuth from 'src/hooks/useAuth';
import axios from 'axios';
import { APIURL } from '../../../../constants/ApiUrl';
import { DialogAnimate } from '../../../../components/animate';
import { AddNewMember } from '../../Project';
// ----------------------------------------------------------------------

ProjectProfileAttachments.propTypes = {
  followers: PropTypes.array,
  posts: PropTypes.array,
  project: PropTypes.object,
  getProjectData: PropTypes.func
};

export default function ProjectProfileAttachments({ followers, myProfile, posts, project, getProjectData }) {
  const { token } = useAuth();
  const [membersList, setMembersList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const GetMembers = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/project_member?page=1&limit=10&projectId=${project._id}&searchString`,
        method: 'GET',
        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        setMembersList([]);
        throw new Error(response);
      } else {
        setMembersList(response.data.data.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [project._id, token]);

  useEffect(() => {
    GetMembers();
  }, [GetMembers]);

  return (
    <>
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
            <Box>
              {/* <Typography variant="h4" sx={{ mb: 3 }}>
                Followers
              </Typography> */}

              <Grid container spacing={3}>
                {membersList.map((member) => (
                  <Grid key={member._id} item xs={12} md={12}>
                    <FollowerCard member={member} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            <ProjectRequirementInput project={project} getProjectData={getProjectData} />
            <Button variant="contained" onClick={handleOpenModal}>
              Add Members / Company as Attachments
            </Button>
            <DialogAnimate open={openModal} onClose={handleCloseModal}>
              <DialogTitle>Add Document</DialogTitle>
              <AddNewMember onCancel={handleCloseModal} project={project} GetMembers={GetMembers} />
            </DialogAnimate>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
  follower: PropTypes.object
};

function FollowerCard({ member }) {
  const { companyId, contactId, avatarUrl, typeOfAttachment } = member;

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      <Avatar alt={companyId.title} src={companyId?.headerImage} sx={{ width: 48, height: 48 }} />
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {companyId?.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon={'bi:person-fill'} sx={{ width: 18, height: 18, mr: 0.5, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {contactId?.fullName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {typeOfAttachment}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
        <Button size="small" onClick={() => {}} variant={'outlined'} color={'inherit'} style={{ marginRight: 10 }}>
          {'View Deal'}
        </Button>
        <Button size="small" onClick={() => {}} variant={'outlined'} color={'inherit'}>
          {'View Profile'}
        </Button>
      </Box>
      {/* <Button
        size="small"
        onClick={() => setToogle(!toggle)}
        variant={toggle ? 'text' : 'outlined'}
        color={toggle ? 'primary' : 'inherit'}
        startIcon={toggle && <Iconify icon={'eva:checkmark-fill'} />}
      >
        {toggle ? 'Followed' : 'Follow'}
      </Button> */}
    </Card>
  );
}
