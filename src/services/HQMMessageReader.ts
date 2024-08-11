export class HQMMessageReader {
    buf: Uint8Array = new Uint8Array();
    pos: number = 0;
    bit_pos: number = 0;

    constructor(buf: Uint8Array) {
        this.buf = buf;
        this.pos = 0;
        this.bit_pos = 0;
    }

    SafeGetByte = (pos: number) => {
        return pos < this.buf.length ? this.buf[pos] : 0
    }

    ReadU32Aligned = () => {
        this.Align();

        const b1 = this.SafeGetByte(this.pos);
        const b2 = this.SafeGetByte(this.pos + 1);
        const b3 = this.SafeGetByte(this.pos + 2);
        const b4 = this.SafeGetByte(this.pos + 3);
        this.pos += 4;
        return b1 | (b2 << 8) | (b3 << 16) | (b4 << 24);
    }

    ReadByteAligned = () => {
        this.Align();
        return this.SafeGetByte(this.pos += 1);
    }

    ReadBits = (b: number) => {
        let res = 0;
        let p = 0;

        while (b > 0) {
            const bitsPossibleToWrite = 8 - this.bit_pos;
            const bits = Math.min(b, bitsPossibleToWrite);

            const mask: number = bits === 8 ? 255 : ~(255 << bits);

            const a: number = (this.SafeGetByte(this.pos) >> this.bit_pos) & mask;
            res |= (a << p);

            if (b >= bitsPossibleToWrite) {
                b -= bitsPossibleToWrite;
                this.bit_pos = 0;
                this.pos += 1;
            } else {
                this.bit_pos += b;
                b = 0;
            }
            p += bits;
        }

        return res;
    }

    ReadPos(b: number, old_value: number) {
        let diff = 0;;
        const oldValue = old_value ?? 0;
        switch (this.ReadBits(2)) {
            case 0:
                diff = this.ReadBitsSigned(3);
                break;
            case 1:
                diff = this.ReadBitsSigned(6);
                break;
            case 2:
                diff = this.ReadBitsSigned(12);
                break;
            case 3:
                return this.ReadBits(b);
            default:
                return 0;
        }
        return Math.max(oldValue + diff, 0);
    }

    ReadBitsSigned(b: number) {
        const a = this.ReadBits(b);
        return a >= 1 << (b - 1) ? (-1 << b) | a : a;
    }

    Align = () => {
        if (this.bit_pos > 0) {
            this.bit_pos = 0;
            this.pos += 1;
        }
    }

    Next = () => {
        this.pos += 1;
        this.bit_pos = 0;
    }
}