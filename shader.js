/**
 * Created by xiankang.he on 2017/4/19.
 */
var Shader;
(function(Shader) {
    //基类
    var BaseShader = (function() {
        function BaseShader(device) {
            this.device = device;
        };
        BaseShader.prototype.vertShader = function(vertData) {

        };
        BaseShader.prototype.fragShader = function(pixel, data) {

        };
        //投影转换到设备坐标系
        BaseShader.prototype.project = function(coord, transMat) {
            // 进行坐标变换,变换后的坐标起始点是坐标系的中心点
            var point = Vector3.TransformCoordinates(coord, transMat);
            // 需要重新计算坐标使起始点变成左上角
            var x = point.x * this.device.workigWidth + this.device.workigWidth / 2.0;
            var y = -point.y * this.device.workigHeight + this.device.workigHeight / 2.0;
            return new Vector3(x, y, point.z);
        };

        return BaseShader;
    })();
    Shader.BaseShader = BaseShader;

    /**************************BaseShader子类****************************/
    //平面着色
    var FlatShader = (function() {
        function FlatShader(device) {
            BaseShader.call(this, device);
        };
        FlatShader.prototype = Object.create(BaseShader.prototype);
        FlatShader.prototype.constructor = FlatShader;
        FlatShader.prototype.vertShader = function(vertData, data) {
            var p = {};
            p.worldNormal = Vector3.TransformNormal(vertData.Normal, data.worldMat);
            p.worldPoint = Vector3.TransformCoordinates(vertData.Position, data.worldMat);
            p.projPoint = this.project(vertData.Position, data.mvpMat);

            return p;
        };
        FlatShader.prototype.surfShader = function(pa, pb, pc, data) {
            var surfData = {};
            var worldVa = pa.worldPoint;
            var worldVb = pb.worldPoint;
            var worldVc = pc.worldPoint;

            var worldNa = pa.worldNormal;
            var worldNb = pb.worldNormal;
            var worldNc = pc.worldNormal;

            var centerN = worldNa.add(worldNb.add(worldNc)).scale(1 / 3);
            var centerP = worldVa.add(worldVb.add(worldVc)).scale(1 / 3);
            var centerL = data.lightPos.subtract(centerP);

            surfData.cos = Utils.computeNdotL(centerN, centerL);
            return surfData;
        }
        FlatShader.prototype.fragShader = function(p, data) {
            var cos = data.surfData.cos;
            return new Color4(cos, cos, cos, 1);
        };
        return FlatShader;
    })();
    Shader.FlatShader = FlatShader;

    //高氏着色
    var GouraudShader = (function() {
        function GouraudShader(device) {
            BaseShader.call(this, device);
        };
        GouraudShader.prototype = Object.create(BaseShader.prototype);
        GouraudShader.constructor = GouraudShader;
        GouraudShader.prototype.vertShader = function(vertData, data) {
            var p = {};
            p.worldNormal = Vector3.TransformCoordinates(vertData.Normal, data.worldMat);
            p.worldPoint = Vector3.TransformCoordinates(vertData.Position, data.worldMat);
            p.projPoint = this.project(vertData.Position, data.mvpMat);
            p.uvCoord = vertData.UVCoord;
            var lightDir = data.lightPos.subtract(p.worldPoint);
            p.ndotl = Utils.computeNdotL(p.worldNormal, lightDir);
            return p;
        };
        GouraudShader.prototype.fragShader = function(p, data) {
            var ndotl = p.ndotl;
            var coord = p.uvCoord;
            var color = data.texture.map(coord.x, coord.y);
            return new Color4(color.r * ndotl, color.g * ndotl, color.b * ndotl, color.a);
        };
        return GouraudShader;
    })();
    Shader.GouraudShader = GouraudShader;

})(Shader || (Shader = {}));
