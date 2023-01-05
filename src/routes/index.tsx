import { useAuth } from '@hooks/useAuth';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useTheme } from 'native-base';
import { AppRoutes } from './app.routes';
import { AuthRoutes } from './auth.routes';

export function Routes(){
  const {user} = useAuth();
  const {colors} = useTheme();

  const theme = DefaultTheme;
  theme.colors.background = colors.gray[700];

  return(
    <NavigationContainer theme={theme}>
      {user.id ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}
