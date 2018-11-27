import Konva from 'konva';

class Camera {
    constructor(shape) {
        let imageObj = shape.image;
        let x = shape.x;
        let y = shape.y;
        let uuid = shape.uuid;
        let defauleAngle = shape.angle; //角度
        let rotation = shape.rotation || 90;
        let name = shape.name || "PerfectCamera" + uuid;

        let camera = new Konva.Image({
            name: name,
            image: imageObj,
            x: x,
            y: y,
            uuid: uuid, //标识
            rotation: rotation,
            width: imageObj.width,
            height: imageObj.height,
            offset: { // offset的设置是使得围绕中心旋转
                x: imageObj.width / 2,
                y: imageObj.height / 2
            }
        });

        let imgW = camera.width(),
            imgH = camera.height();

        let lastAngle = defauleAngle;

        Konva.Util.addMethods(Konva.Image, {
            setAngle(angle, isfirst) {
                if (isfirst) {
                    angle = defauleAngle;
                } else {
                    angle = angle || 0;
                    this.rotate(-lastAngle);
                }
                this.rotate(parseInt(angle));
                lastAngle = angle;
            }
        });

        return camera;
    }
}

export default Camera;