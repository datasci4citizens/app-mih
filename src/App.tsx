import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-user-patient/CreateUser';
import ChildForm from './routes/user/create-user-patient/PatientForm';
import PatientHomePage from './routes/home/PatientHomePage';
import HmiInformations from './routes/home/HmiInformations';
import PatientRegisters from './routes/registers/PatientRegisters';
import SelectPatientNew from './routes/registers/SelectPatientNew';
import FinishRegisterNew from './routes/registers/FinishRegisterNew';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/user/create',
    element: <SelectUserType />

  },
  {
    path: 'user/create/patient',
    element: <CreatePatient />

  },
  {
    path: 'user/create/patient/child',
    element: <ChildForm />
  },
  {
    path: '/patient-home',
    element: <PatientHomePage />

  },
  {
    path: '/patient-home/hmi-informations',
    element: <HmiInformations />

  },
  {
    path: '/patient-registers',
    element: <PatientRegisters />
  },
  {
    path: '/patient-registers/new-register',
    element: <SelectPatientNew />
  },
  {
    path: '/patient-registers/new-register-finish',
    element: <FinishRegisterNew />
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
