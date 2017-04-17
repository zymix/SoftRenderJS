var meshes = [];
var mesh;
var device;
var mera;

document.addEventListener("DOMContentLoaded", init, false);

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame || function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function init(){
	canvas = document.getElementById("gameCanvas");
	mesh = new SoftRender.Mesh("cube", 8);
	mera = new SoftRender.Camera();
	device = new SoftRender.Device(canvas);
	meshes.push(mesh);
	mera.Position = new Vector3(0, 0, 10);  
    mera.Target = new Vector3(0, 0, 0); 

	mesh.Vertices[0] = new Vector3(-1, 1, 1);
    mesh.Vertices[1] = new Vector3(1, 1, 1);
    mesh.Vertices[2] = new Vector3(-1, -1, 1);
    mesh.Vertices[3] = new Vector3(1, -1, 1);
    mesh.Vertices[4] = new Vector3(-1, 1, -1);
    mesh.Vertices[5] = new Vector3(1, 1, -1);
    mesh.Vertices[6] = new Vector3(1, -1, -1);
    mesh.Vertices[7] = new Vector3(-1, -1, -1);

    mesh.Faces[0] = { A: 0, B: 1, C: 2 };
    mesh.Faces[1] = { A: 1, B: 2, C: 3 };
    mesh.Faces[2] = { A: 1, B: 3, C: 6 };
    mesh.Faces[3] = { A: 1, B: 5, C: 6 };
    mesh.Faces[4] = { A: 0, B: 1, C: 4 };
    mesh.Faces[5] = { A: 1, B: 4, C: 5 };

    mesh.Faces[6] = { A: 2, B: 3, C: 7 };
    mesh.Faces[7] = { A: 3, B: 6, C: 7 };
    mesh.Faces[8] = { A: 0, B: 2, C: 7 };
    mesh.Faces[9] = { A: 0, B: 4, C: 7 };
    mesh.Faces[10] = { A: 4, B: 5, C: 6 };
    mesh.Faces[11] = { A: 4, B: 6, C: 7 };

	requestAnimationFrame(drawLoop);
}

function drawLoop(){
	//清除上一帧内容
	device.clear();

	//每帧调整旋转
	mesh.Rotation.x += 0.01;
	mesh.Rotation.y += 0.01;

	//重新计算矩阵渲染
	device.render(mera, meshes);
	//刷新后台缓冲
	device.present();

	requestAnimationFrame(drawLoop);
}