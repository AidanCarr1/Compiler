/* token class */

    
export class Token {

    constructor(name, startLine, startIndex) { 
                    
        //set variables
        this.name = name;
        this.startLine = startLine;
        this.startIndex = startIndex;

        //tell
        putMessage("constructing token");
    }

    //setters
    setName(inputName) {
        this.name = inputName;
    }
    /*
    public setState(state: string) {
        this.state = state;
        _Kernel.krnTrace('PID ' + this.pid + ' set to ' + this.state);
        Control.updatePCBDisplay(this);
    }
    public setSegment(segment: number) {
        
        //for storing in memory...
        if (segment == STORE_ON_DISK) {
            this.segment = ERROR_CODE;

            //set the base and limit
            var base = this.getBase();      //ERROR -> ERROR
            var limit = this.getLimit();    //ERROR -> ERROR

            //location
            this.location = "Disk";
        }

        //for deleting...
        else if (segment == ERROR_CODE) {
            this.segment = ERROR_CODE;
            this.base = ERROR_CODE;
            this.limit = ERROR_CODE;

            //location
            this.location = "---";
        }

        //for storing on disk...
        else {
            this.segment = segment;

            //set segment in eyes of memory manager
            _MemoryManager.segmentList[segment] = this;

            //also sets the base and limit
            var base = this.getBase();      //0->0x000 1->0x100 2->0x200
            var limit = this.getLimit();    //0->0x0FF 1->0x1FF 2->0x2FF

            //location
            this.location = "Memory";
        }
        
        //update display
        Control.updatePCBDisplay(this);
    }

    //getters
    public getBase() {
        //no segment = no base
        if (this.segment == ERROR_CODE) {
            this.base = ERROR_CODE;
            return this.base;
        }
        this.base = SEGMENT_SIZE * this.segment;
        return this.base;
    }
    public getLimit() {
        //no segment = no limit
        if (this.segment == ERROR_CODE) {
            this.limit = ERROR_CODE;
            return this.limit;
        }
        this.base = this.base + SEGMENT_SIZE - 0x01;
        return this.base;
    }
    public getState() {
        return this.state;
    }
    public getSegment() {
        return this.segment;
    }
        */
}
    