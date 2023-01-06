import { useCallback, useEffect, useState } from 'react';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { ExercisesDTO } from '@dtos/ExercisesDTO';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';
import { AppNavigationRoutesProps } from '@routes/app.routes';
import { Loading } from '@components/Loading';

export function Home(){
  const [isLoading, setIsLoading] = useState(false);
  const [exercises, setExercises] = useState<ExercisesDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState('');

  const toast = useToast();
  const {navigate} = useNavigation<AppNavigationRoutesProps>();

  function handleOpenExerciseDetails(execiseId: string){
    navigate('exercise', {execiseId});
  }

  async function fetchGroups(){
    try {
      const response = await api.get('/groups');
      setGroups(response.data);
      setGroupSelected(response.data[0]);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function fetchExercisesByGroups(){
    try {
      setIsLoading(true);
      const response = await api.get(`/exercises/bygroup/${groupSelected}`);
      setExercises(response.data);

    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';

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
    fetchGroups();
  }, []);

  useFocusEffect(useCallback(() => {
    fetchExercisesByGroups();
  }, [groupSelected]));

  return(
    <VStack flex={1}>
      <HomeHeader />
      <FlatList
        data={groups}
        keyExtractor={item => item}
        renderItem={({item}) => (
          <Group
            name={item}
            isActive={groupSelected?.toUpperCase() === item.toUpperCase()}
            onPress={() => setGroupSelected(item)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        _contentContainerStyle={{px: 8}}
        my={10}
        maxH={10}
        minH={10}
      />

      {
        isLoading ? (
          <Loading />
        ) : (
          <VStack flex={1} px={8}>
            <HStack justifyContent="space-between" mb={5}>
              <Heading color="gray.200" fontSize="md" fontFamily="heading">
                Exercícios
              </Heading>
              <Text color="gray.200" fontSize="sm">
                {exercises.length}
              </Text>
            </HStack>
            <FlatList
              data={exercises}
              keyExtractor={item => item.id}
              renderItem={({item}) => (
                <ExerciseCard data={item} onPress={() => handleOpenExerciseDetails(item.id)}/>
              )}
              showsVerticalScrollIndicator={false}
              _contentContainerStyle={{paddingBottom: 20}}
            />
          </VStack>
        )
      }
    </VStack>
  );
}
