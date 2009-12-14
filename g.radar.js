/*
 * Radar charts for g.Raphael
 * 
 * Copyright (c) 2009 Silvan T. Golega
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 * 
 * Developed for:
 * g.Raphael 0.4 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.radar = function (cx, cy, r, values, opts) {
    opts = opts || {};
    var paper = this,			
		arms = [],						// holds the values, their positions, paths, arms, discs
        chart = this.set(),				// the chart that will be constructed and returned
        covers = this.set(),			// holds the areas for event handling
        series = this.set(),
		middle_point,					// raphael disc for background mesh			
		mesh = this.set(),				// the background mesh 
        total = 0,				
		max = 0,						// the maximum of the values
        len = values.length,			// number of values
		web = {pointarray: [], path: null};	// connecting lines between values
		
	
	// overwrite default values for options with opts
	var default_opts = {
		meshwidth:   1,
		strokewidth: 2,
		stroke:      "#f90",
		meshcolor:   "#999",
		helplines:   5,
		discradius:  5
	};
    for (var property in opts)
        default_opts[property] = opts[property];
	opts = default_opts;
	delete default_opts;
		
	// help  function for drawing an arm
	var arm = function (sx, sy, r, angle, m) {
		var rad = Math.PI / 180,
			cos = Math.cos(-angle * rad),
			sin = Math.sin(-angle * rad),
			x   = sx + r * cos,
			y   = sy + r * sin,
			ex  = sx + m * cos,
			ey  = sy + m * sin,
			res = {
				x:			x,
				y:			y,
				//start:	{x: sx, y: sy},
				//end:		{x: ex, y: ey},
				path: 		["M", cx, cy, "L", x, y].join(','),
				rest:		["M", x, y, "L", ex, ey].join(','),
			};
		return res;
	}

	// determine the max value
	for (var i = 0; i < len; i++) {
		total += values[i];
		max = max>values[i] ? max : values[i];
	}
	
	// draw middle point and mesh circles
	middle_point = this.g.disc(cx, cy, 5).attr({stroke: opts.meshcolor, fill: opts.meshcolor, "stroke-width": opts.meshwidth});
	if (opts.helplines){
		var helpradius = r / opts.helplines;
		for (var i = 0; i < opts.helplines; i++) {
			mesh.push(this.circle(cx, cy, helpradius*(i+1)).attr({stroke: opts.meshcolor, "stroke-width": opts.meshwidth}));
		}
	}
	
	// calculate the arms
	for (var i = 0; i < len; i++) {
		arms[i] = arm(cx, cy, r * values[i] / max, i * 360 / len, r);
	}
		
	// draw a poligon through the value points
	web.pointarray.push("M");
	for (var i = 0; i < len; i++) {
		web.pointarray.push(arms[i].x, arms[i].y, "L");
	}
	web.pointarray.push(arms[0].x, arms[0].y);
	web.path = this.path(web.pointarray.join(',')).attr({stroke: opts.stroke, "stroke-width": opts.meshwidth, fill: opts.stroke, "fill-opacity": 0.4});
		
	// draw the value points (and arms) as latest to make sure they are the topmost
	for (var i = 0; i < len; i++) {
		arms[i].path =  this.path(arms[i].path)
							.attr({stroke: opts.stroke,     "stroke-width": opts.strokewidth});
		arms[i].rest =  this.path(arms[i].rest)
							.attr({stroke: opts.meshcolor, "stroke-width": opts.meshwidth});
		arms[i].point = this.g.disc(arms[i].x, arms[i].y, opts.discradius)
							.attr({stroke: opts.stroke, fill: opts.stroke });
		var cover = this.set();
		cover.push(arms[i].path, arms[i].rest, arms[i].point);
		covers.push(cover);
		series.push(arms[i].point);
	}

    chart.hover = function (fin, fout) {
        fout = fout || function () {};
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (arm, cover, j) {
                var o = {
                    arm: arm.point,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: arm.x,
                    my: arm.y,
                    value: values[j],
                    max: max,
                    label: that.labels && that.labels[j]
                };
                o.cover.mouseover(function () {
                    fin.call(o);
                }).mouseout(function () {
                    fout.call(o);
                });
				if (o.label){
					o.label.mouseover(function () {
						fin.call(o);
					}).mouseout(function () {
						fout.call(o);
					});
				}
            })(arms[i], covers[i], i);
        }
        return this;
    };
    // x: where label could be put
    // y: where label could be put
    // value: value to show
    // total: total number to count %
    chart.each = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (arm, cover, j) {
                var o = {
                    arm: arm.point,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: arm.x,
                    my: arm.y,
                    value: values[j],
                    max: max,
                    label: that.labels && that.labels[j]
                };
                f.call(o);
            })(arms[i], covers[i], i);
        }
        return this;
    };
 
    chart.click = function (f) {
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (arm, cover, j) {
                var o = {
                    arm: arm.point,
                    cover: cover,
                    cx: cx,
                    cy: cy,
                    mx: arm.x,
                    my: arm.y,
                    value: values[j],
                    max: max,
                    label: that.labels && that.labels[j]
                };
                cover.click(function () { f.call(o); });
				if (o.label){
					o.label.click(function () {
						f.call(o);
					});
				}
            })(arms[i], covers[i], i);
        }
        return this;
    };

    var legend = function (labels, otherslabel, mark, dir) {
        var x = cx + r + r / 5,
            y = cy,
            h = y + 10;
        labels = labels || [];
        dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
        mark = paper.g.markers[mark && mark.toLowerCase()] || "disc";
        chart.labels = paper.set();
        for (var i = 0; i < len; i++) {
            var clr = series[i].attr("fill"),
                //j = values[i].order,
                txt;
            values[i].others && (labels[j] = otherslabel || "Others");
            labels[i] = paper.g.labelise(labels[i], values[i], total);
            chart.labels.push(paper.set());
            chart.labels[i].push(paper.g[mark](x + 5, h, 5).attr({fill: clr, stroke: "none"}));
            chart.labels[i].push(txt = paper.text(x + 20, h, labels[i] || values[i]).attr(paper.g.txtattr).attr({fill: opts.legendcolor || "#000", "text-anchor": "start"}));
            covers[i].label = chart.labels[i];
            h += txt.getBBox().height * 1.2;
        }
        var bb = chart.labels.getBBox(),
            tr = {
                east: [0, -bb.height / 2],
                west: [-bb.width - 2 * r - 20, -bb.height / 2],
                north: [-r - bb.width / 2, -r - bb.height - 10],
                south: [-r - bb.width / 2, r + 10]
            }[dir];
        chart.labels.translate.apply(chart.labels, tr);
        chart.push(chart.labels);
    };
    if (opts.legend) {
        legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
    }
    chart.push(series, covers, middle_point, mesh);
    chart.series = series;
    chart.covers = covers;
    return chart;
};
