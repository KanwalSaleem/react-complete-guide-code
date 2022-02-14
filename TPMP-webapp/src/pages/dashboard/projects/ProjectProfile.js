import { capitalCase } from 'change-case';
import { useState, useEffect, useCallback } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Tab, Box, Card, Tabs, Container, Typography, Stack, Skeleton, Grid } from '@mui/material';
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
import { ProfileCover, ProfileFollowers } from '../../../sections/@dashboard/user/profile';
import { ProjectProfileEssenials, ProjectProfileAttachments } from '../../../sections/@dashboard/user/projectprofile';
// import { _userAbout, _userFeeds, _userFriends, _userGallery, _userFollowers } from '../../_mock';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APIURL } from '../../../constants/ApiUrl';

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

const SkeletonLoad = (
  <>
    {/* {[...Array(8)].map((_, index) => ( */}
    <Grid>
      <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
    </Grid>
    {/* ))} */}
  </>
);
export default function ProjectProfile(props) {
  const {
    state: { projectId }
  } = useLocation();

  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState();
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

  const GetProjectData = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/project/${projectId}`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        setProject();
        throw new Error(response.data);
      } else {
        setProject(response.data.data);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [projectId, token]);

  useEffect(() => {
    GetProjectData();
  }, [GetProjectData]);

  const PROFILE_TABS = [
    {
      label: 'Essentials',
      value: 'profile',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <ProjectProfileEssenials myProfile={_userAbout} posts={_userFeeds} project={project} />
    },
    {
      label: 'Attachments',
      value: 'projects',
      icon: <Iconify icon={'bx:bxs-group'} width={20} height={20} />,
      component: (
        <ProjectProfileAttachments
          followers={_userFollowers}
          posts={_userFeeds}
          project={project}
          getProjectData={GetProjectData}
        />
      )
    }
  ];

  const onClick = (userData) => {
    navigate('/dashboard/project/editProject', {
      state: { userData }
    });
  };

  return (
    <Page title="Projects">
      {!project ? (
        SkeletonLoad
      ) : (
        <>
          <Container maxWidth={themeStretch ? false : 'lg'}>
            <HeaderBreadcrumbs
              heading="Projects"
              links={[
                { name: 'Dashboard', href: PATH_DASHBOARD.root },
                { name: 'Projects', href: PATH_DASHBOARD.project.projects },
                { name: 'Cards', href: PATH_DASHBOARD.project.projectList },
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
              <ProfileCover myProfile={_userAbout} project={project} userType="project" />

              <TabsWrapperStyle>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ color: 'text.secondary', ml: { md: 17 } }}
                  flexDirection="row"
                  justifyContent="center"
                  alignSelf="center"
                  alignItems="center"
                  // marginLeft={17}
                  // sx={{
                  //   ml: { md: 3 },
                  //   mt: { xs: 1, md: 0 },
                  //   mb: { xs: 0, md: 2 },
                  //   color: 'common.white',
                  //   textAlign: { xs: 'center', md: 'left' }
                  // }}
                >
                  <CopyToClipboard
                    text={`${project?.projectName}, ${project?.type}`}
                    onCopy={() => enqueueSnackbar('Copied to Clipboard', { variant: 'success' })}
                  >
                    <SocialButtton>
                      <Iconify icon={'eva:share-fill'} width={22} height={22} />
                    </SocialButtton>
                  </CopyToClipboard>

                  <SocialButtton onClick={onClick.bind(this, project)}>
                    <Iconify
                      icon={'eva:settings-2-fill'}
                      width={22}
                      height={22}
                      onClick={onClick.bind(this, project)}
                    />
                  </SocialButtton>
                  <SocialButtton onClick={{}}>
                    <Iconify icon={'ant-design:star-outlined'} width={22} height={22} onClick={{}} />
                  </SocialButtton>
                </Typography>

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
        </>
      )}
    </Page>
  );
}
