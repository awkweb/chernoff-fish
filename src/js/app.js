require('../scss/styles.scss');
require('rc-slider/assets/index.css');

var React = require('react');
var ReactDOM = require('react-dom');
var Rcslider = require('rc-slider');
var d3 = require('d3');

const WIDTH = 500,
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

var spineScale = d3.scaleLinear()
  .clamp(true)
  .domain([0, 100])
  .range([0, SPINE_HEIGHT]);

var bodyScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, BODY_HEIGHT]);

var eyeScale = d3.scaleLinear()
  .clamp(true)
  .domain([0, 100])
  .range([0, EYE_RADIUS - 1]);

var finScale = d3.scaleLinear()
  .clamp(true)
  .domain([0, 100])
  .range([0, SPINE_SIZE]);

var Spine = React.createClass({
  render: function() {
    const spine = this.props.spine;
    const id = spine.name + "-" + spine.type;
    return (
      <g
        id={id}
        className="spine"
      >
        <path
          className={spine.type}
          d={drawSpine(spine.position, SPINE_WIDTH, spine.percent)}
        >
        </path>
      </g>
    );
  }
});

var Spines = React.createClass({
  render: function() {
    const transform = "translate(" + (WIDTH / 4.6) + "," + bodyScale(-this.props.back / 2.5 ) + ")";
    const spines = this.props.spines.map(function(spine) {
      return <Spine spine={spine} key={spine.name + "-" + spine.type} />;
    });
    return (
      <g
        id="spines"
        transform={transform}
      >
        {spines}
      </g>
    );
  }
});

var Body = React.createClass({
  render: function() {
    return (
      <g id="body">
        <path
          id="belly"
          d={drawBody(0, 0, WIDTH/2, bodyScale(this.props.belly))}
        >
        </path>
        <path
          id="back"
          d={drawBody(0, 0, WIDTH/2, -bodyScale(this.props.back))}
        >
        </path>
      </g>
    );
  }
});

var Eye = React.createClass({
  render: function() {
    var transform = "translate(" + ((WIDTH / 2) / 1.2) + "," + 0 + ")";
    return (
      <g
        id="eye"
        transform={transform}
      >
        <circle
          id="eye-outline"
          r={EYE_RADIUS}
          cx="0"
          cy="0"
        >
        </circle>
        <circle
          id="eye-pupil"
          r={eyeScale(this.props.eye)}
        >
        </circle>
      </g>
    );
  }
});

var Fin = React.createClass({
  render: function() {
    const fin = this.props.fin;
    const transform = fin.name === "defensive" ? "translate(" + (WIDTH / 3.45) + "," + 10 + ")" : "translate(0,0)";
    return (
      <g
        id={fin.name}
        className="fin"
        transform={transform}
      >
        <path
          d={drawFin(5, 0, finScale(fin.percent), fin.direction)}
        >
        </path>
      </g>
    );
  }
})

var Tail = React.createClass({
  render: function() {
    const fins = this.props.fins.map(function(fin) {
      return <Fin fin={fin} key={fin.name} />;
    });
    return (
      <g
        id="tail"
      >
        {fins}
      </g>
    );
  }
});

var Fish = React.createClass({
  render: function() {
    const transform = "translate(" + getXPosition() + "," + getYPosition() + ")";
    const fins = [this.props.sensative, this.props.cyclical];
    const spines = [
      this.props.americas_dev,
      this.props.americas_em,
      this.props.asia_dev,
      this.props.asia_em,
      this.props.eu_dev,
      this.props.eu_em,
      this.props.ame_dev,
      this.props.ame_em
    ];
    return (
      <svg>
        <g
          id="chernoff"
          className={this.props.strategy}
          transform={transform}
        >
          <Spines back={this.props.style} spines={spines} />
          <Body back={this.props.style} belly={this.props.market_cap} />
          <Eye eye={this.props.f_return} />
          <Fin fin={this.props.defensive}  />
          <Tail fins={fins} />
        </g>
      </svg>
    );
  }
});

