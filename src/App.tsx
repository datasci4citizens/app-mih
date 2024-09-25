import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-patient/CreatePatient';
import ChildForm from './routes/user/create-patient/ChildForm';
import PatientHomePage from './routes/home/PatientHomePage';

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

  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
