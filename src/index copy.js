import * as d3 from "d3";
import data from "../data/simple-flare.json";

function pack() {
  var _chart = {};

  var _width = 1280,
    _height = 800,
    _svg,
    _r = 720,
    // _x = d3.scale.linear().range([0, _r]),
    // _y = d3.scale.linear().range([0, _r]),
    // _x = d3.scaleLinear([0, _r]),
    // _y = d3.scaleLinear([0, _r]),
    _nodes,
    _bodyG;

  _chart.render = function () {
    if (!_svg) {
      _svg = d3
        .select("body")
        .append("svg")
        .attr("height", _height)
        .attr("width", _width);
    }

    renderBody(_svg);
  };

  function renderBody(svg) {
    if (!_bodyG) {
      _bodyG = svg
        .append("g")
        .attr("class", "body")
        .attr("transform", function (d) {
          return (
            "translate(" + (_width - _r) / 2 + "," + (_height - _r) / 2 + ")"
          );
        });
    }

    var pack = d3.pack().size([_r, _r]);
    // .value(function (d) {
    //   return d.size;
    // });

    var nodes = pack.nodes(_nodes);

    renderCircles(nodes);

    renderLabels(nodes);
  }

  function renderCircles(nodes) {
    var circles = _bodyG.selectAll("circle").data(nodes);

    circles.enter().append("svg:circle");

    circles
      .transition()
      .attr("class", function (d) {
        return d.children ? "parent" : "child";
      })
      .attr("cx", function (d) {
        return d.x;
      })
      .attr("cy", function (d) {
        return d.y;
      })
      .attr("r", function (d) {
        return d.r;
      });

    circles.exit().transition().attr("r", 0).remove();
  }

  function renderLabels(nodes) {
    var labels = _bodyG.selectAll("text").data(nodes);

    labels
      .enter()
      .append("svg:text")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .style("opacity", 0);

    labels
      .transition()
      .attr("class", function (d) {
        return d.children ? "parent" : "child";
      })
      .attr("x", function (d) {
        return d.x;
      })
      .attr("y", function (d) {
        return d.y;
      })
      .text(function (d) {
        return d.name;
      })
      .style("opacity", function (d) {
        return d.r > 20 ? 1 : 0;
      });

    labels.exit().remove();
  }

  _chart.width = function (w) {
    if (!arguments.length) return _width;
    _width = w;
    return _chart;
  };

  _chart.height = function (h) {
    if (!arguments.length) return _height;
    _height = h;
    return _chart;
  };

  _chart.r = function (r) {
    if (!arguments.length) return _r;
    _r = r;
    return _chart;
  };

  _chart.nodes = function (n) {
    if (!arguments.length) return _nodes;
    _nodes = n;
    return _chart;
  };

  return _chart;
}

var chart = pack();

// function largeFlare() {
//   d3.json("./data/flare.json", function (nodes) {
//     chart.nodes(nodes).render();
//   });
// }

// function simpleFlare() {
//   d3.json("./data/simple-flare.json", function (nodes) {
//     chart.nodes(nodes).render();
//   });
// }

function simpleFlare() {
  chart.nodes(data).render();
}

simpleFlare();
