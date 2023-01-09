import { TouchableOpacity } from 'react-native';
import { Heading, HStack, Icon, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

import { api } from '@services/api';

import { useAuth } from '@hooks/useAuth';

import { UserPhoto } from './UserPhoto';

import defaultUserPhotoImg from '@assets/userPhotoDefault.png';

export function HomeHeader(){
  const {user, signOut} = useAuth();

  async function handleSignOut(){
    await signOut();
  }

  return(
    <HStack bg="gray.600" pt={16} pb={5} px={8} alignItems="center">
      <UserPhoto
        source={user.avatar ? {uri: `${api.defaults.baseURL}/avatar/${user.avatar}`} : defaultUserPhotoImg}
        mr={4}
        size={16}
        alt="Imagem do usuário"
      />
      <VStack flex={1}>
        <Text color="gray.100" fontSize="md">
          Olá,
        </Text>
        <Heading color="gray.100" fontSize="md" fontFamily="heading">
          {user.name}
        </Heading>
      </VStack>
      <TouchableOpacity onPress={handleSignOut}>
        <Icon
          as={MaterialIcons}
          name="logout"
          size={7}
          color="gray.200"
        />
      </TouchableOpacity>
    </HStack>
  );
}
