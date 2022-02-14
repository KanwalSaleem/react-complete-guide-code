import PropTypes from 'prop-types';
import { useCallback, useState, useEffect } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
import { useFormik, Form, FormikProvider } from 'formik';
import {
  Box,
  Button,
  Switch,
  Tooltip,
  TextField,
  IconButton,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Stack
} from '@mui/material';
import { LoadingButton, MobileDateTimePicker } from '@mui/lab';
// redux
import { useDispatch } from '../../../redux/store';
import { createEvent, updateEvent, deleteEvent } from '../../../redux/slices/calendar';
// hooks
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import ColorSinglePicker from '../../../components/ColorSinglePicker';
import { TYPE } from '../../../utils/constant';
import { APIURL } from '../../../constants/ApiUrl';
import axios from 'axios';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

AddNewMember.propTypes = {
  onCancel: PropTypes.func
};

export default function AddNewMember({ onCancel, project, GetMembers }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();
  const [companiesContactsList, setCompaniesContactsList] = useState([]);
  const [companiesList, setCompaniesList] = useState([]);

  const EventSchema = Yup.object().shape({
    contactId: Yup.string().max(255).required('Contact is required'),
    companyId: Yup.string().max(255).required('company is required'),
    typeOfAttachment: Yup.string().max(255).required('Type of Attachment is required'),
    title: Yup.string().max(255).required('Title/Role is required')
  });

  const formik = useFormik({
    initialValues: {
      contactId: '',
      companyId: '',
      typeOfAttachment: '',
      title: ''
    },
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const response = await fetch(`${APIURL}/project_member`, {
          method: 'POST',
          body: JSON.stringify({
            ...values,
            projectId: project._id
          }),
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });
        const resData = await response.json();

        if (!response.ok) {
          throw new Error(resData.message);
        } else {
          enqueueSnackbar('Save success', { variant: 'success' });
          GetMembers();
          resetForm();
          onCancel();
        }
      } catch (e) {
        console.log(e);
        enqueueSnackbar('Could not Save', { variant: 'error' });
      }
      setSubmitting(false);
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;
  const { token } = useAuth();

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
      } else {
        const companyListSelect = response.data.data.data.map((item) => {
          return { id: item._id, label: item.title };
        });
        setCompaniesList(companyListSelect);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

  const GetCompaniesContactList = async (id) => {
    if (id) {
      try {
        const response = await axios({
          url: `${APIURL}/contact?page=1000&limit=0&searchString&companyId=${id}`,
          method: 'GET',
          headers: {
            'X-Auth-Token': token
          }
        });

        if (response.status !== 200) {
          setCompaniesContactsList([]);
          throw new Error(response);
        } else {
          if (response?.data?.data?.data.length > 0) {
            const contactListSelect = response?.data?.data?.data.map((item) => {
              return { id: item._id, label: item.fullName };
            });

            setCompaniesContactsList(contactListSelect);
          } else {
            enqueueSnackbar('This company has no any contact', { variant: 'info' });
            setCompaniesContactsList([]);
          }
        }
      } catch (e) {
        console.log(e.message);
      }
    }
  };

  useEffect(() => {
    GetCompaniesList();
  }, [GetCompaniesList]);

  useEffect(() => {
    setFieldValue('contactId', '');
    GetCompaniesContactList(values.companyId);
  }, [setFieldValue, values.companyId]);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }}>
            <TextField
              select
              fullWidth
              label="Company"
              placeholder="Company"
              {...getFieldProps('companyId')}
              error={Boolean(touched.companyId && errors.companyId)}
              helperText={touched.companyId && errors.companyId}
              SelectProps={{ native: true }}
            >
              <option value="" />
              {companiesList.map((option) => (
                <option key={option.value} value={option.id}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} marginTop={2}>
            <TextField
              select
              fullWidth
              label="Contact"
              placeholder="Contact"
              {...getFieldProps('contactId')}
              error={Boolean(touched.contactId && errors.contactId)}
              helperText={touched.contactId && errors.contactId}
              SelectProps={{ native: true }}
            >
              <option value="" />
              {companiesContactsList.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} marginTop={2}>
            <TextField
              select
              fullWidth
              label="Type of Attachment"
              placeholder="Type of Attachment"
              {...getFieldProps('typeOfAttachment')}
              error={Boolean(touched.typeOfAttachment && errors.typeOfAttachment)}
              helperText={touched.typeOfAttachment && errors.typeOfAttachment}
              SelectProps={{ native: true }}
            >
              <option value="" />
              {TYPE.map((option) => (
                <option key={option.value} value={option.label}>
                  {option.label}
                </option>
              ))}
            </TextField>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} marginTop={2}>
            <TextField
              fullWidth
              label="Title/Role"
              {...getFieldProps('title')}
              error={Boolean(touched.title && errors.title)}
              helperText={touched.title && errors.title}
              sx={{ mb: 3 }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            Add Member
          </LoadingButton>
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
