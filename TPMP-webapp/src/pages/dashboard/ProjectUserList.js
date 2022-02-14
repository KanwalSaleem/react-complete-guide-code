import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
// material
import { useTheme } from '@mui/material/styles';
import {
  Card,
  Table,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getUserList, deleteUser } from '../../redux/slices/user';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Label from '../../components/Label';
import Scrollbar from '../../components/Scrollbar';
import SearchNotFound from '../../components/SearchNotFound';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../components/_dashboard/user/list';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from 'src/hooks/useAuth';
import { useSnackbar } from 'notistack';
import { APIURL } from '../../constants/ApiUrl';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'title', label: 'Project Name', alignRight: false },
  { id: 'logLine', label: 'Logline', alignRight: false },
  { id: 'genre', label: 'Genre', alignRight: false },
  { id: 'description', label: 'Description', alignRight: false },
  { id: 'availableMaterial', label: 'Avalaible Material', alignRight: false },
  { id: 'requirement', label: 'Requirements', alignRight: false },
  { id: 'commissioningPartnerCompanyId', label: 'Commissioning Partner (Company)', alignRight: false },
  { id: 'commissioningPartnerPocId', label: 'Commissioning Partner POC*', alignRight: false },
  { id: 'clients', label: 'Clients in Discussion', alignRight: false },
  { id: 'talentCompanyClients', label: 'Talent - Company Clients', alignRight: false },
  { id: 'productionHous', label: 'Production House', alignRight: false },
  { id: 'endBuyer', label: 'End Buyer', alignRight: false },

  { id: 'projectSource', label: 'Project Source', alignRight: false },
  { id: 'projectType', label: 'Type', alignRight: false },
  { id: 'priority', label: 'Priority', alignRight: false },
  { id: 'authorId', label: 'Author/ Right Holder', alignRight: false },
  { id: 'googleDriveUrl', label: 'Google Drive URL', alignRight: false },
  { id: 'stage', label: 'Stage', alignRight: false },
  { id: 'stageUpdatedAt', label: 'Stage updated on', alignRight: false },
  { id: 'tulseaAgentId', label: 'Tulsea Agent', alignRight: false },

  { id: 'actions', label: 'Actions', alignRight: false }
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function ProjectUserList({ userList, getProjectList }) {
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const { enqueueSnackbar } = useSnackbar();
  const { token } = useAuth();
  const theme = useTheme();
  const dispatch = useDispatch();
  // const {userList} = useSelector((state) => state.user)
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    dispatch(getUserList());
  }, [dispatch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = userList.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteUser = async (id) => {
    try {
      const response = await axios({
        url: `${APIURL}/project/${id}`,
        method: 'DELETE',
        headers: {
          'X-Auth-Token': token
        }
      });
      if (response.status !== 200) {
        enqueueSnackbar('Could Not Delete Company', { variant: 'error' });
        throw new Error(response);
      } else {
        enqueueSnackbar('Company Delete Successfully', { variant: 'success' });
        getProjectList();
      }
    } catch (e) {
      console.log(e.message);
    }
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  const isUserNotFound = filteredUsers.length === 0;

  const onClick = (userData) => {
    navigate('/dashboard/project/editProject', {
      state: { userData }
    });
  };

  return (
    <Page title="Project: Projects List |  ">
      <Card>
        <UserListToolbar numSelected={selected.length} filterName={filterName} onFilterName={handleFilterByName} />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <UserListHead
                order={order}
                orderBy={orderBy}
                headLabel={TABLE_HEAD}
                rowCount={userList.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
              />
              <TableBody>
                {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                  const {
                    headerImage,
                    title,
                    logLine,
                    genre,
                    description,
                    availableMaterial,
                    requirement,
                    commissioningPartnerPocId,
                    commissioningPartnerCompanyId,
                    clients,
                    talentCompanyClients,
                    productionHouse,
                    endBuyer,
                    projectSource,
                    projectType,
                    priority,
                    authorId,
                    googleDriveUrl,
                    stage,
                    stageUpdatedAt,
                    tulseaAgentId,
                    _id
                  } = row;

                  const isItemSelected = selected.indexOf(title) !== -1;
                  const id = Math.random();
                  return (
                    <TableRow
                      hover
                      key={_id}
                      tabIndex={-1}
                      role="checkbox"
                      selected={isItemSelected}
                      aria-checked={isItemSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={(event) => handleClick(event, title ? title : '-')}
                        />
                      </TableCell>
                      <TableCell component="th" scope="row" padding="none">
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar alt={title} src={headerImage && headerImage} />
                          <Typography variant="subtitle2" noWrap>
                            {title ? title : '-'}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="left">{logLine ? logLine : '-'}</TableCell>
                      <TableCell align="left">{genre ? genre : '-'}</TableCell>
                      <TableCell align="left">{description ? description : '-'}</TableCell>
                      <TableCell align="left">{availableMaterial ? availableMaterial : '-'}</TableCell>
                      <TableCell align="left">{requirement ? requirement : '-'}</TableCell>
                      <TableCell align="left">
                        {commissioningPartnerCompanyId ? commissioningPartnerCompanyId?.title : '-'}
                      </TableCell>
                      <TableCell align="left">
                        {commissioningPartnerPocId ? commissioningPartnerPocId?.fullName : '-'}
                      </TableCell>
                      <TableCell align="left">
                        {clients.length > 0
                          ? clients.map((item) => {
                              return <p>{item.fullName}</p>;
                            })
                          : '-'}
                      </TableCell>
                      <TableCell align="left">{talentCompanyClients ? talentCompanyClients : '-'}</TableCell>
                      <TableCell align="left">{productionHouse ? productionHouse : '-'}</TableCell>
                      <TableCell align="left">{endBuyer ? endBuyer : '-'}</TableCell>

                      <TableCell align="left">{projectSource ? projectSource : '-'}</TableCell>
                      <TableCell align="left">{projectType ? projectType : '-'}</TableCell>
                      <TableCell align="left">{priority ? priority : '-'}</TableCell>
                      <TableCell align="left">
                        {authorId.length > 0
                          ? authorId.map((item) => {
                              return <p>{item.fullName}</p>;
                            })
                          : '-'}
                      </TableCell>
                      <TableCell align="left">{googleDriveUrl ? googleDriveUrl : '-'}</TableCell>
                      <TableCell align="left">{stage ? stage : '-'}</TableCell>
                      <TableCell align="left">{stageUpdatedAt ? stageUpdatedAt : '-'}</TableCell>
                      <TableCell align="left">{tulseaAgentId ? tulseaAgentId : '-'}</TableCell>

                      <TableCell align="right">
                        <UserMoreMenu onDelete={handleDeleteUser.bind(this, _id)} onClick={onClick.bind(this, row)} />
                      </TableCell>
                    </TableRow>
                  );
                })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
              {isUserNotFound && (
                <TableBody>
                  <TableRow>
                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                      <SearchNotFound searchQuery={filterName} />
                    </TableCell>
                  </TableRow>
                </TableBody>
              )}
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={userList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
      {/* </Container> */}
    </Page>
  );
}
