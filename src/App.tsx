import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-user-patient/CreateUser';
import PatientForm from './routes/user/create-user-patient/PatientForm';
import PatientHomePage from './routes/home/UserHomePage';
import HmiInformations from './routes/home/HmiInformations';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import SpecialistHomePage from './routes/home/SpecialistHomePage';
import PendingRegisters from './routes/registers/specialist/PendingRegisters';
import RegisterDiagnostic from './routes/registers/specialist/RegisterDiagnostic';
import TCLE from './routes/user/create-user-patient/Tcle';
import CreateRegister from './routes/registers/user/create-register/CreateRegisterForm';
import RegistersControl from './routes/registers/user/RegistersControl';

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
    path: '/user/create/patient',
    element: <PatientForm />
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
    element: <RegistersControl />
  },
  {
    path: '/user/registers/create-register',
    element: <CreateRegister />
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
  return (
    <RouterProvider router={router} />
  )
}
