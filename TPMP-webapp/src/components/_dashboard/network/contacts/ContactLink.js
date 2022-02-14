import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';

import twitterFill from '@iconify/icons-eva/twitter-fill';
import linkedinFill from '@iconify/icons-eva/linkedin-fill';
// import facebookFill from '@iconify/icons-eva/facebook-fill'

import instagramFilled from '@iconify/icons-ant-design/instagram-filled';
import useAuth from 'src/hooks/useAuth';

// material
import { Stack, Card, TextField, InputAdornment, Box, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// redux
// import { useSelector } from '../../../../redux/store';
// utils
import { PATH_DASHBOARD } from '../../../../routes/paths';
import fakeRequest from '../../../../utils/fakeRequest';
import axios from 'axios';
import { APIURL } from '../../../../constants/ApiUrl';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

const SOCIAL_LINKS_OPTIONS = [
  {
    value: 'facebook',
    icon: <Icon icon={'bx:bxl-imdb'} height={26} />
  },
  {
    value: 'instagram',
    icon: <Icon icon={instagramFilled} height={24} />
  },
  {
    value: 'linkedin',
    icon: <Icon icon={linkedinFill} height={24} />
  },
  {
    value: 'twitter',
    icon: <Icon icon={twitterFill} height={24} />
  }
];

// ----------------------------------------------------------------------

export default function ContactLink({ handleChangeTab, setFormValues, formValues, handleBack, editMode }) {
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  // const { myProfile } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      facebook: formValues.facebook || '',
      instagram: formValues.instagram || '',
      linkedin: formValues.linkedin || '',
      twitter: formValues.twitter || ''
    },
    onSubmit: async (values, { setSubmitting }) => {
      //   await fakeRequest(500)

      await setFormValues((prev) => ({ ...prev, ...values }));
      setSubmitting(true);

      values.location = `${formValues.city},${formValues.country}`;
      delete formValues.city;
      delete formValues.country;

      if (formValues.companyData) {
        const parseCompanyData = JSON.parse(formValues.companyData);
        formValues.companyId = parseCompanyData._id;
        formValues.company = parseCompanyData.title;
      }

      delete formValues.companyData;

      delete formValues.pan;

      if (editMode) {
        const id = formValues._id;
        delete formValues._id;
        delete formValues.isDeleted;
        delete formValues.createdAt;
        delete formValues.createdBy;
        delete formValues.__v;
        delete formValues.values;
        delete formValues.updatedAt;
        delete formValues.updatedBy;

        try {
          const response = await fetch(`${APIURL}/contact/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              ...formValues,
              ...values
            }),
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          });
          const resData = await response.json();

          if (!response.ok) {
            throw new Error(resData.message);
          }

          enqueueSnackbar('Save success', { variant: 'success' });
          navigate(PATH_DASHBOARD.network.contactsList);
        } catch (e) {
          console.log(e);
          enqueueSnackbar('Could not Save', { variant: 'error' });
        }
        setSubmitting(false);
      } else {
        try {
          const response = await fetch(`${APIURL}/contact`, {
            method: 'POST',
            body: JSON.stringify({
              ...formValues,
              ...values
            }),
            headers: {
              'x-auth-token': token,
              'Content-Type': 'application/json'
            }
          });
          const resData = await response.json();
          console.log('res', resData);
          if (!response.ok) {
            throw new Error(resData.message);
          }

          // alert(JSON.stringify(values, null, 2));
          enqueueSnackbar('Save success', { variant: 'success' });
          navigate(PATH_DASHBOARD.network.contactsList);
        } catch (e) {
          console.log(e);
          enqueueSnackbar('Could not Save', { variant: 'error' });
        }
        setSubmitting(false);
      }
    }
  });

  const { handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <Card sx={{ p: 3 }}>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3} alignItems="flex-end">
            {SOCIAL_LINKS_OPTIONS.map((link) => (
              <TextField
                key={link.value}
                fullWidth
                {...getFieldProps(link.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start">{link.icon}</InputAdornment>
                }}
              />
            ))}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="outlined" style={{ marginRight: 10 }} onClick={handleBack}>
                Back
              </Button>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Box>
          </Stack>
        </Form>
      </FormikProvider>
    </Card>
  );
}
