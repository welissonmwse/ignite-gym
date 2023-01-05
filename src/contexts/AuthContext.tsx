import React, { createContext, useEffect, useState } from 'react';

import { storageUserGet, storageUserSave } from '@storage/storageUser';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => void;
}

type AuthContextProviderDataProps = {
  children : React.ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children } : AuthContextProviderDataProps){
  const [user, setUser] = useState({} as UserDTO);

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
    const userLogged = await storageUserGet();

    if(userLogged){
      setUser(userLogged);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{user, signIn}}>
      {children}
    </AuthContext.Provider>
  );
}
