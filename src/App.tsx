import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SelectUserType from './routes/user/SelectUserType';
import CreatePatient from './routes/user/create-patient/CreatePatient';
import ChildForm from './routes/user/create-patient/ChildForm';

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
  }
]);

export function App() {
  return <RouterProvider router={router} />;
}
