import { useTheme } from 'native-base';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { Loading } from '@components/Loading';
import { useAuth } from '@hooks/useAuth';

import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export function Routes(){
  const {user, isLoadingUserStorageData} = useAuth();
  const {colors} = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  if(isLoadingUserStorageData){
    return <Loading />;
  }

  return(
    <NavigationContainer theme={theme}>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
