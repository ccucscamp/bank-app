import { Box, Button, ButtonGroup, Center, Container, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputLeftElement, Select } from "@chakra-ui/react"
import FlipMove from "react-flip-move"
import TeamCard from "../components/TeamCard"
import useTeams from "../hooks/useTeams"
import { useEffect, useMemo, useState } from "react";
import { Team } from "../types";

const parseInputValue = (value: number | undefined) => value !== undefined ? `${value}` : '';

export function TeamSelect(props: { teams: Team[], value: number | undefined, onChange: (teamId: number | undefined) => void }) {
    const { teams, onChange, value } = props;

    const [selected, setSelected] = useState<string>(parseInputValue(value));
    useEffect(() => setSelected(parseInputValue(value)), [value]);

    const isInvalid = useMemo(() => teams.findIndex((v) => v.id === parseInt(selected)) === -1, [selected, teams]);

    useEffect(() => {
        if (!isInvalid) {
            onChange(parseInt(selected));
        } else {
            onChange(undefined);
        }
    }, [isInvalid, onChange, selected]);

    return <Select placeholder='選擇小隊' value={selected} onChange={(e) => setSelected(e.target.value)}>
        {teams.sort((a, b) => a.id - b.id).map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}
    </Select>;
}

export function AmountInput({ value, onChange }: { value: number | undefined, onChange: (val: number | undefined) => void }) {
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
        <Input isInvalid={isInvalid} placeholder='輸入金額' value={val} onChange={(e) => setVal(e.target.value)} />
    </InputGroup>;
}

export default function AdminPage() {
    const { teams } = useTeams(1000);

    const [amount, setAmount] = useState<number | undefined>(0);
    const [teamId, setTeamId] = useState<number>();

    const canSubmit = useMemo(() => teamId !== undefined && amount !== undefined, [teamId, amount]);

    const [loading, setLoading] = useState(false);
    const mutate = (act: 'add' | 'sub' | 'set') => {
        if (canSubmit) {
            const body = JSON.stringify({
                type: act,
                teamId,
                amount,
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

    return <Container maxW='container.lg' marginTop={10}>
        <Flex direction='column' justify='space-betweens'>
            <Box marginBottom={10}>
                <Heading textAlign='center'>找尋我的200億 - 銀行</Heading>
            </Box>
            <Box>
                <Flex justify='space-between'>
                    <Box marginRight={2} flex={1}>
                        <FormControl marginBottom={2}>
                            <FormLabel>小隊</FormLabel>
                            <TeamSelect teams={teams} value={teamId} onChange={setTeamId} />
                        </FormControl>
                        <FormControl marginBottom={6}>
                            <FormLabel>金額</FormLabel>
                            <AmountInput value={amount} onChange={setAmount} />
                        </FormControl>
                        <Center>
                            <ButtonGroup gap='4'>
                                <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('add')} colorScheme='green'>+</Button>
                                <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('sub')} colorScheme='red'>-</Button>
                                <Button isLoading={loading} isDisabled={!canSubmit} onClick={() => mutate('set')} colorScheme='yellow'>Set to</Button>
                            </ButtonGroup>
                        </Center>
                    </Box>
                    <Box marginLeft={2} flex={1}>
                        <Flex direction='column'>
                            <FlipMove>
                                {teams.sort((a, b) => b.money - a.money).map((v, i) => {
                                    return <TeamCard
                                        key={v.id} name={v.name} money={v.money} diff={0}
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
