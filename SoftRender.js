var SoftRender;
(function(SoftRender) {
    //定义相机
    var Camera = (function() {
        function Camera() {
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        };
        return Camera;
    })();
    SoftRender.Camera = Camera;
    //定义面片
    var Face = (function() {
        function Face(a, b, c) {
            this.A = a;
            this.B = b;
            this.C = c;
        }
        return Face;
    });
    SoftRender.Face = Face;
    //定义网格
    var Mesh = (function() {
        function Mesh(name, verticesCount, facesCount) {
            this.name = name;
            this.Vertices = new Array(verticesCount);
            this.Faces = new Array(facesCount);
            this.Rotation = Vector3.Zero();
            this.Position = Vector3.Zero();
        };
        return Mesh;
    })();
    SoftRender.Mesh = Mesh;

    //定义渲染设备
    var Device = (function() {
        function Device(canvas) {
            this.workigCanvas = canvas;
            this.workigWidth = canvas.width;
            this.workigHeight = canvas.height;
            this.workingContext = this.workigCanvas.getContext("2d");
        };
        //清除缓冲区为黑色（默认）
        Device.prototype.clear = function() {
            this.workingContext.clearRect(0, 0, this.workigWidth, this.workigHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workigWidth, this.workigHeight);
        };
        //刷新前缓冲区
        Device.prototype.present = function() {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };
        //像素着色
        Device.prototype.putPixel = function(x, y, color) {
            this.backbufferdata = this.backbuffer.data;
            //注意这个的缓冲数据是一位数组
            var index = ((x >> 0) + (y >> 0) * this.workigWidth) * 4;
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        };
        //投影转换到设备坐标系
        Device.prototype.project = function(coord, transMat) {
            // 进行坐标变换,变换后的坐标起始点是坐标系的中心点 
            var point = Vector3.TransformCoordinates(coord, transMat);
            // 需要重新计算坐标使起始点变成左上角
            var x = point.x * this.workigWidth + this.workigWidth / 2.0 >> 0;
            var y = -point.y * this.workigHeight + this.workigHeight / 2.0 >> 0;
            return new Vector2(x, y);
        };
        //封装，越界检测
        Device.prototype.drawPoint = function(point) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workigWidth && point.y < this.workigHeight) {
                this.putPixel(point.x, point.y, new Color4(1, 1, 0, 1));
            }
        };
        Device.prototype.render = function(camera, meshes) {
            var viewMat = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
            var projMat = Matrix.PerspectiveFovLH(0.78, this.workigWidth / this.workigHeight, 0.01, 1.0);
            var mat = viewMat.multiply(projMat);
            for (var i = 0; i < meshes.length; ++i) {
                var mesh = meshes[i];
                //计算世界坐标系的变换矩阵SRT
                var worldMat = Matrix.RotationYawPitchRoll(
                        mesh.Rotation.y, mesh.Rotation.x, mesh.Rotation.z)
                    .multiply(Matrix.Translation(
                        mesh.Position.x, mesh.Position.y, mesh.Position.z));
                //mvp变换矩阵
                mat = worldMat.multiply(mat);

                for (var i = 0; i < mesh.Faces.length; i++) {
                    var face = mesh.Faces[i];

                    var pA = this.project(mesh.Vertices[face.A], mat);
                    var pB = this.project(mesh.Vertices[face.B], mat);
                    var pC = this.project(mesh.Vertices[face.C], mat);

                    this.drawLine(pA, pB);
                    this.drawLine(pB, pC);
                    this.drawLine(pC, pA);
                }
            }
        };

        //渲染直线
        Device.prototype.drawLine = function(p1, p2) {
            var x1 = p1.x >> 0;
            var x2 = p2.x >> 0;
            var y1 = p1.y >> 0;
            var y2 = p2.y >> 0;
            var dx = Math.abs(x1 - x2);
            var dy = Math.abs(y1 - y2);
            var sx = (x1 < x2) ? 1 : -1;
            var sy = (y1 < y2) ? 1 : -1;
            var err = dx - dy;
            while (true) {
                this.drawPoint(new Vector2(x1, y1));
                if ((x1 == x2) && (y1 == y2)) {
                    break;
                }
                var e2 = 2 * err;
                if (e2 > -dy) {
                    err -= dy;
                    x1 += sx;
                }
                if (e2 < dx) {
                    err += dx;
                    y1 += sy;
                }
            }
        };
        return Device;
    })();
    SoftRender.Device = Device;
})(SoftRender || (SoftRender = {}));
