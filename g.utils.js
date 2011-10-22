/*!
 * g.Raphael 0.4.1 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.snapEnds = function (from, to, steps) {
    var f = from,
        t = to;

    if (f == t) {
        return {from: f, to: t, power: 0};
    }

    function round(a) {
        return Math.abs(a - .5) < .25 ? ~~(a) + .5 : Math.round(a);
    }

    var d = (t - f) / steps,
        r = ~~(d),
        R = r,
        i = 0;

    if (r) {
        while (R) {
            i--;
            R = ~~(d * Math.pow(10, i)) / Math.pow(10, i);
        }

        i ++;
    } else {
        while (!r) {
            i = i || 1;
            r = ~~(d * Math.pow(10, i)) / Math.pow(10, i);
            i++;
        }

        i && i--;
    }

    t = round(to * Math.pow(10, i)) / Math.pow(10, i);

    if (t < to) {
        t = round((to + .5) * Math.pow(10, i)) / Math.pow(10, i);
    }

    f = round((from - (i > 0 ? 0 : .5)) * Math.pow(10, i)) / Math.pow(10, i);
    return { from: f, to: t, power: i };
};

Raphael.fn.axis = function (x, y, length, from, to, steps, orientation, labels, type, dashsize) {
    dashsize = dashsize == null ? 2 : dashsize;
    type = type || "t";
    steps = steps || 10;

    var path = type == "|" || type == " " ? ["M", x + .5, y, "l", 0, .001] : orientation == 1 || orientation == 3 ? ["M", x + .5, y, "l", 0, -length] : ["M", x, y + .5, "l", length, 0],
        ends = this.snapEnds(from, to, steps),
        f = ends.from,
        t = ends.to,
        i = ends.power,
        j = 0,
        txtattr = { font: "11px 'Fontin Sans', Fontin-Sans, sans-serif" },
        text = this.set();

    d = (t - f) / steps;

    var label = f,
        rnd = i > 0 ? i : 0;
        dx = length / steps;

    if (+orientation == 1 || +orientation == 3) {
        var Y = y,
            addon = (orientation - 1 ? 1 : -1) * (dashsize + 3 + !!(orientation - 1));

        while (Y >= y - length) {
            type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), Y + .5, "l", dashsize * 2 + 1, 0]));
            text.push(this.text(x + addon, Y, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr).attr({ "text-anchor": orientation - 1 ? "start" : "end" }));
            label += d;
            Y -= dx;
        }

        if (Math.round(Y + dx - (y - length))) {
            type != "-" && type != " " && (path = path.concat(["M", x - (type == "+" || type == "|" ? dashsize : !(orientation - 1) * dashsize * 2), y - length + .5, "l", dashsize * 2 + 1, 0]));
            text.push(this.text(x + addon, y - length, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr).attr({ "text-anchor": orientation - 1 ? "start" : "end" }));
        }
    } else {
        label = f;
        rnd = (i > 0) * i;
        addon = (orientation ? -1 : 1) * (dashsize + 9 + !orientation);

        var X = x,
            dx = length / steps,
            txt = 0,
            prev = 0;

        while (X <= x + length) {
            type != "-" && type != " " && (path = path.concat(["M", X + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
            text.push(txt = this.text(X, y + addon, (labels && labels[j++]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr));

            var bb = txt.getBBox();

            if (prev >= bb.x - 5) {
                text.pop(text.length - 1).remove();
            } else {
                prev = bb.x + bb.width;
            }

            label += d;
            X += dx;
        }

        if (Math.round(X - dx - x - length)) {
            type != "-" && type != " " && (path = path.concat(["M", x + length + .5, y - (type == "+" ? dashsize : !!orientation * dashsize * 2), "l", 0, dashsize * 2 + 1]));
            text.push(this.text(x + length, y + addon, (labels && labels[j]) || (Math.round(label) == label ? label : +label.toFixed(rnd))).attr(txtattr));
        }
    }

    var res = this.path(path);

    res.text = text;
    res.all = this.set([res, text]);
    res.remove = function () {
        this.text.remove();
        this.constructor.prototype.remove.call(this);
    };

    return res;
};
