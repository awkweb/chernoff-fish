var width = 500,
  height = 500,
  breakpoint = 768,
  bodyHeight = 350,
  eyeRadius = 15,
  spineWidth = 20,
  spineHeight = 100,
  duration = 1000;

function getXPosition() {
  var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var x = screenWidth < breakpoint ? (screenWidth / 2) - (width / 4) : (screenWidth / 4) - (width / 4);
  return x;
}

function getYPosition() {
  var screenWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var screenHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  var y = screenWidth < breakpoint ? (screenHeight / 4) + 25: (screenHeight / 2);
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
  .range([0, spineHeight]);

var bodyScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, bodyHeight]);

var eyeScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, eyeRadius - 1]);

var finScale = d3.scaleLinear()
  .domain([0, 100])
  .range([0, 50]);

var g = d3.select("div").append("svg")
  .append("g")
  .data([fish])
  .attr("id", "chernoff")
  .attr("class", function (d) { return d.strategy; })
  .attr("transform", "translate(" + getXPosition() + "," + getYPosition() + ")");

var spines = g.append("g")
    .attr("id", "spines")
    .attr("transform", function (d) {
    return "translate(" + (width / 4.6) + "," + bodyScale(-d.body.style / 2.5) + ")"
  });

var spine = spines.selectAll("g")
  .data(fish.spines);
  
var spineEnter = spine.enter()
  .append("g")
  .attr("id", function (d) { return d.name + "-" + d.type; })
  .attr("class", "spine");

spineEnter.append("path")
  .attr("class", function (d) { return d.type; })
  .attr("d", function (d) {
    return drawSpine(d.position, spineWidth, d.height);
  });

spine.select("path")
  .transition()
  .duration(duration)
  .attr("d", function (d) {
    return drawSpine(d.position, spineWidth, d.height);
  });

var body = g.append("g")
  .attr("id", "body");

body.append("path")
  .attr("id", "belly")
  .attr("d", function (d) {
    return drawBody(0, 0, width/2, bodyScale(d.body.market_cap));
  });

body.append("path")
  .attr("id", "back")
  .attr("d", function (d) {
    return drawBody(0, 0, width/2, -bodyScale(d.body.style));
  });

var eye = g.append("g")
  .attr("id", "eye")
  .attr("transform", "translate(" + ((width / 2) / 1.2) + "," + 0 + ")");

eye.append("circle")
  .attr("id", "eye-outline")
  .attr("r", eyeRadius)
  .attr("cx", 0)
  .attr("cy", 0);

eye.append("circle")
  .attr("id", "eye-pupil")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 0);

eye.select("#eye-pupil")
  .transition()
  .duration(duration)
  .attr("r", function (d) {
    return eyeScale(d.return);
  })

var middleFin = g.append("g")
  .attr("id", "fin")
  .attr("class", "fin")
  .attr("transform", "translate(" + (width / 3.45) + "," + 10 + ")");

middleFin.append("path")
  .attr("d", function (d) {
    return drawFin(5, 0, finScale(d.fin.size), d.fin.direction);
  });

var tail = g.append("g")
    .attr("id", "tail");

var fin = tail.selectAll("g")
  .attr("id", "tail")
  .data(fish.tail);
  
var finEnter = fin.enter()
  .append("g")
  .attr("id", function (d) { return d.name; })
  .attr("class", "fin");

finEnter.append("path")
  .attr("d", function (d) {
    return drawFin(5, 0, finScale(d.size), d.direction);
  });