var Form = React.createClass({
  handleChange: function(event) {
    this.props.onUserInput(
      this.refs.strategy.value,
      this.refs.style.value,
      this.refs.market_cap.value
    );
  },

  handleReturnSliderChange: function(value) {
    this.props.returnSliderChange(
      value
    );
  },

  handleDefensiveSliderChange: function(value) {
    this.props.defensiveSliderChange(
      value
    );
  },

  handleCyclicalSliderChange: function(value) {
    this.props.cyclicalSliderChange(
      value
    );
  },

  handleSensativeSliderChange: function(value) {
    this.props.sensativeSliderChange(
      value
    );
  },

  handleAmericasDevSliderChange: function(value) {
    this.props.americasDevSliderChange(
      value
    );
  },

  handleAmericasEmSliderChange: function(value) {
    this.props.americasEmSliderChange(
      value
    );
  },

  handleAsiaDevSliderChange: function(value) {
    this.props.asiaDevSliderChange(
      value
    );
  },

  handleAsiaEmSliderChange: function(value) {
    this.props.asiaEmSliderChange(
      value
    );
  },

  handleEuropeDevSliderChange: function(value) {
    this.props.europeDevSliderChange(
      value
    );
  },

  handleEuropeEmSliderChange: function(value) {
    this.props.europeEmSliderChange(
      value
    );
  },

  handleAmeDevSliderChange: function(value) {
    this.props.ameDevSliderChange(
      value
    );
  },

  handleAmeEmSliderChange: function(value) {
    this.props.ameEmSliderChange(
      value
    );
  },

  render: function() {
    return (
      <form
        className={this.props.strategy}
      >
        <h1>Chernoff Fish with <a href="https://d3js.org">D3</a> & <a href="https://facebook.github.io/react/">React</a></h1>
        <h3>1. General</h3>

        <div className="field">
          <div className="label-container">
            <label htmlFor="strategy">Investment Strategy</label>
            <span className="help">Fund type</span>
          </div>
          <select
            ref="strategy"
            onChange={this.handleChange}
            className="select"
          >
            <option value="long">Long</option>
            <option value="short">Short</option>
          </select>
        </div>

        <div className="field">
          <div className="label-container">
            <label htmlFor="style">Investment Style</label>
            <span className="help">Overarching theory</span>
          </div>
          <select
            ref="style"
            onChange={this.handleChange}
            className="select"
          >
            <option value="33">Growth</option>
            <option value="66">Core</option>
            <option value="99">Value</option>
          </select>
        </div>

        <div className="field">
          <div className="label-container">
            <label htmlFor="market_cap">Market Capitalization</label>
            <span className="help">Total market value</span>
          </div>
          <select
            ref="market_cap"
            onChange={this.handleChange}
            className="select"
          >
            <option value="33">Small</option>
            <option value="66">Medium</option>
            <option value="99">Large</option>
          </select>
        </div>

        <div className="field">
          <div className="label-container">
            <label htmlFor="return">Performance</label>
            <span className="help">Return as % of category max</span>
          </div>
          <div className="slider">
            <Rcslider
              onChange={this.handleReturnSliderChange}
              defaultValue={this.props.f_return}
            />
          </div>
        </div>

        <h3>2. Sector</h3>

        <div className="field">
          <div className="label-container">
            <label htmlFor="defensive">Defensive</label>
            <span className="help">Consumer staples, health care, utilities</span>
          </div>
          <div className="slider">
            <Rcslider
              onChange={this.handleDefensiveSliderChange}
              defaultValue={this.props.defensive.percent}
            />
          </div>
        </div>

        <div className="field">
          <div className="label-container">
            <label htmlFor="cyclical">Cyclical</label>
            <span className="help">Materials, financial, consumer discr.</span>
          </div>
          <div className="slider">
            <Rcslider
              onChange={this.handleCyclicalSliderChange}
              defaultValue={this.props.cyclical.percent}
            />
          </div>
        </div>

        <div className="field">
          <div className="label-container">
            <label htmlFor="sensative">Sensative</label>
            <span className="help">Technology, energy, industrials</span>
          </div>
          <div className="slider">
            <Rcslider
              onChange={this.handleSensativeSliderChange}
              defaultValue={this.props.sensative.percent}
            />
          </div>
        </div>

        <h3>3. Region</h3>

        <h4>Americas</h4>

        <div className="field-container">
          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="americas-emerging">Emerging</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAmericasEmSliderChange}
                defaultValue={this.props.americas_em.percent}
              />
            </div>
          </div>

          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="americas-developed">Developed</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAmericasDevSliderChange}
                defaultValue={this.props.americas_dev.percent}
              />
            </div>
          </div>
        </div>

        <h4>Asia</h4>

        <div className="field-container">
          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="asia-emerging">Emerging</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAsiaEmSliderChange}
                defaultValue={this.props.asia_em.percent}
              />
            </div>
          </div>

          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="asia-developed">Developed</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAsiaDevSliderChange}
                defaultValue={this.props.asia_dev.percent}
              />
            </div>
          </div>
        </div>

        <h4>Europe</h4>

        <div className="field-container">
          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="europe-emerging">Emerging</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleEuropeEmSliderChange}
                defaultValue={this.props.eu_em.percent}
              />
            </div>
          </div>

          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="europe-developed">Developed</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleEuropeDevSliderChange}
                defaultValue={this.props.eu_dev.percent}
              />
            </div>
          </div>
        </div>

        <h4>Africa & Middle East</h4>

        <div className="field-container">
          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="ame-emerging">Emerging</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAmeEmSliderChange}
                defaultValue={this.props.ame_em.percent}
              />
            </div>
          </div>

          <div className="field field-50">
            <div className="label-container">
              <label htmlFor="ame-developed">Developed</label>
            </div>
            <div className="slider">
              <Rcslider
                onChange={this.handleAmeDevSliderChange}
                defaultValue={this.props.ame_dev.percent}
              />
            </div>
          </div>
        </div>

      </form>
    );
  }
});

