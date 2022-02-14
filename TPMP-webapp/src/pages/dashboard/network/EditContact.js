import { useLocation } from 'react-router';
import Contacts from './Contacts';

const EditContact = () => {
  const { state } = useLocation();

  return <Contacts contactValues={state} editMode={true} />;
};

export default EditContact;
