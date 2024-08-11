import Matrix4 from "shared/LinearAlgebra/Matrix4";
import Vector3D from "shared/LinearAlgebra/Vector3D";

export default class HqmParse {
    static UXP = new Vector3D(1.0, 0.0, 0.0);
    static UXN = new Vector3D(-1.0, 0.0, 0.0);
    static UYP = new Vector3D(0.0, 1.0, 0.0);
    static UYN = new Vector3D(0.0, -1.0, 0.0);
    static UZP = new Vector3D(0.0, 0.0, 1.0);
    static UZN = new Vector3D(0.0, 0.0, -1.0);

    static TABLE =
        [
            [this.UYP, this.UXP, this.UZP],
            [this.UYP, this.UZP, this.UXN],
            [this.UYP, this.UZN, this.UXP],
            [this.UYP, this.UXN, this.UZN],
            [this.UZP, this.UXP, this.UYN],
            [this.UXN, this.UZP, this.UYN],
            [this.UXP, this.UZN, this.UYN],
            [this.UZN, this.UXN, this.UYN],
        ];

    static ConvertMatrixFromNetwork(b: number, v1: number, v2: number) {
        var r1 = this.ConvertRotColumnFromNetwork(b, v1);
        var r2 = this.ConvertRotColumnFromNetwork(b, v2);
        var r0 = this.Cross(r1, r2);

        var m2 = new Matrix4();

        m2.matrixData[0][0] = r0.x;
        m2.matrixData[1][0] = r0.y;
        m2.matrixData[2][0] = r0.z;
        m2.matrixData[0][1] = r1.x;
        m2.matrixData[1][1] = r1.y;
        m2.matrixData[2][1] = r1.z;
        m2.matrixData[0][2] = r2.x;
        m2.matrixData[1][2] = r2.y;
        m2.matrixData[2][2] = r2.z;

        return m2.ToVector();
    }

    static Cross(left: Vector3D, right: Vector3D) {
        return new Vector3D
            (
                left.y * right.z - left.z * right.y,
                left.z * right.x - left.x * right.z,
                left.x * right.y - left.y * right.x
            );
    }

    static ConvertRotColumnFromNetwork(b: number, v: number) {
        const start = v & 7;
        var temp1 = this.TABLE[start][0];
        var temp2 = this.TABLE[start][1];
        var temp3 = this.TABLE[start][2];

        let pos = 3;

        while (pos < b) {
            const step = ((v >> pos) & 3);
            var c1 = Vector3D.Normalized(Vector3D.AddVector(temp1, temp2));
            var c2 = Vector3D.Normalized(Vector3D.AddVector(temp2, temp3));
            var c3 = Vector3D.Normalized(Vector3D.AddVector(temp1, temp3));
            switch (step) {
                case 0:
                    temp2 = c1;
                    temp3 = c3;
                    break;
                case 1:
                    temp1 = c1;
                    temp3 = c2;
                    break;
                case 2:
                    temp1 = c3;
                    temp2 = c2;
                    break;
                case 3:
                    temp1 = c1;
                    temp2 = c2;
                    temp3 = c3;
                    break;
            }
            pos += 2;
        }
        return Vector3D.Normalized(Vector3D.AddVector(Vector3D.AddVector(temp1, temp2), temp3));
    }
}