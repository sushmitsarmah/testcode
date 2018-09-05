import React, { Component } from 'react';
import * as d3 from 'd3';
import './line-chart.css';

// import { hrdata } from '../data/hr.11839';

import { D3_CONSTANTS as CONSTANTS } from '../constants';

const DATAPOINTS = 500;
const DURATION = 100;

export class HeartRate extends Component {

    width = CONSTANTS.WIDTH - CONSTANTS.MARGIN.left - CONSTANTS.MARGIN.right;
    height = CONSTANTS.HEIGHT - CONSTANTS.MARGIN.top - CONSTANTS.MARGIN.bottom;

    count = DATAPOINTS;

    constructor(props) {
        super(props);
        this.state = {
            data: []
        };
        this.mysvg = React.createRef();
        this.initChart = this.initChart.bind(this);
        this.tick = this.tick.bind(this);
        this.createAxes = this.createAxes.bind(this);
        this.initChartVariables = this.initChartVariables.bind(this);
    }

    // when the line chart component mounts
    componentDidMount() {
        this.element = this.mysvg.current;

        this.state.data = this.props.hrdata.slice(0, DATAPOINTS);

        this.initChartVariables();
        this.initChart();
        // this.tick();
    }

    // initiate the variables required for line generation and axes
    initChartVariables() {
        this.x = d3.scaleLinear()
            .domain([0, DATAPOINTS - 1])
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .domain(d3.extent(this.props.hrdata, d => d))
            .range([this.height, 0]);

        this.line = d3.line()
            .x((d, i) => this.x(i))
            .y((d, i) => this.y(d));
    }

    // initiate the chart
    initChart() {

        const self = this;

        // select the svg element
        this.svg = d3.select(this.element);

        // add a g container fo the chart
        this.g = this.svg.append("g")
            .attr("transform", `translate(${CONSTANTS.MARGIN.left} , ${CONSTANTS.MARGIN.top})`);

        // add a clip path definition. So when the path transitions it gets cut off from the edges
        this.g.append("defs").append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("width", this.width)
            .attr("height", this.height);

        // create the x and y axes
        console.log('@@@')
        this.createAxes();

        // add the clip path
        const g = this.g.append("g")
            .attr("clip-path", "url(#clip)");

        // add and save the line path.
        g.append("path")
            .datum(this.state.data)
            .attr("class", "line")
            .transition()
            .duration(DURATION)
            .ease(d3.easeLinear)
            .on("start", function () {
                self.tick(this);
            });
    }

    // create the axes
    createAxes() {
        const xval = this.y.domain().reduce( (a,b) => a+b ) / 2;
        // create the x axis
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.y(xval) + ")")
            .call(d3.axisBottom(this.x));

        // create the y axis
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this.y));
    }

    // tick function to update the line and transition it
    tick(selected) {

        const self = this;

        // Push a new data point onto the back.
        self.state.data.push(this.props.hrdata[this.count]);
        this.count++;

        if(this.count === this.props.hrdata.length){
            this.count = 0;
        }

        // Redraw the line.
        d3.select(selected)
            .attr("d", self.line)
            .attr("transform", null);

        // Slide it to the left.
        d3.active(selected)
            .attr("transform", "translate(" + self.x(-1) + ",0)")
            .transition()
            .on("start", function () {
                self.tick(this);
            });

        // Pop the old data point off the front.
        self.state.data.shift();
    }

    render() {
        return (
            <div className="LineChart">
                <svg width={CONSTANTS.WIDTH} height={CONSTANTS.HEIGHT} ref={this.mysvg}></svg>
            </div>
        );
    }
}