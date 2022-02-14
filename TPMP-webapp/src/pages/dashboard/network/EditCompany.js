import { useLocation } from 'react-router-dom';
import Companies from './Companies';

const EditCompany = (props) => {
  const {
    state: { userData }
  } = useLocation();
  const formValues = {
    title: userData.title,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    address: userData.address,
    priority: userData.priority,
    companyType: userData.companyType,
    companyGST: userData.companyGST,
    bankAccountNo: userData.bankAccountNo,
    IFSCCode: userData.IFSCCode,
    headerImage: userData.headerImage
  };
  const id = userData._id;
  return <Companies formValues={formValues} id={id} isEdit={true} />;
};

export default EditCompany;
