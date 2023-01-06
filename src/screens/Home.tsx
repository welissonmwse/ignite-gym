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

export function Home(){
  const [exercises, setExercises] = useState<ExercisesDTO[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [groupSelected, setGroupSelected] = useState(groups[0]);

  const toast = useToast();
  const {navigate} = useNavigation<AppNavigationRoutesProps>();

  function handleOpenExerciseDetails(){
    navigate('exercise');
  }

  async function fetchGroups(){
    try {
      const response = await api.get('/groups');
      setGroups(response.data);

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
            isActive={groupSelected === item}
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
            <ExerciseCard data={item} onPress={handleOpenExerciseDetails}/>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{paddingBottom: 20}}
        />
      </VStack>
    </VStack>
  );
}
