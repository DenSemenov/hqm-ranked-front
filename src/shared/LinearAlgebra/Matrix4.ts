import Vector3D from "./Vector3D";

export default class Matrix4 {
    matrixData: number[][] = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ];

    ToVector() {
        const sy = Math.sqrt(this.matrixData[0][0] * this.matrixData[0][0] + this.matrixData[1][0] * this.matrixData[1][0]);
        const singular = sy < 1e-6;

        let x, y, z: number;

        if (!singular) {
            x = Math.atan2(this.matrixData[2][1], this.matrixData[2][2]);
            y = Math.atan2(-this.matrixData[2][0], sy);
            z = Math.atan2(this.matrixData[1][0], this.matrixData[0][0]);
            z = Math.atan2(this.matrixData[1][0], this.matrixData[0][0]);
        }
        else {
            x = Math.atan2(-this.matrixData[1][2], this.matrixData[1][1]);
            y = Math.atan2(-this.matrixData[2][0], sy);
            z = 0;
        }

        return new Vector3D(x, y, z);
    }
}