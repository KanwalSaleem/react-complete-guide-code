import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography, Stack, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// layouts
import LogoOnlyLayout from '../../layouts/LogoOnlyLayout';
// routes
import { PATH_AUTH } from '../../routes/paths';
// components
import Page from '../../components/Page';
import { ResetPasswordForm } from '../../components/authentication/reset-password';
//
import { SentIcon } from '../../assets';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    display: 'flex',
    minHeight: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function SetNewPassword() {
    const { enqueueSnackbar } = useSnackbar();

    const ChangePassWordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Old Password is required'),
        newPassword: Yup.string().min(6, 'Password must be at least 6 characters').required('New Password is required'),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            confirmNewPassword: ''
        },
        validationSchema: ChangePassWordSchema,
        onSubmit: async (values, { setSubmitting }) => {
            // await fakeRequest(500);
            setSubmitting(false);
            alert(JSON.stringify(values, null, 2));
            enqueueSnackbar('Save success', { variant: 'success' });
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;
    return (
        <RootStyle title="Reset Password | Minimal UI">
            <LogoOnlyLayout />

            <Container>
                <Box sx={{ maxWidth: 480, mx: 'auto' }}>
                    <Typography variant="h3" paragraph>
                        Change your password?
                    </Typography>
                    <FormikProvider value={formik}>
                        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                            <Stack spacing={3} alignItems="flex-end">
                                <TextField
                                    {...getFieldProps('oldPassword')}
                                    fullWidth
                                    autoComplete="on"
                                    type="password"
                                    label="Old Password"
                                    error={Boolean(touched.oldPassword && errors.oldPassword)}
                                    helperText={touched.oldPassword && errors.oldPassword}
                                />

                                <TextField
                                    {...getFieldProps('newPassword')}
                                    fullWidth
                                    autoComplete="on"
                                    type="password"
                                    label="New Password"
                                    error={Boolean(touched.newPassword && errors.newPassword)}
                                    helperText={(touched.newPassword && errors.newPassword) || 'Password must be minimum 6+'}
                                />

                                <TextField
                                    {...getFieldProps('confirmNewPassword')}
                                    fullWidth
                                    autoComplete="on"
                                    type="password"
                                    label="Confirm New Password"
                                    error={Boolean(touched.confirmNewPassword && errors.confirmNewPassword)}
                                    helperText={touched.confirmNewPassword && errors.confirmNewPassword}
                                />

                                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                    Save Changes
                                </LoadingButton>
                            </Stack>
                        </Form>
                    </FormikProvider>
                    {/* <Button fullWidth size="large" component={RouterLink} to={PATH_AUTH.login} sx={{ mt: 1 }}>
                        Back
                    </Button> */}
                </Box>
            </Container>
        </RootStyle>
    );
}
