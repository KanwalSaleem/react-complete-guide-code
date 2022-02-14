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

import ContactsCompany from '../../../components/_dashboard/network/contacts/ContactsCompany';

// ----------------------------------------------------------------------

export default function Companies(props) {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('basic_details');
  const [isTulseaClient, settulseaClient] = useState(false);
  const [formValues, setFormValues] = useState(props.formValues ? props.formValues : {});
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
        <ContactsCompany
          handleTulseaClient={handleTulseaClient}
          isEdit={props.isEdit}
          isTulseaClient={isTulseaClient}
          setFormValues={setFormValues}
          formValues={formValues}
          id={props.id}
        />
      )
    }
  ];

  return (
    <Page title="User: Account Settings |  ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={props.isEdit ? 'Edit Company' : 'Create a new company'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Network', href: PATH_DASHBOARD.network.contacts },
            { name: props.isEdit ? 'Edit Company' : 'Create Company' }
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
