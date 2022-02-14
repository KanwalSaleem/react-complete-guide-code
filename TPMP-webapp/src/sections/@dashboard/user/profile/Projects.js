import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Box, Grid, Card, Button, Avatar, Typography, Skeleton } from '@mui/material';
// components
import Iconify from '../../../../components/Iconify';
import ProjectList from '../../../../components/_dashboard/project/ProjectList';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------

Projects.propTypes = {
  projectsList: PropTypes.array
};

const SkeletonLoad = (
  <>
    {[...Array(8)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Skeleton variant="rectangular" width="100%" sx={{ paddingTop: '115%', borderRadius: 2 }} />
      </Grid>
    ))}
  </>
);
export default function Projects({ projectsList }) {
  return (
    // <Box sx={{ mt: 5 }}>
    //   <Grid container spacing={3}>
    //     {projectsList.map((ProjectDATA) => (
    //       <Grid key={ProjectDATA._id} item xs={12} sm={6} md={6} lg={4}>
    //         <ProjectList project={ProjectDATA} />
    //       </Grid>
    //     ))}
    //     {!projectsList.length && SkeletonLoad}
    //   </Grid>
    // </Box>
    <Box sx={{ mt: 5 }}>
      {projectsList.length > 0 ? (
        <>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Projects
          </Typography>

          <Grid container spacing={3}>
            {projectsList.map((project) => (
              <Grid key={project._id} item xs={12} md={4}>
                <FollowerCard project={project} />
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <Typography variant="h4" sx={{ mb: 3 }}>
          No Projects to show
        </Typography>
      )}
    </Box>
  );
}

// ----------------------------------------------------------------------

FollowerCard.propTypes = {
  project: PropTypes.object
};

function FollowerCard({ project }) {
  const navigate = useNavigate();
  const { title, projectType, avatarUrl, isFollowed } = project;
  const projectId = project?._id;
  const [toggle, setToogle] = useState(isFollowed);

  return (
    <Card sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
      {/* <Avatar alt={title} src={avatarUrl} sx={{ width: 48, height: 48 }} /> */}
      <Box sx={{ flexGrow: 1, minWidth: 0, pl: 2, pr: 1 }}>
        <Typography variant="subtitle2" noWrap>
          {title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Iconify icon={'bx:bxs-info-circle'} sx={{ width: 16, height: 16, mr: 0.5, flexShrink: 0 }} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {projectType}
          </Typography>
        </Box>
      </Box>
      <Button
        size="small"
        // onClick={() => setToogle(!toggle)}
        onClick={() =>
          navigate('/dashboard/project/projectProfile', {
            state: { projectId }
          })
        }
        variant={'outlined'}
        color={'inherit'}

        // variant={toggle ? 'text' : 'outlined'}
        // color={toggle ? 'primary' : 'inherit'}
        // startIcon={toggle && <Iconify icon={'eva:checkmark-fill'} />
      >
        {toggle ? 'Archieved' : 'View'}
      </Button>
    </Card>
  );
}
