require('../scss/styles.scss');

var React = require('react');
var ReactDOM = require('react-dom');
var d3 = require('d3');

var WIDTH = 500,
  HEIGHT = 500,
  BREAKPOINT = 768,
  BODY_HEIGHT = 350,
  EYE_RADIUS = 15,
  SPINE_WIDTH = 20,
  SPINE_HEIGHT = 100,
  SPINE_SIZE = 50,
  DURATION = 1000;

function getXPosition() {
  var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var x = screenWidth < BREAKPOINT ? (screenWidth / 2) - (WIDTH / 4) : (screenWidth / 4) - (WIDTH / 4);
  return x;
}

function getYPosition() {
  var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var y = screenWidth < BREAKPOINT ? (screenHeight / 4) + 25: (screenHeight / 2);
  return y;
}

function drawSpine(position, width, height) {
  var x1 = ((position - 1) * width),
      x2 = (x1 - width) + 1,
      width = -width,
      height = -height;
  return "M" + x1 +",0 Q" + x1 + "," + (height + -width) + " " + x2 + "," + height + " L" + x2 + ",0 Z";
}

function drawBody(x, y, width, height) {
  var start = x + "," + y + " ";
  return "M" + start + "C" + start + (width / 2) + "," + height + " " + width + "," + y + " Z";
}

function drawFin(x, y, width, direction) {
  var start = x + "," + y + " ",
      height = width * 2.25 * direction,
      width = -width;
  return "M" + start + "Q" + x + "," + height + " " + width + "," + height + " L" + width + "," + y + " Z";
}

function updateWindow(){
  d3.select("#chernoff")
    .attr("transform", "translate(" + getXPosition() + "," + getYPosition() + ")");
}
window.onresize = updateWindow;

var fish = {
  "strategy": "long",
  "return": 30,
  "body": {
    "style": 40,
    "market_cap": 20
  },
  "spines": [
    {
      "name": "americas",
      "type": "dev",
      "height": 55,
      "position": 1
    },
    {
      "name": "americas",
      "type": "em",
      "height": 40,
      "position": 1
    },
    {
      "name": "asia",
      "type": "dev",
      "height": 40,
      "position": 2
    },
    {
      "name": "asia",
      "type": "em",
      "height": 40,
      "position": 2
    },
    {
      "name": "eu",
      "type": "dev",
      "height": 60,
      "position": 3
    },
    {
      "name": "eu",
      "type": "em",
      "height": 20,
      "position": 3
    },
    {
      "name": "ame",
      "type": "dev",
      "height": 40,
      "position": 4
    },
    {
      "name": "ame",
      "type": "em",
      "height": 60,
      "position": 4
    },
  ],
  "tail": [
    {
      "name": "sensative",
      "size": 15,
      "direction": 1
    },
    {
      "name": "cyclical",
      "size": 40,
      "direction": -1
    }
  ],
  "fin": {
      "name": "defensive",
      "size": 45,
      "direction": 1
  }
};

var spineScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, SPINE_HEIGHT]);

var bodyScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, BODY_HEIGHT]);

var eyeScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, EYE_RADIUS - 1]);

var finScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, SPINE_SIZE]);

var Body = React.createClass({
  render: function() {
    return (
      <svg>
        <g id="body">
          <path
            id="back"
            d={drawBody(0, 0, WIDTH/2, bodyScale(40))}
          >
          </path>
          <path
            id="belly"
            d={drawBody(0, 0, WIDTH/2, bodyScale(30))}
          >
          </path>
        </g>
      </svg>
    );
  }
})

var Chart = React.createClass({
  render: function() {
    var initTransform = "translate(" + getXPosition() + "," + getYPosition() + ")";
    return (
      <svg>
        <g
          id="chernoff"
          className={this.props.strategy}
          transform={initTransform}
        >
          <Body />
        </g>
      </svg>
    );
  }
});

var Form = React.createClass({
  handleChange: function(event) {
    console.log(this.refs.strategy.value);
    this.props.onUserInput(
      this.refs.strategy.value,
    );
  },

  render: function() {
    return (
      <form>
        <select
          ref="strategy"
          onChange={this.handleChange}
        >
          <option value="long">Long</option>
          <option value="short">Short</option>
        </select>
      </form>
    );
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      strategy: "long",
    };
  },

  componentDidMount: function() {
  },

  handleUserInput: function(strategy) {
    this.setState({
      strategy: strategy,
    });
  },

  render: function() {
    return (
      <div id="main">
        <div id="chart">
          <Chart
            strategy={this.state.strategy}
          >
          </Chart>
        </div>
        <div id="form">
          <Form
            onUserInput={this.handleUserInput}
            strategy={this.state.strategy}
          />
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <App width={500} height={500} />,
  document.getElementById("app")
);
