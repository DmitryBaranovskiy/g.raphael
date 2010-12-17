/*!
 * g.sunburst 0.1 - Sunburst diagrams
 * Needs g.Raphael 0.4.1 - Charting library, based on Raphaël 
 *
 * Copyright (c)2010 zynamics GmbH (http://zynamics.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * license.
 *
 * Author: Christian Blichmann <christian.blichmann@zynamics.com>
 */
Raphael.fn.g.sunburst = function(cx, cy, values, opts) {
	opts = opts || {};
	var paper = this,
		chart = this.set(),
		series = this.set(),
		levelRadii = [];

	function levelRadius(level) {
		if (levelRadii[level])
			return levelRadii[level];

		var levelWidth = opts.onLevelWidth || function(level) {
				return this.levelWidths ? this.levelWidths[level] :
					(this.levelWidth || 50);
			},
			res = 0;

		for (var i = 0; i <= level; i++)
			res += levelWidth.call(opts, i);

		levelRadii[level] = res;
		return res;
	}

    function sector(cx, cy, ri, ro, startAngle, endAngle, params) {
		var large = Math.abs(endAngle - startAngle) > 180,
			rad = Math.PI / 180,
		    xo1 = cx + ro * Math.cos(-startAngle * rad),
		    yo1 = cy + ro * Math.sin(-startAngle * rad),
		    xo2 = cx + ro * Math.cos(-endAngle * rad),
		    yo2 = cy + ro * Math.sin(-endAngle * rad),
		    xi1 = cx + ri * Math.cos(-startAngle * rad),
		    yi1 = cy + ri * Math.sin(-startAngle * rad),
		    xi2 = cx + ri * Math.cos(-endAngle * rad),
		    yi2 = cy + ri * Math.sin(-endAngle * rad),
		    halfAngle = Math.abs(endAngle + startAngle) / 2,
		    rm = (ro + ri) / 2,
		    xm = cx + rm * Math.cos(-halfAngle * rad),
		    ym = cy + rm * Math.sin(-halfAngle * rad),
		    res = paper.path([
				"M", xi1, yi1,
				"A", ri, ri, 0, +large, 0, xi2, yi2,
				"L", xo2, yo2,
				"A", ro, ro, 0, +large, 1, xo1, yo1,
				"Z",
			]);
		res.middle = {x: xm, y: ym};
		res.mangle = halfAngle;
		res.ri = ri;
		res.ro = ro;
		return res.attr(params);
	}

	function getDataSeriesFromObj(rootLabel, values) {
		var res = {label: rootLabel, value: 0, children: []},
			maxDepth = 0;
		for (var i in values) {
			var child;
			if (~~values[i]) {
				res.value += values[i];
				child = {label: i, value: values[i], depth: 0, children: []};
			} else {
				child = getDataSeriesFromObj(i, values[i]);
				res.value += child.value;
			}
			maxDepth = Math.max(maxDepth, child.depth);
			res.children[res.children.length] = child;
		}
		res.depth = maxDepth + 1;
		return res;
	}

	function colorAttr(idx, depth) {
		var idx = idx % (opts.colors.length || opts.gradients.length);

		if (opts.onGradient)
			return {gradient: opts.onGradient.call(opts, idx, depth)};

		return opts.gradients ? {gradient: opts.gradients[idx]} : {
			fill: opts.colors ? opts.colors[idx] : Raphael.getColor()};
	}

	function renderSeries(data, renderTo, level, total, prevAngle, parentIdx) {
		level = level || 0;
		total = total || data.value;
		prevAngle = prevAngle || (opts.offsetAngle || 0);
		parentIdx = parentIdx || 0;
		var startAngle,
			endAngle = prevAngle,
			children = data.children,
			childIdx = 0;
		for (var i in children) {
			startAngle = endAngle;
			endAngle += children[i].value / total * 360;

			var thisIdx = level == 0 ? childIdx : parentIdx,
				sect = sector(cx, cy, levelRadius(level), levelRadius(level + 1),
					startAngle, endAngle,
					colorAttr(!opts.colorizeByLevel ? thisIdx : level, level)).attr({
						stroke: opts.stroke || "#fff",
						"stroke-width": opts.strokewidth || 1});
			sect.level = level;
			sect.value = children[i].value;
			sect.label = children[i].label;
			renderTo.push(sect);
			renderSeries(children[i], renderTo, level + 1, total, startAngle,
				thisIdx);
			childIdx++;
		}
	}

	Raphael.getColor.reset();
	data = getDataSeriesFromObj(opts.rootLabel, values);
	renderSeries(data, series);

	function getCallbackContext(sector) {
		return {
			sector: sector,
			cx: cx,
			cy: cy,
            mx: sector.middle.x,
            my: sector.middle.y,
            mangle: sector.mangle
		};
	}

    chart.hover = function(fin, fout) {
        fout = fout || function () {};
        for (var i = 0; i < series.length; i++)
            (function (sector) {
                var o = getCallbackContext(sector);
                sector.mouseover(function () { fin.call(o); });
                sector.mouseout(function () { fout.call(o); });
            })(series[i]);
        return this;
    };

    chart.click = function(f) {
        for (var i = 0; i < series.length; i++)
            (function (sector) {
                var o = getCallbackContext(sector);
                sector.click(function () { f.call(o); });
            })(series[i]);
        return this;
    };

    chart.push(series);
    chart.series = series;
    return chart;
};
