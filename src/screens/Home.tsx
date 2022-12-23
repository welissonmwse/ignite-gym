import { useState } from 'react';
import { HStack, VStack } from 'native-base';

import { HomeHeader } from '@components/HomeHeader';
import { Group } from '@components/Group';

export function Home(){
  const [groupSelected, setGroupSelected] = useState('Costa');

  return(
    <VStack flex={1}>
      <HomeHeader />
      <HStack>
        <Group
          name="Costa"
          isActive={groupSelected === 'Costa'}
          onPress={() => setGroupSelected('Costa')}
        />
        <Group
          name="Ombro"
          isActive={groupSelected === 'Ombro'}
          onPress={() => setGroupSelected('Ombro')}
        />
      </HStack>
    </VStack>
  );
}
