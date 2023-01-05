import React, { createContext, useEffect, useState } from 'react';

import { storageUserGet, storageUserSave } from '@storage/storageUser';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => void;
  isLoadingUserStorageData: boolean;
}

type AuthContextProviderDataProps = {
  children : React.ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children } : AuthContextProviderDataProps){
  const [user, setUser] = useState({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function signIn(email: string, password: string){
    try {
      const {data} = await api.post('/sessions', {email, password});

      if(data.user){
        setUser(data.user);
        storageUserSave(data.user);
        console.log(data.user);
      }

    } catch (error) {
      console.log(error);
      throw error;
    }

  }

  async function loadUserData(){
    try {
      const userLogged = await storageUserGet();

      if(userLogged){
        setUser(userLogged);
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
    <AuthContext.Provider value={{user, isLoadingUserStorageData, signIn}}>
      {children}
    </AuthContext.Provider>
  );
}
