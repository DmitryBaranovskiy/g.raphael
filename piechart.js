var markers = {
    disc: "disc",
    o: "disc",
    square: "square",
    s: "square",
    triangle: "triangle",
    t: "triangle",
    star: "star",
    "*": "star",
    cross: "cross",
    x: "cross",
    plus: "plus",
    "+": "plus",
    arrow: "arrow",
    "->": "arrow"
};
Raphael.fn.g = Raphael.fn.g || {};
Raphael.fn.g.piechart = function (cx, cy, r, values) {
    var paper = this,
        chart = this.set(),
        len = values.length;
    if (len == 1) {
        chart.push(paper.circle(cx, cy, r));
    } else {
        function sector(cx, cy, r, startAngle, endAngle, fill) {
            var rad = Math.PI / 180,
                x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad);
            return paper.path({fill: fill}, ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
        }
        var angle = -20,
            total = 0;
        for (var i = 0; i < len; i++) {
            total += values[i];
        }
        for (var i = 0; i < len; i++) {
            chart.push(sector(cx, cy, r, angle, angle += 360 * values[i] / total, "hsb(" + (i % 2 ? .6 : 0) + ", 0.2, " + Math.min(1 - i * .1, 1) + ")"));
        }
    }
    
    chart.color = function () {
        for (var i = 0, ii = len; i < ii; i++) {
            this[i].attr({fill: arguments[i] || "hsb(" + Math.min(i * .1, 1) + ", 1, .5)"});
        }
        return this;
    };
    chart.stroke = function (color, width) {
        color = color || "#000";
        width = width || 1;
        this.attr({stroke: color, "stroke-width": width});
        return this;
    };
    chart.hover = function (fin, fout) {
        fout = fout || function () {};
        var that = this;
        for (var i = 0; i < len; i++) {
            (function (sector, j) {
                var o = {
                    sector: sector,
                    cx: cx,
                    cy: cy,
                    r: r,
                    value: values[j],
                    label: that.labels && that.labels[j]
                };
                sector.mouseover(function () {
                    fin.call(o);
                }).mouseout(function () {
                    fout.call(o);
                });
            })(this[i], i);
        }
        return this;
    };
    chart.legend = function (labels, mark) {
        var x = cx + r + r / 5,
            y = cy - len * 10;
        labels = labels || {};
        mark = markers[mark && mark.toLowerCase()] || "disc";
        this.labels = [];
        this.labelsDir = "east";
        for (var i = 0; i < len; i++) {
            var clr = this[i].attr("fill");
            labels[i] && (labels[i] = labels[i].replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g, function (all, value, percent) {
                if (value) {
                    return values[i].toFixed(value.replace(/^#+\.?/g, "").length);
                }
                if (percent) {
                    return (values[i] * 100 / total).toFixed(percent.replace(/^%+\.?/g, "").length) + "%";
                }
            }));
            this.labels[i] = paper.set();
            this.labels[i].push(paper.g[mark](x + 5, y + 10 + i * 20, 5).attr({fill: clr, stroke: "none"}));
            this.labels[i].push(paper.text(x + 20, y + 10 + i * 20, labels[i] || values[i]).attr({font: '10px "Arial"', fill: "#000", "text-anchor": "start"}));
        }
        return this;
    };
    chart.moveLegend = function (dir) {
        if (this.labelsDir != dir) {
            var bb0 = this.labels[0].getBBox();
            var bb = {x: bb0.x, y: bb0.y, width: bb0.width, height: len * 20};
            for (var i = 0; i < len; i++) {
                bb0 = this.labels[i].getBBox();
                bb0.width > bb.width && (bb.width = bb0.width);
            }
            switch (this.labelsDir.toLowerCase()) {
                case "north":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(r * 1.2 + bb.width / 2, len * 10 + r + r / 5);
                    }
                    this.labelsDir = dir;
                break;
                case "south":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(r * 1.2 + bb.width / 2, -len * 10 - r - r / 5);
                    }
                    this.labelsDir = dir;
                break;
                case "west":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(r * 2.4 + bb.width, 0);
                    }
                    this.labelsDir = dir;
                break;
            }
            switch (dir.toLowerCase()) {
                case "north":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(-r * 1.2 - bb.width / 2, -len * 10 - r - r / 5);
                    }
                    this.labelsDir = dir;
                break;
                case "south":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(-r * 1.2 - bb.width / 2, len * 10 + r + r / 5);
                    }
                    this.labelsDir = dir;
                break;
                case "west":
                    for (var i = 0; i < len; i++) {
                        this.labels[i].translate(-r * 2.4 - bb.width, 0);
                    }
                    this.labelsDir = dir;
                break;
            }
        }
        return this;
    };
    return chart;
};
Raphael.fn.g.disc = function (cx, cy, r) {
    return this.circle(cx, cy, r);
};
Raphael.fn.g.square = function (cx, cy, r) {
    return this.rect(cx - r, cy - r, 2 * r, 2 * r);
};
Raphael.fn.g.triangle = function (cx, cy, r) {
    r *= 1.75;
    return this.path({}, "M".concat(cx, ",", cy, "m0-", r * .58, "l", r * .5, ",", r * .87, "-", r, ",0z"));
};
Raphael.fn.g.star = function (cx, cy, r, r2) {
    r2 = r2 || r * .5;
    var points = ["M", cx, cy + r2, "L"],
        R;
    for (var i = 1; i < 10; i++) {
        R = i % 2 ? r : r2;
        points = points.concat([(cx + R * Math.sin(i * Math.PI * .2)).toFixed(3), (cy + R * Math.cos(i * Math.PI * .2)).toFixed(3)]);
    }
    points.push("z");
    return this.path({}, points);
};
Raphael.fn.g.cross = function (cx, cy, r) {
    r = r / 2;
    return this.path({}, "M".concat(cx - r, ",", cy, "l", [-r, -r, r, -r, r, r, r, -r, r, r, -r, r, r, r, -r, r, -r, -r, -r, r, -r, -r, "z"]));
};
Raphael.fn.g.plus = function (cx, cy, r) {
    r = r / 2;
    return this.path({}, "M".concat(cx - r / 2, ",", cy - r / 2, "l", [0, -r, r, 0, 0, r, r, 0, 0, r, -r, 0, 0, r, -r, 0, 0, -r, -r, 0, 0, -r, "z"]));
};
Raphael.fn.g.arrow = function (cx, cy, r) {
    r = r / 2;
    return this.path({}, "M".concat(cx, ",", cy - r / 2, "l", [0, -r, r * 1.5, r * 1.5, -r * 1.5, r * 1.5, 0, -r, -r, 0, 0, -r], "z"));
};
