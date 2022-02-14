import { Icon } from '@iconify/react';

import { useState, useEffect, useCallback } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';

import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import plusFill from '@iconify/icons-eva/plus-fill';
import useAuth from 'src/hooks/useAuth';
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// material
import { Container, Grid, Skeleton, Button, IconButton } from '@mui/material';
// redux
// import { useDispatch } from '../../redux/store';
// import { getCards, getProfile, getInvoices, getAddressBook, getNotifications } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

import ContactGeneral from '../../../components/_dashboard/network/contacts/ContactGeneral';
import ContactExtended from '../../../components/_dashboard/network/contacts/ContactExtended';
import ContactClient from '../../../components/_dashboard/network/contacts/ContactClient';
import ContactLink from '../../../components/_dashboard/network/contacts/ContactLink';
import AllContactList from '../../../components/_dashboard/network/contacts/AllContactList';
import UserList from '../../../pages/dashboard/UserList';
import { UserListToolbar } from '../../../components/_dashboard/user/list';
import { APIURL } from '../../../constants/ApiUrl';
import ProjectList from '../../../components/_dashboard/project/ProjectList';

// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);
export default function AllContacts() {
  const [selected, setSelected] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('basic_details');
  const [listType, setListType] = useState('card');
  const [contactsList, setContactsList] = useState([]);

  const [filterName, setFilterName] = useState('');
  const [searchData, setSearchData] = useState([]);

  // const dispatch = useDispatch();

  // useEffect(() => {
  //     dispatch(getCards());
  //     dispatch(getAddressBook());
  //     dispatch(getInvoices());
  //     dispatch(getNotifications());
  //     dispatch(getProfile());
  // }, [dispatch]);

  const ACCOUNT_TABS = [
    {
      value: 'basic_details',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <ContactGeneral />
    },
    {
      value: 'additional_details',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <ContactExtended />
    },
    {
      value: 'client',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: <ContactClient />
    },
    {
      value: 'social_links',
      icon: <Icon icon={shareFill} width={20} height={20} />,
      component: <ContactLink />
    }
    // {
    //     value: 'change_password',
    //     icon: <Icon icon={roundVpnKey} width={20} height={20} />,
    //     component: <AccountChangePassword />
    // }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const GetContactList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/contact?page=1&limit=1000&searchString`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        throw new Error(response);
      }
      // console.log(response)

      setContactsList(response.data.data.data);
      setSearchData(response.data.data.data);
      // const resData = await response.json()
      // if (!response.ok) {
      //   throw new Error(resData.message)
      // }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    if (event.target.value) {
      setContactsList(
        contactsList.filter((item) => item.fullName.toLowerCase().includes(event.target.value.toLowerCase()))
      );
    } else {
      setContactsList(searchData);
    }
  };

  useEffect(() => {
    GetContactList();
  }, [GetContactList]);

  return (
    <Page title="User: Account Settings |  ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={listType === 'card' ? 'Contact Cards' : 'Contact List'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Network', href: PATH_DASHBOARD.network.contacts },
            { name: listType === 'card' ? 'Contact Cards' : 'Contact List' }
          ]}
          action={
            <>
              <IconButton
                style={{ marginRight: 10 }}
                onClick={() => {
                  setListType((prev) => {
                    if (prev === 'card') {
                      return 'list';
                    }
                    return 'card';
                  });
                }}
              >
                <Icon
                  icon={listType === 'card' ? 'entypo:resize-full-screen' : 'bi:grid-3x2-gap-fill'}
                  width={20}
                  height={20}
                />
              </IconButton>

              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.network.contacts}
                startIcon={<Icon icon={plusFill} />}
              >
                New User
              </Button>
            </>
          }
        />

        {listType === 'card' && (
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            width={'100%'}
          />
        )}
        {listType === 'card' ? (
          <Grid container spacing={3}>
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
            {!contactsList.length && SkeletonLoad}
          </Grid>
        ) : (
          <>{contactsList.length > 0 && <UserList userList={contactsList} getContactList={GetContactList} />}</>
        )}
      </Container>
    </Page>
  );
}
