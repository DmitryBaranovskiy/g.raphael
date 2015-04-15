/*!
 * g.Raphael 0.52 - Charting library, based on Raphaël
 * Copyright (c) 2015 Codrin Fechete, after g.pie.js file by Copyright (c) 2009-2012 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

 /*
 * donuthart method on paper
 */
/*\
 * Paper.donutchart
 [ method ]
 **
 * Creates a donut chart
 **
 > Parameters
 **
 - cx (number) x coordinate of the chart
 - cy (number) y coordinate of the chart
 - r (integer) radius of the chart
 - rint (integer) radius of the chart's interior
 - values (array) values used to plot
 - opts (object) options for the chart
 o {
 o minPercent (number) minimal percent threshold which will have a slice rendered. Sliced corresponding to data points below this threshold will be collapsed into 1 additional slice. [default `1`]
 o maxSlices (number) a threshold for how many slices should be rendered before collapsing all remaining slices into 1 additional slice (to focus on most important data points). [default `100`]
 o stroke (string) color of the chart stroke in HTML color format [default `"#FFF"`]
 o strokewidth (integer) width of the chart stroke [default `1`]
 o init (boolean) whether or not to show animation when the chart is ready [default `false`]
 o colors (array) colors be used to plot the chart
 o href (array) urls to to set up clicks on chart slices
 o legend (array) array containing strings that will be used in a legend. Other label options work if legend is defined.
 o legendcolor (string) color of text in legend [default `"#000"`]
 o legendothers (string) text that will be used in legend to describe options that are collapsed into 1 slice, because they are too small to render [default `"Others"`]
 o legendmark (string) symbol used as a bullet point in legend that has the same colour as the chart slice [default `"circle"`]
 o legendpos (string) position of the legend on the chart [default `"east"`]. Other options are `"north"`, `"south"`, `"west"`
 o }
 **
 = (object) path element of the popup
 > Usage
 | r.piechart(cx, cy, r, values, opts)
 \*/
 
