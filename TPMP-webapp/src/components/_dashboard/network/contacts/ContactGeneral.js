import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
import DateTimePicker from '@mui/lab/DateTimePicker';

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

UserNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleChangeTab: PropTypes.func,
  setFormValues: PropTypes.func,
  formValues: PropTypes.object,
  editMode: PropTypes.bool
};

export default function UserNewForm(props) {
  const [companiesList, setCompaniesList] = useState([]);

  const {
    handleTulseaClient,
    isEdit,
    isTulseaClient = false,
    handleChangeTab,
    setFormValues,
    formValues,
    editMode
  } = props;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();

  const NewUserSchema = Yup.object().shape({
    fullName: Yup.string().required('Full Name is required'),
    email: Yup.string().required('Email is required').email(),
    phoneNumber: Yup.string(),
    // personalAddress: Yup.string(),
    city: Yup.string().required('City is required'),
    country: Yup.string().required('Country is required'),
    // country: Yup.string().required('country is required'),
    companyData: Yup.string().required('Company is required'),
    alternatePhoneNo: Yup.string()
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // role: Yup.string().required('Role Number is required'),
    // avatarUrl: Yup.mixed().required('Avatar is required'),

    // billingAddress: Yup.string(),
    // bankAccountNo: Yup.string(),
    // personalGST: Yup.string(),
    // IFSCCode: Yup.string(),
  });

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      profilePic: formValues.profilePic || '',
      fullName: formValues.fullName || '',
      email: formValues.email || '',
      phoneNumber: formValues.phoneNumber || '',
      country: formValues.location ? formValues.location.split(',')[1] : formValues.country || '',
      city: formValues.location ? formValues.location.split(',')[0] : formValues.city || '',

      //   zipCode: '',
      //   avatarUrl: null,
      isTulseaClient: isTulseaClient,
      // companyData: formValues.companyData || '',
      companyData: formValues.companyId ? JSON.stringify({ _id: formValues.companyId, title: formValues.company }) : '',

      //   role: '',
      // companyId: formValues.companyId || '',

      //   shortBiography: '',
      alternatePhoneNo: formValues.alternatePhoneNo || '',
      birthday: formValues.birthday || new Date().toDateString()
      // personalAddress: formValues.personalAddress || ''

      // billingAddress: formValues.billingAddress || '',
      // personalGST: formValues.personalGST || '',
      // IFSCCode: formValues.IFSCCode || '',
      // pan: '',
      // bankAccountNo: formValues.bankAccountNo || ''
    },

    validationSchema: NewUserSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        // await fakeRequest(500);

        // resetForm()
        setFormValues((prev) => ({ ...prev, ...values }));

        handleChangeTab();
        // setSubmitting(false)
        // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
        //   variant: 'success',
        // })
        // navigate(PATH_DASHBOARD.user.list)
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;
  const GetCompaniesList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/company?page=1&limit=1000&searchString`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        throw new Error(response);
      }
      if (response?.data?.data?.data.length > 0) {
        const companyListSelect = response?.data?.data?.data.map((item) => {
          return { _id: item._id, title: item.title };
        });

        setCompaniesList(companyListSelect);
      } else {
        // const defaultCompanies = [
        //   { _id: 1, title: 'Freelancer' },
        //   { _id: 2, title: 'Tulsea' },
        //   { _id: 3, title: 'Talent' }
        // ];
        setCompaniesList([]);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

  useEffect(() => {
    GetCompaniesList();
  }, [GetCompaniesList]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      if (file) {
        setFieldValue('profilePic', {
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFieldValue('headerImage', 'https://i.pinimg.com/originals/fb/c2/a9/fbc2a961bfd0e7b5673a7922cb848cdb.jpg');

        UploadImage(file);
      }
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
        setFieldValue('profilePic', responseData.data[0].src);

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
              {isEdit && (
                <Label
                  color={values.status !== 'active' ? 'error' : 'success'}
                  sx={{
                    textTransform: 'uppercase',
                    position: 'absolute',
                    top: 24,
                    right: 24
                  }}
                >
                  {values.status}
                </Label>
              )}

              <Box sx={{ mb: 5 }}>
                <UploadAvatar
                  accept="image/*"
                  file={values.profilePic}
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

              {isEdit && (
                <FormControlLabel
                  labelPlacement="start"
                  control={
                    <Switch
                      onChange={(event) => setFieldValue('status', event.target.checked ? 'banned' : 'active')}
                      checked={values.status !== 'active'}
                    />
                  }
                  label={
                    <>
                      <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                        Banned
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Apply disable account
                      </Typography>
                    </>
                  }
                  sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
                />
              )}

              <FormControlLabel
                labelPlacement="start"
                control={
                  <Switch
                    {...getFieldProps('tulseaClient')}
                    checked={isTulseaClient}
                    onChange={() => handleTulseaClient()}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Tulsea Client
                    </Typography>
                    {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Disabling this will automatically send the user a verification email
                                        </Typography> */}
                  </>
                }
                sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              />
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Basic Details
                  </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    {...getFieldProps('fullName')}
                    error={Boolean(touched.fullName && errors.fullName)}
                    helperText={touched.fullName && errors.fullName}
                  />

                  <TextField
                    select
                    fullWidth
                    label="Company"
                    placeholder="Company"
                    {...getFieldProps('companyData')}
                    error={Boolean(touched.companyData && errors.companyData)}
                    helperText={touched.companyData && errors.companyData}
                    SelectProps={{ native: true }}
                  >
                    <option value="" />
                    {companiesList.map((option) => (
                      <option key={option._id} value={JSON.stringify(option)}>
                        {option.title}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    {...getFieldProps('email')}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                  />
                  <TextField
                    fullWidth
                    label="Phone Number"
                    {...getFieldProps('phoneNumber')}
                    error={Boolean(touched.phoneNumber && errors.phoneNumber)}
                    helperText={touched.phoneNumber && errors.phoneNumber}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Alternative Phone no."
                    {...getFieldProps('alternatePhoneNo')}
                    error={Boolean(touched.alternatePhoneNo && errors.alternatePhoneNo)}
                    helperText={touched.alternatePhoneNo && errors.alternatePhoneNo}
                  />
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Birthday"
                    value={values.birthday}
                    onChange={(newValue) => {
                      setFieldValue('birthday', newValue);
                    }}
                  />
                  {/* <TextField
                    fullWidth
                    label="Main Residing Address"
                    {...getFieldProps('personalAddress')}
                    error={Boolean(touched.personalAddress && errors.personalAddress)}
                    helperText={touched.personalAddress && errors.personalAddress}
                  /> */}
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Country"
                    placeholder="Country"
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    {...getFieldProps('country')}
                    error={Boolean(touched.country && errors.country)}
                    helperText={touched.country && errors.country}
                  >
                    <option value="" />
                    {countries.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="City"
                    {...getFieldProps('city')}
                    error={Boolean(touched.city && errors.city)}
                    helperText={touched.city && errors.city}
                  />

                  {/* <TextField fullWidth label="Zip/Code" {...getFieldProps('zipCode')} /> */}
                </Stack>
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Bank Details
                  </Typography>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Billing Address"
                    {...getFieldProps('billingAddress')}
                    error={Boolean(touched.billingAddress && errors.billingAddress)}
                    helperText={touched.billingAddress && errors.billingAddress}
                  />
                  <TextField
                    fullWidth
                    label="Personal GST"
                    {...getFieldProps('personalGST')}
                    error={Boolean(touched.personalGST && errors.personalGST)}
                    helperText={touched.personalGST && errors.personalGST}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Bank Account No."
                    {...getFieldProps('bankAccountNo')}
                    error={Boolean(touched.bankAccountNo && errors.bankAccountNo)}
                    helperText={touched.bankAccountNo && errors.bankAccountNo}
                  />
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    {...getFieldProps('IFSCCode')}
                    error={Boolean(touched.IFSCCode && errors.IFSCCode)}
                    helperText={touched.IFSCCode && errors.IFSCCode}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Pan Number"
                    {...getFieldProps('pan')}
                    error={Boolean(touched.IFSCCode && errors.IFSCCode)}
                    helperText={touched.IFSCCode && errors.IFSCCode}
                  />
                </Stack> */}
                {/* <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  
                </Stack> */}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                    {!isEdit ? 'Next' : 'Save Changes'}
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
