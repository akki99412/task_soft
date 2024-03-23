class Interval2StringUseCase extends iUseCase(class {}) {
    run = function () {
        if (this.intervalEntity.end == null) {
            return this.intervalEntity.start.format() + "/";
        } else {
            return this.intervalEntity.start.format() + "/" + this.intervalEntity.end.format();
        }
    }

    constructor(intervalEntity) {
        this.intervalEntity = intervalEntity;
    }
}
