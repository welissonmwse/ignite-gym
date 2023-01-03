import { Center, ScrollView, Skeleton, VStack } from 'native-base';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { useState } from 'react';

export function Profile(){
  const [photoIsLoading, setPhotoIsLoading] = useState(true);
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
        </Center>
      </ScrollView>
    </VStack>
  );
}
