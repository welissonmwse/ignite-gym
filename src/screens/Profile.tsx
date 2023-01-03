import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, Skeleton, Text, VStack } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { useState } from 'react';

export function Profile(){
  const [photoIsLoading, setPhotoIsLoading] = useState(false);
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
                source={{uri: 'https://github.com/welissonmwse.png'}}
                mr={4}
                size={33}
                alt="Imagem do usuário"
              />
            )
          }
          <TouchableOpacity>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar foto
            </Text>
          </TouchableOpacity>
        </Center>
      </ScrollView>
    </VStack>
  );
}
