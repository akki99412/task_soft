
class IntervalEntity {
    constructor(start) {
        let type_of_start = Object.prototype.toString.call(start);
        if (type_of_start == "[object Array]") {
            this.start = start[0];
            this.end = start[1];
        } else {
            this.start = start;
            this.end=null
        }
    }
}