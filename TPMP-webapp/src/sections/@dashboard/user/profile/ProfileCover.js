import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography, Avatar } from '@mui/material';
// utils
import cssStyles from '../../../../utils/cssStyles';
// hooks
import useAuth from '../../../../hooks/useAuth';
// components
import MyAvatar from '../../../../components/MyAvatar';
import Image from '../../../../components/Image';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  '&:before': {
    // ...cssStyles().bgBlur({blur: 2, color: theme.palette.primary.darker}),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute'
  }
}));

const InfoStyle = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(5),
  [theme.breakpoints.up('md')]: {
    right: 'auto',
    display: 'flex',
    alignItems: 'center',
    left: theme.spacing(3),
    bottom: theme.spacing(3)
  }
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  myProfile: PropTypes.object,
  userType: PropTypes.string
};

const companyCoverImage = `https://i.pinimg.com/736x/80/fe/38/80fe38ae1ac694f04439a93dd3b8bee7.jpg`;

export default function ProfileCover({ myProfile, project, userType }) {
  const { user } = useAuth();
  const { position, cover } = myProfile;
  const { profilePic, headerImage } = project;
  const coverImage = `https://source.unsplash.com/random/200x200?sig=${Math.random()}`;
  return (
    <RootStyle>
      <InfoStyle>
        {/* <MyAvatar
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 128 },
            height: { xs: 80, md: 128 },

          }} */}
        {userType !== 'project' && (
          <Avatar
            alt={'Profile'}
            src={project?.fullName ? profilePic : headerImage}
            sx={{
              mx: 'auto',
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'common.white',
              width: { xs: 80, md: 128 },
              height: { xs: 80, md: 128 }
            }}
          />
        )}
        {/* /> */}
        {userType === 'project' ? (
          <Box
            sx={{
              // ml: { md: 3 },
              // mt: { xs: 1, md: 0 },
              mb: { xs: 0, md: 5 },
              color: 'common.white',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Typography variant="h4">{project?.title}</Typography>
            <Typography sx={{ opacity: 0.72 }}>{project?.type}</Typography>
            <Typography sx={{ opacity: 0.72 }}>{project?.genre}</Typography>
          </Box>
        ) : (
          <Box
            sx={{
              ml: { md: 3 },
              mt: { xs: 1, md: 0 },
              mb: { xs: 0, md: 2 },
              color: 'common.white',
              textAlign: { xs: 'center', md: 'left' }
            }}
          >
            <Typography variant="h4">{project?.fullName ? project?.fullName : project?.title}</Typography>
            <Typography sx={{ opacity: 0.72 }}>
              {project?.fullName ? project?.designation : project?.companyType}
            </Typography>
            <Typography sx={{ opacity: 0.72 }}>
              {' '}
              {project?.fullName ? project?.company : project?.companyGST}
            </Typography>
          </Box>
        )}
      </InfoStyle>
      <Image
        alt="profile cover"
        // src={project?.fullName ? headerImage : companyCoverImage}
        src={coverImage}
        sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />
    </RootStyle>
  );
}
