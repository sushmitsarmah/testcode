import React from 'react'
import * as d3 from 'd3'

import { geojson } from '../data/world';

export class Map extends React.Component{
    
    constructor(props){
        super(props)
        this.initVariables = this.initVariables.bind(this)
        this.initMap = this.initMap.bind(this)
        this.svgRef = React.createRef()
    }

    componentDidMount(){
        this.element = this.svgRef.current
        this.initVariables()
        this.initMap()

    }

    initVariables(){

        this.path = d3.geoPath().projection(
            d3.geoAlbersUsa()
                .translate([400, 250])
                .scale([1000])
        )
    }
    
    initMap(){
        const url = "https://enjalot.github.io/wwsd/data/world/world-110m.geojson";
            
        // d3.json(url)
        // .then(geojson => {
            this.svg = d3.select(this.element)
                .selectAll('path')
                .data(geojson.features).enter()
                .append("path")
                .attr("d", this.path)
                .style("stroke", "#fff")
                .style("stroke-width", "1")
        // });
    }

    render(){
        return (
            <div>
                <svg width={800} height={500} ref={this.svgRef}>
                </svg>
            </div>
        )
    }
}

export default Map