import { Heading, SectionList, VStack } from 'native-base';

import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';

export function History(){
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
          <Heading color="gray.200" fontSize="md" mt={10} mb={3}>
            {section.title}
          </Heading>
        )}
        px={8}
      />
    </VStack>
  );
}
