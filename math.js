var Utils;
(function(Utils) {
    Utils.interpolate = function(min, max, gradient) {
        return min + (max - min) * Utils.clamp(gradient);
    }
    Utils.clamp = function(value, min, max) {
        if (typeof min === "undefined") { min = 0; }
        if (typeof max === "undefined") { max = 1; }
        return Math.max(min, Math.min(value, max));
    };
    // 计算向量之间角度的余弦，返回0到1之间的值
    Utils.computeNdotL = function(n, l) {
        var tmpN = Vector3.Normalize(n);
        var tmpL = Vector3.Normalize(l);
        return Math.max(0, Vector3.Dot(tmpN, tmpL));
    };
})(Utils || (Utils = {}));

var Color4 = (function() {
    function Color4(initialR, initialG, initialB, initialA) {
        this.r = initialR;
        this.g = initialG;
        this.b = initialB;
        this.a = initialA;
    }
    Color4.prototype.toString = function() {
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
    };
    return Color4;
})();

var Vector2 = (function() {
    function Vector2(initialX, initialY) {
        this.x = initialX;
        this.y = initialY;
    }
    Vector2.prototype.toString = function() {
        return "{X: " + this.x + " Y:" + this.y + "}";
    };
    Vector2.prototype.add = function(otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    };
    Vector2.prototype.subtract = function(otherVector) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    };
    Vector2.prototype.negate = function() {
        return new Vector2(-this.x, -this.y);
    };
    Vector2.prototype.scale = function(scale) {
        return new Vector2(this.x * scale, this.y * scale);
    };
    Vector2.prototype.equals = function(otherVector) {
        return this.x === otherVector.x && this.y === otherVector.y;
    };
    Vector2.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.lengthSquared = function() {
        return (this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.normalize = function() {
        var len = this.length();
        if (len === 0) {
            return;
        }
        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
    };
    Vector2.Zero = function Zero() {
        return new Vector2(0, 0);
    };
    Vector2.Copy = function Copy(source) {
        return new Vector2(source.x, source.y);
    };
    Vector2.Normalize = function Normalize(vector) {
        var newVector = Vector2.Copy(vector);
        newVector.normalize();
        return newVector;
    };
    Vector2.Minimize = function Minimize(left, right) {
        var x = (left.x < right.x) ? left.x : right.x;
        var y = (left.y < right.y) ? left.y : right.y;
        return new Vector2(x, y);
    };
    Vector2.Maximize = function Maximize(left, right) {
        var x = (left.x > right.x) ? left.x : right.x;
        var y = (left.y > right.y) ? left.y : right.y;
        return new Vector2(x, y);
    };
    Vector2.Transform = function Transform(vector, transformation) {
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
        return new Vector2(x, y);
    };
    Vector2.Distance = function Distance(value1, value2) {
        return Math.sqrt(Vector2.DistanceSquared(value1, value2));
    };
    Vector2.DistanceSquared = function DistanceSquared(value1, value2) {
        var x = value1.x - value2.x;
        var y = value1.y - value2.y;
        return (x * x) + (y * y);
    };
    return Vector2;
})();

var Vector3 = (function() {
    function Vector3(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    };

    Vector3.prototype.toString = function() {
        return "{X:" + this.x + " Y:" + this.y + " Z:" + this.z + "}";
    };
    Vector3.prototype.add = function(other) {
        return new Vector3(this.x + other.x, this.y + other.y, this.z + other.z);
    };
    Vector3.prototype.subtract = function(other) {
        return new Vector3(this.x - other.x, this.y - other.y, this.z - other.z);
    };
    Vector3.prototype.negate = function() {
        return new Vector3(-this.x, -this.y, -this.z);
    };
    Vector3.prototype.scale = function(scale) {
        return new Vector3(this.x * scale, this.y * scale, this.z * scale);
    };
    Vector3.prototype.equals = function(other) {
        return this.x == other.x && this.y == other.y && this.z == other.y;
    };
    Vector3.prototype.multiply = function(other) {
        return new Vector3(this.x * other.x, this.y * other.y, this.z * other.z);
    };
    Vector3.prototype.divide = function(other) {
        return new Vector3(this.x / other.x, this.y / other.y, this.z / other.z);
    };
    Vector3.prototype.length = function() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    };
    Vector3.prototype.lengthSquared = function() {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    };
    Vector3.prototype.normalize = function() {
        var len = this.length();
        if (len == 0) {
            return;
        }
        var num = 1.0 / len;
        this.x *= num;
        this.y *= num;
        this.z *= num;
    };

    Vector3.FromArray = function FromArray(array, offset) {
        if (!offset) {
            offset = 0;
        }
        return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
    };
    Vector3.Zero = function Zero() {
        return new Vector3(0, 0, 0);
    };
    Vector3.Up = function Up() {
        return new Vector3(0, 1.0, 0);
    };
    Vector3.Copy = function Copy(source) {
        return new Vector3(source.x, source.y, source.z);
    };
    Vector3.TransformCoordinates = function TransformCoordinates(vector, transformation) {
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
        var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
        var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];

        return new Vector3(x / w, y / w, z / w);
    };
    Vector3.TransformNormal = function TransformNormal(vector, transformation) {
        var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
        var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
        var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);

        return new Vector3(x, y, z);
    };
    Vector3.Dot = function Dot(left, right) {
        return left.x * right.x + left.y * right.y + left.z * right.z;
    };
    Vector3.Cross = function Cross(left, right) {
        var x = left.y * right.z - left.z * right.y;
        var y = left.z * right.x - left.x * right.z;
        var z = left.x * right.y - left.y * right.x;
        return new Vector3(x, y, z);
    };
    Vector3.Normalize = function Normalize(vector) {
        var v = Vector3.Copy(vector);
        v.normalize();
        return v;
    };
    Vector3.Distance = function Distance(v1, v2) {
        return Math.sqrt(Vector3.DistanceSquare(v1, v2));
    };
    Vector3.DistanceSquare = function(v1, v2) {
        var x = v1.x - v2.x;
        var y = v1.y - v2.y;
        var z = v1.z - v2.z;
        return x * x + y * y + z * z;
    };

    return Vector3;
})();

