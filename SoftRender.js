var SoftRender;
(function (SoftRender) {
    //定义相机
    var Camera = (function () {
        function Camera() {
            this.Position = Vector3.Zero();
            this.Target = Vector3.Zero();
        };
        return Camera;
    })();
    SoftRender.Camera = Camera;
    //定义面片
    var Face = (function () {
        function Face(a, b, c) {
            this.A = a;
            this.B = b;
            this.C = c;
        }

        return Face;
    });
    SoftRender.Face = Face;
    //定义网格
    var Mesh = (function () {
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
    var Device = (function () {
        function Device(canvas) {
            this.workigCanvas = canvas;
            this.workigWidth = canvas.width;
            this.workigHeight = canvas.height;
            this.workingContext = this.workigCanvas.getContext("2d");
            this.depthbuffer = new Array(this.workigWidth * this.workigHeight);
        };
        //清除缓冲区为黑色（默认）
        Device.prototype.clear = function () {
            this.workingContext.clearRect(0, 0, this.workigWidth, this.workigHeight);
            this.backbuffer = this.workingContext.getImageData(0, 0, this.workigWidth, this.workigHeight);
            for (var i = 0; i < this.depthbuffer.length; i++) {
                this.depthbuffer[i] = 10000000;
            }
        };
        //刷新前缓冲区
        Device.prototype.present = function () {
            this.workingContext.putImageData(this.backbuffer, 0, 0);
        };
        //像素着色
        Device.prototype.putPixel = function (x, y, z, color) {
            this.backbufferdata = this.backbuffer.data;
            //注意这个的缓冲数据是一位数组
            var index = ((x >> 0) + (y >> 0) * this.workigWidth);
            //开启深度测试
            if (this.depthbuffer[index] < z) {
                return;
            }
            //通过深度测试则重置深度值
            this.depthbuffer[index] = z;
            index *= 4
            this.backbufferdata[index] = color.r * 255;
            this.backbufferdata[index + 1] = color.g * 255;
            this.backbufferdata[index + 2] = color.b * 255;
            this.backbufferdata[index + 3] = color.a * 255;
        };
        //投影转换到设备坐标系
        // Device.prototype.project = function(coord, transMat) {
        //     // 进行坐标变换,变换后的坐标起始点是坐标系的中心点
        //     var point = Vector3.TransformCoordinates(coord, transMat);
        //     // 需要重新计算坐标使起始点变成左上角
        //     var x = point.x * this.workigWidth + this.workigWidth / 2.0 >> 0;
        //     var y = -point.y * this.workigHeight + this.workigHeight / 2.0 >> 0;
        //     return new Vector3(x, y, point.z);
        // };
        //封装，越界检测
        Device.prototype.drawPoint = function (point, color) {
            if (point.x >= 0 && point.y >= 0 && point.x < this.workigWidth && point.y < this.workigHeight) {
                this.putPixel(point.x, point.y, point.z, color);
            }
        };
        Device.prototype.render = function (camera, meshes) {
            var data = {};
            var viewMat = Matrix.LookAtLH(camera.Position, camera.Target, Vector3.Up());
            var projMat = Matrix.PerspectiveFovLH(0.78, this.workigWidth / this.workigHeight, 0.01, 1.0);
            var lightPos = new Vector3(0, 10, 10);

            data.lightPos = lightPos;
            for (var i = 0; i < meshes.length; ++i) {
                var mesh = meshes[i];
                //计算世界坐标系的变换矩阵SRT
                var worldMat = Matrix.RotationYawPitchRoll(
                    mesh.Rotation.y, mesh.Rotation.x, mesh.Rotation.z)
                    .multiply(Matrix.Translation(
                        mesh.Position.x, mesh.Position.y, mesh.Position.z));
                //mvp变换矩阵
                mvpMat = worldMat.multiply(viewMat).multiply(projMat);
                // 自定义一个光照位置
                data.worldMat = worldMat;
                data.mvpMat = mvpMat;
                //var shaderProgram = new Shader.FlatShader(this);
                var shaderProgram = new Shader.GouraudShader(this);
                this.renderPipeline(mesh, shaderProgram, data);
            }
        };
        Device.prototype.renderPipeline = function (mesh, shaderProgram, data) {
            var vertArr = mesh.Vertices;
            for (var i = 0; i < mesh.Faces.length; i++) {
                var face = mesh.Faces[i];

                var va = vertArr[face.A];
                var vb = vertArr[face.B];
                var vc = vertArr[face.C];
                var pA = shaderProgram.vertShader(va, data);
                var pB = shaderProgram.vertShader(vb, data);
                var pC = shaderProgram.vertShader(vc, data);
                if (shaderProgram.surfShader != null) {
                    data.surfData = shaderProgram.surfShader(pA, pB, pC, data);
                }

                this.drawTriangle(pA, pB, pC, shaderProgram.fragShader, data);
            }
        };
        //通过重心坐标系实现三角形光栅化
        Device.prototype.drawTriangle = function (pa, pb, pc, fragShader, data) {
            var p0 = pa.projPoint;
            var p1 = pb.projPoint;
            var p2 = pc.projPoint;
            var xmin = Math.floor(Math.min(p0.x, p1.x, p2.x));
            var ymin = Math.floor(Math.min(p0.y, p1.y, p2.y));
            var xmax = Math.ceil(Math.max(p0.x, p1.x, p2.x));
            var ymax = Math.ceil(Math.max(p0.y, p1.y, p2.y));
            //直线方程p2p0
            var a20 = (p2.y - p0.y);
            var b20 = (p0.x - p2.x);
            var c20 = p2.x * p0.y - p0.x * p2.y;
            var f20 = a20 * p1.x + b20 * p1.y + c20;
            //直线方程p1p2
            var a12 = (p1.y - p2.y);
            var b12 = (p2.x - p1.x);
            var c12 = p1.x * p2.y - p2.x * p1.y;
            var f12 = a12 * p0.x + b12 * p0.y + c12;

            var zero = 0.000001;
            //避免下面除零错误
            if (Math.abs(f20) < zero || Math.abs(f12) < zero) {
                return;
            }
            var fa = 1 / f12;
            var fb = 1 / f20;

            //优化迭代，递增
            var oa = a12 * (xmin - 1) + b12 * (ymin - 1) + c12;
            var ob = a20 * (xmin - 1) + b20 * (ymin - 1) + c20;
            for (var y = ymin; y <= ymax; ++y) {
                oa += b12;
                ob += b20;
                var tmpa = oa;
                var tmpb = ob;
                for (var x = xmin; x <= xmax; ++x) {
                    tmpa += a12;
                    tmpb += a20;
                    var a = tmpa * fa;
                    var b = tmpb * fb;
                    var c = 1 - a - b;
                    if (a >= 0 && b >= 0 && c >= 0) {
                        //着色
                        //光栅化的像素点
                        var z = a * p0.z + b * p1.z + c * p2.z;
                        var newp = {};
                        var pixel = new Vector3(x, y, z);
                        newp.ndotl = a * pa.ndotl + b * pb.ndotl + c * pc.ndotl;
                        newp.pixel = pixel;
                        var color = fragShader(newp, data);
                        this.drawPoint(pixel, color);
                    }
                }
            }
        };
        //渲染直线
        Device.prototype.drawLine = function (p1, p2) {
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

        //异步加载JSON文件
        Device.prototype.LoadJSONFileAsync = function (filename, callback) {
            var jsonObject = {};
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open("GET", filename, true);
            var that = this;
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

                    jsonObject = JSON.parse(xmlhttp.responseText);
                    callback(that.CreateMeshesFromJson(jsonObject));
                }
            };
            xmlhttp.send(null);
        };
        //解析JSON对象创建网格
        Device.prototype.CreateMeshesFromJson = function (jsonObject) {
            var meshes = [];
            for (var meshIndex = 0; meshIndex < jsonObject.meshes.length; meshIndex++) {
                var verticesArray = jsonObject.meshes[meshIndex].vertices;
                var indicesArray = jsonObject.meshes[meshIndex].indices;
                var uvCount = jsonObject.meshes[meshIndex].uvCount;
                var verticesStep = 1;
                // 取决于纹理坐标的数量，我们动态的选择6步进、8步进以及10步进值  
                switch (uvCount) {
                    case 0:
                        verticesStep = 6;
                        break;
                    case 1:
                        verticesStep = 8;
                        break;
                    case 2:
                        verticesStep = 10;
                        break;
                }
                var verticesCount = verticesArray.length / verticesStep;
                var facesCount = indicesArray.length / 3;
                var mesh = new SoftRender.Mesh(jsonObject.meshes[meshIndex].name, verticesCount, facesCount);
                for (var i = 0; i < verticesCount; i++) {
                    //获取顶点
                    var x = verticesArray[i * verticesStep];
                    var y = verticesArray[i * verticesStep + 1];
                    var z = verticesArray[i * verticesStep + 2];
                    //获取顶点上的法线
                    var nx = verticesArray[i * verticesStep + 3];
                    var ny = verticesArray[i * verticesStep + 4];
                    var nz = verticesArray[i * verticesStep + 5];
                    mesh.Vertices[i] = {
                        Position: new Vector3(x, y, z),
                        Normal: new Vector3(nx, ny, nz)
                    }
                }
            }
            for (var i = 0; i < facesCount; i++) {
                var a = indicesArray[i * 3];
                var b = indicesArray[i * 3 + 1];
                var c = indicesArray[i * 3 + 2];
                mesh.Faces[i] = {A: a, B: b, C: c};
            }
            // var pos = jsonObject.meshes[meshIndex].position;
            // mesh.Position = new Vector3(pos[0], pos[1], pos[2]);
            // var ro = jsonObject.meshes[meshIndex].rotation;
            //mesh.Rotation = new Vector3(135, -45, 0);
            meshes.push(mesh);
            return meshes;
        };
        return Device;
    })();
    SoftRender.Device = Device;
})(SoftRender || (SoftRender = {}));
