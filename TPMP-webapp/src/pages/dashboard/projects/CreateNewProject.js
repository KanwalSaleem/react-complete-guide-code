import { useEffect } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container } from '@mui/material';
// redux
// import { useDispatch, useSelector } from '../../redux/store';
// import { getProducts } from '../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
// import ProductNewForm from '../../components/_dashboard/e-commerce/ProductNewForm';
import CreateProject from '../../../components/_dashboard/project/CreateProject';
// ----------------------------------------------------------------------

export default function CreateNewProject({ projectData, editMode = false }) {
  const { themeStretch } = useSettings();
  // const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  // const { products } = useSelector((state) => state.product);

  // const currentProduct = products.find((product) => paramCase(product.name) === name);

  // useEffect(() => {
  //     dispatch(getProducts());
  // }, [dispatch]);

  return (
    <Page title={!editMode ? 'Project: Create a new Project |  ' : 'Project: Edit Project |  '}>
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={!editMode ? 'Create a new Project' : 'Edit project'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Projects',
              href: PATH_DASHBOARD.project.projects
            },
            { name: !editMode ? 'New Project' : projectData?.title }
          ]}
        />
        {/* <ProductNewForm isEdit={isEdit} currentProduct={currentProduct} /> */}
        <CreateProject projectData={projectData} isEdit={editMode} />
      </Container>
    </Page>
  );
}