var Matrix = (function() {
    function Matrix() {
        this.m = [];
    };

    Matrix.prototype.isIdentity = function() {
        if (this.m[0] != 1.0 || this.m[5] != 1.0 || this.m[10] != 1.0 || this.m[15] != 1.0)
            return false;
        if (this.m[1] != 0.0 || this.m[2] != 0.0 || this.m[3] != 0.0 || this.m[4] != 0.0 || this.m[6] != 0.0 || this.m[7] != 0.0 || this.m[8] != 0.0 || this.m[9] != 0.0 || this.m[11] != 0.0 || this.m[12] != 0.0 || this.m[13] != 0.0 || this.m[14] != 0.0)
            return false;
        return true;
    };
    Matrix.prototype.determinant = function() {
        var tmp1 = this.m[10] * this.m[15] - this.m[11] * this.m[14];
        var tmp2 = this.m[9] * this.m[15] - this.m[11] * this.m[13];
        var tmp3 = this.m[9] * this.m[14] - this.m[10] * this.m[13];
        var tmp4 = this.m[8] * this.m[15] - this.m[11] * this.m[12];
        var tmp5 = this.m[8] * this.m[14] - this.m[10] * this.m[12];
        var tmp6 = this.m[8] * this.m[13] - this.m[9] * this.m[12];

        var m1 = this.m[5] * tmp1 - this.m[6] * tmp2 + this.m[7] * tmp3;
        var m2 = this.m[4] * tmp1 - this.m[6] * tmp4 + this.m[7] * tmp5;
        var m3 = this.m[4] * tmp2 - this.m[5] * tmp4 + this.m[7] * tmp6;
        var m4 = this.m[4] * tmp3 - this.m[5] * tmp5 + this.m[6] * tmp6;

        return this.m[0] * m1 - this.m[1] * m2 + this.m[2] * m3 - this.m[3] * m4;
    };
    Matrix.prototype.toArray = function() {
        return this.m;
    };
    Matrix.prototype.invert = function() {
        var tmp1 = this.m[10] * this.m[15] - this.m[11] * this.m[14];
        var tmp2 = this.m[9] * this.m[15] - this.m[11] * this.m[13];
        var tmp3 = this.m[9] * this.m[14] - this.m[10] * this.m[13];
        var tmp4 = this.m[8] * this.m[15] - this.m[11] * this.m[12];
        var tmp5 = this.m[8] * this.m[14] - this.m[10] * this.m[12];
        var tmp6 = this.m[8] * this.m[13] - this.m[9] * this.m[12];

        var m1 = this.m[5] * tmp1 - this.m[6] * tmp2 + this.m[7] * tmp3;
        var m2 = this.m[4] * tmp1 - this.m[6] * tmp4 + this.m[7] * tmp5;
        var m3 = this.m[4] * tmp2 - this.m[5] * tmp4 + this.m[7] * tmp6;
        var m4 = this.m[4] * tmp3 - this.m[5] * tmp5 + this.m[6] * tmp6;

        var determinant = this.m[0] * m1 - this.m[1] * m2 + this.m[2] * m3 - this.m[3] * m4;
        var denominator = 1.0 / determinant;

        var tmp7 = this.m[6] * this.m[15] - this.m[7] * this.m[14];
        var tmp8 = this.m[5] * this.m[15] - this.m[7] * this.m[13];
        var tmp9 = this.m[5] * this.m[14] - this.m[6] * this.m[13];
        var tmp10 = this.m[4] * this.m[15] - this.m[7] * this.m[12];
        var tmp11 = this.m[4] * this.m[14] - this.m[6] * this.m[12];
        var tmp12 = this.m[4] * this.m[13] - this.m[5] * this.m[12];

        var tmp13 = this.m[6] * this.m[11] - this.m[7] * this.m[10];
        var tmp14 = this.m[5] * this.m[11] - this.m[7] * this.m[9];
        var tmp15 = this.m[5] * this.m[10] - this.m[6] * this.m[9];
        var tmp16 = this.m[4] * this.m[10] - this.m[6] * this.m[8];
        var tmp17 = this.m[4] * this.m[11] - this.m[7] * this.m[8];
        var tmp18 = this.m[4] * this.m[9] - this.m[5] * this.m[8];

        var m5 = this.m[1] * tmp1 - this.m[2] * tmp2 + this.m[3] * tmp3;
        var m6 = this.m[0] * tmp1 - this.m[2] * tmp4 + this.m[3] * tmp5;
        var m7 = this.m[0] * tmp2 - this.m[1] * tmp4 + this.m[3] * tmp6;
        var m8 = this.m[0] * tmp1 - this.m[1] * tmp4 + this.m[2] * tmp5;

        var m9 = this.m[1] * tmp7 - this.m[2] * tmp8 + this.m[3] * tmp9;
        var m10 = this.m[0] * tmp7 - this.m[2] * tmp10 + this.m[3] * tmp11;
        var m11 = this.m[0] * tmp8 - this.m[1] * tmp10 + this.m[3] * tmp12;
        var m12 = this.m[0] * tmp9 - this.m[1] * tmp11 + this.m[2] * tmp12;

        var m13 = this.m[1] * tmp13 - this.m[2] * tmp14 + this.m[3] * tmp15;
        var m14 = this.m[0] * tmp13 - this.m[2] * tmp17 + this.m[3] * tmp16;
        var m15 = this.m[0] * tmp14 - this.m[1] * tmp17 + this.m[3] * tmp18;
        var m16 = this.m[0] * tmp15 - this.m[1] * tmp16 + this.m[2] * tmp18;

        this.m[0] = m1 * denominator;
        this.m[1] = -m5 * denominator;
        this.m[2] = m9 * denominator;
        this.m[3] = -m13 * denominator;
        this.m[4] = -m2 * denominator;
        this.m[5] = m6 * denominator;
        this.m[6] = -m10 * denominator;
        this.m[7] = m14 * denominator;
        this.m[8] = m3 * denominator;
        this.m[9] = -m7 * denominator;
        this.m[10] = m11 * denominator;
        this.m[11] = -m15 * denominator;
        this.m[12] = -m4 * denominator;
        this.m[13] = m8 * denominator;
        this.m[14] = -m12 * denominator;
        this.m[15] = m16 * denominator;
    };
    Matrix.prototype.multiply = function(other) {
        var result = new Matrix(other);
        result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
        result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
        result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
        result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];

        result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
        result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
        result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
        result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];


        result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
        result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
        result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
        result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];

        result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
        result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
        result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
        result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
        return result;
    };
    Matrix.prototype.equals = function(value) {
        return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
    };
    Matrix.FromValues = function FromValues(initialM11, initialM12, initialM13, initialM14, initialM21, initialM22, initialM23, initialM24, initialM31, initialM32, initialM33, initialM34, initialM41, initialM42, initialM43, initialM44) {
        var result = new Matrix();
        result.m[0] = initialM11;
        result.m[1] = initialM12;
        result.m[2] = initialM13;
        result.m[3] = initialM14;
        result.m[4] = initialM21;
        result.m[5] = initialM22;
        result.m[6] = initialM23;
        result.m[7] = initialM24;
        result.m[8] = initialM31;
        result.m[9] = initialM32;
        result.m[10] = initialM33;
        result.m[11] = initialM34;
        result.m[12] = initialM41;
        result.m[13] = initialM42;
        result.m[14] = initialM43;
        result.m[15] = initialM44;
        return result;
    };
    Matrix.Identity = function Identity() {
        return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
    };
    Matrix.Zero = function Zero() {
        return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    };
    Matrix.Copy = function Copy(source) {
        return Matrix.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
    };
    Matrix.RotationX = function RotationX(angle) {
        var result = Matrix.Zero();
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        result.m[0] = 1.0;
        result.m[5] = cos;
        result.m[6] = sin;
        result.m[9] = -sin;
        result.m[10] = cos;
        result.m[15] = 1.0;
        return result;
    };
    Matrix.RotationY = function RotationX(angle) {
        var result = Matrix.Zero();
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        result.m[0] = cos;
        result.m[2] = -sin;
        result.m[5] = 1.0;
        result.m[8] = sin;
        result.m[10] = cos;
        result.m[15] = 1.0;
        return result;
    };
    Matrix.RotationZ = function RotationX(angle) {
        var result = Matrix.Zero();
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        result.m[0] = cos;
        result.m[1] = sin;
        result.m[4] = -sin;
        result.m[5] = cos;
        result.m[10] = 1.0;
        result.m[15] = 1.0;
        return result;
    };
    Matrix.RotationAxis = function RotationAxis(axis, angle) {
        var result = Matrix.Identity();
        var sin = Math.sin(angle);
        var cos = Math.cos(angle);
        var n = Vector3.Normalize(axis);
        var x = n.x;
        var y = n.y;
        var z = n.z;
        var c1 = 1 - cos;
        result.m[0] = x * x * c1 + cos;
        result.m[1] = x * y * c1 + z * sin;
        result.m[2] = x * z * c1 - y * sin;
        result.m[4] = x * y * c1 - z * sin;
        result.m[5] = y * y * c1 + cos;
        result.m[6] = y * z * c1 + x * cos;
        result.m[8] = x * z * c1 + y * sin;
        result.m[9] = y * z * c1 - x * sin;
        result.m[10] = z * z * c1 + cos;
        return result;
    }
    Matrix.RotationYawPitchRoll = function RotationYawPitchRoll(yaw, pitch, roll) {
        return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
    };
    Matrix.Scaling = function Scaling(x, y, z) {
        var result = Matrix.Zero();
        result.m[0] = x;
        result.m[5] = y;
        result.m[10] = z;
        result.m[15] = 1.0;
        return result;
    };
    Matrix.Translation = function Translation(x, y, z) {
        var result = Matrix.Identity();
        result.m[12] = x;
        result.m[13] = y;
        result.m[14] = z;
        return result;
    };
    Matrix.LookAtLH = function LookAtLH(eye, target, up) {
        var zAxis = target.subtract(eye);
        zAxis.normalize();
        var xAxis = Vector3.Cross(zAxis, up);
        xAxis.normalize();
        var yAxis = Vector3.Cross(xAxis, zAxis);
        yAxis.normalize();
        var ex = -Vector3.Dot(eye, xAxis);
        var ey = -Vector3.Dot(eye, yAxis);
        var ez = -Vector3.Dot(eye, zAxis);
        return Matrix.FromValues(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            ex, ey, ez, 1
        )
    };
    Matrix.PerspectiveLH = function PerspectiveLH(width, height, znear, zfar) {
        var result = Matrix.Zero();
        result.m[0] = 2 * znear / width;
        result.m[5] = 2 * znear / height;
        result.m[10] = zfar / (zfar - znear);
        result.m[11] = 1.0;
        result.m[14] = znear * zfar / (znear - zfar);
        return result;
    };
    Matrix.PerspectiveFovLH = function PerspectiveFovLH(fov, aspect, znear, zfar) {
        var result = Matrix.Zero();
        var cotan = 1.0 / Math.tan(fov * 0.5);
        result.m[0] = cotan / aspect;
        result.m[5] = cotan;
        result.m[10] = zfar / (zfar - znear);
        result.m[11] = 1.0;
        result.m[14] = znear * zfar / (znear - zfar);
        return result;
    };
    Matrix.Transpose = function Transpose(matrix) {
        var result = new Matrix();
        result.m[0] = matrix.m[0];
        result.m[1] = matrix.m[4];
        result.m[2] = matrix.m[8];
        result.m[3] = matrix.m[12];
        result.m[4] = matrix.m[1];
        result.m[5] = matrix.m[5];
        result.m[6] = matrix.m[9];
        result.m[7] = matrix.m[13];
        result.m[8] = matrix.m[2];
        result.m[9] = matrix.m[6];
        result.m[10] = matrix.m[10];
        result.m[11] = matrix.m[14];
        result.m[12] = matrix.m[3];
        result.m[13] = matrix.m[7];
        result.m[14] = matrix.m[11];
        result.m[15] = matrix.m[15];
        return result;
    };
    return Matrix;
})();
