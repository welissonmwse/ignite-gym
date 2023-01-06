import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, useToast, VStack } from 'native-base';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  old_password: string;
  password_confirm: string;
}

const profileSchema = yup.object({
  name: yup.string().required('Inform o nome.'),

  password: yup.string()
    .min(8, 'A senha deve ter pelo menos 8 caracteres.')
    .nullable().transform((value) => value ? value : null),

  password_confirm: yup.string()
    .oneOf([yup.ref('password'), null], 'Senha incorreta')
    .nullable().transform((value) => value ? value : null)
    .when('password', {
      is: (Field: any) => Field,
      then: yup.string().nullable().required('Confirme a nova senha')
        .nullable().transform((value) => value ? value : null),
    }),
});

export function Profile(){
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://github.com/welissonmwse.png');

  const toast = useToast();
  const { user } = useAuth();

  const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  });

  async function handlePlofileUpdate(data: FormDataProps){
    console.log(data);
  }

  async function handleUserPhotoSelect(){
    try {
      setPhotoIsLoading(true);
      const photoSelected = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if(!photoSelected.canceled){
        const photoInfo = await FileSystem.getInfoAsync(photoSelected.assets[0].uri);

        if(photoInfo.size && (photoInfo.size / 1024 / 1024) > 5){
          return toast.show({
            title: 'Essa imagem é muito grande. Escolha uma de até 5MB.',
            placement: 'top',
            bgColor: 'red.500'
          });
        }
        setUserPhoto(photoSelected.assets[0].uri);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false);
    }
  }
  return(
    <VStack flex={1}>
      <ScreenHeader title="Perfil" />
      <ScrollView>
        <Center mt={6} px={10}>
          {
            photoIsLoading ? (
              <Skeleton
                w={33}
                h={33}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
            ) : (
              <UserPhoto
                source={{uri: userPhoto}}
                mr={4}
                size={33}
                alt="Imagem do usuário"
              />
            )
          }
          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name="name"
            render={({field: { onChange, value }}) => (
              <Input
                bg="gray.600"
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
            render={({field: { value }}) => (
              <Input
                bg="gray.600"
                value={value}
                isDisabled
              />
            )}
          />

        </Center>
        <VStack px={10} mt={12} mb={9}>
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mb={2}>
            Alterar Senha
          </Heading>
          <Controller
            control={control}
            name="old_password"
            render={({field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                onChangeText={onChange}
                secureTextEntry
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password_confirm"
            render={({field: { onChange }}) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                onChangeText={onChange}
                secureTextEntry
                errorMessage={errors.password_confirm?.message}
              />
            )}
          />
          <Button
            title="Atualizar"
            mt={4}
            onPress={handleSubmit(handlePlofileUpdate)}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
