import { TouchableOpacity } from 'react-native';
import { Heading, HStack, Icon, Text, VStack } from 'native-base';

import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';


import { AppNavigationRoutesProps } from '@routes/app.routes';

import BadySvg from '@assets/body.svg';

export function Exercise(){
  const { goBack } = useNavigation<AppNavigationRoutesProps>();

  function handleGoBack(){
    goBack();
  }

  return(
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack justifyContent="space-between" alignItems="center" mt={4} mb={8}>
          <Heading color="gray.100" fontSize="lg" flexShrink={1}>
            Puxada frontal
          </Heading>
          <HStack alignItems="center">
            <BadySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              Costas
            </Text>
          </HStack>
        </HStack>
      </VStack>
    </VStack>
  );
}
