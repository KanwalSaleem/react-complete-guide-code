import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useCallback, useState, useEffect } from 'react';
import { Form, FormikProvider, useFormik } from 'formik';
// material
import { styled } from '@mui/material/styles';
import { LoadingButton } from '@mui/lab';
import {
  Card,
  Chip,
  Grid,
  Stack,
  Radio,
  Switch,
  Select,
  TextField,
  InputLabel,
  Typography,
  RadioGroup,
  FormControl,
  Autocomplete,
  InputAdornment,
  FormHelperText,
  FormControlLabel
} from '@mui/material';
// utils
import fakeRequest from '../../../utils/fakeRequest';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
//
import useAuth from 'src/hooks/useAuth';
import { QuillEditor } from '../../editor';
import { UploadMultiFile } from '../../upload';
import { APIURL } from '../../../constants/ApiUrl';
import { AVAILABLE_MATERIAL, STAGE, TYPE } from '../../../utils/constant';
import DateTimePicker from '@mui/lab/DateTimePicker';
import axios from 'axios';

// ----------------------------------------------------------------------
const GENRE = [
  'Scripted',
  'Unscripted',
  'Action and adventure',
  'Animation',
  'Comedy',
  'Drama',
  'Historical',
  'Horror',
  'Science fiction',
  'Western',
  'Unscripted'
];
const AVAILABLEMATERIAL = ['Concept', 'Story', 'Treatment', 'Bible', 'Pilot ', 'Auto suggestions '];
const REQUIREMENT = [
  'Writers',
  'Directors',
  'Showrunner',
  'Producer',
  'Actor',
  'Financing',
  'Platform/Studio/Distributor'
];

const contactsDummyList = [
  { id: 1, label: 'fdd' },
  { id: 2, label: 'fdd' },
  { id: 3, label: 'fdd' },
  { id: 4, label: 'fdd' },
  { id: 5, label: 'fdd' }
];
// const STAGE = [
//   'Under Development / Content Feedback',
//   'Packaging / Pitching',
//   'Commissioned',
//   'Production',
//   'Released',
//   'Shelved / Cancelled'
// ];
// const TYPE = [
//   'Series',
//   'Feature (Theatrical)',
//   'Feature (Digital)',
//   'Book / Story',
//   'Format',
//   'Short Film / Anthology',
//   'Others (Please specify)'
// ];

const GENDER_OPTION = ['Open', 'Close'];

const TAGS_OPTION = [
  'Toy Story 3',
  'Logan',
  'Full Metal Jacket',
  'Dangal',
  'The Sting',
  '2001: A Space Odyssey',
  "Singin' in the Rain",
  'Toy Story',
  'Bicycle Thieves',
  'The Kid',
  'Inglourious Basterds',
  'Snatch',
  '3 Idiots'
];

const LabelStyle = styled(Typography)(({ theme }) => ({
  ...theme.typography.subtitle2,
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1)
}));

// ----------------------------------------------------------------------

ProductNewForm.propTypes = {
  isEdit: PropTypes.bool,
  currentProduct: PropTypes.object
};