(function () {

    function Donatchart(paper, cx, cy, r, rin, values, opts) {
        r = Math.max(r,rin);
        rin = Math.min(r,rin);
        opts = opts || {};

        var chartinst = this,
            rad = Math.PI / 180,
            sectors = [],
            covers = paper.set(),
            borders = paper.set(),
            chart = paper.set(),
            series = paper.set(),
            finalDim = paper.set(),
            order = [],
            len = values.length,
            angle = 0,
            total = 0,
            others = 0,
            cut = opts.maxSlices || 100,
            minPercent = parseFloat(opts.minPercent) || 1,
            angleplus = 0,
            defcut = Boolean( minPercent );

        function sector(cx, cy, r, rin, startAngle, endAngle) {
            var x1 = cx + r * Math.cos(-startAngle * rad),
                x2 = cx + r * Math.cos(-endAngle * rad),
                y1 = cy + r * Math.sin(-startAngle * rad),
                y2 = cy + r * Math.sin(-endAngle * rad),
                xx1 = cx + rin * Math.cos(-startAngle * rad),
                xx2 = cx + rin * Math.cos(-endAngle * rad),
                yy1 = cy + rin * Math.sin(-startAngle * rad),
                yy2 = cy + rin * Math.sin(-endAngle * rad),
                xm = cx + r / 2 * Math.cos(-(startAngle + (endAngle - startAngle) / 2) * rad),
                ym = cy + r / 2 * Math.sin(-(startAngle + (endAngle - startAngle) / 2) * rad),
                res = ["M", xx1, yy1,
                       "L", x1, y1, 
                       "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, 
                       "L", xx2, yy2, 
                       "A", rin, rin, 0, +(endAngle - startAngle > 180), 1, xx1, yy1, "z"];
            res.middle = { x: xm, y: ym };
            return res;       
        }    
        chart.covers = covers;
        if (len == 1) {   
            var cint = paper.circle(cx, cy, rin).attr({stroke: opts.stroke || "#000", "stroke-width": opts.strokewidth || 1, fill:""});
            var cext = paper.circle(cx, cy, r).attr({stroke: opts.stroke || "#000", "stroke-width": opts.strokewidth || 1, fill:""});
            
            series.push(paper.path(sector(cx, cy, r, rin, 0.001, 360)).attr({ fill: opts.colors && opts.colors[0] || chartinst.colors[0], "stroke-width": 0 }));
            covers.push(paper.path(sector(cx, cy, r, rin, 0.001, 360)).attr(chartinst.shim));

            series[0].cint = cint;
            series[0].cext = cext;

            total = values[0];
            values[0] = { value: values[0], order: 0, valueOf: function () { return this.value; } };
            opts.href && opts.href[0] && covers[0].attr({ href: opts.href[0] });
            series[0].middle = {x: cx, y: cy};
            series[0].mangle = 180;
        } else {
            // Calculate total:            
            for (var i = 0; i < len; i++) {
                total += values[i];
                values[i] = { value: values[i], order: i, valueOf: function () { return this.value; } };
            }                        
            // Values are sorted numerically:
            values.sort(function (a, b) {
                return b.value - a.value;
            });
            
            for (i = 0; i < len; i++) {
                if (defcut && values[i] * 100 / total < minPercent) {
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

            for (i = 0; i < len; i++) {
                var mangle = angle - 360 * values[i] / total / 2;
                if (!i) {
                    angle = 90 - mangle;
                    mangle = angle - 360 * values[i] / total / 2;
                }
                if (opts.init) {
                    if(!i){
                        var ipath = sector(cx, cy, 5, 1, angle, angle - 360 * values[i] / total).join(",");
                    }else{
                        var ipath = sector(cx, cy, 5, 1, angle, angle + angleplus).join(",");                        
                    }
                }
                angleplus = 360 * values[i] / total;                

                var path = sector(cx, cy, r, rin, angle, angle + angleplus);
                var j = (opts.matchColors && opts.matchColors == true) ? values[i].order : i;
                var p = paper.path(opts.init ? ipath : path).attr({ fill: opts.colors && opts.colors[j] || chartinst.colors[j] || "#666", stroke: opts.stroke || "#fff", "stroke-width": (opts.strokewidth == null ? 1 : opts.strokewidth), "stroke-linejoin": "round" });

                p.value = values[i];
                p.middle = path.middle;
                p.mangle = mangle;
                sectors.push(p);
                series.push(p);
                finalDim.push(paper.path(path).hide());
            //  opts.init && p.animate({callback:initHref, path: path.join(",") }, (+opts.init - 1) || 1000, ">");
                opts.init && p.animate({path: path.join(",") }, (+opts.init - 1) || 1000, ">");
                angle += angleplus;

            }            
            for (i = 0; i < len; i++) {
                p = paper.path(finalDim[i].attr("path")).attr(chartinst.shim);
                opts.href && opts.href[i] && p.attr({ href: opts.href[i] });// one line if
                p.attr = function () {};
                covers.push(p);
                series.push(p);
            }
        }
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
                })(series[i], covers[i], i);
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
                (function (sector, cover, j) {
                    var o = {
                        sector: sector,
                        cover: cover,
                        cx: cx,
                        cy: cy,
                        x: sector.middle.x,
                        y: sector.middle.y,
                        mangle: sector.mangle,
                        r: r,
                        value: values[j],
                        total: total,
                        label: that.labels && that.labels[j]
                    };
                    f.call(o);
                })(series[i], covers[i], i);
            }
            return this;
        };

        chart.click = function (f) {
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
                    cover.click(function () { f.call(o); });
                })(series[i], covers[i], i);
            }
            return this;
        };

        chart.inject = function (element) {
            element.insertBefore(covers[0]);
        };

        var legend = function (labels, otherslabel, mark, dir) {            
            var x = cx + r + r / 5,
                y = cy,
                h = y + 10;

            labels = labels || [];
            dir = (dir && dir.toLowerCase && dir.toLowerCase()) || "east";
            mark = paper[mark && mark.toLowerCase()] || "circle";
            chart.labels = paper.set();

            for (var i = 0; i < len; i++) {
                var clr = series[i].attr("fill"),
                    j = values[i].order,
                    txt;

                values[i].others && (labels[j] = otherslabel || "Others");
                labels[j] = chartinst.labelise(labels[j], values[i], total);
                chart.labels.push(paper.set());
                chart.labels[i].push(paper[mark](x + 5, h, 5).attr({ fill: clr, stroke: "none" }));
                chart.labels[i].push(txt = paper.text(x + 20, h, labels[j] || values[j]).attr(chartinst.txtattr).attr({ fill: opts.legendcolor || "#000", "text-anchor": "start"}));
                covers[i].label = chart.labels[i];
                h += txt.getBBox().height * 1.2;
            }

            var bb = chart.labels.getBBox(),
                tr = {
                    east: [0, -bb.height / 2],
                    west: [-bb.width - 2 * r - 40, -bb.height / 2],
                    north: [-r - bb.width / 2, -r - bb.height - 10],
                    south: [-r - bb.width / 2, r + 10]
                }[dir];

            chart.labels.translate.apply(chart.labels, tr);
            chart.push(chart.labels);
        };

        if (opts.legend) {
            legend(opts.legend, opts.legendothers, opts.legendmark, opts.legendpos);
        }

        chart.push(series, covers);
        chart.series = series;
        chart.covers = covers;

        return chart;
    };
    
    //inheritance
    var F = function() {};
    F.prototype = Raphael.g;
    Donatchart.prototype = new F;
    
    //public
    Raphael.fn.donutchart = function(cx, cy, r, rin, values, opts) {
        return new Donatchart(this, cx, cy, r, rin, values, opts);
    }
    
})();