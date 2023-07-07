import { Card, CardBody, Stat, Flex, StatLabel, StatHelpText, StatArrow, StatNumber, Box, CardProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";

const TeamCard = forwardRef((props: { name: string, money: number, diff?: number } & CardProps, ref) => {
    const { name, money, diff } = props;

    const showDiff = typeof diff === 'number' && diff !== 0;

    const [arrowUp, setArrowUp] = useState(false);
    useEffect(() => {
        if (showDiff) {
            if (diff && diff > 0) {
                setArrowUp(true);
            } else if (diff && diff < 0) {
                setArrowUp(false);
            }
        }
    }, [diff, showDiff]);

    return <Card {...props} ref={ref}>
        <CardBody>
            <Stat>
                <Flex justify='space-between'>
                    <Box>
                        <StatLabel transition={'font-size .5s ease-out'} fontSize={showDiff ? 'sm' : '2xl'}>{name}</StatLabel>
                        <StatHelpText transition={'font-size .5s ease-out'} fontSize={showDiff ? 'sm' : '0px'}
                            marginBottom={0}>
                            {arrowUp ?
                                <StatArrow boxSize={showDiff ? '1em' : '0px'} type='increase' /> :
                                <StatArrow boxSize={showDiff ? '1em' : '0px'} type='decrease' />
                            }
                            {diff?.toLocaleString()}
                        </StatHelpText>
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
