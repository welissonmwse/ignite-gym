import { useNavigation } from '@react-navigation/native';
import { Center, Heading, Image, ScrollView, Text, VStack } from 'native-base';

import { Input } from '@components/Input';
import { Button } from '@components/Button';

import backgroundImg from '@assets/background.png';
import LogoSvg from '@assets/logo.svg';

export function SignUp(){
  const { goBack } = useNavigation();

  function handleGoBack(){
    goBack();
  }

  return(
    <ScrollView contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <VStack flex={1} px={10} pb={10}>
        <Image source={backgroundImg} alt="Pessoas treinando" resizeMode="contain" position="absolute"/>
        <Center my={24}>
          <LogoSvg />
          <Text color="gray.100" fontSize="sm">
            Treine sua mente e o seu corpo
          </Text>
        </Center>
        <Center>
          <Heading color="gray.100" fontSize="xl" fontFamily="heading" mb={6}>
            Crie sua conta
          </Heading>
          <Input
            placeholder="Nome"
          />
          <Input
            placeholder="E-mail"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            placeholder="Senha"
            secureTextEntry
          />
          <Button title="Criar e acessar" />
        </Center>

        <Button
          mt={24}
          title="Voltar para o login"
          variant="outline"
          onPress={handleGoBack}
        />

      </VStack>
    </ScrollView>
  );
}
