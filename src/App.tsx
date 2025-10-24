import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthGuard } from './guards/auth';
import HmiInformations from './routes/home/HmiInformations';
import SpecialistHomePage from './routes/home/SpecialistHomePage';
import PatientHomePage from './routes/home/UserHomePage';
import LoginPage from './routes/login/Login';
import SpecialistRegistersControl from './routes/registers/specialist/SpecialsitRegistersControl';
import CreateRegister from './routes/registers/user/create-register/CreateRegisterForm';
import RegistersControl from './routes/registers/user/RegistersControl';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import PatientForm from './routes/user/create-user-patient/PatientForm';
import TCLE from './routes/user/create-user-patient/Tcle';
import SelectUserType from './routes/user/SelectUserType';
import { SWRConfig } from 'swr';
import CreateUser from './routes/user/create-user-patient/CreateUser';
import { RoleGuard } from './guards/role';
import { NoRoleGuard } from './guards/norole';
import { ChoseRoleGuard } from './guards/choserole';
import { SpecialistGuard } from './guards/specialist';
import { UserGuard } from './guards/user';

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
                element: <RegistersControl />
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
            path: '/user/create/tcle',
            element: <TCLE />
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
      fetcher: (url, args) => fetch(`${import.meta.env.VITE_SERVER_URL}${url}`, { credentials: 'include', ...args }).then(res => res.json())
    }}>
      <RouterProvider router={router} />
    </SWRConfig>
  )
}
