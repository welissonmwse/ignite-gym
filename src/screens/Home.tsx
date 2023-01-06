import { useEffect, useState } from 'react';
import { FlatList, Heading, HStack, Text, useToast, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';

import { AppError } from '@utils/AppError';
import { api } from '@services/api';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';
import { AppNavigationRoutesProps } from '@routes/app.routes';

export function Home(){
  const exercise = ['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra'];
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

  useEffect(() => {
    fetchGroups();
  }, []);

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
            4
          </Text>
        </HStack>
        <FlatList
          data={exercise}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <ExerciseCard name={item} onPress={handleOpenExerciseDetails}/>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{paddingBottom: 20}}
        />
      </VStack>
    </VStack>
  );
}
