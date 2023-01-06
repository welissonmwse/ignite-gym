import React, { createContext, useEffect, useState } from 'react';

import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser';
import { storageAuthTokenGet, storageAuthTokenSave } from '@storage/storageAuthToken';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingUserStorageData: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  singOut: () => Promise<void>;
}

type AuthContextProviderDataProps = {
  children : React.ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children } : AuthContextProviderDataProps){
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  function userAndTokenUpdate(userData: UserDTO, token: string){
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    setUser(userData);
  }

  async function storageUserAndTokenSave(userData: UserDTO, token: string){
    try {
      setIsLoadingUserStorageData(true);

      await storageUserSave(userData);
      await storageAuthTokenSave(token);

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function signIn(email: string, password: string){
    try {
      const {data} = await api.post('/sessions', {email, password});

      if(data.user && data.token){
        await storageUserAndTokenSave(data.user, data.token);

        userAndTokenUpdate(data.user, data.token);
      }

    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  async function singOut(){
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function loadUserData(){
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const token = await storageAuthTokenGet();

      if(token && userLogged){
        userAndTokenUpdate(userLogged, token);
      }

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{user, isLoadingUserStorageData, signIn, singOut}}>
      {children}
    </AuthContext.Provider>
  );
}
