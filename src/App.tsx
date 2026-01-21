import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard } from './guards/auth';
import HmiInformations from './routes/home/HmiInformations';
import SpecialistHomePage from './routes/home/SpecialistHomePage';
import PatientHomePage from './routes/home/UserHomePage';
import LoginPage from './routes/login/Login';
import SpecialistRegistersControl from './routes/registers/specialist/SpecialsitRegistersControl';
import CreateRegister from './routes/registers/user/create-register/CreateRegisterForm';
import Patients from './routes/registers/user/Patients';
import PatientRegisters from './routes/registers/user/PatientRegisters';
import Register from './routes/registers/user/Register';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import PatientForm from './routes/user/create-user-patient/PatientForm';
import SelectUserType from './routes/user/SelectUserType';
import { SWRConfig } from 'swr';
import CreateUser from './routes/user/create-user-patient/CreateUser';
import { RoleGuard } from './guards/role';
import { NoRoleGuard } from './guards/norole';
import { ChoseRoleGuard } from './guards/choserole';
import { SpecialistGuard } from './guards/specialist';
import { UserGuard } from './guards/user';
import apiClient from './lib/axios';
import AllRegisters from './routes/registers/user/AllRegisters';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/',
    element: <AuthGuard />,
    children: [
      {
        path: '/',
        element: <RoleGuard />,
        children: [
          {
            path: '/',
            element: <ChoseRoleGuard />
          },
          {
            path: '/user',
            element: <UserGuard />,
            children: [
              {
                path: '/user/create/patient',
                element: <PatientForm />
              },
              {
                path: '/user/home',
                element: <PatientHomePage />

              },
              {
                path: '/user/home/hmi-informations',
                element: <HmiInformations />

              },
              {
                path: '/user/registers',
                element: <AllRegisters />
              },
              {
                path: '/user/patients',
                element: <Patients />
              },
              {
                path: '/user/patients/:patientId',
                element: <PatientRegisters />
              },
              {
                path: '/user/patients/:patientId/:registerId',
                element: <Register />
              },
              {
                path: '/user/registers/create-register/:patient_id/:first_time',
                element: <CreateRegister />
              }
            ]

          },
          {

            path: '/specialist',
            element: <SpecialistGuard />,
            children: [

              {
                path: '/specialist/home',
                element: <SpecialistHomePage />

              },
              {

                path: '/specialist/home/registers-evaluation',
                element: <SpecialistRegistersControl />

              }
            ]

          },
        ]
      },
      {
        path: "/",
        element: <NoRoleGuard />,
        children: [

          {
            path: '/user/create',
            element: <CreateUser />
          },
          {
            path: '/specialist/create',
            element: <CreateSpecialist />
          },
          {
            path: '/select',
            element: <SelectUserType />
          },
        ]

      }
    ]
  }
]);

export function App() {
  return (
    <SWRConfig value={{
      fetcher: (url) => apiClient.get(url).then(res => res.data)
    }}>
      <RouterProvider router={router} />
    </SWRConfig>
  )
}
