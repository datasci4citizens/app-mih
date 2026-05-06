import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AuthGuard } from './guards/AuthGuard';

import SpecialistHomePage from './routes/home/SpecialistHomePage';
import PatientHomePage from './routes/home/UserHomePage';
import LoginPage from './routes/login/Login';
import SpecialistRegistersControl from './routes/registers/specialist/SpecialistRegistersControl';
import CreateRegister from './routes/registers/user/create-register/CreateRegisterForm';
import Patients from './routes/registers/user/Patients';
import PatientRegisters from './routes/registers/user/PatientRegisters';
import Register from './routes/registers/user/Register';
import CreateSpecialist from './routes/user/create-specialist/CreateSpecialist';
import PatientForm from './routes/user/create-user-patient/PatientForm';
import SelectUserType from './routes/user/SelectUserType';
import SettingsPage from './routes/user/SettingsPage';
import { SWRConfig } from 'swr';
import CreateUser from './routes/user/create-user-patient/CreateUser';
import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Fullscreen } from '@boengli/capacitor-fullscreen';
import { RoleGuard } from './guards/RoleGuard';
import { NoRoleGuard } from './guards/NoRoleGuard';
import { ChoseRoleGuard } from './guards/ChooseRoleGuard';
import { SpecialistGuard } from './guards/SpecialistGuard';
import { UserGuard } from './guards/UserGuard';
import apiClient from './lib/axios';
import AllRegisters from './routes/registers/user/AllRegisters';

import { ConsentUpdateGuard } from './guards/ConsentUpdateGuard';
import { Toaster } from './components/ui/toaster';
import { AndroidBackButtonHandler } from './components/AndroidBackButtonHandler';

/**
 * Layout raiz que injeta o AndroidBackButtonHandler globalmente.
 * Renderizado uma única vez para todo o app.
 */
function RootLayout() {
  return (
    <>
      <AndroidBackButtonHandler />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
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
            element: <ConsentUpdateGuard />,
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
                      },
                      {
                        path: '/user/settings',
                        element: <SettingsPage />
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
                        path: '/specialist/settings',
                        element: <SettingsPage />
                      },
                      {
                        path: '/specialist/home/registers-evaluation',
                        element: <SpecialistRegistersControl />
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: '/',
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
    ]
  }
]);

export function App() {
  useEffect(() => {
    const activateImmersiveMode = async () => {
      if (Capacitor.isNativePlatform()) {
        try {
          await Fullscreen.activateImmersiveMode();
        } catch (error) {
          if (import.meta.env.VITE_DEV_MODE === 'true') {
            console.error('Failed to activate immersive mode:', error);
          }
        }
      }
    };
    activateImmersiveMode();
  }, []);
  return (
    <SWRConfig value={{
      fetcher: (url) => apiClient.get(url).then(res => res.data)
    }}>
      <RouterProvider router={router} />
      <Toaster />
    </SWRConfig>
  )
}
