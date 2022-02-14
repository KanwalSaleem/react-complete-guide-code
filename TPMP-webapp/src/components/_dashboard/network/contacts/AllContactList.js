import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
import facebookFill from '@iconify/icons-eva/facebook-fill';
import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Card, Grid, Avatar, Tooltip, Divider, Typography, IconButton } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';
//
import SvgIconStyle from '../../../SvgIconStyle';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Iconify from '../../../../components/Iconify';
import logo from '../../../../assets/favicon-32.png';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
// ----------------------------------------------------------------------

const SOCIALS = [
  {
    name: 'Facebook',
    icon: <Icon icon={facebookFill} width={20} height={20} color="#1877F2" />
  },
  {
    name: 'Instagram',
    icon: <Icon icon={instagramFilled} width={20} height={20} color="#D7336D" />
  },
  {
    name: 'Linkedin',
    icon: <Icon icon={linkedinFill} width={20} height={20} color="#006097" />
  },
  {
    name: 'Twitter',
    icon: <Icon icon={twitterFill} width={20} height={20} color="#1C9CEA" />
  }
];

const CardMediaStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  justifyContent: 'center',
  paddingTop: 'calc(100% * 9 / 16)',
  cursor: 'pointer',
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
    // backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd
    // backgroundColor: alpha(theme.palette.primary.darker, 0.72),
  }
}));

const CoverImgStyle = styled('img')({
  top: 0,
  zIndex: 8,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

function InfoItem(number, key) {
  return (
    <Grid item xs={4}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', display: 'block' }}>
        {key}
      </Typography>
      <Typography variant="subtitle1">
        {/* {fShortenNumber(number)}   */}
        {number}
      </Typography>
    </Grid>
  );
}

// AllContactList.propTypes = {
//   user: PropTypes.object.isRequired
// };

const SocialButtton = styled('button')(({ theme }) => ({
  paddingRight: 8,
  paddingLeft: 8,
  flexDirection: 'row',
  backgroundColor: theme.palette.background.paper,
  borderColor: theme.palette.background.paper,
  borderBlockColor: theme.palette.background.paper,

  borderWidth: 0

  // [theme.breakpoints.up('sm')]: {
  //   justifyContent: 'center'
  // }
}));

export default function AllContactList({ project, ...other }) {
  const companyCoverImage = `https://i.pinimg.com/736x/80/fe/38/80fe38ae1ac694f04439a93dd3b8bee7.jpg`;
  const coverImage = `https://source.unsplash.com/random/200x200?sig=${Math.random()}`;

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const {
    fullName,
    designation,
    bucket,
    company,
    pod,
    roleSkillSet,
    email,
    phoneNumber,
    profilePic,
    headerImage,
    isTulseaClient
  } = project;

  // const { name, cover, position, follower, totalPost, avatarUrl, following } = user;
  return (
    <Card {...other}>
      <CardMediaStyle
        onClick={() =>
          navigate(project?.fullName ? '/dashboard/network/ContactProfile' : '/dashboard/network/CompaniesProfile', {
            state: { project }
          })
        }
      >
        <SvgIconStyle
          color="paper"
          src="/static/icons/shape-avatar.svg"
          sx={{
            width: 144,
            height: 62,
            zIndex: 10,
            bottom: -26,
            position: 'absolute'
          }}
        />

        <Avatar
          alt={project?.fullName ? fullName : project?.title}
          src={project?.fullName ? profilePic : headerImage}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
          onClick={() => {}}
        />
        <CoverImgStyle
          alt="cover"
          // src={project?.fullName ? headerImage : companyCoverImage}
          src={coverImage}
        />
      </CardMediaStyle>

      {project?.fullName && (
        <Typography
          variant="body2"
          sx={{ color: 'text.secondary' }}
          flexDirection="row"
          width="100%"
          display="flex"
          paddingLeft={1}
          paddingTop={0.5}
          alignItems="center"
        >
          <Iconify
            icon={'clarity:star-solid'}
            width={22}
            height={22}
            style={{ paddingRight: 2, paddingLeft: 2, color: '#E1D713' }}
          />

          <Iconify
            icon={'carbon:add'}
            width={25}
            height={25}
            style={{ paddingRight: 2, paddingLeft: 2, color: 'black' }}
          />
          {isTulseaClient && <img src={logo} style={{ width: 18, height: 18 }} alt="" />}
        </Typography>
      )}

      <Typography
        variant="subtitle1"
        align="center"
        style={{ cursor: 'pointer' }}
        sx={{ mt: 6 }}
        onClick={() =>
          navigate(project?.fullName ? '/dashboard/network/ContactProfile' : '/dashboard/network/CompaniesProfile', {
            state: { project }
          })
        }
      >
        {project?.fullName ? fullName : project?.title}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {project?.fullName ? designation | bucket | company | roleSkillSet : project?.companyType}
      </Typography>

      <Typography
        variant="body2"
        align="center"
        sx={{ color: 'text.secondary' }}
        flexDirection="row"
        justifyContent="center"
        paddingTop={1}
        paddingBottom={3}
      >
        {project?.fullName && (
          <>
            <CopyToClipboard
              text={phoneNumber}
              onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
            >
              <SocialButtton>
                <Iconify icon={'bx:bxs-phone'} width={22} height={22} />
              </SocialButtton>
            </CopyToClipboard>

            <CopyToClipboard text={email} onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}>
              <SocialButtton>
                <Iconify icon={'eva:email-fill'} width={22} height={22} />
              </SocialButtton>
            </CopyToClipboard>
          </>
        )}

        <CopyToClipboard
          text={
            project?.fullName
              ? `${fullName}, ${designation}, ${bucket}, ${company}, ${roleSkillSet}`
              : `${project?.title}, ${project?.companyType}`
          }
          onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
        >
          <SocialButtton>
            <Iconify icon={'eva:share-fill'} width={22} height={22} />
          </SocialButtton>
        </CopyToClipboard>
      </Typography>

      {/* <Box sx={{ textAlign: 'center', mt: 2, mb: 2.5 }}>
                {SOCIALS.map((social) => (
                    <Tooltip key={social.name} title={social.name}>
                        <IconButton>{social.icon}</IconButton>
                    </Tooltip>
                ))}
            </Box> */}

      <Divider />
      {project?.fullName ? (
        <Grid container sx={{ py: 3, textAlign: 'center' }}>
          {InfoItem(project?.deals ? project?.deals : '-', 'Deals')}
          {InfoItem(project?.projects ? project?.projects : '-', 'Projects')}
          {InfoItem(project?.pod ? project?.pod : '-', 'Pod')}
        </Grid>
      ) : (
        <Grid container sx={{ justifyContent: 'space-between', py: 3, textAlign: 'center' }}>
          {InfoItem(project?.titles ? project?.titles : '-', 'Titles')}
          {InfoItem(project?.priority ? project?.priority : '-', 'Priority')}
        </Grid>
      )}
    </Card>
  );
}
