import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, Heading, ScrollView, Skeleton, Text, useToast, VStack } from 'native-base';

import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as yup from 'yup';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { useAuth } from '@hooks/useAuth';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/Input';
import { Button } from '@components/Button';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

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
  const [isUpdating, setIsUpdating] = useState(false);
  const [photoIsLoading, setPhotoIsLoading] = useState(false);

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const {control, handleSubmit, formState: {errors}} = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver(profileSchema)
  });

  async function handlePlofileUpdate(data: FormDataProps){
    try {
      setIsUpdating(true);
      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);

      await updateUserProfile(userUpdated);

      toast.show({
        title: 'Perfil atualizado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível atualizar dados.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });

    } finally {
      setIsUpdating(false);
    }
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
        // setUserPhoto(photoSelected.assets[0].uri);
        const fileExtension = photoSelected.assets[0].uri.split('.').pop();

        const photoFile = {
          name: `${user.name}.${fileExtension}`.toLowerCase(),
          uri: photoSelected.assets[0].uri,
          type: `${photoSelected.assets[0].type}/${fileExtension}`
        } as any;

        const userPhotoUploadForm = new FormData();
        userPhotoUploadForm.append('avatar', photoFile);

        const avatarUpdatedResponse = await api.patch('/users/avatar', userPhotoUploadForm, {
          headers: { 'Content-Type': 'multipart/form-data'}
        });

        const userUpdated = user;
        userUpdated.avatar = avatarUpdatedResponse.data.avatar;

        updateUserProfile(userUpdated);

        toast.show({
          title: 'Foto atualizada!',
          placement: 'top',
          bgColor: 'green.700'
        });
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
                source={user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultUserPhotoImg}
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
            isLoading={isUpdating}
          />
        </VStack>
      </ScrollView>
    </VStack>
  );
}
