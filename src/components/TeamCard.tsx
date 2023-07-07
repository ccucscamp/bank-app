import { Card, CardBody, Stat, Flex, StatLabel, StatHelpText, StatArrow, StatNumber, Box, CardProps } from "@chakra-ui/react";
import { forwardRef } from "react";

const TeamCard = forwardRef((props: { name: string, money: number, diff?: number } & CardProps, ref) => {
    const { name, money, diff } = props;

    const showDiff = typeof diff === 'number' && diff !== 0;

    return <Card {...props} ref={ref}>
        <CardBody>
            <Stat>
                <Flex justify='space-between'>
                    <Box>
                        <StatLabel fontSize={showDiff ? 'sm' : '2xl'}>{name}</StatLabel>
                        {showDiff ? <StatHelpText marginBottom={0}>
                            {diff > 0 ? <StatArrow type='increase' /> : <StatArrow type='decrease' />}
                            {diff.toLocaleString()}
                        </StatHelpText> : null}
                    </Box>
                    <Box>
                        <StatNumber>{money.toLocaleString()}</StatNumber>
                    </Box>
                </Flex>
            </Stat>
        </CardBody>
    </Card>;
});

export default TeamCard;
