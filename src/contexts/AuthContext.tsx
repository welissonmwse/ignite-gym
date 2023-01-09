import React, { createContext, useEffect, useState } from 'react';

import { storageUserGet, storageUserRemove, storageUserSave } from '@storage/storageUser';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuthToken';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingUserStorageData: boolean;
  refreshedToken: string;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (user: UserDTO) => Promise<void>;
}

type AuthContextProviderDataProps = {
  children : React.ReactNode
}

export const AuthContext = createContext<AuthContextDataProps>({} as AuthContextDataProps);

export function AuthContextProvider({ children } : AuthContextProviderDataProps){
  const [user, setUser] = useState({} as UserDTO);
  const [refreshedToken, setRefreshedToken] = useState('');
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] = useState(true);

  async function userAndTokenUpdate(userData: UserDTO, token: string) {
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

  async function signOut(){
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);
      await storageUserRemove();
      await storageAuthTokenRemove();

    } catch (error) {
      console.log(error);
      throw error;

    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function updateUserProfile(user: UserDTO){
    try {
      setUser(user);
      await storageUserSave(user);

    } catch (error) {
      console.log(error);
      throw error;
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

  function refreshTokenUpdated(newToken: string){
    setRefreshedToken(newToken);
  }

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager({ signOut, refreshTokenUpdated });

    return () => {
      subscribe();
    };
  },[signOut]);

  return (
    <AuthContext.Provider value={{user, isLoadingUserStorageData, refreshedToken, signIn, signOut, updateUserProfile}}>
      {children}
    </AuthContext.Provider>
  );
}
