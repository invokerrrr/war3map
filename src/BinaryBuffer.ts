
/**
 * BinaryBuffer acts like a binary out stream which combines all data to a buffer.
 * @packageDocumentation
 */


/**
 * Write binary data from byte, string, int, float, etc.
 */
export class BinaryWriteBuffer{
    /**
     * Push a `utf-8` string to binary buffer.
     * @param str The string to write.
     * @param isNullTerminated Whether or not the string ends with '\0'
     */
    public writeString(str:string,isNullTerminated =false){
        /*
            convert string to utf-8 code.
        */
        const buf=Buffer.from(str,'utf-8');
        buf.forEach((byte)=>{
            this._buffer.push(byte);
        });
        if(isNullTerminated){
            this._buffer.push(0);
        }
        return this;
    }
    /**
     * Push a null to binary buffer.
     */
    public writeNullTerminator(){
        this._buffer.push(0);
        return this;
    }
    /**
     * Push '\r\n' to binary buffer.
     */
    public writeNewLine(){
        this._buffer.push(0x0d);//carriage return
        this._buffer.push(0x0a);//line feed
        return this;
    }
    /**
     * Push char to binary buffer.
     * @param char The char to write.
     */
    public writeChar(char:string){
        this._buffer.push(char.charCodeAt(0));
        return this;
    }
    /**
     * Push int or short to binary buffer.
     * @param intValue The int(32-bit) or short(16-bit) to write.
     * @param isShort whether or not the value is 16-bit.
     */
    public writeInt(intValue:number,isShort:boolean=false){
        /*const intN=isShort?this._int16:this._int32;
        //little endian
        intN.fromInt(intValue).bytes.forEach((byte:number) => {
            this._buffer.push(byte);
        });*/
        if(isShort){
            const buf=Buffer.alloc(2);
            buf.writeInt16LE(intValue,0);
            this._buffer.push(buf[0],buf[1]);
        }else{
            const buf=Buffer.alloc(4);
            buf.writeInt32LE(intValue,0);
            this._buffer.push(buf[0],buf[1],buf[2],buf[3]);
        }
        return this;
    }
    /**
     * Push short to binary buffer.
     * @param short The short(16-bit) to write.
     */
    public writeShort(short:number){
        return this.writeInt(short,true);
    }
    /**
     * Push float to binary buffer.
     * @param float The float(32-bit) to write.
     */
    public writeFloat(float:number){
        const buf=Buffer.alloc(4);
        buf.writeFloatLE(float,0);
        this._buffer.push(buf[0],buf[1],buf[2],buf[3]);
        return this;
    }
    /**
     * Push byte(8-bit) to binary buffer.
     * @param byte The byte(8-bit) to write.
     */
    public writeByte(byte:number){
        this._buffer.push(byte);
        return this;
    }
    /**
     * Generate a buffer from the values pushed.
     */
    public getBuffer(){
        return Buffer.from(this._buffer);
    }

    private _buffer:number[]=[];
}

/**
 * Read binary data to byte, string, int, float, etc.
 */
export class BinaryReadBuffer{
    /**
     * Construct a new BinaryReader with buffer.
     * @param buffer The data to read.
     */
    constructor(buffer:Buffer){
        this._buffer=buffer;
    }
    /**
     * Read an int(32-bit).
     */
    public readInt():number{
        const int=this._buffer.readInt32LE(this._offset);
        this._offset+=4;
        return int;
    }
    /**
     * Read a short int(16-bit).
     */
    public readShort():number{
        const short=this._buffer.readInt16LE(this._offset);
        this._offset+=2;
        return short;
    }
    /**
     * Read a float(32-bit).
     */
    public readFloat():number{
        const float:number=this._buffer.readFloatLE(this._offset);
        this._offset+=4;
        return float;
    }
    /**
     * Read a string until '\0'.
     */
    public readString(): string{
        const str:number[]=[];
        while(this._buffer[this._offset]!=0x00){
            str.push(this._buffer[this._offset]);
            ++this._offset;
        }
        ++this._offset;//consume '\0'
        return Buffer.from(str).toString("utf-8");
    }
    /**
     * Read the number of chars.
     * @param len The length of chars to read.
     */
    public readChars(len:number=1):string{
        const str=this._buffer.slice(this._offset,len).toString("utf-8");
        this._offset+=len;
        return str;
    }
    /**
     * Read a byte.
     */
    public readByte():number{
        const byte=this._buffer[this._offset];
        this._offset+=1;
        return byte;
    }
    private _offset=0;
    private _buffer:Buffer;
}
