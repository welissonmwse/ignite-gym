import { useEffect, useState } from 'react';
import { Heading, SectionList, Text, useToast, VStack } from 'native-base';

import { api } from '@services/api';
import { AppError } from '@utils/AppError';

import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';

export function History(){
  const [isLoading, setIsLoading] = useState(true);
  // const [exercises, setExercises] = useState([]);
  const exercises = [
    {
      title: '26.08.23',
      data: ['Puxada frontal', 'Remada unilateral']
    },
    {
      title: '27.08.23',
      data: ['Puxada frontal']
    },
  ];

  const toast = useToast();

  async function fetchHistory(){
    try {
      setIsLoading(true);
      const response = await api.get('/history');
      // setExercises(response.data);
      console.log(response.data[0]);
      // const data = response.data.map()

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar o histórico de exercícios';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  return(
    <VStack flex={1}>
      <ScreenHeader title="Histórico de Exercícios" />
      <SectionList
        sections={exercises}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <HistoryCard />
        )}
        renderSectionHeader={({section}) => (
          <Heading color="gray.200" fontSize="md" fontFamily="heading" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
        contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: 'center'}}
        ListEmptyComponent={() => (
          <Text color="gray.100" textAlign="center">
            Não há exercícios registrados ainda. {'\n'}
            Vamos fazer exercícios hoje?
          </Text>
        )}
        showsVerticalScrollIndicator={false}
      />
    </VStack>
  );
}