var App = React.createClass({

  getInitialState: function() {
    return {
      strategy: "long",
      style: 33,
      market_cap: 33,
      f_return: 33,
      defensive: {
        "name": "defensive",
        "percent": 33,
        "direction": 1
      },
      cyclical: {
        "name": "cyclical",
        "percent": 33,
        "direction": -1
      },
      sensative: {
        "name": "sensative",
        "percent": 33,
        "direction": 1
      },
      americas_dev: {
        "name": "americas",
        "type": "dev",
        "percent": 55,
        "position": 1
      },
      americas_em:{
        "name": "americas",
        "type": "em",
        "percent": 40,
        "position": 1
      },
      asia_dev: {
        "name": "asia",
        "type": "dev",
        "percent": 40,
        "position": 2
      },
      asia_em: {
        "name": "asia",
        "type": "em",
        "percent": 40,
        "position": 2
      },
      eu_dev: {
        "name": "eu",
        "type": "dev",
        "percent": 60,
        "position": 3
      },
      eu_em: {
        "name": "eu",
        "type": "em",
        "percent": 20,
        "position": 3
      },
      ame_dev: {
        "name": "ame",
        "type": "dev",
        "percent": 40,
        "position": 4
      },
      ame_em: {
        "name": "ame",
        "type": "em",
        "percent": 60,
        "position": 4
      },
    };
  },

  handleUserInput: function(strategy, style, market_cap) {
    this.setState({
      strategy: strategy,
      style: style,
      market_cap: market_cap
    });
  },

  handleReturnInput: function(f_return) {
    this.setState({
      f_return: f_return
    });
  },

  handleDefensiveInput: function(percent) {
    this.setState({
      defensive: {
        "name": "defensive",
        "percent": percent,
        "direction": 1
      }
    });
  },

  handleCyclicalInput: function(percent) {
    this.setState({
      cyclical: {
        "name": "cyclical",
        "percent": percent,
        "direction": -1
      }
    });
  },

  handleSensativeInput: function(percent) {
    this.setState({
      sensative: {
        "name": "sensative",
        "percent": percent,
        "direction": 1
      }
    });
  },

  handleAmericasDevSliderChange: function(percent) {
    this.setState({
      americas_dev: {
        "name": "americas",
        "type": "dev",
        "percent": percent,
        "position": 1
      }
    });
  },

  handleAmericasEmSliderChange: function(percent) {
    this.setState({
      americas_em: {
        "name": "americas",
        "type": "em",
        "percent": percent,
        "position": 1
      }
    });
  },

  handleAsiaDevSliderChange: function(percent) {
    this.setState({
      asia_dev: {
        "name": "asia",
        "type": "dev",
        "percent": percent,
        "position": 2
      }
    });
  },

  handleAsiaEmSliderChange: function(percent) {
    this.setState({
      asia_em: {
        "name": "asia",
        "type": "em",
        "percent": percent,
        "position": 2
      }
    });
  },

  handleEuropeDevSliderChange: function(percent) {
    this.setState({
      eu_dev: {
        "name": "europe",
        "type": "dev",
        "percent": percent,
        "position": 3
      }
    });
  },

  handleEuropeEmSliderChange: function(percent) {
    this.setState({
      eu_em: {
        "name": "europe",
        "type": "em",
        "percent": percent,
        "position": 3
      }
    });
  },

  handleAmeDevSliderChange: function(percent) {
    this.setState({
      ame_dev: {
        "name": "ame",
        "type": "dev",
        "percent": percent,
        "position": 4
      }
    });
  },

  handleAmeEmSliderChange: function(percent) {
    this.setState({
      ame_em: {
        "name": "ame",
        "type": "em",
        "percent": percent,
        "position": 4
      }
    });
  },

  render: function() {
    return (
      <div id="main">
        <div id="chart">
          <Fish
            strategy={this.state.strategy}
            style={this.state.style}
            market_cap={this.state.market_cap}
            f_return={this.state.f_return}
            
            defensive={this.state.defensive}
            cyclical={this.state.cyclical}
            sensative={this.state.sensative}
            
            americas_dev={this.state.americas_dev}
            americas_em={this.state.americas_em}
            asia_dev={this.state.asia_dev}
            asia_em={this.state.asia_em}
            eu_dev={this.state.eu_dev}
            eu_em={this.state.eu_em}
            ame_dev={this.state.ame_dev}
            ame_em={this.state.ame_em}
          >
          </Fish>
        </div>
        <div id="form">
          <Form
            onUserInput={this.handleUserInput}
            returnSliderChange={this.handleReturnInput}
            defensiveSliderChange={this.handleDefensiveInput}
            cyclicalSliderChange={this.handleCyclicalInput}
            sensativesSliderChange={this.handleSensativeInput}
            
            americasDevSliderChange={this.handleAmericasDevSliderChange}
            americasEmSliderChange={this.handleAmericasEmSliderChange}
            asiaDevSliderChange={this.handleAsiaDevSliderChange}
            asiaEmSliderChange={this.handleAsiaEmSliderChange}
            europeDevSliderChange={this.handleEuropeDevSliderChange}
            europeEmSliderChange={this.handleEuropeEmSliderChange}
            ameDevSliderChange={this.handleAmeDevSliderChange}
            ameEmSliderChange={this.handleAmeEmSliderChange}
            
            strategy={this.state.strategy}
            style={this.state.style}
            market_cap={this.state.market_cap}
            f_return={this.state.f_return}
            defensive={this.state.defensive}
            cyclical={this.state.cyclical}
            sensative={this.state.sensative}

            americas_dev={this.state.americas_dev}
            americas_em={this.state.americas_em}
            asia_dev={this.state.asia_dev}
            asia_em={this.state.asia_em}
            eu_dev={this.state.eu_dev}
            eu_em={this.state.eu_em}
            ame_dev={this.state.ame_dev}
            ame_em={this.state.ame_em}
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
