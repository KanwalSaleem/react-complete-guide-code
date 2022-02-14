import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Card, CardHeader, Stack } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';

// ----------------------------------------------------------------------

const IconStyle = styled(Iconify)(({ theme }) => ({
  width: 20,
  height: 20,
  marginTop: 1,
  flexShrink: 0,
  marginRight: theme.spacing(2)
}));

// ----------------------------------------------------------------------

ProfileSocialInfo.propTypes = {
  profile: PropTypes.object,
  project: PropTypes.object
};

export default function ProfileSocialInfo({ profile, project }) {
  const { facebookLink, instagramLink, linkedinLink, twitterLink } = profile;
  const { linkedin, facebook, twitter, instagram } = project;

  const SOCIALS = [
    facebook && {
      name: 'Facebook',
      icon: <IconStyle icon={'bx:bxl-imdb'} color="#1877F2" />,
      href: facebook ? facebook : ''
    },

    linkedin && {
      name: 'Linkedin',
      icon: <IconStyle icon={'eva:linkedin-fill'} color="#006097" />,
      href: linkedin ? linkedin : ''
    },
    twitter && {
      name: 'Twitter',
      icon: <IconStyle icon={'eva:twitter-fill'} color="#1C9CEA" />,
      href: twitter ? twitter : ''
    },
    instagram && {
      name: 'Instagram',
      icon: <IconStyle icon={'ant-design:instagram-filled'} color="#D7336D" />,
      href: instagram ? instagram : ''
    }
  ];

  return (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {SOCIALS.map((link) => (
          <Stack key={link.name} direction="row" alignItems="center">
            {link.icon}
            <Link
              component="span"
              variant="body2"
              color="text.primary"
              noWrap
              style={{ cursor: 'pointer' }}
              onClick={() => window.open(`${link.href}`)}
            >
              {link.href}
            </Link>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
