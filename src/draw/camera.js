import go from 'gojs';

export default class {
    constructor(rectuuid,point) {
        let camerasvg = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1 Basic//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11-basic.dtd"><svg version="1.1" baseProfile="basic" id="svg2" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve"><path id="path410" d="m26.7,13.016006c-0.16,6.095 -5.55,10.992 -12.2,10.992c-6.61,0 -11.99,-4.864 -12.19,-10.934a5.278,5.278 0 0 1 -2.28,-1.96c-0.11,-1.648 0,-6.3 0,-7.369c4.56,-4.952 24.24,-5.029 28.95,0l0,7.369a5.464,5.464 0 0 1 -2.28,1.9l0,0l0,0.002zm-16.44,6.844l0,0c0.62,1.071 2.28,1.843 4.24,1.843s3.63,-0.772 4.25,-1.843l0,0l0.19,-5.986l0,0a4.511,4.511 0 0 0 -8.87,0l0,0l0.19,5.986zm16.46,-15.116c-4.16,-3.047 -18.96,-3.282 -24.43,-0.081c0,0.551 -0.05,3.024 0.04,3.87c4.3,-2.741 19.96,-2.7 24.39,0l0,-3.787l0,-0.002zm-12.22,10.05a2.552,2.552 0 1 1 -2.26,2.535a2.415,2.415 0 0 1 2.26,-2.535l0,0zm12.22,-10.05"/></svg>`;

        //使用这个可以设置shape的position属性
        let cameradrawing = new go.Node();
        let xmldoc = new DOMParser().parseFromString(camerasvg, "text/xml");
        let paths = xmldoc.getElementsByTagName("path");
        cameradrawing.minSize = new go.Size(50,40);
        cameradrawing.desiredSize = new go.Size(50,40);
        cameradrawing.position = new go.Point(point.x-35,point.y-28);
        cameradrawing.zOrder = 99;
        cameradrawing.resizable=true;
        for (let i = 0; i < paths.length; i++) {
            let path = paths[i];
            let shape = new go.Shape();
            let rectShape = new go.Shape();
            rectShape.figure = "Rectangle";
            rectShape.fill= "#00B5CB" ;//"#00B5CB",
            rectShape.opacity=0;
            rectShape.strokeWidth= 0;
            rectShape.stroke= null;

            let stroke = path.getAttribute("stroke");
            if (typeof stroke === "string" && stroke !== "none") {
                shape.stroke = stroke;
            } else {
                shape.stroke = null;
            }

            let strokewidth = parseFloat(path.getAttribute("stroke-width"));
            if (!isNaN(strokewidth)) shape.strokeWidth = strokewidth;

            let id = path.getAttribute("id");
            if (typeof id === "string") shape.name = id;

            // let fill = path.getAttribute("fill");
            // if (typeof fill === "string") {
            //     shape.fill = (fill === "none") ? null : fill;
            // }
            shape.fill = "#00B5CB";
            let data = path.getAttribute("d");
            if (typeof data === "string") shape.geometry = go.Geometry.parse(data, true);

            shape.height = 24;
            shape.width = 28.97;
            shape.position = new go.Point(10,8);
            cameradrawing.add(rectShape);
            cameradrawing.add(shape);
        }
        //将图形的__gohashid添加到camera的属性上以便后续操作
        cameradrawing.rectuuid = rectuuid;
        return cameradrawing;
    }
}
