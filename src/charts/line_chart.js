import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import './line-chart.css';

import { D3_CONSTANTS as CONSTANTS } from '../constants';

export class LineChart extends Component {

    width = CONSTANTS.WIDTH - CONSTANTS.MARGIN.left - CONSTANTS.MARGIN.right;
    height = CONSTANTS.HEIGHT - CONSTANTS.MARGIN.top - CONSTANTS.MARGIN.bottom;

    constructor(props){
        super(props);
        this.mysvg = React.createRef();
        this.initChart = this.initChart.bind(this);
        this.tick = this.tick.bind(this);
        this.createAxes = this.createAxes.bind(this);
        this.initChartVariables = this.initChartVariables.bind(this);
    }

    // when the line chart component mounts
    componentDidMount(){
        this.element = this.mysvg.current;
        this.initChartVariables();
        this.initChart();
        this.tick();
    }

    // when th eprops data updates
    componentDidUpdate(){
        this.tick();
    }

    // initiate the variables required for line generation and axes
    initChartVariables() {
        this.x = d3.scaleLinear()
            .domain([0, CONSTANTS.N - 1])
            .range([0, this.width]);

        this.y = d3.scaleLinear()
            .domain([-1, 1])
            .range([this.height, 0]);

        this.line = d3.line()
            .x((d, i) => this.x(i))
            .y((d, i) => this.y(d));
    }

    // initiate the chart
    initChart(){

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
        this.createAxes();
        
        // add the clip path
        const g = this.g.append("g")
            .attr("clip-path", "url(#clip)");

        // add and save the line path.
        this.selected = g.append("path")
            .attr("class", "line");            
    }

    // create the axes
    createAxes() {
        // create the x axis
        this.g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + this.y(0) + ")")
            .call(d3.axisBottom(this.x));

        // create the y axis
        this.g.append("g")
            .attr("class", "axis axis--y")
            .call(d3.axisLeft(this.y)); 
    }

    // tick function to update the line and transition it
    tick() {
        // Redraw the line.
        this.selected
            .datum(this.props.data)
            .attr("d", this.line)
            .attr("transform", null);

        // Slide it to the left.
        this.selected
            .transition()
            .duration(CONSTANTS.DURATION.TRANSITION)
            .ease(d3.easeLinear)
            .attr("transform", "translate(" + this.x(-1) + ",0)")
            .transition();
    }

    render() {
        return (
            <div className="LineChart">
                <svg width={CONSTANTS.WIDTH} height={CONSTANTS.HEIGHT} ref={this.mysvg}></svg>
            </div>
        );
    }
}

LineChart.propTypes = {
    data: PropTypes.arrayOf(PropTypes.number)
};