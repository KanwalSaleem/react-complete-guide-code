import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Card,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
  FormHelperText,
  FormControlLabel,
  Button
} from '@mui/material';
import DateTimePicker from '@mui/lab/DateTimePicker';
// utils
import { fData } from '../../../../utils/formatNumber';
// import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
//
import Label from '../../../Label';
import { UploadAvatar } from '../../../upload';
import countries from './countries';
import {
  BUCKET,
  POD,
  DESIGNATION,
  RELATIONSHIP,
  PRIORITY,
  TypeOfClient,
  AVAILABILITY_STATUS
} from '../../../../utils/constant';
// ----------------------------------------------------------------------

ContactClient.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
  handleChangeTab: PropTypes.func,
  setFormValues: PropTypes.func,
  formValues: PropTypes.object,
  editMode: PropTypes.bool
};

export default function ContactClient({
  isEdit,
  editMode,
  currentUser,
  handleChangeTab,
  setFormValues,
  formValues,
  handleBack
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    pod: Yup.string().required('Pod is required'),
    typeOfClient: Yup.string().required('Type of Client is required'),
    agent: Yup.string().required('Agent is required')
    // strategyUpdate: Yup.string().required('Strategy/Update is required'),
    // priority: Yup.string().required('Priority is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      typeOfClient: formValues.typeOfClient || currentUser?.typeOfClient || '',
      agent: formValues.agent || currentUser?.agent || '',
      strategyUpdate: formValues.strategyUpdate || currentUser?.strategyUpdate || '',
      priority: formValues.priority || currentUser?.priority || '',

      availabilityStatus: formValues.availabilityStatus || currentUser?.availabilityStatus || '',
      availabilityStatusModifiedAt: new Date().toDateString(),
      pod: formValues.pod || currentUser?.pod || ''
      //   country: currentUser?.country || '',
      //   city: currentUser?.city || '',
      //   zipCode: currentUser?.zipCode || '',
      //   avatarUrl: currentUser?.avatarUrl || null,
      //   tulseaClient: currentUser?.tulseaClient || false,
      //   company: currentUser?.company || '',
      //   role: currentUser?.role || '',
      //   biography: currentUser?.biography || '',
      //   shortBiography: currentUser?.shortBiography || '',
    },
    validationSchema: NewUserSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      console.log(values);
      try {
        // await fakeRequest(500);
        // resetForm()
        setFormValues((prev) => ({ ...prev, ...values }));
        handleChangeTab();
        setSubmitting(false);
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

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Type of Client"
                    placeholder="Type of Client"
                    {...getFieldProps('typeOfClient')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.typeOfClient && errors.typeOfClient)}
                    helperText={touched.typeOfClient && errors.typeOfClient}
                  >
                    <option value="" />
                    {TypeOfClient.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Agent"
                    {...getFieldProps('agent')}
                    error={Boolean(touched.agent && errors.agent)}
                    helperText={touched.agent && errors.agent}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {/* <TextField
                    fullWidth
                    label="Strategy / Update"
                    placeholder="Strategy / Update"
                    {...getFieldProps('strategyUpdate')}
                    // error={Boolean(touched.state && errors.state)}
                    // helperText={touched.state && errors.state}
                  /> */}
                  <TextField
                    select
                    fullWidth
                    label="Pod"
                    placeholder="Pod"
                    {...getFieldProps('pod')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.pod && errors.pod)}
                    helperText={touched.pod && errors.pod}
                  >
                    <option value="" />
                    {POD.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  <TextField
                    select
                    fullWidth
                    label="Priority"
                    placeholder="Priority"
                    {...getFieldProps('priority')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    // error={Boolean(touched.priority && errors.priority)}
                    // helperText={touched.priority && errors.priority}
                  >
                    <option value="" />
                    {PRIORITY.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>

                {editMode && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                    <TextField
                      select
                      fullWidth
                      label="Availability Status"
                      placeholder="Availability Status"
                      {...getFieldProps('availabilityStatus')}
                      //{...getFieldProps('country')}
                      SelectProps={{ native: true }}
                      // error={Boolean(touched.availabilityStatus && errors.availabilityStatus)}
                      // helperText={touched.availabilityStatus && errors.availabilityStatus}
                    >
                      <option value="" />
                      {AVAILABILITY_STATUS.map((option) => (
                        <option key={option.value} value={option.label}>
                          {option.label}
                        </option>
                      ))}
                    </TextField>
                    <DateTimePicker
                      renderInput={(props) => <TextField {...props} />}
                      label="Availability Status Last Modified On (timestamp)"
                      // value={value}
                      // onChange={(newValue) => {
                      //     setValue(newValue);
                      // }}
                    />
                  </Stack>
                )}
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="outlined" style={{ marginRight: 10 }} onClick={handleBack}>
                    Back
                  </Button>
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
