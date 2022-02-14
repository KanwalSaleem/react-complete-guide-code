import PropTypes from 'prop-types';
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
  FormControlLabel
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

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

DocForm.propTypes = {
  onCancel: PropTypes.func
};

export default function DocForm({ onCancel }) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const isMountedRef = useIsMountedRef();

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    link: Yup.string().max(5000).required('Link is required')
  });

  const formik = useFormik({
    initialValues: {
      title: '',
      link: ''
    },
    validationSchema: EventSchema,
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const newEvent = {
          title: values.title,
          link: values.link
        };

        onCancel();
        if (isMountedRef.current) {
          resetForm();
          setSubmitting(false);
        }
      } catch (error) {
        console.error(error);
        if (isMountedRef.current) {
          setSubmitting(false);
        }
      }
    }
  });

  const { values, errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <DialogContent sx={{ pb: 0, overflowY: 'unset' }}>
          <TextField
            fullWidth
            label="Title"
            {...getFieldProps('title')}
            error={Boolean(touched.title && errors.title)}
            helperText={touched.title && errors.title}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            multiline
            maxRows={4}
            label="Link"
            {...getFieldProps('link')}
            error={Boolean(touched.link && errors.link)}
            helperText={touched.link && errors.link}
            sx={{ mb: 3 }}
          />
        </DialogContent>

        <DialogActions>
          <Box sx={{ flexGrow: 1 }} />
          <Button type="button" variant="outlined" color="inherit" onClick={onCancel}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} loadingIndicator="Loading...">
            Add
          </LoadingButton>
        </DialogActions>
      </Form>
    </FormikProvider>
  );
}
