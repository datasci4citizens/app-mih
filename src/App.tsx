import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-user-patient/CreateUser';
import ChildForm from './routes/user/create-user-patient/PatientForm';
import PatientHomePage from './routes/home/UserHomePage';
import HmiInformations from './routes/home/HmiInformations';
import PatientRegisters from './routes/registers/PatientRegisters';
import SelectPatientNew from './routes/registers/SelectPatientNew';
import FinishRegisterNew from './routes/registers/FinishRegisterNew';
import Register from './routes/registers/Register';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import SpecialistHomePage from './routes/home/SpecialistHomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <h1>Home!</h1>,
  },
  {
    path: '/create',
    element: <SelectUserType />

  },
  {
    path: '/user/create',
    element: <CreatePatient />

  },
  {
    path: '/user/create/patient',
    element: <ChildForm />
  },
  {
    path: '/specialist/create',
    element: <CreateSpecialist />

  },
  {
    path: '/user/home',
    element: <PatientHomePage />

  },
  {
    path: '/specialist/home',
    element: <SpecialistHomePage />

  },
  {
    path: '/user/home/hmi-informations',
    element: <HmiInformations />

  },
  {
    path: '/user/registers',
    element: <PatientRegisters />
  },
  {
    path: '/user/registers/new-register',
    element: <SelectPatientNew />
  },
  {
    path: '/user/registers/new-register/finish',
    element: <FinishRegisterNew />
  },
  {
    path: '/user/registers/register',
    element: <Register />

  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
