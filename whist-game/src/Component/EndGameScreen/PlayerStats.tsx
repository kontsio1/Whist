import {useParams} from "react-router-dom";
import {Heading, Spinner, Text, Tooltip, VStack} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {statsGetRequest, user} from "../../Constants";
import {calculateAverage} from "../../Utils/calculateAverage";
import {findMaxValue} from "../../Utils/findMaxValue";
import {Radar} from "./Visuals/Radar/Radar";
import {data} from "./Visuals/Radar/data";

export const PlayerStats = () => {
    const { player } = useParams()
    const [loading, setLoading] = useState<boolean>(true);
    const [stats, setStats] = useState<statsGetRequest>();
    const customLabels = {accuracy:"Measures how often you correctly predicted the right number of tricks. It tells you the proportion of correct calls against all the calls you made in the game", precision:"Measures how consistently you made a correct call. High precision indicates that your predictions are close to each other, even if they might not be close to the correct call", sensitivity:"Measures the completeness of your predictions. High sensitivity means that you had few and possibly unlucky incorrect calls", score:"It combines all of the above into a single metric that represents your overall performance for this game"}
    const bestCall = findMaxValue(stats?.F1Score)
    
    useEffect(() => {
        setLoading(true)
        getConfusionMatrix().then((stats)=> {
            setStats(stats)
            setLoading(false)
        })
    }, []);
    
    const getConfusionMatrix = async (): Promise<statsGetRequest> => {
        try {
            const resp = await axios.get(`/stats/${player}`);
            return resp.data;
        } catch (error) {
            console.log(error)
            throw error
        }
    }
    return  <div>
        <Heading>{player}</Heading>
        {
            loading ? <Spinner thickness='5px' speed='0.65s' emptyColor='brand.200' color='brand.100' size='xl'/> :
                <div>
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
                    <Text>{`Your best call is: ${bestCall.maxIndex} calls with a score of: ${bestCall.max}`}</Text>
                    <Radar data={data} width={500} height={500}
                           axisConfig={[
                               { name: 'accuracy', max: 10 },
                               { name: 'precision', max: 10 },
                               { name: 'recall', max: 10 },
                           ]}/>
                </div>
        }
    </div>
}