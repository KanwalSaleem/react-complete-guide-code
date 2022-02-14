import { useEffect, useState, useCallback } from 'react';
import { paramCase } from 'change-case';
import { useParams, useLocation } from 'react-router-dom';
// material
import { Container, Grid, Skeleton, IconButton, Button } from '@mui/material';
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
import ProjectList from '../../../components/_dashboard/project/ProjectList';

import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import { UserListToolbar } from '../../../components/_dashboard/user/list';
import axios from 'axios';
import { APIURL } from '../../../constants/ApiUrl';
import useAuth from 'src/hooks/useAuth';
// import ProjectUserList from '../../../pages/dashboard/ProjectUserList ';
import ProjectUserList from '../../../pages/dashboard/ProjectUserList';
// ----------------------------------------------------------------------

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);
export default function AllProject() {
  const { token } = useAuth();
  const [projectsList, setProjectList] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [listType, setListType] = useState('card');
  const [selected, setSelected] = useState([]);
  const [filterName, setFilterName] = useState('');
  const { themeStretch } = useSettings();
  // const dispatch = useDispatch();
  const { pathname } = useLocation();
  const { name } = useParams();
  // const { products } = useSelector((state) => state.product);

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
    if (event.target.value) {
      setProjectList(
        projectsList.filter((item) => item.title.toLowerCase().includes(event.target.value.toLowerCase()))
      );
    } else {
      setProjectList(searchData);
    }
  };

  const GetProjectList = useCallback(async () => {
    try {
      const response = await axios({
        url: `${APIURL}/project?page=1&limit=1000&searchString&projectSource=&projectType&genre&stage&authorId&tulseaAgentId`,
        method: 'GET',

        headers: {
          'X-Auth-Token': token
        }
      });

      if (response.status !== 200) {
        throw new Error(response.data.data);
      }

      setProjectList(response.data.data.data);
      setSearchData(response.data.data.data);
      // const resData = await response.json()
      // if (!response.ok) {
      //   throw new Error(resData.message)
      // }
    } catch (e) {
      console.log(e.message);
    }
  }, [token]);

  useEffect(() => {
    GetProjectList();
  }, [GetProjectList]);

  // const currentProduct = products.find((product) => paramCase(product.name) === name);
  return (
    <Page title="Project: Projects | ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={listType === 'card' ? 'Projects' : 'Projects List'}
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            {
              name: 'Projects',
              href: PATH_DASHBOARD.project.projects
            },
            { name: listType === 'card' ? 'Cards' : 'List' }
          ]}
          action={
            <>
              <IconButton
                style={{ marginRight: 10 }}
                onClick={() => {
                  setListType((prev) => {
                    if (prev === 'card') {
                      return 'list';
                    }
                    return 'card';
                  });
                }}
              >
                <Icon
                  icon={listType === 'card' ? 'entypo:resize-full-screen' : 'bi:grid-3x2-gap-fill'}
                  width={20}
                  height={20}
                />
              </IconButton>

              <Button
                variant="contained"
                component={RouterLink}
                to={PATH_DASHBOARD.project.projects}
                startIcon={<Icon icon={plusFill} />}
              >
                New User
              </Button>
            </>
          }
        />
        {listType === 'card' && (
          <UserListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            width={'100%'}
          />
        )}

        {listType === 'card' ? (
          <Grid container spacing={3}>
            {projectsList.map((ProjectDATA) => (
              <Grid key={ProjectDATA._id} item xs={12} sm={6} md={6} lg={4}>
                <ProjectList project={ProjectDATA} getProjectList={GetProjectList} />
              </Grid>
            ))}
            {!projectsList.length && SkeletonLoad}
          </Grid>
        ) : (
          <>{projectsList.length > 0 && <ProjectUserList userList={projectsList} getProjectList={GetProjectList} />}</>
        )}
      </Container>
    </Page>
  );
}
