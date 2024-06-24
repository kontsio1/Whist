import * as d3 from 'd3';
import {AxisConfig, INNER_RADIUS, RadarGrid} from './RadarGrid';
import {HStack, VStack} from "@chakra-ui/react";

export type Variable = "accuracy" | "precision" | "recall"

type DataItem<T extends string> = {
    [key in T]: number
} & {
    name: string
}

export type Data = DataItem<Variable>[]

const MARGIN = 30;
const COLORS = [
    '#ad00ff',
    '#ff004a',
    '#ff00f2',
];

type YScale = d3.ScaleRadial<number, number, never>;

type RadarProps = {
    width: number;
    height: number;
    data?: Data;
    legend?: string[];
    axisConfig?: AxisConfig[];
};
export const Radar = ({width, height, data, axisConfig, legend}: RadarProps) => {
    const outerRadius = Math.min(width, height) / 2 - MARGIN;
        console.log(data)
    
    if(!data) {
        return <div></div>
    }
    axisConfig = axisConfig ?? [{ name: 'accuracy', max: 1 },{ name: 'precision', max: 1 },{ name: 'recall', max: 1 }]
    // The x scale provides an angle for each variable of the dataset
    const allVariableNames = axisConfig.map((axis) => axis.name);
    const xScale = d3
        .scaleBand()
        .domain(allVariableNames)
        .range([0, 2 * Math.PI]);

    // Compute the y scales: 1 scale per variable.
    
    // Provides the distance to the center.
    let yScales: { [name: string]: YScale } = {};
    axisConfig.forEach((axis) => {
        yScales[axis.name] = d3
            .scaleRadial()
            .domain([0, axis.max])
            .range([INNER_RADIUS, outerRadius]);
    });

    // Color Scale
    const allGroups = data.map((d) => d.name);
    const colorScale = d3.scaleOrdinal<string>().domain(allGroups).range(COLORS);

    // Compute the main radar shapes, 1 per group
    const lineGenerator = d3.lineRadial();

    const allLines = data.map((series, i) => {
        // @ts-ignore
        const allCoordinates = axisConfig.map((axis) => {
            const yScale = yScales[axis.name];
            const angle = xScale(axis.name) ?? 0; // I don't understand the type of scalePoint. IMO x cannot be undefined since I'm passing it something of type Variable.
            const radius = yScale(series[axis.name]);
            const coordinate: [number, number] = [angle, radius];
            return coordinate;
        });

        // To close the path of each group, the path must finish where it started
        // so add the last data point at the end of the array
        allCoordinates.push(allCoordinates[0]);
        const d = lineGenerator(allCoordinates);
        if (!d) {
            return;
        }
        return (
            <path
                key={i}
                d={d}
                stroke={colorScale(series.name)}
                strokeWidth={3}
                fill={colorScale(series.name)}
                fillOpacity={0.1}
            />
        );
    });
    //Legend
    var keys = legend ?? ["1 Call", "2 Calls", "3 Calls"];

    const Svg = d3.select("#my_radar");
    // Create a group for the legend
    const legendGroup = Svg.append("g")
        .attr("transform", "translate(10, 10)"); // Adjust translate values as needed

    // Add one dot in the legend for each name
    legendGroup.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", 10)
        .attr("cy", (d, i) => 10 + i * 20) // Adjust spacing as needed
        .attr("r", 5) // Adjust radius as needed
        .style("fill", d => colorScale(d) as string);

    // Add one text label in the legend for each name
    legendGroup.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 20) // Adjust text distance from circles
        .attr("y", (d, i) => 10 + i * 20) // Adjust spacing as needed
        .style("fill", d => colorScale(d) as string)
        .text(d => d)
        .style("alignment-baseline", "middle");

    return (
        <div>
            <HStack>
            <svg width={width} height={height}>
                <g transform={'translate(' + width / 2 + ',' + height / 2 + ')'}>
                    <RadarGrid
                        outerRadius={outerRadius}
                        xScale={xScale}
                        axisConfig={axisConfig}
                    />
                    {allLines}
                </g>
            </svg>
            <svg id={"my_radar"} height='100' width='100'/>
            </HStack>
        </div>
    );
};
