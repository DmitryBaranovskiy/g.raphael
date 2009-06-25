/*
 * g.Raphael 0.2 - Charting library on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
(function () {
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
    },
        hues = [.6, .2, .05, .1333, .75, 0],
        colors = [];
    for (var i = 0; i < 10; i++) {
        if (i < hues.length) {
            colors.push("hsb(" + hues[i] + ", .75, .75)");
        } else {
            colors.push("hsb(" + hues[i - hues.length] + ", 1, .5)");
        }
    }
    function labelise(label, val, total) {
        if (label) {
            return label.replace(/(##+(?:\.#+)?)|(%%+(?:\.%+)?)/g, function (all, value, percent) {
                if (value) {
                    return (+val).toFixed(value.replace(/^#+\.?/g, "").length);
                }
                if (percent) {
                    return (val * 100 / total).toFixed(percent.replace(/^%+\.?/g, "").length) + "%";
                }
            });
        } else {
            return (+val).toFixed(0);
        }
    }
    Raphael.fn.g = Raphael.fn.g || {};
    Raphael.fn.g.piechart = function (cx, cy, r, values) {
        var paper = this,
            sectors = [],
            covers = [],
            chart = this.set(),
            order = [],
            len = values.length,
            angle = -20,
            total = 0,
            others = 0,
            cut = 9,
            defcut = true;
        if (len == 1) {
            chart.push(paper.circle(cx, cy, r).attr({fill: colors[0], stroke: "#fff"}));
            covers.push(paper.circle(cx, cy, r).attr({fill: "#000", opacity: 0, "stroke-width": 3}));
            chart.push(covers[0]);
            total = values[0];
            values[0] = {value: values[0], order: 0, valueOf: function () { return this.value; }};
            chart[0].middle = {x: cx, y: cy};
            chart[0].mangle = 180;
        } else {
            function sector(cx, cy, r, startAngle, endAngle, fill) {
                var rad = Math.PI / 180,
                    x1 = cx + r * Math.cos(-startAngle * rad),
                    x2 = cx + r * Math.cos(-endAngle * rad),
                    xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    y1 = cy + r * Math.sin(-startAngle * rad),
                    y2 = cy + r * Math.sin(-endAngle * rad),
                    ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                    p = paper.path({fill: fill, stroke: "#fff"}, ["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]);
                p.middle = {x: xm, y: ym};
                return p;
            }
            for (var i = 0; i < len; i++) {
                total += values[i];
                values[i] = {value: values[i], order: i, valueOf: function () { return this.value; }};
            }
            values.sort(function (a, b) {
                return b.value - a.value;
            });
            for (var i = 0; i < len; i++) {
                if (defcut && values[i] * 360 / total <= 1.5) {
                    cut = i;
                    defcut = false;
                }
                if (i > cut) {
                    defcut = false;
                    values[cut].value += values[i];
                    values[cut].others = true;
                    others = values[cut].value;
                }
            }
            len = Math.min(cut + 1, values.length);
            others && values.splice(len) && (values[cut].others = true);
            for (var i = 0; i < len; i++) {
                var mangle = angle + 360 * values[i] / total / 2;
                var p = sector(cx, cy, r, angle, angle += 360 * values[i] / total, colors[i] || "#666");
                p.value = values[i];
                p.mangle = mangle;
                sectors.push(p);
                chart.push(p);
            }
            for (var i = 0; i < len; i++) {
                var p = paper.path({fill: "#000", opacity: 0, "stroke-width": 3}, sectors[i].attr("path"));
                covers.push(p);
                chart.push(p);
            }
        }
    
        chart.color = function (colorarray) {
            var arr = colorarray || arguments;
            for (var i = 0, ii = len; i < ii; i++) {
                this[i].attr({fill: arr[i] || colors[i]});
            }
            return this;
        };
        chart.stroke = function (color, width) {
            color = color || "#fff";
            width = width || 1;
            this.attr({stroke: color, "stroke-width": width});
            return this;
        };
        chart.hover = function (fin, fout) {
            fout = fout || function () {};
            var that = this;
            for (var i = 0; i < len; i++) {
                (function (sector, cover, j) {
                    var o = {
                        sector: sector,
                        cover: cover,
                        cx: cx,
                        cy: cy,
                        mx: sector.middle.x,
                        my: sector.middle.y,
                        mangle: sector.mangle,
                        r: r,
                        value: values[j],
                        total: total,
                        label: that.labels && that.labels[j]
                    };
                    cover.mouseover(function () {
                        fin.call(o);
                    }).mouseout(function () {
                        fout.call(o);
                    });
                })(this[i], this[i + len], i);
            }
            return this;
        };
        chart.inject = function (element) {
            element.insertBefore(covers[0]);
        };
        chart.legend = function (labels, otherslabel, mark) {
            var x = cx + r + r / 5,
                y = cy - len * 10;
            labels = labels || [];
            mark = markers[mark && mark.toLowerCase()] || "disc";
            this.labels = paper.set();
            this.labelsDir = "east";
            for (var i = 0; i < len; i++) {
                var clr = this[i].attr("fill");
                var j = values[i].order;
                values[i].others && (labels[j] = otherslabel || "Others");
                labels[j] = labelise(labels[j], values[i], total);
                this.labels.push(paper.set());
                this.labels[i].push(paper.g[mark](x + 5, y + 10 + i * 20, 5).attr({fill: clr, stroke: "none"}));
                this.labels[i].push(paper.text(x + 20, y + 10 + i * 20, labels[j] || values[j]).attr({font: '10px "Arial"', fill: "#000", "text-anchor": "start"}));
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

    Raphael.fn.g.barchart = function (x, y, width, height, values, isHorisontal, type, gutter) {
        type = {round: "round", sharp: "sharp", soft: "soft"}[type] || "square";
        gutter = parseFloat(gutter || "20%");
        var chart = this.set(),
            bars = this.set(),
            covers = this.set(),
            total = Math.max.apply(Math, values),
            paper = this,
            multi = 0,
            len = values.length;
        if (typeof values[0] == "object" && values[0] instanceof Array) {
            total = [];
            multi = len;
            len = 0;
            for (var i = values.length; i--;) {
                total.push(Math.max.apply(Math, values[i]));
                len = Math.max(len, values[i].length);
            }
            for (var i = values.length; i--;) {
                if (values[i].length < len) {
                    for (var j = len; j--;) {
                        values[i].push(0);
                    }
                }
            }
            total = Math.max.apply(Math, total);
        }
        if (isHorisontal) {
            var barwidth = Math.round(width / (len * (100 + gutter) + gutter) * 100),
                barhgutter = barwidth * gutter / 100,
                barvgutter = 20,
                X = x + barhgutter,
                Y = (height - 2 * barvgutter) / total;
            barwidth /= multi || 1;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < multi; j++) {
                    var h = Math.round((multi ? values[j][i] : values[i]) * Y),
                        top = y + height - barvgutter - h,
                        bar;
                    bars.push(bar = this.g.finger(Math.round(X + barwidth / 2), top + h, barwidth, h, true, type).attr({stroke: "none", fill: colors[multi > 1 ? j : i]}));
                    bar.y = top;
                    bar.x = Math.round(X + barwidth / 2);
                    bar.w = barwidth;
                    bar.h = h;
                    bar.value = multi ? values[j][i] : values[i];
                    X += barwidth;
                }
                X += barhgutter;
            }
            X = x + barhgutter;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < multi; j++) {
                    covers.push(this.rect(Math.round(X), y + barvgutter, barwidth, height - barvgutter).attr({stroke: "none", fill: "#000", opacity: 0}));
                    X += barwidth;
                }
                X += barhgutter;
            }
            chart.label = function (labels, isBottom) {
                labels = labels || [];
                this.labels = paper.set();
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < multi; j++) {
                        var label = labelise(multi ? labels[j] && labels[j][i] : labels[i], multi ? values[j][i] : values[i], total);
                        this.labels.push(paper.g.label(bars[i * (multi || 1) + j].x, isBottom ? y + height - barvgutter / 2 : bars[i * (multi || 1) + j].y - 10, label).attr([{fill: "none"}]).insertBefore(covers[0]));
                    }
                }
                return this;
            };
        } else {
            var barheight = height / (len * (100 + gutter) + gutter) * 100,
                bargutter = barheight * gutter / 100,
                Y = y + bargutter,
                X = (width - 1) / total;
            barheight /= multi || 1;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < multi; j++) {
                    var val = multi ? values[j][i] : values[i],
                        bar;
                    bars.push(bar = this.g.finger(x, Y + barheight / 2, Math.round(val * X), barheight, false, type).attr({stroke: "none", fill: colors[multi > 1 ? j : i]}));
                    bar.x = x + Math.round(val * X);
                    bar.y = Y + barheight / 2;
                    bar.w = Math.round(val * X);
                    bar.h = barheight;
                    bar.value = val;
                    Y += barheight;
                }
                Y += bargutter;
            }
            Y = y + bargutter;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < multi; j++) {
                    covers.push(this.rect(x, Y, width, barheight).attr({stroke: "none", fill: "#000", opacity: 0}));
                    Y += barheight;
                }
                Y += bargutter;
            }
            chart.label = function (labels, isRight) {
                labels = labels || [];
                this.labels = paper.set();
                for (var i = 0; i < len; i++) {
                    for (var j = 0; j < multi; j++) {
                        var  label = labelise(multi ? labels[j] && labels[j][i] : labels[i], multi ? values[j][i] : values[i], total);
                        var X = isRight ? bars[i * (multi || 1) + j].x - barheight / 2 + 3 : x + 5,
                            A = isRight ? "end" : "start",
                            L;
                        this.labels.push(L = paper.text(X, bars[i * (multi || 1) + j].y, label).attr({"text-anchor": A}).insertBefore(covers[0]));
                        if (L.getBBox().x < x + 5) {
                            L.attr({x: x + 5, "text-anchor": "start"});
                        }
                    }
                }
                return this;
            };
        }
        chart.hover = function (fin, fout) {
            fout = fout || function () {};
            var that = this;
            for (var i = 0; i < len; i++) {
                for (var j = 0; j < multi; j++) {
                    (function (bar, cover, i, j) {
                        var o = {
                            bar: bar,
                            value: multi ? values[j][i] : values[i],
                            label: that.labels && that.labels[i]
                        };
                        cover.mouseover(function () {
                            fin.call(o);
                        }).mouseout(function () {
                            fout.call(o);
                        });
                    })(bars[i * (multi || 1) + j], covers[i * (multi || 1) + j], i, j);
                }
            }
            return this;
        };
        chart.push(bars);
        chart.bars = bars;
        chart.covers = covers;
        chart.remove = function () {
            chart.bars.remove();
            chart.labels && chart.labels.remove();
            chart.covers.remove();
        };
        return chart;
    };



    Raphael.fn.g.finger = function (x, y, width, height, dir, ending) {
        // dir 0 for horisontal and 1 for vertical
        ending = {square: "square", sharp: "sharp", soft: "soft"}[ending] || "round";
        var path;
        switch (ending) {
            case "round":
            if (!dir) {
                var r = height / 2;
                if (width < r) {
                    r = width;
                    path = ["M", x - .5, y - (height / 2) - .5, "l", width - r, 0, "a", r, height / 2, 0, 0, 1, 0, height, "l", r - width, 0, "z"];
                } else {
                    path = ["M", x - .5, y - r - .5, "l", width - r, 0, "a", r, r, 0, 1, 1, 0, height, "l", r - width, 0, "z"];
                }
            } else {
                var r = width / 2;
                if (height < r) {
                    r = height;
                    path = ["M", x - (width / 2) - .5, y - .5, "l", 0, r - height, "a", width / 2, r, 0, 0, 1, width, 0, "l", 0, height - r, "z"];
                } else {
                    path = ["M", x - r- .5, y - .5, "l", 0, r - height, "a", r, r, 0, 1, 1, width, 0, "l", 0, height - r, "z"];
                }
            }
            break;
            case "sharp":
            if (!dir) {
                var half = height / 2;
                path = ["M", x - .5, y + half - .5, "l", 0, -height, Math.max(width - half, 0), 0, Math.min(half, width), half, -Math.min(half, width), half, "z"];
            } else {
                var half = width / 2;
                path = ["M", x + half - .5, y - .5, "l", -width, 0, 0, -Math.max(height - half, 0), half, -Math.min(half, height), half, Math.min(half, height), half, "z"];
            }
            break;
            case "square":
            if (!dir) {
                path = ["M", x - .5, y + height / 2 - .5, "l", 0, -height, width, 0, 0, height, "z"];
            } else {
                path = ["M", x + width / 2 - .5, y - .5, "l", -width, 0, 0, -height, width, 0, "z"];
            }
            break;
            case "soft":
            var r;
            if (!dir) {
                r = Math.min(width, height / 5);
                path = ["M", x - .5, y - (height / 2) - .5, "l", width - r, 0, "a", r, r, 0, 0, 1, r, r, "l", 0, height - r * 2, "a", r, r, 0, 0, 1, -r, r, "l", r - width, 0, "z"];
            } else {
                r = Math.min(width / 5, height);
                path = ["M", x - (width / 2) - .5, y - .5, "l", 0, r - height, "a", r, r, 0, 0, 1, r, -r, "l", width - 2 * r, 0, "a", r, r, 0, 0, 1, r, r, "l", 0, height - r, "z"];
            }
        }
        return this.path({}, path);
    };

    Raphael.fn.g.disc = function (cx, cy, r) {
        return this.circle(cx, cy, r);
    };
    Raphael.fn.g.square = function (cx, cy, r) {
        r = r * .7;
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
    Raphael.fn.g.tag = function (x, y, text, angle, r) {
        angle = angle || 0;
        r = r == null ? 5 : r;
        text = text || "$9.99";
        var res = this.set(),
            d = 3;
        res.push(this.path({fill: "#000", stroke: "none"}));
        res.push(this.text(x, y, text).attr({"font-size": 12, fill: "#fff"}));
        res.update = function () {
            this.rotate(0, x, y);
            var bb = this[1].getBBox();
            if (bb.height >= r * 2) {
                this[0].attr({path: ["M", x, y + r, "a", r, r, 0, 1, 1, 0, -r * 2, r, r, 0, 1, 1, 0, r * 2, "m", 0, -r * 2 -d, "a", r + d, r + d, 0, 1, 0, 0, (r + d) * 2, "L", x + r + d, y + bb.height / 2 + d, "l", bb.width + 2 * d, 0, 0, -bb.height - 2 * d, -bb.width - 2 * d, 0, "L", x, y - r - d].join(",")});
            } else {
                var dx = Math.sqrt(Math.pow(r + d, 2) - Math.pow(bb.height / 2 + d, 2));
                this[0].attr({path: ["M", x, y + r, "a", r, r, 0, 1, 1, 0, -r * 2, r, r, 0, 1, 1, 0, r * 2, "M", x + dx, y - bb.height / 2 - d, "a", r + d, r + d, 0, 1, 0, 0, bb.height + 2 * d, "l", r + d - dx + bb.width + 2 * d, 0, 0, -bb.height - 2 * d, "L", x + dx, y - bb.height / 2 - d].join(",")});
            }
            this[1].attr({x: x + r + d + bb.width / 2, y: y});
            angle = 360 - angle;
            this.rotate(angle, x, y);
            angle > 90 && angle < 270 && this[1].attr({x: x - r - d - bb.width / 2, y: y, rotation: [180 + angle, x, y]});
            return this;
        };
        res.update();
        return res;
    };
    Raphael.fn.g.flag = function (x, y, text, angle) {
        angle = angle || 0;
        text = text || "$9.99";
        var res = this.set(),
            d = 3;
        res.push(this.path({fill: "#000", stroke: "none"}));
        res.push(this.text(x, y, text).attr({"font-size": 12, fill: "#fff"}));
        res.update = function () {
            this.rotate(0, x, y);
            var bb = this[1].getBBox();
            this[0].attr({path: ["M", x, y, "l", bb.height / 2 + d, -bb.height / 2 - d, bb.width + 2 * d, 0, 0, bb.height + 2 * d, -bb.width - 2 * d, 0, "z"].join(",")});
            this[1].attr({x: x + bb.height / 2 + d + bb.width / 2, y: y});
            angle = 360 - angle;
            this.rotate(angle, x, y);
            angle > 90 && angle < 270 && this[1].attr({x: x - r - d - bb.width / 2, y: y, rotation: [180 + angle, x, y]});
            return this;
        };
        return res.update();
    };
    Raphael.fn.g.label = function (x, y, text) {
        var res = this.set();
        res.push(this.rect(x, y, 10, 10).attr({stroke: "none", fill: "#ccc"}));
        res.push(this.text(x, y, text));
        res.pill = res[0];
        res.txt = res[1];
        res.update = function () {
            var bb = this.txt.getBBox(),
                r = Math.min(bb.width + 10, bb.height + 10) / 2;
            this.pill.attr({x: bb.x - r / 2, y: bb.y - r / 2, width: bb.width + r, height: bb.height + r, r: r});
        };
        res.update();
        return res;
    };
    Raphael.fn.g.drop = function (x, y, text, size, angle) {
        size = size || 30;
        angle = angle || 0;
        var res = this.set();
        res.push(this.path({}, ["M", x, y, "l", size, 0, "A", size * .4, size * .4, 0, 1, 0, x + size * .7, y - size * .7, "z"]).attr({fill: "#000", stroke: "none", rotation: [22.5 - angle, x, y]}));
        angle = (angle + 90) * Math.PI / 180;
        res.push(this.text(x + size * Math.sin(angle), y + size * Math.cos(angle), text).attr({"font-size": size * 12 / 30, fill: "#fff"}));
        res.drop = res[0];
        res.text = res[1];
        return res;
    };
    Raphael.fn.g.blob = function (x, y, text, angle) {
        var angle = (+angle + 1 ? angle : 45) + 90,
            size = 12,
            rad = Math.PI / 180,
            fontSize = size * 12 / 12;
        var txt = this.text(x + size * Math.sin((angle) * rad), y + size * Math.cos((angle) * rad) - fontSize / 2, text).attr({"font-size": fontSize, fill: "#fff"});
        var res = this.set();
        res.update = function () {
            var bb = this[1].getBBox(),
                w = Math.max(bb.width + fontSize, size * 25 / 12),
                h = Math.max(bb.height + fontSize, size * 25 / 12),
                x2 = x + size * Math.sin((angle - 22.5) * rad),
                y2 = y + size * Math.cos((angle - 22.5) * rad),
                x1 = x + size * Math.sin((angle + 22.5) * rad),
                y1 = y + size * Math.cos((angle + 22.5) * rad),
                dx = (x1 - x2) / 2,
                dy = (y1 - y2) / 2,
                rx = w / 2,
                ry = h / 2,
                k = -Math.sqrt(Math.abs(rx * rx * ry * ry - rx * rx * dy * dy - ry * ry * dx * dx) / (rx * rx * dy * dy + ry * ry * dx * dx)),
                cx = k * rx * dy / ry + (x1 + x2) / 2,
                cy = k * -ry * dx / rx + (y1 + y2) / 2;
            this[1].attr({x: cx, y: cy});
            this[0].attr({path: ["M", x, y, "L", x1, y1, "A", rx, ry, 0, 1, 1, x2, y2, "z"].join(",")});
            return this;
        };
        res.push(this.path({fill: "#000", stroke: "none"}).insertBefore(txt));
        res.push(txt);
        res.update();
        return res;
    };
    Raphael.fn.g.colorValue = function (value, total, s, b) {
        return "hsb(" + [Math.min((1 - value / total) * .4, 1), s || .75, b || .75] + ")";
    };
    Raphael.el.lighter = function (times) {
        times = times || 2;
        var fs = [this.attrs.fill, this.attrs.stroke];
        this.fs = this.fs || [fs[0], fs[1]];
        fs[0] = Raphael.rgb2hsb(Raphael.getRGB(fs[0]).hex);
        fs[1] = Raphael.rgb2hsb(Raphael.getRGB(fs[1]).hex);
        fs[0].b = Math.min(fs[0].b * times, 1);
        fs[0].s = fs[0].s / times;
        fs[1].b = Math.min(fs[1].b * times, 1);
        fs[1].s = fs[1].s / times;
        this.attr({fill: "hsb(" + [fs[0].h, fs[0].s, fs[0].b] + ")", stroke: "hsb(" + [fs[1].h, fs[1].s, fs[1].b] + ")"});
    };
    Raphael.el.darker = function (times) {
        times = times || 2;
        var fs = [this.attrs.fill, this.attrs.stroke];
        this.fs = this.fs || [fs[0], fs[1]];
        fs[0] = Raphael.rgb2hsb(Raphael.getRGB(fs[0]).hex);
        fs[1] = Raphael.rgb2hsb(Raphael.getRGB(fs[1]).hex);
        fs[0].s = Math.min(fs[0].s * times, 1);
        fs[0].b = fs[0].b / times;
        fs[1].s = Math.min(fs[1].s * times, 1);
        fs[1].b = fs[1].b / times;
        this.attr({fill: "hsb(" + [fs[0].h, fs[0].s, fs[0].b] + ")", stroke: "hsb(" + [fs[1].h, fs[1].s, fs[1].b] + ")"});
    };
    Raphael.el.original = function () {
        if (this.fs) {
            this.attr({fill: this.fs[0], stroke: this.fs[1]});
            delete this.fs;
        }
    };
})();