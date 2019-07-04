import { Component, OnInit } from '@angular/core';
var d3= window['d3'];
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ngOnInit() {
    var w = 400,
      h = 400,
      r = 180,
      inner = 70,
      color = d3.scale.category20c();

    var data = [{ "label": "ONE", "value": 194 },
    { "label": "TWO", "value": 567 },
    { "label": "THREE", "value": 1314 },
    { "label": "FOUR", "value": 793 },
    { "label": "FIVE", "value": 1929 },
    { "label": "SIX", "value": 1383 }];

    var total = d3.sum(data, function (d) {
      return d3.sum(d3.values(d));
    });

    var vis = d3.select("#chart")
      .append("svg:svg")
      .data([data])
      .attr("width", w)
      .attr("height", h)
      .append("svg:g")
      .attr("transform", "translate(" + r * 1.1 + "," + r * 1.1 + ")")

    var textTop = vis.append("text")
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .attr("class", "textTop")
      .text("TOTAL")
      .attr("y", -10),
      textBottom = vis.append("text")
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .attr("class", "textBottom")
        .text(total.toFixed(2) + "m")
        .attr("y", 10);

    var arc = d3.svg.arc()
      .innerRadius(inner)
      .outerRadius(r);

    var arcOver = d3.svg.arc()
      .innerRadius(inner + 5)
      .outerRadius(r + 5);

    var pie = d3.layout.pie()
      .value(function (d) { return d.value; });

    var arcs = vis.selectAll("g.slice")
      .data(pie)
      .enter()
      .append("svg:g")
      .attr("class", "slice")
      .on("mouseover", function (d) {
        d3.select(this).select("path").transition()
          .duration(200)
          .attr("d", arcOver)

        textTop.text(d3.select(this).datum().data.label)
          .attr("y", -10);
        textBottom.text(d3.select(this).datum().data.value.toFixed(2))
          .attr("y", 10);
      })
      .on("mouseout", function (d) {
        d3.select(this).select("path").transition()
          .duration(100)
          .attr("d", arc);

        textTop.text("TOTAL")
          .attr("y", -10);
        textBottom.text(total.toFixed(2) + "m");
      });

    arcs.append("svg:path")
      .attr("fill", function (d, i) { return color(i); })
      .attr("d", arc);

    var legend = d3.select("#chart").append("svg")
      .attr("class", "legend")
      .attr("width", r)
      .attr("height", r * 2)
      .selectAll("g")
      .data(data)
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function (d, i) { return color(i); });

    legend.append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .text(function (d) { return d.label; });
  }
}
