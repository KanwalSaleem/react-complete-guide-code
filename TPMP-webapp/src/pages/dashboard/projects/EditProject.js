import { useLocation } from 'react-router';
import CreateNewProject from './CreateNewProject';

const EditProject = () => {
  const {
    state: { userData }
  } = useLocation();

  return <CreateNewProject projectData={userData} editMode={true} />;
};

export default EditProject;
