import React, { Component } from 'react';
import * as d3 from 'd3';
// import { LineChart } from './charts/line_chart';
// import { LineChart2 } from './charts/line_chart_continuous';
// import { HeartRate } from './charts/heartrate';
// import History from './charts/history';
import { Map } from './charts/map';
import logo from './logo.svg';
import './App.css';

// data from http://ecg.mit.edu/time-series/
// import { hrdata1 } from './data/hr.11839';
// import { hrdata2 } from './data/hr.7257';
// import { hrdata3 } from './data/hr.207';
// import { hrdata4 } from './data/hr.237';

// const history = [
//     { date: '2018-09-04T14:53:08.191Z', balance: 50 },
//     { date: '2018-09-04T14:53:22.422Z', balance: 25 },
//     { date: '2018-09-04T14:53:33.601Z', balance: 40 },
//     { date: '2018-09-04T14:53:46.283Z', balance: 70 },
//     { date: '2018-09-04T14:53:56.266Z', balance: 75 },
//     { date: '2018-09-04T14:54:06.311Z', balance: 95 },
//     { date: '2018-09-04T14:54:18.441Z', balance: 45 },
//     { date: '2018-09-04T14:54:26.193Z', balance: 65 }
// ];

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
                <Map />
                {/* <History data={history} /> */}
                {/* <HeartRate hrdata={hrdata1}/>
                <HeartRate hrdata={hrdata2} />
                <HeartRate hrdata={hrdata3} />
                <HeartRate hrdata={hrdata4} /> */}
                {/* <LineChart2 />
                <LineChart data={this.state.data} /> */}
            </div>
        );
    }
}

export default App;
