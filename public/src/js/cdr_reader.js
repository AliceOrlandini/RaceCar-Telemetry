/**
 * In questo file è contenuta la classe CdrReader che permette di convertire
 * un dato sotto forma di ArrayBuffer tenendo di conto del big/little endian.
 */

var EncapsulationKind;
(function (EncapsulationKind) {
  EncapsulationKind[EncapsulationKind["CDR_BE"] = 0] = "CDR_BE";
  EncapsulationKind[EncapsulationKind["CDR_LE"] = 1] = "CDR_LE";
  EncapsulationKind[EncapsulationKind["PL_CDR_BE"] = 2] = "PL_CDR_BE";
  EncapsulationKind[EncapsulationKind["PL_CDR_LE"] = 3] = "PL_CDR_LE";
})(EncapsulationKind = EncapsulationKind || (EncapsulationKind = {}));

const endianTestArray = new Uint8Array(4);
const isBigEndian_1 = () => {
  return endianTestArray[3] === 1;
}

class CdrReader {
  constructor(data) {
    this.textDecoder = new TextDecoder("utf8");
    this.hostLittleEndian = !(0, isBigEndian_1)();
    if (data.byteLength < 4) {
        throw new Error(`Invalid CDR data size ${data.byteLength}, must contain at least a 4-byte header`);
    }
    this.view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const kind = this.kind;
    this.littleEndian = kind === EncapsulationKind.CDR_LE || kind === EncapsulationKind.PL_CDR_LE;
    this.offset = 4;
  }
  get kind() {
    return this.view.getUint8(1);
  }
  get decodedBytes() {
    return this.offset;
  }
  get byteLength() {
    return this.view.byteLength;
  }
  int8() {
    const value = this.view.getInt8(this.offset);
    this.offset += 1;
    return value;
  }
  uint8() {
    const value = this.view.getUint8(this.offset);
    this.offset += 1;
    return value;
  }
  int16() {
    this.align(2);
    const value = this.view.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  uint16() {
    this.align(2);
    const value = this.view.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  int32() {
    this.align(4);
    const value = this.view.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  uint32() {
    this.align(4);
    const value = this.view.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  int64() {
    this.align(8);
    const value = this.view.getBigInt64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  uint64() {
    this.align(8);
    const value = this.view.getBigUint64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  uint16BE() {
    this.align(2);
    const value = this.view.getUint16(this.offset, false);
    this.offset += 2;
    return value;
  }
  uint32BE() {
    this.align(4);
    const value = this.view.getUint32(this.offset, false);
    this.offset += 4;
    return value;
  }
  uint64BE() {
    this.align(8);
    const value = this.view.getBigUint64(this.offset, false);
    this.offset += 8;
    return value;
  }
  float32() {
    this.align(4);
    const value = this.view.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  float64() {
    this.align(8);
    const value = this.view.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  string() {
    const length = this.uint32();
    if (length <= 1) {
      this.offset += length;
      return "";
    }
    const data = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, length - 1);
    const value = this.textDecoder.decode(data);
    this.offset += length;
    return value;
  }
  sequenceLength() {
    return this.uint32();
  }
  int8Array(count = this.sequenceLength()) {
    const array = new Int8Array(this.view.buffer, this.view.byteOffset + this.offset, count);
    this.offset += count;
    return array;
  }
  uint8Array(count = this.sequenceLength()) {
    const array = new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, count);
    this.offset += count;
    return array;
  }
  int16Array(count = this.sequenceLength()) {
    return this.typedArray(Int16Array, "getInt16", count);
  }
  uint16Array(count = this.sequenceLength()) {
    return this.typedArray(Uint16Array, "getUint16", count);
  }
  int32Array(count = this.sequenceLength()) {
    return this.typedArray(Int32Array, "getInt32", count);
  }
  uint32Array(count = this.sequenceLength()) {
    return this.typedArray(Uint32Array, "getUint32", count);
  }
  int64Array(count = this.sequenceLength()) {
    return this.typedArray(BigInt64Array, "getBigInt64", count);
  }
  uint64Array(count = this.sequenceLength()) {
    return this.typedArray(BigUint64Array, "getBigUint64", count);
  }
  float32Array(count = this.sequenceLength()) {
    return this.typedArray(Float32Array, "getFloat32", count);
  }
  float64Array(count = this.sequenceLength()) {
    return this.typedArray(Float64Array, "getFloat64", count);
  }
  stringArray(count = this.sequenceLength()) {
    const output = [];
    for (let i = 0; i < count; i++) {
        output.push(this.string());
    }
    return output;
  }
  /**
   * Seek the current read pointer a number of bytes relative to the current position. Note that
   * seeking before the four-byte header is invalid
   * @param relativeOffset A positive or negative number of bytes to seek
   */
  seek(relativeOffset) {
    const newOffset = this.offset + relativeOffset;
    if (newOffset < 4 || newOffset >= this.view.byteLength) {
      throw new Error(`seek(${relativeOffset}) failed, ${newOffset} is outside the data range`);
    }
    this.offset = newOffset;
  }
  /**
   * Seek to an absolute byte position in the data. Note that seeking before the four-byte header is
   * invalid
   * @param offset An absolute byte offset in the range of [4-byteLength)
   */
  seekTo(offset) {
    if (offset < 4 || offset >= this.view.byteLength) {
      throw new Error(`seekTo(${offset}) failed, value is outside the data range`);
    }
    this.offset = offset;
  }
  align(size) {
    const alignment = (this.offset - 4) % size;
    if (alignment > 0) {
      this.offset += size - alignment;
    }
  }
  // reads a given count of numeric values into a typed array
  typedArray(TypedArrayConstructor, getter, count) {
    if (count === 0) {
      return new TypedArrayConstructor();
    }
    this.align(TypedArrayConstructor.BYTES_PER_ELEMENT);
    const totalOffset = this.view.byteOffset + this.offset;
    if (this.littleEndian !== this.hostLittleEndian) {
      // slowest path
      return this.typedArraySlow(TypedArrayConstructor, getter, count);
    }
    else if (totalOffset % TypedArrayConstructor.BYTES_PER_ELEMENT === 0) {
      // fastest path
      const array = new TypedArrayConstructor(this.view.buffer, totalOffset, count);
      this.offset += TypedArrayConstructor.BYTES_PER_ELEMENT * count;
      return array;
    }
    else {
      // slower path
      return this.typedArrayUnaligned(TypedArrayConstructor, getter, count);
    }
  }
  typedArrayUnaligned(TypedArrayConstructor, getter, count) {
    // benchmarks indicate for count < ~10 doing each individually is faster than copy
    if (count < 10) {
      return this.typedArraySlow(TypedArrayConstructor, getter, count);
    }
    // if the length is > 10, then doing a copy of the data to align it is faster
    // using _set_ is slightly faster than slice on the array buffer according to today's benchmarks
    const byteLength = TypedArrayConstructor.BYTES_PER_ELEMENT * count;
    const copy = new Uint8Array(byteLength);
    copy.set(new Uint8Array(this.view.buffer, this.view.byteOffset + this.offset, byteLength));
    this.offset += byteLength;
    return new TypedArrayConstructor(copy.buffer, copy.byteOffset, count);
  }
  typedArraySlow(TypedArrayConstructor, getter, count) {
    const array = new TypedArrayConstructor(count);
    let offset = this.offset;
    for (let i = 0; i < count; i++) {
      array[i] = this.view[getter](offset, this.littleEndian);
      offset += TypedArrayConstructor.BYTES_PER_ELEMENT;
    }
    this.offset = offset;
    return array;
  }
}