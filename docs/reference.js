Raphael(function () {
    var grad = {
            stroke: "#fff",
            fill: "0-#c9de96-#8ab66b:44-#398235"
        },
        fill = {
            stroke: "#fff",
            fill: "#ff0000",
            "stroke-width": 2
        };

    function prepare(id) {
        var div = document.getElementById(id);
        div.style.cssText = "display:block;float:right;padding:10px;width:99px;height:99px;background:#2C53B0 url(./blueprint-min.png) no-repeat";
        return Raphael(div, 99, 99);
    }
    
    prepare("Element.popup-extra").circle(50, 50, 5).attr(grad).popup();
    prepare("Element.tag-extra").circle(50, 50, 15).attr(grad).tag(60);
    prepare("Element.drop-extra").circle(50, 50, 8).attr(grad).drop(60);
    prepare("Element.flag-extra").circle(50, 50, 10).attr(grad).flag(60);
    prepare("Element.label-extra").circle(50, 50, 10).attr(grad).label();
    prepare("Element.blob-extra").circle(50, 50, 8).attr(grad).blob(60);

    prepare("Paper.popup-extra").popup(50, 50, "Hello", 'down');
    prepare("Paper.tag-extra").tag(50, 50, "$9.99", 60);
    prepare("Paper.drop-extra").drop(30, 70, "$9.99", 60);
    prepare("Paper.flag-extra").flag(50, 50, "$9.99", 60);
    prepare("Paper.label-extra").label(50, 50, "$9.99");
    prepare("Paper.blob-extra").blob(50, 50, "Hello", 60);

    prepare("Paper.dotchart-extra").dotchart(0, 0, 99, 99, [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], [1, 2, 3, 4, 5], {max: 7, heat: true, gutter: 1, axisxstep: 4});
    prepare("Paper.linechart-extra").linechart(0, 0, 99, 99, [1,2,3,4,5], [[1,2,3,4,5], [1,3,9,16,25], [100,50,25,12,6]], {smooth: true, colors: ['#F00', '#0F0', '#FF0'], symbol: 'circle', width: 1});
    prepare("Paper.piechart-extra").piechart(50, 50, 47, [1,2,3,4,5]);
    
    prepare("Element.lighter-extra").circle(50, 50, 20).attr(fill).lighter(6);
    prepare("Element.darker-extra").circle(50, 50, 20).attr(fill).darker(6);
    prepare("Element.resetBrightness-extra").circle(50, 50, 20).attr(fill).lighter(6).resetBrightness();
    
    
});
