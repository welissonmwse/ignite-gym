import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from 'native-base';
import { Controller, useForm } from 'react-hook-form';

import { useAuth } from '@hooks/useAuth';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import { AuthNavigationRoutesProps } from '@routes/auth.routes';

import { AppError } from '@utils/AppError';

import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

type FormData = {
  email: string;
  password: string;
}

export function SignIn(){
  const [isLoading, setIsLoading] = useState(false);

  const { navigate } = useNavigation<AuthNavigationRoutesProps>();
  const {signIn} = useAuth();
  const toast = useToast();

  const {control, handleSubmit, formState: {errors}} = useForm<FormData>();

  function handleNewAccount(){
    navigate('signUp');
  }

  async function handleSignIn({email, password}: FormData){
    try {
      setIsLoading(true);
      await signIn(email, password);

    } catch (error) {
      const isAppError = error instanceof AppError;

      const title = isAppError ? error.message : 'Não foi possível efetuar o login. Tente mais tarde.';

      setIsLoading(false);

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  return(
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={10}>
        <Image
          source={backgroundImg}
          defaultSource={backgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
          Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Acesse sua conta
          </Heading>
          <Controller
            control={control}
            name="email"
            rules={{required: 'Informe o e-mail'}}
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{required: 'Informe a senha'}}
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="Senha"
                secureTextEntry
                onChangeText={onChange}
                value={value}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Button
            title="Acessar"
            onPress={handleSubmit(handleSignIn)}
            isLoading={isLoading}
          />
        </Center>
        <Center mt={24}>
          <Text color="gray.100" fontSize="sm" mb={3} fontFamily="body">
            Ainda não tem acesso?
          </Text>
          <Button
            title="Criar conta"
            variant="outline"
            onPress={handleNewAccount}
          />
        </Center>
      </VStack>
    </ScrollView>
  );
}
