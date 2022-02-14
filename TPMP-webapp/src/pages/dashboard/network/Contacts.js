import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useState, useEffect } from 'react';
import bellFill from '@iconify/icons-eva/bell-fill';
import shareFill from '@iconify/icons-eva/share-fill';
import roundVpnKey from '@iconify/icons-ic/round-vpn-key';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
// material
import { Container, Tab, Box, Tabs, Stack } from '@mui/material';
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
// ----------------------------------------------------------------------

export default function UserAccount({ contactValues, editMode = false }) {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('basic_details');
  const [isTulseaClient, settulseaClient] = useState(contactValues?.isTulseaClient ? true : false);
  const [formValues, setFormValues] = useState(contactValues ? contactValues : {});
  // const dispatch = useDispatch();

  // useEffect(() => {
  //     dispatch(getCards());
  //     dispatch(getAddressBook());
  //     dispatch(getInvoices());
  //     dispatch(getNotifications());
  //     dispatch(getProfile());
  // }, [dispatch]);
  const handleTulseaClient = () => {
    settulseaClient((prev) => !prev);
  };

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  let ACCOUNT_TABS = [
    {
      value: 'basic_details',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: (
        <ContactGeneral
          handleTulseaClient={handleTulseaClient}
          isEdit={false}
          isTulseaClient={isTulseaClient}
          setFormValues={setFormValues}
          handleChangeTab={handleChangeTab.bind(this, null, 'additional_details')}
          formValues={formValues}
          editMode={editMode}
        />
      )
    },
    {
      value: 'additional_details',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: (
        <ContactExtended
          setFormValues={setFormValues}
          handleChangeTab={handleChangeTab.bind(this, null, 'client')}
          formValues={formValues}
          editMode={editMode}
          isEdit={editMode}
        />
      )
    },
    {
      value: 'client',
      icon: <Icon icon={bellFill} width={20} height={20} />,
      component: (
        <ContactClient
          setFormValues={setFormValues}
          handleChangeTab={handleChangeTab.bind(this, null, 'social_links')}
          handleBack={handleChangeTab.bind(this, null, 'additional_details')}
          formValues={formValues}
          editMode={editMode}
        />
      )
    },
    {
      value: 'social_links',
      icon: <Icon icon={shareFill} width={20} height={20} />,
      component: (
        <ContactLink
          setFormValues={setFormValues}
          formValues={formValues}
          handleBack={handleChangeTab.bind(this, null, 'client')}
          editMode={editMode}
          //   handleChangeTab={handleChangeTab.bind(
          //     this,
          //     null,
          //     'additional_details',
          //   )}
        />
      )
    }
    // {
    //     value: 'change_password',
    //     icon: <Icon icon={roundVpnKey} width={20} height={20} />,
    //     component: <AccountChangePassword />
    // }
  ];

  if (isTulseaClient === false) {
    ACCOUNT_TABS = [
      {
        value: 'basic_details',
        icon: <Icon icon={roundAccountBox} width={20} height={20} />,
        component: (
          <ContactGeneral
            handleTulseaClient={handleTulseaClient}
            isEdit={false}
            setFormValues={setFormValues}
            handleChangeTab={handleChangeTab.bind(this, null, 'additional_details')}
            formValues={formValues}
            editMode={editMode}
          />
        )
      },
      {
        value: 'additional_details',
        icon: <Icon icon={roundReceipt} width={20} height={20} />,
        component: (
          <ContactExtended
            setFormValues={setFormValues}
            handleChangeTab={handleChangeTab.bind(this, null, 'social_links')}
            handleBack={handleChangeTab.bind(this, null, 'basic_details')}
            formValues={formValues}
            editMode={editMode}
          />
        )
      },
      {
        value: 'social_links',
        icon: <Icon icon={shareFill} width={20} height={20} />,
        component: (
          <ContactLink
            formValues={formValues}
            setFormValues={setFormValues}
            handleChangeTab={handleChangeTab}
            handleBack={handleChangeTab.bind(this, null, 'additional_details')}
            editMode={editMode}
          />
        )
      }
    ];
  }
  return (
    <Page title="User: Account Settings |  ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={editMode ? 'Edit Contact' : 'Create a new contact'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Network', href: PATH_DASHBOARD.network.contacts },
            { name: editMode ? 'Edit Contact' : 'Create Contact' }
          ]}
        />

        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disabled
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>

          {ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>
      </Container>
    </Page>
  );
}
