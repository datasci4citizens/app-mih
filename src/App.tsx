import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-user-patient/CreateUser';
import PatientForm from './routes/user/create-user-patient/PatientForm';
import PatientHomePage from './routes/home/UserHomePage';
import HmiInformations from './routes/home/HmiInformations';
import PatientRegisters from './routes/registers/user/PatientRegisters';
import SelectPatientNew from './routes/registers/user/SelectPatientNew';
import FinishRegisterNew from './routes/registers/user/FinishRegisterNew';
import Register from './routes/registers/user/Register';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import SpecialistHomePage from './routes/home/SpecialistHomePage';
import PendingRegisters from './routes/registers/specialist/PendingRegisters';
import RegisterDiagnostic from './routes/registers/specialist/RegisterDiagnostic';
import TCLE from './routes/user/create-user-patient/Tcle';

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
    path: 'user/create/tcle',
    element: <TCLE />

  },
  {
    path: '/user/create/patient/:id',
    element: <PatientForm />
  },
  {
    path: '/specialist/create',
    element: <CreateSpecialist />

  },
  {
    path: '/user/home/:id',
    element: <PatientHomePage />

  },
  {
    path: '/specialist/home',
    element: <SpecialistHomePage />

  },
  {
    path: '/user/home/hmi-informations/:id',
    element: <HmiInformations />

  },
  {
    path: '/user/registers/:id',
    element: <PatientRegisters />
  },
  {
    path: '/user/registers/new-register/:id',
    element: <SelectPatientNew />
  },
  {
    path: '/user/registers/new-register/finish/:id',
    element: <FinishRegisterNew />
  },
  {
    path: '/user/registers/register/:id',
    element: <Register />

  },
  {
    path: '/specialist/home/pending-registers',
    element: <PendingRegisters />

  },
  {
    path: '/specialist/home/register-diagnostic',
    element: <RegisterDiagnostic />
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
