import { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Box, Heading, HStack, Icon, Image, ScrollView, Text, useToast, VStack } from 'native-base';

import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { AppNavigationRoutesProps } from '@routes/app.routes';

import { Button } from '@components/Button';
import { Loading } from '@components/Loading';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { ExercisesDTO } from '@dtos/ExercisesDTO';

import BadySvg from '@assets/body.svg';
import SeriesSvg from '@assets/series.svg';
import RepetitionsSvg from '@assets/repetitions.svg';

type RouteParams = {
  exerciseId: string;
}

export function Exercise(){
  const [isLoading, setIsLoading] = useState(true);
  const [sendingRegister, setSendingRegister] = useState(false);
  const [exercise, setExercise] = useState<ExercisesDTO>({} as ExercisesDTO);

  const { goBack, navigate } = useNavigation<AppNavigationRoutesProps>();
  const { params } = useRoute();
  const toast = useToast();

  const { exerciseId } = params as RouteParams;

  function handleGoBack(){
    goBack();
  }

  async function fetchExerciseDetails(){
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/${exerciseId}`);
      setExercise(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os detalhes do exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExerciseHistoryRegister(){
    try {
      setSendingRegister(true);
      await api.post('/history', {exercise_id: exerciseId});

      toast.show({
        title: 'Parabéns! Exercício registrado ao seu histórico.',
        placement: 'top',
        bgColor: 'green.500',
      });

      navigate('history');

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível registrar o exercício.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setSendingRegister(false);
    }
  }

  useEffect(() => {
    fetchExerciseDetails();
  }, [exerciseId]);

  return(
    <VStack flex={1}>
      <VStack px={8} bg="gray.600" pt={12}>
        <TouchableOpacity onPress={handleGoBack}>
          <Icon as={Feather} name="arrow-left" color="green.500" size={6} />
        </TouchableOpacity>
        <HStack justifyContent="space-between" alignItems="center" mt={4} mb={8}>
          <Heading color="gray.100" fontSize="lg" fontFamily="heading" flexShrink={1}>
            {exercise.name}
          </Heading>
          <HStack alignItems="center">
            <BadySvg />
            <Text color="gray.200" ml={1} textTransform="capitalize">
              {exercise.group}
            </Text>
          </HStack>
        </HStack>
      </VStack>
      {
        isLoading ? (
          <Loading />
        ) : (
          <ScrollView>
            <VStack p={8}>
              <Box rounded="lg" mb={3} overflow="hidden">
                <Image
                  source={{uri: `${api.defaults.baseURL}/exercise/demo/${exercise.demo}`}}
                  alt="Image do exercício"
                  w="full"
                  h={80}
                  resizeMode="cover"
                />
              </Box>
              <Box bg="gray.600" rounded="md" pb={4} px={4}>
                <HStack alignItems="center" justifyContent="space-around" mb={6} mt={5}>
                  <HStack>
                    <SeriesSvg />
                    <Text color="gray.200" ml={2}>
                      {exercise.series} séries
                    </Text>
                  </HStack>
                  <HStack>
                    <RepetitionsSvg />
                    <Text color="gray.200" ml={2}>
                      {exercise.repetitions} repetições
                    </Text>
                  </HStack>
                </HStack>
                <Button
                  title="Marcar como realizado"
                  isLoading={sendingRegister}
                  onPress={handleExerciseHistoryRegister}
                />
              </Box>
            </VStack>
          </ScrollView>
        )
      }
    </VStack>
  );
}
