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
    data: Data;
    axisConfig: AxisConfig[];
};
export const Radar = ({width, height, data, axisConfig}: RadarProps) => {
    const outerRadius = Math.min(width, height) / 2 - MARGIN;

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
    const Svg = d3.select("#my_radar");

// create a list of keys
    var keys = ["1 Call", "2 Calls", "3 Calls"]


// Add one dot in the legend for each name.
    Svg.selectAll("mydots")
        .data(keys)
        .enter()
        .append("circle")
        .attr("cx", 100)
        .attr("cy", (d, i) => {
            return 98 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", (d) => {
            return colorScale(d) as string
        })

// Add one dot in the legend for each name.
    Svg.selectAll("mylabels")
        .data(keys)
        .enter()
        .append("text")
        .attr("x", 120) //text distance
        .attr("y", function (d, i) {
            return 100 + i * 25
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", (d) => {
            return colorScale(d) as string
        })
        .text(function (d) {
            return d
        })
        // .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")

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
            <svg id={"my_radar"} height='300' width='300'/>
            </HStack>
        </div>
    );
};
