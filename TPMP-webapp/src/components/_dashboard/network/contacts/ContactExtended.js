import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, TextField, Button, Typography } from '@mui/material';

// utils
import { fData } from '../../../../utils/formatNumber';
// import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';

import { BUCKET, POD, DESIGNATION, RELATIONSHIP, PRIORITY, AVAILABILITY_STATUS } from '../../../../utils/constant';

// ----------------------------------------------------------------------

// ContactAdditionalDetails.propTypes = {
//   isEdit: PropTypes.bool,
//   currentUser: PropTypes.object,
//   handleChangeTab: PropTypes.func,
//   setFormValues: PropTypes.func,
//   handleBack: PropTypes.func,
//   formValues: PropTypes.object,
//   editMode: PropTypes.bool
// };

export default function ContactExtended({
  isEdit,
  currentUser,
  handleChangeTab,
  setFormValues,
  handleBack,
  formValues,
  editMode
}) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  console.log(editMode);
  const NewUserSchema = Yup.object().shape({
    bucket: Yup.string().required('Bucket is required'),
    // roleSkillSet: Yup.string(),

    designation: Yup.string(),
    source: Yup.string(),
    reportTo: Yup.string(),
    relationship: Yup.string()
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      bucket: formValues.bucket || currentUser?.bucket || '',
      //   name: currentUser?.name || '',

      designation: formValues.designation || currentUser?.designation || '',
      source: formValues.source || currentUser?.source || '',

      reportTo: formValues.reportTo || currentUser?.reportTo || '',
      relationship: formValues.relationship || currentUser?.relationship || '',
      bio: formValues.bio || '',

      personalAddress: formValues.personalAddress || '',
      billingAddress: formValues.billingAddress || '',
      personalGST: formValues.personalGST || '',
      IFSCCode: formValues.IFSCCode || '',
      pan: '',
      bankAccountNo: formValues.bankAccountNo || ''
    },
    validationSchema: NewUserSchema,
    onSubmit: (values, { setSubmitting, resetForm, setErrors }) => {
      try {
        handleChangeTab();
        // await fakeRequest(500);
        // resetForm()
        // console.log(values)
        setFormValues((prev) => ({ ...prev, ...values }));

        setSubmitting(false);
        // enqueueSnackbar(!isEdit ? 'Create success' : 'Update success', {
        //   variant: 'success',
        // })
        // navigate(PATH_DASHBOARD.user.list)
        console.log('values2', values);
      } catch (error) {
        console.error(error);
        setSubmitting(false);
        setErrors(error);
      }
    }
  });

  const {
    errors,
    // values,
    touched,
    handleSubmit,
    isSubmitting,
    setFieldValue,
    getFieldProps
  } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('avatarUrl', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    {...getFieldProps('bucket')}
                    select
                    fullWidth
                    label="Bucket"
                    placeholder="Bucket"
                    // //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.bucket && errors.bucket)}
                    helperText={touched.bucket && errors.bucket}
                  >
                    <option value="" />
                    {BUCKET.map((option) => (
                      <option key={option} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    select
                    fullWidth
                    label="Designation"
                    placeholder="Country"
                    {...getFieldProps('designation')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.designation && errors.designation)}
                    helperText={touched.designation && errors.designation}
                  >
                    <option value="" />
                    {DESIGNATION.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  {/* <TextField
                    select
                    fullWidth
                    label="Role"
                    placeholder="Role"
                    {...getFieldProps('roleSkillSet')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.roleSkillSet && errors.roleSkillSet)}
                    helperText={touched.roleSkillSet && errors.roleSkillSet}
                  >
                    <option value="" />
                    {BUCKET.map((option) => (
                      <option key={option.code} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField> */}
                </Stack>

                {/*  */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  {/* <TextField
                    fullWidth
                    label="Source"
                    {...getFieldProps('source')}
                    error={Boolean(touched.source && errors.source)}
                    helperText={touched.source && errors.source}
                  /> */}

                  <TextField
                    fullWidth
                    label="Reports To"
                    {...getFieldProps('reportTo')}
                    error={Boolean(touched.reportTo && errors.reportTo)}
                    helperText={touched.reportTo && errors.reportTo}
                  />
                  {/* <TextField
                    select
                    fullWidth
                    label="Relationship"
                    placeholder="Country"
                    //{...getFieldProps('country')}
                    {...getFieldProps('relationship')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.relationship && errors.relationship)}
                    helperText={touched.relationship && errors.relationship}
                  >
                    <option value="" />
                    {RELATIONSHIP.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField> */}

                  {isEdit && (
                    <TextField
                      fullWidth
                      label="Contact By"
                      disabled={true}
                      {...getFieldProps('source')}
                      error={Boolean(touched.source && errors.source)}
                      helperText={touched.source && errors.source}
                    />
                  )}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Bio"
                    {...getFieldProps('bio')}
                    error={Boolean(touched.bio && errors.bio)}
                    helperText={touched.bio && errors.bio}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
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
                    label="Main Residing Address"
                    {...getFieldProps('personalAddress')}
                    error={Boolean(touched.personalAddress && errors.personalAddress)}
                    helperText={touched.personalAddress && errors.personalAddress}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Personal GST"
                    {...getFieldProps('personalGST')}
                    error={Boolean(touched.personalGST && errors.personalGST)}
                    helperText={touched.personalGST && errors.personalGST}
                  />
                  <TextField
                    fullWidth
                    label="Bank Account No."
                    {...getFieldProps('bankAccountNo')}
                    error={Boolean(touched.bankAccountNo && errors.bankAccountNo)}
                    helperText={touched.bankAccountNo && errors.bankAccountNo}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="IFSC Code"
                    {...getFieldProps('IFSCCode')}
                    error={Boolean(touched.IFSCCode && errors.IFSCCode)}
                    helperText={touched.IFSCCode && errors.IFSCCode}
                  />
                  <TextField
                    fullWidth
                    label="Pan Number"
                    {...getFieldProps('pan')}
                    error={Boolean(touched.IFSCCode && errors.IFSCCode)}
                    helperText={touched.IFSCCode && errors.IFSCCode}
                  />
                </Stack>

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
