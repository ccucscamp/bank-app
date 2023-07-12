import { Box, Button, ButtonGroup, Card, CardBody, CardHeader, Center, Container, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, Switch } from "@chakra-ui/react"
import FlipMove from "react-flip-move"
import TeamCard from "../components/TeamCard"
import useTeams from "../hooks/useTeams"
import { useEffect, useMemo, useRef, useState } from "react";
import { socket } from "../socket";

const parseInputValue = (value: number | undefined) => value !== undefined ? `${value}` : '';

type AmountInputProps = {
    value: number | undefined,
    onChange: (val: number | undefined) => void,
    onEnter?: () => void,
    inputRef: React.MutableRefObject<any>,
};
export function AmountInput({ value, onChange, onEnter, inputRef }: AmountInputProps) {
    const [val, setVal] = useState<string>(parseInputValue(value));

    useEffect(() => setVal(parseInputValue(value)), [value]);

    const isInvalid = useMemo(() => Number.isNaN(parseInt(val)), [val]);

    useEffect(() => {
        if (!isInvalid) {
            onChange(parseInt(val));
        } else {
            onChange(undefined);
        }
    }, [isInvalid, onChange, val]);

    return <InputGroup>
        <InputLeftElement
            pointerEvents='none'
            color='gray.300'
            fontSize='1.2em'
            children='$'
        />
        <Input
            ref={inputRef}
            isInvalid={isInvalid}
            placeholder='輸入金額'
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && onEnter) onEnter();
            }}
        />
    </InputGroup>;
}

export default function AdminPage() {
    const { teams } = useTeams(1000);

    const [amount, setAmount] = useState<number | undefined>(0);
    const [teamId, setTeamId] = useState<number>();
    const [isFreeze, setIsFreeze] = useState(false);

    const canSubmit = useMemo(() => teamId !== undefined && amount !== undefined, [teamId, amount]);

    const [loading, setLoading] = useState(false);
    const mutate = (act: 'add' | 'sub' | 'set') => {
        if (canSubmit) {
            const body = JSON.stringify({
                type: act,
                teamId,
                amount,
                isFreeze,
            });

            setLoading(true);
            fetch(`${process.env.REACT_APP_BACKEND}/api`, {
                method: 'POST',
                body,
                headers: {
                    'Content-Type': 'application/json',
                }
            }).finally(() => setLoading(false));
        } else {
            console.error('cannot submit');
        }
    }

    const [currDispMode, setCurrDispMode] = useState<'bank' | 'lottery'>('bank');
    useEffect(() => {
        socket.on('display_mode_updated', (newMode) => setCurrDispMode(newMode));
        return () => {
            socket.off('display_mode_updated');
        };
    }, []);

    const inputRef = useRef<HTMLInputElement>();

    return <Container maxW='container.lg' marginTop={10}>
        <Flex direction='column' justify='space-betweens'>
            <Box marginBottom={10}>
                <Heading textAlign='center'>找尋我的200億 - 銀行</Heading>
            </Box>
            <Box>
                <Flex justify='space-between'>
                    <Box marginRight={2} flex={1}>
                        <Card marginBottom={4}>
                            <CardBody>
                                <FormControl marginBottom={6}>
                                    <FormLabel>金額</FormLabel>
                                    <AmountInput inputRef={inputRef} value={amount} onChange={setAmount} onEnter={() => mutate('add')} />
                                </FormControl>
                                <Center marginBottom={6}>
                                    <ButtonGroup gap='4'>
                                        <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('add')} colorScheme='green'>+</Button>
                                        <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('sub')} colorScheme='red'>-</Button>
                                        <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('set')} colorScheme='yellow'>Set to</Button>
                                    </ButtonGroup>
                                </Center>
                                <FormControl display='flex' alignItems='center'>
                                    <FormLabel htmlFor='freeze' mb='0'>
                                        Freeze?
                                    </FormLabel>
                                    <Switch id='freeze' isChecked={isFreeze} onChange={(e) => setIsFreeze(e.target.checked)} />
                                </FormControl>
                            </CardBody>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Heading size='md'>Display</Heading>
                            </CardHeader>
                            <CardBody>
                                <ButtonGroup variant='outline' spacing='6'>
                                    <Button
                                        colorScheme='blue'
                                        variant={currDispMode === 'bank' ? 'solid' : 'outline'}
                                        onClick={() => socket.emit('update_disp_mode', 'bank')}
                                    >
                                        Bank
                                    </Button>
                                    <Button
                                        colorScheme='orange'
                                        variant={currDispMode === 'lottery' ? 'solid' : 'outline'}
                                        onClick={() => socket.emit('update_disp_mode', 'lottery')}
                                    >
                                        Lottery
                                    </Button>
                                    <Button
                                        colorScheme='green'
                                        isDisabled={currDispMode !== 'lottery'}
                                        onClick={() => socket.emit('lottery_run')}
                                    >
                                        Run Lottery
                                    </Button>
                                </ButtonGroup>
                            </CardBody>
                        </Card>
                    </Box>
                    <Box marginLeft={2} flex={1}>
                        <Flex direction='column'>
                            <FlipMove>
                                {teams.sort((a, b) => b.money - a.money).map((v) => {
                                    return <TeamCard
                                        key={v.id} name={v.name} money={v.money} diff={0}
                                        onClick={() => {
                                            inputRef.current?.focus();
                                            setTeamId(v.id)
                                        }}
                                        borderColor='#4299E1' borderWidth={teamId === v.id ? '2px' : '0px'}
                                        marginBottom={2} size='sm'
                                    />
                                })}
                            </FlipMove>
                        </Flex>
                    </Box>
                </Flex>
            </Box>
        </Flex>
    </Container>
}