export default function ProductNewForm({ isEdit, projectData }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [contactsList, setContactsList] = useState([]);
  const { token } = useAuth();
  const [companiesList, setCompaniesList] = useState([]);
  const [companiescontactsList, setCompaniesContactsList] = useState([]);

  const NewProductSchema = Yup.object().shape({
    title: Yup.string().required('Name is required'),
    genre: Yup.array().min(1).required('Genre is required'),
    projectType: Yup.string().required('Type is required'),
    authorId: Yup.array().min(1).required('Author is required'),
    commissioningPartnerCompanyId: Yup.object({}).nullable().required('Commissioning Partner (Company) is required'),
    commissioningPartnerPocId: Yup.object().nullable().required('Commissioning Partner POC is required'),
    tulseaAgentId: Yup.string().nullable().required('Agent is required'),
    projectSource: Yup.string().required('Project Source is required')
    // description: Yup.string().required('Description is required'),
    // images: Yup.array().min(1, 'Images is required'),
    // price: Yup.number().required('Price is required')
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: projectData?.title || '',
      logLine: projectData?.logLine || '',
      genre: projectData?.genre || [],
      description: projectData?.description || '',
      availableMaterial: projectData?.availableMaterial || [],
      requirement: projectData?.requirement || [],
      commissioningPartnerPocId: projectData?.commissioningPartnerPocId
        ? {
            id: projectData?.commissioningPartnerPocId?._id,
            label: projectData?.commissioningPartnerPocId?.fullName
          }
        : null,
      commissioningPartnerCompanyId: projectData?.commissioningPartnerCompanyId
        ? {
            id: projectData?.commissioningPartnerCompanyId?._id,
            label: projectData?.commissioningPartnerCompanyId?.title
          }
        : null,
      clients:
        projectData?.clients.length > 0
          ? projectData?.clients.map((item) => {
              return {
                id: item._id,
                label: item.fullName
              };
            })
          : [],
      talentCompanyClients: projectData?.talentCompanyClients || [],
      productionHouse: projectData?.productionHouse || '',
      endBuyer: projectData?.endBuyer || '',
      visibility: projectData?.visibility || true,
      projectSource: projectData?.projectSource || '',
      projectType: projectData?.projectType || '',
      projectAvailableMaterial: projectData?.projectAvailableMaterial || '',
      priority: projectData?.priority || '',
      authorId:
        projectData?.authorId.length > 0
          ? projectData?.authorId.map((item) => {
              return {
                id: item._id,
                label: item.fullName
              };
            })
          : [],
      // authorId: [],
      googleDriveUrl: projectData?.googleDriveUrl || '',
      stage: projectData?.stage || '',
      stageUpdatedAt: projectData?.stageUpdatedAt || new Date().toDateString(),
      projectCreatedOn: projectData?.projectCreatedOn || new Date().toDateString(),
      tulseaAgentId:
        projectData?.tulseaAgentId ||
        '' ||
        //   images: currentProduct?.images || [],
        //   code: currentProduct?.code || '',
        //   sku: currentProduct?.sku

        ''
      //   price: currentProduct?.price || '',

      //   priceSale: currentProduct?.priceSale || '',
      //   tags: currentProduct?.tags || [TAGS_OPTION[0]],

      //   taxes: true,
      //   gender: currentProduct?.gender || GENDER_OPTION[2],
      //   category: currentProduct?.category || CATEGORY_OPTION[0].classify[1]
    },

    validationSchema: NewProductSchema,
    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      setSubmitting(true);
      delete values.projectAvailableMaterial;
      delete values.projectCreatedOn;

      const authorIdArray = values.authorId.map((item) => {
        return item.id;
      });
      const clientsIdArray =
        values.clients.length > 0
          ? values.clients.map((item) => {
              return item.id;
            })
          : [];

      if (isEdit) {
        const id = projectData._id;

        try {
          const response = await fetch(`${APIURL}/project/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
              ...values,
              authorId: authorIdArray,
              clients: clientsIdArray,
              commissioningPartnerCompanyId: values.commissioningPartnerCompanyId?.id
                ? values.commissioningPartnerCompanyId?.id
                : '',
              commissioningPartnerPocId: values.commissioningPartnerPocId?.id
                ? values.commissioningPartnerPocId?.id
                : ''
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

          enqueueSnackbar('Update success', { variant: 'success' });

          navigate(PATH_DASHBOARD.project.projectList);
        } catch (e) {
          console.log(e);
          enqueueSnackbar('Could not Update', { variant: 'error' });
        }
      } else {
        try {
          // await fakeRequest(500);
          const response = await fetch(`${APIURL}/project`, {
            method: 'POST',
            body: JSON.stringify({
              ...values,
              authorId: authorIdArray,
              clients: clientsIdArray,
              commissioningPartnerCompanyId: values.commissioningPartnerCompanyId?.id
                ? values.commissioningPartnerCompanyId?.id
                : '',
              commissioningPartnerPocId: values.commissioningPartnerPocId?.id
                ? values.commissioningPartnerPocId?.id
                : ''
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
            resetForm();
            navigate(PATH_DASHBOARD.project.projectList);
          }
        } catch (error) {
          console.log(error);
          enqueueSnackbar('Could not Save', { variant: 'error' });
        }
      }
      resetForm();
      setSubmitting(false);
    }
  });

  const { errors, values, touched, handleSubmit, isSubmitting, setFieldValue, getFieldProps } = formik;

  const handleDrop = useCallback(
    (acceptedFiles) => {
      setFieldValue(
        'images',
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
    },
    [setFieldValue]
  );

  const handleRemoveAll = () => {
    setFieldValue('images', []);
  };

  const handleRemove = (file) => {
    const filteredItems = values.images.filter((_file) => _file !== file);
    setFieldValue('images', filteredItems);
  };

  const GetContactList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/contact?page=1&limit=1000&searchString`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        setContactsList([]);
        throw new Error(response);
      } else {
        const contactListSelect = response?.data?.data?.data.map((item) => {
          return { id: item._id, label: item.fullName };
        });
        setContactsList(contactListSelect);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

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
        setCompaniesList([]);
        throw new Error(response);
      } else {
        const companyListSelect = response?.data?.data?.data.map((item) => {
          return { id: item._id, label: item.title };
        });
        setCompaniesList(companyListSelect);
      }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

  const GetCompaniesContactList = async (id) => {
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
  };

  useEffect(() => {
    GetCompaniesList();
    GetContactList();
  }, [GetCompaniesList, GetContactList]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Project Name/Title"
                    {...getFieldProps('title')}
                    error={Boolean(touched.title && errors.title)}
                    helperText={touched.title && errors.title}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Project Source"
                    {...getFieldProps('projectSource')}
                    error={Boolean(touched.projectSource && errors.projectSource)}
                    helperText={touched.projectSource && errors.projectSource}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    select
                    fullWidth
                    label="Type"
                    placeholder="Type"
                    {...getFieldProps('projectType')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.projectType && errors.projectType)}
                    helperText={touched.projectType && errors.projectType}
                  >
                    <option value="" />
                    {TYPE.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    label="Logline"
                    {...getFieldProps('logLine')}
                    error={Boolean(touched.logLine && errors.logLine)}
                    helperText={touched.logLine && errors.logLine}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    fullWidth={true}
                    value={values.genre}
                    onChange={(event, newValue) => {
                      setFieldValue('genre', newValue);
                    }}
                    options={GENRE.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Genre"
                        {...params}
                        error={Boolean(touched.genre && errors.genre)}
                        helperText={touched.genre && errors.genre}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <TextField
                    fullWidth
                    multiline
                    minRows={4}
                    label="Description"
                    {...getFieldProps('description')}
                    error={Boolean(touched.description && errors.description)}
                    helperText={touched.description && errors.description}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    fullWidth={true}
                    value={values.availableMaterial}
                    onChange={(event, newValue) => {
                      setFieldValue('availableMaterial', newValue);
                    }}
                    options={AVAILABLEMATERIAL.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Available Material" {...params} />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    fullWidth={true}
                    value={values.requirement}
                    onChange={(event, newValue) => {
                      setFieldValue('requirement', newValue);
                    }}
                    options={REQUIREMENT.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Requirements" {...params} />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    // multiple
                    freeSolo
                    fullWidth={true}
                    value={values.commissioningPartnerCompanyId}
                    onChange={(event, newValue) => {
                      setFieldValue('commissioningPartnerCompanyId', newValue);
                      GetCompaniesContactList(newValue?.id);
                      setFieldValue('commissioningPartnerPocId', '');
                    }}
                    options={companiesList.map((option) => option)}
                    renderTags={(value, getTagProps) => <Chip size="small" label={value} />}
                    renderInput={(params) => (
                      <TextField
                        label="Commissioning Partner (Company)"
                        {...params}
                        error={Boolean(touched.commissioningPartnerCompanyId && errors.commissioningPartnerCompanyId)}
                        helperText={touched.commissioningPartnerCompanyId && errors.commissioningPartnerCompanyId}
                      />
                    )}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    // multiple
                    freeSolo
                    fullWidth={true}
                    value={values.commissioningPartnerPocId}
                    onChange={(event, newValue) => {
                      setFieldValue('commissioningPartnerPocId', newValue);
                    }}
                    options={companiescontactsList.map((option) => option)}
                    renderTags={(value, getTagProps) => (
                      //   value.map((option, index) => <Chip {...getTagProps({ index })} key={option} size="small" label={option} />)
                      <Chip size="small" label={value} />
                    )}
                    renderInput={(params) => (
                      <TextField
                        label="Commissioning Partner POC*"
                        {...params}
                        error={Boolean(touched.commissioningPartnerPocId && errors.commissioningPartnerPocId)}
                        helperText={touched.commissioningPartnerCompanyId && errors.commissioningPartnerPocId}
                      />
                    )}
                  />

                  {/* <Autocomplete
                    multiple
                    freeSolo
                    value={values.authorId}
                    onChange={(event, newValue) => {
                      setFieldValue('authorId', newValue);
                    }}
                    options={contactsList.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.label} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Author / Rights Holder"
                        {...params}
                        error={Boolean(touched.authorId && errors.authorId)}
                        helperText={touched.authorId && errors.authorId}
                      />
                    )}
                  /> */}
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    fullWidth={true}
                    value={values.clients}
                    onChange={(event, newValue) => {
                      setFieldValue('clients', newValue);
                    }}
                    options={contactsList.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.label} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Clients in Discussion" {...params} />}
                  />
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    fullWidth={true}
                    value={values.talentCompanyClients}
                    onChange={(event, newValue) => {
                      setFieldValue('talentCompanyClients', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      ))
                    }
                    renderInput={(params) => <TextField label="Talent - Company Clients" {...params} />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    // multiple
                    freeSolo
                    fullWidth={true}
                    value={values.productionHouse}
                    onChange={(event, newValue) => {
                      setFieldValue('productionHouse', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) => (
                      // value.map((option, index) => (
                      //   <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      // ))
                      <Chip size="small" label={value} />
                    )}
                    renderInput={(params) => <TextField label="Production House" {...params} />}
                  />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 3, sm: 2 }}>
                  <Autocomplete
                    // multiple
                    freeSolo
                    fullWidth={true}
                    value={values.endBuyer}
                    onChange={(event, newValue) => {
                      setFieldValue('endBuyer', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) => (
                      // value.map((option, index) => (
                      //   <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      // ))
                      <Chip size="small" label={value} />
                    )}
                    renderInput={(params) => <TextField label="End Buyer" {...params} />}
                  />
                </Stack>
              </Stack>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card sx={{ p: 3 }}>
                <FormControlLabel
                  control={<Switch {...getFieldProps('visibility')} checked={values.visibility} />}
                  label="Visibility"
                  sx={{ mb: 2 }}
                />

                <Stack spacing={3}>
                  {/* <TextField
                    select
                    fullWidth
                    label="Available Material"
                    placeholder="Available Material"
                    {...getFieldProps('projectAvailableMaterial')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.pod && errors.pod)}
                    helperText={touched.pod && errors.pod}
                  >
                    <option value="" />
                    {AVAILABLE_MATERIAL.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField> */}
                  <div>
                    <LabelStyle>Priority</LabelStyle>
                    <RadioGroup {...getFieldProps('priority')} row>
                      <Stack spacing={1} direction="row">
                        {GENDER_OPTION.map((gender) => (
                          <FormControlLabel key={gender} value={gender} control={<Radio />} label={gender} />
                        ))}
                      </Stack>
                    </RadioGroup>
                  </div>
                  <Autocomplete
                    multiple
                    freeSolo
                    value={values.authorId}
                    onChange={(event, newValue) => {
                      setFieldValue('authorId', newValue);
                    }}
                    options={contactsList.map((option) => option)}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip {...getTagProps({ index })} key={option.id} size="small" label={option.label} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField
                        label="Author / Rights Holder"
                        {...params}
                        error={Boolean(touched.authorId && errors.authorId)}
                        helperText={touched.authorId && errors.authorId}
                      />
                    )}
                  />
                </Stack>
              </Card>

              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <TextField fullWidth label="Google Drive URL" {...getFieldProps('googleDriveUrl')} />

                  <TextField
                    select
                    fullWidth
                    label="Stage"
                    placeholder="Stage"
                    {...getFieldProps('stage')}
                    //{...getFieldProps('country')}
                    SelectProps={{ native: true }}
                    error={Boolean(touched.pod && errors.pod)}
                    helperText={touched.pod && errors.pod}
                  >
                    <option value="" />
                    {STAGE.map((option) => (
                      <option key={option.value} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </TextField>

                  {isEdit && (
                    <>
                      <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Stage updated on"
                        value={values.stageUpdatedAt}
                        onChange={(newValue) => {
                          setFieldValue('stageUpdatedAt', newValue);
                        }}
                      />
                      <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Project created on"
                        value={values.projectCreatedOn}
                        onChange={(newValue) => {
                          setFieldValue('projectCreatedOn', newValue);
                        }}
                      />
                    </>
                  )}
                  <Autocomplete
                    // multiple
                    freeSolo
                    fullWidth={true}
                    value={values.tulseaAgentId}
                    onChange={(event, newValue) => {
                      setFieldValue('tulseaAgentId', newValue);
                    }}
                    options={TAGS_OPTION.map((option) => option)}
                    renderTags={(value, getTagProps) => (
                      // value.map((option, index) => (
                      //   <Chip {...getTagProps({ index })} key={option} size="small" label={option} />
                      // ))
                      <Chip size="small" label={value} />
                    )}
                    renderInput={(params) => (
                      <TextField
                        label="Tulsea Agent"
                        {...params}
                        error={Boolean(touched.tulseaAgentId && errors.tulseaAgentId)}
                        helperText={touched.tulseaAgentId && errors.tulseaAgentId}
                      />
                    )}
                  />

                  <TextField
                    fullWidth
                    label="Edit by"
                    disabled={true}
                    // {...getFieldProps('editBy')}
                  />
                </Stack>
              </Card>
              <LoadingButton type="submit" fullWidth variant="contained" size="large" loading={isSubmitting}>
                {!isEdit ? 'Save Project' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}
