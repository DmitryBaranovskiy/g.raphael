/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function () {
    var shim = { stroke: 'none', fill: '#000', 'fill-opacity': 0 },
        colorValue = function (value, total, s, b) {
            return 'hsb(' + [Math.min((1 - value / total) * .4, 1), s || .75, b || .75] + ')';
        },
        defColors = (function () {
            var hues = [.6, .2, .05, .1333, .75, 0],
                colors = [];

            for (var i = 0; i < 10; i++) {
                if (i < hues.length) {
                    colors.push('hsb(' + hues[i] + ',.75, .75)');
                } else {
                    colors.push('hsb(' + hues[i - hues.length] + ', 1, .5)');
                }
            }

            return colors;
        })();

    Raphael.fn.dotchart = function (x, y, width, height, valuesx, valuesy, size, opts) {
        function drawAxis(ax) {
            +ax[0] && (ax[0] = paper.axis(x + gutter, y + gutter, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 2, opts.axisxlabels || null, opts.axisxtype || "t"));
            +ax[1] && (ax[1] = paper.axis(x + width - gutter, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 3, opts.axisylabels || null, opts.axisytype || "t"));
            +ax[2] && (ax[2] = paper.axis(x + gutter, y + height - gutter + maxR, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 0, opts.axisxlabels || null, opts.axisxtype || "t"));
            +ax[3] && (ax[3] = paper.axis(x + gutter - maxR, y + height - gutter, height - 2 * gutter, miny, maxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 1, opts.axisylabels || null, opts.axisytype || "t"));
        }

        opts = opts || {};
        var xdim = this.snapEnds(Math.min.apply(Math, valuesx), Math.max.apply(Math, valuesx), valuesx.length - 1),
            minx = xdim.from,
            maxx = xdim.to,
            gutter = opts.gutter || 10,
            ydim = this.snapEnds(Math.min.apply(Math, valuesy), Math.max.apply(Math, valuesy), valuesy.length - 1),
            miny = ydim.from,
            maxy = ydim.to,
            len = Math.max(valuesx.length, valuesy.length, size.length),
            symbol = this[opts.symbol] || "circle",
            res = this.set(),
            series = this.set(),
            max = opts.max || 100,
            top = Math.max.apply(Math, size),
            R = [],
            paper = this,
            k = Math.sqrt(top / Math.PI) * 2 / max;

        for (var i = 0; i < len; i++) {
            R[i] = Math.min(Math.sqrt(size[i] / Math.PI) * 2 / k, max);
        }

        gutter = Math.max.apply(Math, R.concat(gutter));

        var axis = this.set(),
            maxR = Math.max.apply(Math, R);

        if (opts.axis) {
            var ax = (opts.axis + "").split(/[,\s]+/);

            drawAxis(ax);

            var g = [], b = [];

            for (var i = 0, ii = ax.length; i < ii; i++) {
                var bb = ax[i].all ? ax[i].all.getBBox()[["height", "width"][i % 2]] : 0;

                g[i] = bb + gutter;
                b[i] = bb;
            }

            gutter = Math.max.apply(Math, g.concat(gutter));

            for (var i = 0, ii = ax.length; i < ii; i++) if (ax[i].all) {
                ax[i].remove();
                ax[i] = 1;
            }

            drawAxis(ax);

            for (var i = 0, ii = ax.length; i < ii; i++) if (ax[i].all) {
                axis.push(ax[i].all);
            }

            res.axis = axis;
        }

        var kx = (width - gutter * 2) / ((maxx - minx) || 1),
            ky = (height - gutter * 2) / ((maxy - miny) || 1);

        for (var i = 0, ii = valuesy.length; i < ii; i++) {
            var sym = this.raphael.is(symbol, "array") ? symbol[i] : symbol,
                X = x + gutter + (valuesx[i] - minx) * kx,
                Y = y + height - gutter - (valuesy[i] - miny) * ky;

            sym && R[i] && series.push(this[sym](X, Y, R[i]).attr({ fill: opts.heat ? colorValue(R[i], maxR) : defcolors[0], "fill-opacity": opts.opacity ? R[i] / max : 1, stroke: "none" }));
        }

        var covers = this.set();

        for (var i = 0, ii = valuesy.length; i < ii; i++) {
            var X = x + gutter + (valuesx[i] - minx) * kx,
                Y = y + height - gutter - (valuesy[i] - miny) * ky;

            covers.push(this.circle(X, Y, maxR).attr(shim));
            opts.href && opts.href[i] && covers[i].attr({href: opts.href[i]});
            covers[i].r = +R[i].toFixed(3);
            covers[i].x = +X.toFixed(3);
            covers[i].y = +Y.toFixed(3);
            covers[i].X = valuesx[i];
            covers[i].Y = valuesy[i];
            covers[i].value = size[i] || 0;
            covers[i].dot = series[i];
        }

        res.covers = covers;
        res.series = series;
        res.push(series, axis, covers);

        res.hover = function (fin, fout) {
            covers.mouseover(fin).mouseout(fout);
            return this;
        };

        res.click = function (f) {
            covers.click(f);
            return this;
        };

        res.each = function (f) {
            if (!Raphael.is(f, "function")) {
                return this;
            }

            for (var i = covers.length; i--;) {
                f.call(covers[i]);
            }

            return this;
        };

        res.href = function (map) {
            var cover;

            for (var i = covers.length; i--;) {
                cover = covers[i];

                if (cover.X == map.x && cover.Y == map.y && cover.value == map.value) {
                    cover.attr({href: map.href});
                }
            }
        };
        return res;
    };
})();
