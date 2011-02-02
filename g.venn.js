/*!
 * g.venn 0.2 - 2-area Venn-diagrams
 * Needs g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c)2010-2011 zynamics GmbH (http://zynamics.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * license.
 *
 * Author: Christian Blichmann <christian.blichmann@zynamics.com>
 */
Raphael.fn.g.venn = function(cx, cy, width, height, values, opts) {
	opts = opts || {};
	var paper = this,
	    chart = this.set(),
	    areas = this.set(),
	    intersects = this.set();

	function lensArea(d, overlap) {
		return 2 * Math.acos(d / 2) - d * Math.sqrt(4 - Math.pow(d, 2)) / 2 -
			Math.PI * overlap;
	}

	function dLensArea(d) {
		return -2 / Math.sqrt(1 - Math.pow(d, 2) / 4) -
			Math.sqrt(4 - Math.pow(d, 2)) / 2 + d /
			Math.sqrt(4 - Math.pow(d, 2));
	}

	// TODO: Implement 3-area Venn
	var a0 = values.cardinalities[0],
	    a1 = values.cardinalities[1],
	    aI = values.overlaps[0],
	    r0 = Math.sqrt(a0 / Math.PI), // Get radii for area, unscaled
	    r1 = Math.sqrt(a1 / Math.PI),
	    overlap = aI / a0,
	    dnPrev = 0 - lensArea(0, overlap) / dLensArea(0), dn, // Initial guess
	    d, s;

	// Find a distance d, so that the left circle area, the overlap area and
	// the right circle area are proportional to the given values using
	// Newton's method. We need many iterations to draw overlap == 0 correctly.
	// See http://mathworld.wolfram.com/Circle-CircleIntersection.html for
	// details on circle-circle-intersection.
	for (var i = 1; i < 150; i++) {
		dn = Math.max(dnPrev - lensArea(dnPrev, overlap) / dLensArea(dnPrev),
			1e-14); // Clamp near zero to draw overlap == a0 correctly
		dnPrev = dn;
	}

	// Scale to bounding box
	s = width <= height ? width / ( dn * r0 + 2 * r1 ) : height / r1 / 2;
	r0 *= s;
	r1 *= s;
	d = Math.max(dn * r0, 0) - r0 + r1;

	// Calculate drawing parameters
	var x0 = cx - (r1 - r0 + d) / 2,
	    y0 = cy,
	    x1 = x0 + d,
	    y1 = y0,
	    a = Math.sqrt((-d + r1 - r0) * (-d - r1 + r0) * (-d + r1 + r0) *
			( d + r1 + r0)) / d,
		xi = (Math.pow(d, 2) - Math.pow(r1, 2) + Math.pow(r0, 2)) / (2 * d);
		yi = a / 2;

	function outline2(large0, sweep0, large1, sweep1) {
		var res = paper.path([
			"M", x0 + xi, y0 - yi,
			"A", r0, r0, 0, large0, sweep0, x0 + xi, y0 + yi,
			"A", r1, r1, 0, large1, sweep1, x0 + xi, y0 - yi,
			"Z"
		]);
		// TODO: Calculate middle x and middle y position
		return res;
	}

	function renderParts(areas, intersects) {
		Raphael.getColor.reset();
		function colorAttr(i) {
			return opts.gradients ? {gradient: opts.gradients[i]} : {
				fill: opts.colors ? opts.colors[i] : Raphael.getColor()};
		}
		areas.push(outline2(~~(xi > 0), 0, 0, 1).attr(colorAttr(0)));
		areas.push(outline2(~~(xi <= 0), 1, 1, 0).attr(colorAttr(1)));
		intersects.push(outline2(~~(xi <= 0), 1, 0, 1).attr(colorAttr(2)));

		strokes = {stroke: opts.stroke || "#fff",
			"stroke-width": opts.strokewidth == null ? 1 : opts.strokewidth};
		areas.attr(strokes);
		intersects.attr(strokes);
	}

	renderParts(areas, intersects);

	function getCallbackContext(set) {
		return {
			set: set,
			cx: cx,
			cy: cy,
//			mx: set.middle.x,
//			my: set.middle.y,
			values: values
		};
	}

	chart.hover = function(fin, fout) {
		fout = fout || function () {};
		function h(set) {
			var o = getCallbackContext(set);
			set.mouseover(function () { fin.call(o); });
			set.mouseout(function () { fout.call(o); });
		};
		for (var i = 0; i < areas.length; i++) h(areas[i]);
		for (var i = 0; i < intersects.length; i++) h(intersects[i]);
		return this;
	};

	chart.click = function(f) {
		function c(set) {
			var o = getCallbackContext(set);
			set.click(function () { f.call(o); });
		}
		for (var i = 0; i < areas.length; i++) c(areas[i]);
		for (var i = 0; i < intersects.length; i++) c(intersects[i]);
		return this;
	};

	chart.push(areas);
	chart.push(intersects);
	chart.areas = areas;
	chart.intersects = intersects;
	return chart;
};
