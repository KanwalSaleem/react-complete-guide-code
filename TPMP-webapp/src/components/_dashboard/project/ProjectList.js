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
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../SvgIconStyle';
import Iconify from '../../../components/Iconify';
import tulsiLogo from '../../../assets/favicon-32.png';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

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
  '&:before': {
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)', // Fix on Mobile
    borderTopLeftRadius: theme.shape.borderRadiusMd,
    borderTopRightRadius: theme.shape.borderRadiusMd,
    backgroundColor: alpha(theme.palette.primary.darker, 0.72)
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
// ----------------------------------------------------------------------

function InfoItem(label, value) {
  return (
    <Grid item xs={4}>
      <Typography variant="caption" sx={{ mb: 0.5, color: 'text.secondary', display: 'block' }}>
        {label}
      </Typography>
      {/* <Typography variant="subtitle1">{value}</Typography> */}
      {typeof value === 'string' ? (
        <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{value}</div>
      ) : (
        value?.length > 0 &&
        value.map((item) => {
          return <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{item}</div>;
        })
      )}
    </Grid>
  );
}

ProjectLists.propTypes = {
  user: PropTypes.object.isRequired
};
export default function ProjectLists({ project, ...other }) {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const coverImage = `https://source.unsplash.com/random/200x200?sig=${Math.random()}`;
  // const { name, cover, position, follower, totalPost, avatarUrl, following } = user;
  // const { title, genre, projectType, authorId, commissioningPartnerCompanyId, tulseaAgentId } = project;
  const { title, genre, projectType, authorId, commissioningPartnerCompanyId, tulseaAgentId } = project;

  const authorIdArray = authorId.map((item) => {
    return item.fullName;
  });
  const projectId = project?._id;
  return (
    <Card {...other}>
      <CardMediaStyle
        onClick={() =>
          navigate('/dashboard/project/projectProfile', {
            state: { projectId }
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
          alt={title}
          src={''}
          sx={{
            width: 64,
            height: 64,
            zIndex: 11,
            position: 'absolute',
            transform: 'translateY(-50%)'
          }}
        />
        <CoverImgStyle alt="cover" src={coverImage} />
      </CardMediaStyle>
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
          icon={'ant-design:star-outlined'}
          width={22}
          height={22}
          style={{ paddingRight: 2, paddingLeft: 1, color: 'black' }}
        />

        <Iconify
          icon={'carbon:add'}
          width={26}
          height={26}
          style={{ paddingRight: 2, paddingLeft: 1, color: 'black' }}
        />
        <img src={tulsiLogo} style={{ width: 18, height: 18 }} alt="" />
        {/* {isTulseaClient && <img src={tulsiLogo} style={{ width: 18, height: 18 }} alt="" />} */}
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        style={{ cursor: 'pointer' }}
        sx={{ mt: 6 }}
        onClick={() =>
          navigate('/dashboard/project/projectProfile', {
            state: { projectId }
          })
        }
      >
        {title}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {projectType}
      </Typography>
      <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
        {genre.map((item) => (
          <Typography variant="body2" align="center" sx={{ color: 'text.secondary' }}>
            {item}
          </Typography>
        ))}
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
        <CopyToClipboard
          text={`${title}, ${projectType}, ${genre}`}
          onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
        >
          <Iconify icon={'eva:share-fill'} width={22} height={22} color="black" />
        </CopyToClipboard>
      </Box>

      <Divider />

      <Grid container sx={{ py: 3, textAlign: 'center' }}>
        {InfoItem('Author', authorIdArray)}
        {InfoItem('Com.Partner(Co)', commissioningPartnerCompanyId.title)}
        {InfoItem('Agent', tulseaAgentId)}
      </Grid>
    </Card>
  );
}
