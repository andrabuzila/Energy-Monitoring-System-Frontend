import React, { useMemo, createContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout from './components/Layout';
import './custom.css';
import { usePersistState } from './hooks/UsePersistState';
import './App.css';


export const AppContext = createContext()

const App = () => {
  const [userId, setUserId] = usePersistState('userId', null);
  const [userRole, setUserRole] = usePersistState('userRole', '')
  const [users, setUsers] = usePersistState('users', null);
  const [devices, setDevices] = usePersistState('devices', null);
  const [devicesForUser, setDevicesForUser] = usePersistState('devicesForUser', null);
  const [isLoggedIn, setIsLoggedIn] = usePersistState('loggedIn', false);
  const [devicesForAllUsers, setDevicesForAllUsers] = usePersistState('allDevices', false);
  const appRoutes = useMemo(() => {
    return AppRoutes();
  },[])
    return (
      <AppContext.Provider value ={{userId, setUserId, users, setUsers, isLoggedIn, setIsLoggedIn, devices, setDevices, devicesForUser, setDevicesForUser, userRole, setUserRole, devicesForAllUsers, setDevicesForAllUsers}}>
      <Layout>
        <Routes>
          {appRoutes.map((route, index) => {
            const { element, ...rest } = route;
            return <Route key={index} {...rest} element={element} />;
          })}
        </Routes>
      </Layout>
      </AppContext.Provider>
    );
}

export default App;
