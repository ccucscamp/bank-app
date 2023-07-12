import { Card, CardBody, Stat, Flex, StatLabel, StatHelpText, StatArrow, StatNumber, Box, CardProps } from "@chakra-ui/react";
import { forwardRef, useEffect, useState } from "react";

const TeamCard = forwardRef((props: { name: string, money: number, smallMoney?: number, diff?: number, addQMark?: boolean } & CardProps, ref) => {
    const { name, money, diff, smallMoney, addQMark, ...restProps } = props;

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

    return <Card {...restProps} ref={ref}>
        <CardBody>
            <Stat>
                <Flex justify='space-between'>
                    <Box alignSelf='center'>
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
                    <Box textAlign='right' alignSelf='center'>
                        <StatNumber>{money.toLocaleString()}{addQMark ? '+?' : null}</StatNumber>
                        <StatHelpText>{smallMoney?.toLocaleString()}</StatHelpText>
                    </Box>
                </Flex>
            </Stat>
        </CardBody>
    </Card>;
});

export default TeamCard;
