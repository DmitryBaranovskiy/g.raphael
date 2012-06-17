g.Raphaël - Official charting plugin for Raphaël
=========

For more information, see: http://g.raphaeljs.com/

Changelog
---------

This branch has made a few modifications to g.pie.js

 * Sectors with a value of 0, will now have stroke set to 0, to avoid the arbitrary line on the chart
 * Added an sort flag, opts = {sort: false} will keep the chart from being sorted
 * Added opacity, opts = {opacity: [0.5, ...]}
 * Added an inside radius option, to allow for the creation of donut charts, opts = {insideRadius: 50}


Examples can be found at http://wargoats.com/pie/