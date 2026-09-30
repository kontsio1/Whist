import {useParams} from "react-router-dom";
import {Box, Center, Heading, Spinner, Text, Tooltip, useBreakpointValue, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {statsGetRequest} from "../../Constants";
import {calculateAverage} from "../../Utils/calculateAverage";
import {findMaxValue} from "../../Utils/findMaxValue";
import {Radar} from "./Visuals/Radar/Radar";
import api from "../../api";

export const PlayerStats = () => {
    const { player } = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<statsGetRequest>();
    const customLabels = {accuracy:"Measures how often you correctly predicted the right number of tricks. It tells you the proportion of correct calls against all the calls you made in the game", precision:"Measures how consistently you made a correct call. High precision indicates that your predictions are close to each other, even if they might not be close to the correct call", sensitivity:"Measures the completeness of your predictions. High sensitivity means that you had few and possibly unlucky incorrect calls", score:"It combines all of the above into a single metric that represents your overall performance for this game"}
    const bestCall = findMaxValue(stats?.F1Score)
    const radarSize = useBreakpointValue({base: 220, sm: 260, md: 320}) ?? 260
    
    useEffect(() => {
        const getConfusionMatrix = async (): Promise<statsGetRequest> => {
            try {
                const resp = await api.get(`/stats/${player}`);
                return resp.data;
            } catch (error) {
                console.log("error: ", error)
                throw error
            }
        }

        const getStatsAsync = async ()=> {
            setLoading(true)
            const stats = await getConfusionMatrix()
            setStats(stats)
            setLoading(false)
        }
        getStatsAsync().catch(console.error)
    }, [player]);

    const radarLegend = []
    console.log(stats, "<<stats")
    const radarData = stats?.precision.map((p: number, index: number)=> {
        const name = index + "-Calls"
        radarLegend.push(name)
        // @ts-ignore
        return {precision:p, accuracy: stats?.accuracy, recall: stats?.recall[index], name:name}
    })
    
    return  <Box className={'pageSection'}>
        <Heading textAlign={'center'}>{player}</Heading>
        {
            loading ? <Center py={8}><Spinner thickness='5px' speed='0.65s' emptyColor='brand.200' color='brand.100' size='xl'/></Center> :
                <Box>
                    <VStack>
                        <Text>Overall</Text>
                        <Tooltip label={customLabels.accuracy} placement='left'>
                            <Text>{`Accuracy: ${stats?.accuracy}`}</Text>
                        </Tooltip>
                        <Tooltip label={customLabels.precision} placement='left'>
                            <Text>{`Precision: ${calculateAverage(stats?.precision)}`}</Text>
                        </Tooltip>
                        <Tooltip label={customLabels.sensitivity} placement='left'>
                            <Text>{`Sensitivity: ${calculateAverage(stats?.recall)}`}</Text>
                        </Tooltip>
                        <Tooltip label={customLabels.score} placement='left'>
                            <Text>{`Score: ${calculateAverage(stats?.F1Score)}`}</Text>
                        </Tooltip>
                    </VStack>
                    <Text mt={6} textAlign={'center'}>{`Your best call is: ${bestCall.maxIndex} calls with a score of: ${bestCall.max}`}</Text>
                    <Center mt={4} overflowX={'auto'}>
                        <Radar data={radarData} width={radarSize} height={radarSize}/>
                    </Center>
                </Box>
        }
    </Box>
}