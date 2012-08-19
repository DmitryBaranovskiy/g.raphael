g.Raphaël - Official charting plugin for Raphaël
=========

For more information, see: http://g.raphaeljs.com/

Changelog
---------

**v0.51**

 * Fixed issues with piechart related to hrefs
 * Exposed minPercent and maxSlices in piechart
 * merged several pull requests fixing other issues
 * created docs using dr.js (see docs/reference.html)
   
**v0.5**

 * Refactored codebase and API to work with Raphaël 2.0
 * `g` is no longer a namespace, but instead a prototype object that all charts inherit. See documentation for all configurable options on the `g` prototype.
 * `g.markers` has been removed. The marker parameter strings now just try and resolve functions on the Paper prototype.
 * All primitive shapes have been removed. They are now part of Raphaël core in `plugins/`
 * The companion function `original` to the brightness functions `lighter` and `darker` has been renamed to `resetBrightness` to account for the `g` namespace removal
 * Tooltips have been modified/enhanced in the following ways:
   * All tooltips can now be called on any Element or Set instance, as well as from the paper object.
   * All tooltip `update` functions have been removed. Tooltip functions now return their path element. It is up to the caller to manage both the Element or set that is used as the context and the path element that was drawn by the tooltip function.
   * All tooltip `dir` options have been changed from `0`, `1`, `2`, `3`, to `'down'`, `'left'`, `'up'`, `'right'` repectively.
   * `blob` and `drop` tooltips no longer accept `size` parameters. Instead, the bounding box of the Element/Set being used as content is used to automatically determine the size.
   * `popupit` and `labelit` have been removed. Their functionality is now the default behavior of all tooltips
