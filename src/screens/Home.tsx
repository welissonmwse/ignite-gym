import { useState } from 'react';
import { FlatList, Heading, HStack, Text, VStack } from 'native-base';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';
import { ExerciseCard } from '@components/ExerciseCard';

export function Home(){
  const groups = ['Costas', 'Bíceps', 'Tríceps', 'Ombro'];
  const exercise = ['Puxada frontal', 'Remada curvada', 'Remada unilateral', 'Levantamento terra'];
  const [groupSelected, setGroupSelected] = useState(groups[0]);

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
      />
      <VStack flex={1} px={8}>
        <HStack justifyContent="space-between" mb={5}>
          <Heading color="gray.200" fontSize="md">
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
            <ExerciseCard name={item}/>
          )}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{paddingBottom: 20}}
        />
      </VStack>
    </VStack>
  );
}
