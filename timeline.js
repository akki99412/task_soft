




class Timeline {
    constructor(a, isShiftable) {
        this.isShiftable = isShiftable;
        this.value = a;
        this.lastFns = [];
        this.values = [this.value];
        this.index = 0;
    };


    static create = (isShiftable = false) => (a) => {
        return new Timeline(a, isShiftable);
    }
    static Op = class {
        static push =
            a => timeline => {
                timeline.value = a;
                if (timeline.isShiftable) {
                    timeline.values = timeline.values.slice(0, timeline.index + 1).concat([a]);
                    timeline.index = timeline.index + 1;
                }
                return timeline;
            }
        static pop =
            timeline => {
                timeline.index = timeline.index - 1;
                timeline.value = timeline.values[timeline.index];
                return timeline;
            }
        static pushAgain =
            timeline => {
                timeline.index = timeline.index + 1;
                timeline.value = timeline.values[timeline.index];
                return timeline;
            }
        static canPop =
            timeline => 0 < timeline.index;
        static canPushAgain =
            timeline => timeline.index < timeline.values.length - 1;

        static next =
            (a) => timeline => {
                if (!isEqualObjectJson(a)(timeline.value)) {
                    // if ((a !== timeline.value)) {
                    Timeline.Op.push(a)(timeline);
                    timeline.lastFns.forEach(f => f(a)); //perform all fns in the list
                    return timeline; // return the modified timeline
                } else {
                    // c.log(a);
                    if (this.isShiftable) {timeline.values = timeline.values.slice(0, timeline.index + 1);}
                    return timeline;
                }
            }

        static bind =
            (monadFunc) =>
                (timelineA) => {
                    const timelineB = monadFunc(timelineA.value);
                    const newFn = (a) => {
                        Timeline.Op.next(monadFunc(a).value)(timelineB);
                        return undefined;
                    };
                    timelineA.lastFns = timelineA.lastFns.concat([newFn]);
                    return timelineB;
                }

        static apply =
            funcMonad => timelineA => {

                const timelineB = Timeline.create()(funcMonad.value(timelineA.value));
                const newFn = func => a => {
                    Timeline.Op.next(func(a))(timelineB);
                    return undefined;
                }
                timelineA.lastFns = timelineA.lastFns.concat([a => newFn(funcMonad.value)(a)]);
                funcMonad.lastFns = funcMonad.lastFns.concat([a => newFn(a)(timelineA.value)])
                return timelineB;
            }
        static map =
            f => Timeline.Op.bind(data => Timeline.create()(f(data)));

        static undo =
            timeline => {
                if (timeline.isShiftable) {
                    if (Timeline.Op.canPop(timeline)) {
                        Timeline.Op.pop(timeline);
                        timeline.lastFns.forEach(f => f(timeline.value)); //perform all fns in the list
                    } else {
                        throw new Error("Exceeded the range that can be undo.");
                    }
                } else {
                    throw new Error("This timeline can't undo.")
                }
                return timeline; // return the modified timeline
            };
        static redo =
            timeline => {
                if (timeline.isShiftable) {
                    if (Timeline.Op.canPushAgain(timeline)) {
                        Timeline.Op.pushAgain(timeline);
                        timeline.lastFns.forEach(f => f(timeline.value)); //perform all fns in the list
                    } else {
                        throw new Error("Exceeded the range that can be redo.");
                    }
                } else {
                    throw new Error("This timeline can't redo.");
                }
                return timeline; // return the modified timeline
            };
        static checkAndUndo =
            timeline => {
                if (Timeline.Op.canPop(timeline)) {
                    return Timeline.Op.undo(timeline);
                } else {
                    c.warn("This timeline can't undo.");
                    return timeline;
                }
            }
        static checkAndRedo =
            timeline => {
                if (Timeline.Op.canPushAgain(timeline)) {
                    return Timeline.Op.redo(timeline);
                } else {
                    c.warn("This timeline can't redo.");
                    return timeline;
                }
            }


    }
    next = (a) => Timeline.Op.next(a)(this);
    bind = (monadFunc) => Timeline.Op.bind(monadFunc)(this);
    map = (f) => Timeline.Op.map(f)(this);
    apply = monad => Timeline.Op.apply(this)(monad);
    undo = () => Timeline.Op.undo(this);
    redo = () => Timeline.Op.redo(this);
    checkAndUndo = () => Timeline.Op.checkAndUndo(this);
    checkAndRedo = () => Timeline.Op.checkAndRedo(this);

}


function main() {
    return;
}