import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Center, Heading, Image, ScrollView, Text, useToast, VStack } from 'native-base';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { AppError } from '@utils/AppError';

import { api } from '@services/api';

import { useAuth } from '@hooks/useAuth';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

type FormDataProps = {
  name: string
  email: string
  password: string
  password_confirm: string
}

const signUpSchema = yup.object({
  name: yup.string().required('Inform o nome.'),

  email: yup.string().required('Informe o e-mail.')
    .email('E-mail inválido.'),

  password: yup.string().required('Informe a senha.')
    .min(8, 'A senha deve ter pelo menos 8 caracteres.'),

  password_confirm: yup.string().required('Confirme a senha.')
    .oneOf([yup.ref('password'), null], 'Senha incorreta'),
});

export function SignUp(){
  const [isLoading, setIsLoading] = useState(false);

  const { control, handleSubmit, formState: {errors} } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  });

  const {signIn} = useAuth();
  const { goBack } = useNavigation();
  const toast = useToast();

  function handleGoBack(){
    goBack();
  }

  async function handleSignUp({name, email, password}: FormDataProps){
    try {
      setIsLoading(true);
      await api.post('/users', {name, email, password});
      await signIn(email, password);

    } catch (error) {
      setIsLoading(false);
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível criar a conta. Tente mais tarde';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      });
    }
  }

  return(
    <ScrollView
      contentContainerStyle={{flexGrow: 1}}
      showsVerticalScrollIndicator={false}
    >
      <VStack flex={1} px={10} pb={10}>
        <Image
          source={backgroundImg}
          defaultSource={backgroundImg}
          alt="Pessoas treinando"
          resizeMode="contain"
          position="absolute"
        />
        <Center my={16}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Crie sua conta
          </Heading>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="Nome"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="E-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({ field: { onChange, value }}) => (
              <Input
                bg="gray.700"
                placeholder="Confirme a Senha"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType="send"
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />
          <Button
            title="Criar e acessar"
            onPress={handleSubmit(handleSignUp)}
            isLoading={isLoading}
          />
        </Center>

        <Button
          mt={12}
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />

      </VStack>
    </ScrollView>
  );
}
