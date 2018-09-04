import React, { Component } from 'react';
import * as d3 from 'd3';
import { LineChart } from './charts/line_chart';
import logo from './logo.svg';
import './App.css';

import { D3_CONSTANTS as CONSTANTS } from './constants';

class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            data: []
        };
        this.updateData = this.updateData.bind(this);
        this.initData = this.initData.bind(this);
    }

    // when component mounts start the interval to update the data
    componentDidMount(){
        this.initData();
        this.updateData();
    }

    // initialize the data
    initData() {
        this.random = d3.randomNormal(0, .2);
        this.setState({
            data: d3.range(CONSTANTS.N).map(this.random)
        });
    }

    // starts the time interval to update the data
    updateData(){
        setInterval(() => {
            const data = this.state.data;
            // Push a new data point onto the back.
            data.push(this.random());
            // Pop the old data point off the front.
            data.shift();

            // update the state variable
            this.setState({
                date: data
            });

        }, CONSTANTS.DURATION.INTERVAL);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <LineChart data={this.state.data} />
            </div>
        );
    }
}

export default App;
