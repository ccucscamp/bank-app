
import { Flex, Box, Container, Heading, Image, Center } from '@chakra-ui/react';
import FlipMove from 'react-flip-move';
import TeamCard from '../components/TeamCard';
import useTeams from '../hooks/useTeams';
import { useEffect, useMemo, useState } from 'react';
import { socket } from '../socket';

function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return () => setValue(value => value + 1);
}

function numberToCardNum(num: number): string {
  if (num === 1) return 'A';
  if (num === 11) return 'J';
  if (num === 12) return 'Q';
  if (num === 13) return 'K';
  if (num === 0) return '';
  return `${num}`;
}

function Lottery() {
  const [choosenNumber, setChoosenNunber] = useState<number[]>([]);
  const [runningNum, setRunningNum] = useState<number>();

  const pickOne = (exists: number[]) => {
    return new Promise<number>((res) => {
      let runNum = 0;

      const constVelChangeNumber = (timeOut: number, speed: number) => {
        return new Promise((res) => {
          let interval = setInterval(() => {
            do {
              runNum = runNum + 1;
              if (runNum > 13) runNum = 1;
              // eslint-disable-next-line no-loop-func
            } while (exists.findIndex((v) => v === runNum) !== -1);
            setRunningNum(runNum);
          }, speed);

          setTimeout(() => {
            clearInterval(interval);
            res(undefined);
          }, timeOut);
        });
      }

      constVelChangeNumber(500, 10)
        .then(() => constVelChangeNumber(500, 20))
        .then(() => constVelChangeNumber(500, 30))
        .then(() => constVelChangeNumber(500, 40))
        .then(() => constVelChangeNumber(500, 50))
        .then(() => constVelChangeNumber(500, 60))
        .then(() => constVelChangeNumber(500, 70))
        .then(() => constVelChangeNumber(500, 80))
        .then(() => constVelChangeNumber(500, 160))
        .then(() => constVelChangeNumber(500, 320))
        .then(() => constVelChangeNumber(500, 640))
        .then(() => {
          res(runNum);
        });
    })
  }

  useEffect(() => {
    const startLottery = () => {
      let choosenNum: number[] = [];

      const update = (v: number) => {
        choosenNum = [...choosenNum, v];
        setChoosenNunber(choosenNum);
      };

      pickOne(choosenNum)
        .then(update)
        .then(() => pickOne(choosenNum))
        .then(update)
        .then(() => pickOne(choosenNum))
        .then(update)
        .then(() => pickOne(choosenNum))
        .then(update)
        .then(() => pickOne(choosenNum))
        .then(update);
    };

    socket.on('lottery_run', () => {
      startLottery();
    });

    return () => {
      socket.off('lottery_run');
    }
  }, []);

  const dispChoosenNumber = useMemo(() => {
    return [0, 0, 0, 0, 0].map((v, i) => choosenNumber[i] ?? v);
  }, [choosenNumber]);

  return <>
    <Box marginBottom={10}>
      <Flex justify='space-between'>
        {dispChoosenNumber.map((v, i) => {
          const lotteryString = `${numberToCardNum(v)}`;

          return <Box
            key={i} opacity={v !== 0 ? 1 : 0}
            bg='#d46f70' borderRadius='full' w='100px' h='100px'
            display='flex' alignItems='center' justifyContent='center'
          >
            <Heading color='whitesmoke' textAlign='center'>{lotteryString}</Heading>
          </Box>;
        })}
      </Flex>
    </Box>
    {runningNum ?
      <Box className='lottery-ball' borderRadius='full' w='3xs' h='3xs' alignSelf='center'
        display='flex' alignItems='center' justifyContent='center'>
        <Heading color='white' textAlign='center' size='4xl'>{numberToCardNum(runningNum)}</Heading>
      </Box>
      : null}
  </>
}

function Bank() {
  const timeOut = 5000;
  const forceUpdate = useForceUpdate();
  const { teams, diff: allDiff } = useTeams(timeOut);

  useEffect(() => {
    const interval = setInterval(() => forceUpdate(), timeOut);
    return () => {
      clearInterval(interval);
    }
  }, [forceUpdate]);

  return <Box>
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
  </Box>;
}

function App() {

  useEffect(() => {
    socket.on('display_mode_updated', (newMode) => {
      setDisplayMode(newMode);
    });

    return () => {
      socket.off('display_mode_updated');
    }
  }, []);

  const [displayMode, setDisplayMode] = useState<'bank' | 'lottery'>('bank');

  return (
    <Container marginTop={10}>
      <Flex direction='column' justify='space-betweens'>
        <Center marginBottom={5}>
          <Image boxSize='100' borderRadius='5'
            src='./bank-app/logo512.png' alt='2023 csie camp logo'
          />
        </Center>
        <Center marginBottom={10}>
          <Heading>找尋我的200億 - {displayMode === 'bank' ? '小隊存款' : '開獎時間'}</Heading>
        </Center>
        {displayMode === 'bank' ? <Bank /> : <Lottery />}
      </Flex>
    </Container>
  );
}

export default App;
