import { capitalCase } from 'change-case';
import { useState, useCallback, useEffect } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container, Typography, Stack } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useAuth from '../../../hooks/useAuth';
import useSettings from '../../../hooks/useSettings';
import { useLocation } from 'react-router-dom';
// _mock_
import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../../_mock';
// components
import Page from '../../../components/Page';
import Iconify from '../../../components/Iconify';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import {
  Projects,
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileDocs,
  ProfileFollowers
} from '../../../sections/@dashboard/user/profile';
// import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { APIURL } from '../../../constants/ApiUrl';
import axios from 'axios';
import ProjectLists from 'src/components/_dashboard/project/ProjectList';

const TabsWrapperStyle = styled('div')(({ theme }) => ({
  zIndex: 9,
  bottom: 0,
  width: '100%',

  display: 'flex',
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  [theme.breakpoints.up('sm')]: {
    justifyContent: 'center'
  },
  [theme.breakpoints.up('md')]: {
    justifyContent: 'space-between',
    paddingRight: theme.spacing(3)
  }
}));

const SocialIcon = styled('div')(({ theme }) => ({
  justifyContent: 'center',
  alignSelf: 'center',
  alignItems: 'center',
  flexDirection: 'row',
  paddingLeft: 150

  // backgroundColor: theme.palette.background.paper,

  // [theme.breakpoints.up('sm')]: {
  //   justifyContent: 'center'
  // }
}));
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

export default function CompaniesProfile(props) {
  const [projectsList, setProjectList] = useState([]);
  const { token } = useAuth();
  const {
    state: { project }
  } = useLocation();
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const { themeStretch } = useSettings();
  const { user } = useAuth();

  const [currentTab, setCurrentTab] = useState('profile');
  const [findFriends, setFindFriends] = useState('');

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const handleFindFriends = (value) => {
    setFindFriends(value);
  };

  const PROFILE_TABS = [
    {
      label: 'Profile & Contacts',
      value: 'profile',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <Profile myProfile={_userAbout} posts={_userFeeds} project={project} userType="company" />
    },
    {
      label: 'Projects',
      value: 'projects',
      icon: <Iconify icon={'eva:heart-fill'} width={20} height={20} />,
      component: <Projects projectsList={projectsList} />
    }
  ];

  const onClick = (userData) => {
    navigate('/dashboard/network/EditCompany', {
      state: { userData }
    });
  };
  const GetProjectList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/project?page=1&limit=1000&searchString&projectSource=&projectType&genre&stage&authorId&tulseaAgentId&commissioningPartnerCompanyId=${project._id}`,
        // url: `${APIURL}/project?page=1&limit=1000&searchString&projectSource=&projectType&genre&stage&authorId&tulseaAgentId&companyId=${project._id}`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data.data);
      }

      setProjectList(response.data.data.data);
    } catch (e) {
      console.log(e.message);
    }
  }, [project._id, token]);

  useEffect(() => {
    GetProjectList();
  }, [GetProjectList]);

  return (
    <Page title="Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Profile"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Network', href: PATH_DASHBOARD.network.contacts },
            { name: 'Cards', href: PATH_DASHBOARD.network.companiesList },
            { name: project.title }
          ]}
        />

        <Card
          sx={{
            mb: 3,
            height: 280,
            position: 'relative'
          }}
        >
          <ProfileCover myProfile={_userAbout} project={project} />

          <TabsWrapperStyle>
            <Typography
              variant="body2"
              align="center"
              sx={{ color: 'text.secondary' }}
              flexDirection="row"
              justifyContent="center"
              alignSelf="center"
              alignItems="center"
              marginLeft={17}
            >
              <CopyToClipboard
                text={project?.phoneNumber}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <SocialButtton>
                  <Iconify icon={'bx:bxs-phone'} width={22} height={22} />
                </SocialButtton>
              </CopyToClipboard>

              <CopyToClipboard
                text={project?.email}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <SocialButtton>
                  <Iconify icon={'eva:email-fill'} width={22} height={22} />
                </SocialButtton>
              </CopyToClipboard>
              <CopyToClipboard
                text={`${project?.title}, ${project?.companyType}`}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <SocialButtton>
                  <Iconify icon={'eva:share-fill'} width={22} height={22} />
                </SocialButtton>
              </CopyToClipboard>

              <SocialButtton onClick={onClick.bind(this, project)}>
                <Iconify icon={'eva:settings-2-fill'} width={22} height={22} onClick={onClick.bind(this, project)} />
              </SocialButtton>
            </Typography>

            {/* <Box sx={{ textAlign: 'center', mt: 1, mb: 2, ml: 17 }}>
              <CopyToClipboard
                text={project?.phoneNumber}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <Iconify icon={'bx:bxs-phone'} width={22} height={22} style={{ marginLeft: 3, marginRight: 3 }} />
              </CopyToClipboard>

              <CopyToClipboard
                text={project?.email}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <Iconify icon={'eva:email-fill'} width={22} height={22} style={{ marginLeft: 3, marginRight: 3 }} />
              </CopyToClipboard>
              <CopyToClipboard
                text={`${project?.title}, ${project?.companyType}`}
                onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
              >
                <Iconify icon={'eva:share-fill'} width={22} height={22} style={{ marginLeft: 3, marginRight: 3 }} />
              </CopyToClipboard>

              <Iconify
                icon={'eva:settings-2-fill'}
                width={22}
                height={22}
                onClick={onClick.bind(this, project)}
                style={{ marginLeft: 3, marginRight: 3 }}
              />
            </Box> */}

            <Tabs
              value={currentTab}
              scrollButtons="auto"
              variant="scrollable"
              allowScrollButtonsMobile
              onChange={(e, value) => handleChangeTab(value)}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab disableRipple key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
              ))}
            </Tabs>
          </TabsWrapperStyle>
        </Card>

        {PROFILE_TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Container>
    </Page>
  );
}
