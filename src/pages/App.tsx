
import { Flex, Box, Container, Heading, Image, Center } from '@chakra-ui/react';
import FlipMove from 'react-flip-move';
import TeamCard from '../components/TeamCard';
import useTeams from '../hooks/useTeams';
import { useEffect, useState } from 'react';

function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1);
}

function App() {
  const timeOut = 5000;
  const forceUpdate = useForceUpdate();
  const { teams, diff: allDiff } = useTeams(timeOut);

  useEffect(() => {
    setInterval(() => forceUpdate(), timeOut);
  }, [forceUpdate]);

  return (
    <Container marginTop={10}>
      <Flex direction='column' justify='space-betweens'>
        <Center marginBottom={5}>
          <Image boxSize='100' borderRadius='5'
            src='./bank-app/logo512.png' alt='2023 csie camp logo'
          />
        </Center>
        <Box marginBottom={10}>
          <Heading textAlign='center'>找尋我的200億 - 小隊存款</Heading>
        </Box>
        <Box>
          <Flex direction='column'>
            <FlipMove>
              {teams.sort((a, b) => b.money - a.money).map((v, i) => {
                const diff = (Date.now() - allDiff[v.id]?.at.getTime() < timeOut) ? allDiff[v.id].amount : undefined;

                return <TeamCard
                  key={v.id} name={v.name} money={v.money} diff={diff}
                  marginBottom={2} size='sm'
                />
              })}
            </FlipMove>
          </Flex>
        </Box>
      </Flex>
    </Container>
  );
}

export default App;
