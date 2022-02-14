import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';

// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, TextField, Typography, FormHelperText, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../../utils/formatNumber';
// import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
//
import Label from '../../../Label';
import { UploadAvatar } from '../../../upload';
import countries from './countries';
import useAuth from 'src/hooks/useAuth';
import axios from 'axios';
import { PRIORITY, TYPEOFCOMPANY } from '../../../../utils/constant';
import { APIURL } from '../../../../constants/ApiUrl';

// ----------------------------------------------------------------------

ContactsCompany.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleChangeTab: PropTypes.func,
  setFormValues: PropTypes.func,
  formValues: PropTypes.object
};

export default function ContactsCompany(props) {
  const { setFormValues, formValues } = props;

  const { isEdit } = props;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Company Name is required'),
    address: Yup.string().required('Company Address is required'),
    companyType: Yup.string().required('Type Of Company is required')
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      title: formValues.title || '',
      email: formValues.email || '',
      phoneNumber: formValues.phoneNumber || '',
      address: formValues.address || '',
      priority: formValues.priority || '',
      companyType: formValues.companyType || '',
      companyGST: formValues.companyGST || '',
      bankAccountNo: formValues.bankAccountNo || '',
      IFSCCode: formValues.IFSCCode || '',
      headerImage: formValues.headerImage || ''
    },
    validationSchema: NewUserSchema,

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      //   await fakeRequest(500)

      setSubmitting(true);

      try {
        if (isEdit === true) {
          const response = await fetch(`${APIURL}/company/${props.id}`, {
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
        } else {
          const response = await fetch(`${APIURL}/company`, {
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

          if (!response.ok) {
            throw new Error(resData.message);
          }
        }

        enqueueSnackbar('Save success', { variant: 'success' });
        navigate(PATH_DASHBOARD.network.companiesList);
      } catch (e) {
        console.log(e);
        enqueueSnackbar('Could not Save', { variant: 'error' });
      }
      setSubmitting(false);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setFieldValue('headerImage', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
      UploadImage(file);
    },
    [setFieldValue]
  );

  const UploadImage = useCallback(
    async (file) => {
      try {
        let base_url = `${APIURL}/helpers/upload-image`;
        const header = new Headers();
        header.append('x-auth-token', token);
        let uploadData = new FormData();

        uploadData.append('dv', file);

        const response = await fetch(base_url, {
          method: 'POST',
          body: uploadData,
          headers: header
        });
        const responseData = await response.json();

        console.log(responseData.data[0].src);
        setFieldValue('headerImage', responseData.data[0].src);

        // }
      } catch (e) {
        console.log(e.message);
      }
    },

    [setFieldValue, token]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ py: 10, px: 3 }}>
              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.headerImage}
                  maxSize={3145728}
                  onDrop={handleDrop}
                  error={Boolean(touched.avatarUrl && errors.avatarUrl)}
                  caption={
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 2,
                        mx: 'auto',
                        display: 'block',
                        textAlign: 'center',
                        color: 'text.secondary'
                      }}
                    >
                      Allowed *.jpeg, *.jpg, *.png, *.gif
                      <br /> max size of {fData(3145728)}
                    </Typography>
                  }
                />
                <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
                  {touched.avatarUrl && errors.avatarUrl}
                </FormHelperText>
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    placeholder="Company Name"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Company Email Address"
                    placeholder="Company Email Address"
                    {...getFieldProps('email')}
                  />
                  <TextField
                    fullWidth
                    label="Company Phone Number"
                    placeholder="Company Phone Number"
                    {...getFieldProps('phoneNumber')}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Company Address"
                    placeholder="Company Address"
                    {...getFieldProps('address')}
                    error={Boolean(touched.address && errors.address)}
                    helperText={touched.address && errors.address}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Company Priority"
                    placeholder="Company Priority"
                    SelectProps={{ native: true }}
                    {...getFieldProps('priority')}
                  >
                    <option value="" />
                    {PRIORITY.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Type Of Company"
                    placeholder="Type Of Company"
                    SelectProps={{ native: true }}
                    {...getFieldProps('companyType')}
                    error={Boolean(touched.companyType && errors.companyType)}
                    helperText={touched.companyType && errors.companyType}
                  >
                    <option value="" />
                    {TYPEOFCOMPANY.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField fullWidth label="Company GST" placeholder="Company GST" {...getFieldProps('companyGST')} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Bank Account No."
                    placeholder="Bank Account No."
                    {...getFieldProps('bankAccountNo')}
                  />
                  <TextField fullWidth label="IFSC Code" placeholder="IFSC Code" {...getFieldProps('IFSCCode')} />
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {isEdit ? 'Edit Company' : 'Save Company'}
                  </LoadingButton>
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
