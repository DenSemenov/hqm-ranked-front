export default class Vector3D {
    x: number = 0;
    y: number = 0;
    z: number = 0;

    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static AddVector(a: Vector3D, b: Vector3D): Vector3D {
        return {
            x: a.x + b.x,
            y: a.y + b.y,
            z: a.z + b.z
        } as Vector3D;
    }

    static Divide(v: Vector3D, b: number) {
        return new Vector3D(v.x / b, v.y / b, v.z / b);
    }

    static Normalized(v: Vector3D): Vector3D {
        return this.Divide(v, this.GetLength(v));
    }

    static GetLength(v: Vector3D) {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    static CalcVector(v1: Vector3D | null, v2: Vector3D) {
        if (v1 != null) {
            var vx = v2.x - v1.x;
            var vy = v2.y - v1.y;
            var vz = v2.z - v1.z;

            return new Vector3D(vx, vy, vz);
        }
        else {
            return new Vector3D(0, 0, 0);
        }
    }

    static Subtract(v1: Vector3D, v2: Vector3D) {
        return new Vector3D(v1.x - v2.x, v1.x - v2.y, v1.z - v2.z);
    }

    static Magnitude(v: Vector3D) {
        return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2) - Math.pow(v.z, 2));
    }
}

