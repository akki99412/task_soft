




class Timeline {
    constructor(a, valuesLength) {
        this.value = a;
        this.lastFns = [];
        this.beforeFns = [];
        this.afterFns = [];
        this.values = [this.value];
        this.index = 0;
        this.valuesLength = valuesLength;
        this.isShiftable = valuesLength > 0;
    };


    static create = (valuesLength = 0) => (a) => {
        return new Timeline(a, valuesLength);
    }
    static Op = class {
        static push =
            a => timeline => {
                timeline.value = a;
                if (timeline.isShiftable) {
                    const end = timeline.index+1;
                    const start = 0 < (end - timeline.valuesLength) ? end - timeline.valuesLength : 0;

                    timeline.values = timeline.values.slice(start, end).concat([a]);
                    // timeline.index = timeline.index + 1;
                    timeline.index=timeline.values.length-1
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
                timeline.beforeFns.forEach(f => f(timeline.value)); //perform all fns in the list
                if (!isEqualObjectJson(a)(timeline.value)) {
                    // if ((a !== timeline.value)) {
                    Timeline.Op.push(a)(timeline);
                    timeline.lastFns.forEach(f => f(a)); //perform all fns in the list
                } else {
                    // c.log(a);
                    if (this.isShiftable) {timeline.values = timeline.values.slice(0, timeline.index + 1);}
                }
                timeline.afterFns.forEach(f => f(timeline.value)); //perform all fns in the list
                return timeline; // return the modified timeline
            }
        static bindingTemplate =
            listName => timelineB => (monadFunc) =>
                (timelineA) => {
                    // const timelineB = monadFunc(timelineA.value);
                    const newFn = (a) => {
                        Timeline.Op.next(monadFunc(a).value)(timelineB);
                        return undefined;
                    };
                    timelineA[listName] = timelineA[listName].concat([newFn]);
                    return timelineB;
                }

        static bind = (monadFunc) =>
            (timelineA) => Timeline.Op.bindingTemplate("lastFns")(monadFunc(timelineA.value))(monadFunc)(timelineA);
        static beforeBind = (monadFunc) =>
            (timelineA) => Timeline.Op.bindingTemplate("beforeFns")(monadFunc(timelineA.value))(monadFunc)(timelineA);
        static afterBind = (monadFunc) =>
            (timelineA) => Timeline.Op.bindingTemplate("afterFns")(monadFunc(timelineA.value))(monadFunc)(timelineA);

        static lateBind = (monadFunc) => timelineB=>
            (timelineA) => Timeline.Op.bindingTemplate("lastFns")(timelineB)(monadFunc)(timelineA);
        static lateBeforeBind = (monadFunc) => timelineB=>
            (timelineA) => Timeline.Op.bindingTemplate("beforeFns")(timelineB)(monadFunc)(timelineA);
        static lateAfterBind = (monadFunc) => timelineB=>
            (timelineA) => Timeline.Op.bindingTemplate("afterFns")(timelineB)(monadFunc)(timelineA);


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
        static beforeMap =
            f => Timeline.Op.beforeBind(data => Timeline.create()(f(data)));
        static afterMap =
            f => Timeline.Op.afterBind(data => Timeline.create()(f(data)));
        
        static lateMap =
            f => Timeline.Op.lateBind(data => Timeline.create()(f(data)));
        static lateBeforeMap =
            f => Timeline.Op.lateBeforeBind(data => Timeline.create()(f(data)));
        static lateAfterMap =
            f => Timeline.Op.lateAfterBind(data => Timeline.create()(f(data)));
        
        static undo =
            timeline => {
                timeline.beforeFns.forEach(f => f(timeline.value));
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
                timeline.afterFns.forEach(f => f(timeline.value));
                return timeline; // return the modified timeline
            };
        static redo =
            timeline => {
                timeline.beforeFns.forEach(f => f(timeline.value));
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
                timeline.afterFns.forEach(f => f(timeline.value));
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
    map=f=>Timeline.Op.map(f)(this);
    beforeMap=f=>Timeline.Op.beforeMap(f)(this);
    afterMap=f=>Timeline.Op.afterMap(f)(this);
    lateMap=f=>timeline=>Timeline.Op.lateMap(f)(timeline)(this);
    lateBeforeMap=f=>timeline=>Timeline.Op.lateBeforeMap(f)(timeline)(this);
    lateAfterMap=f=>timeline=>Timeline.Op.lateAfterMap(f)(timeline)(this);
    apply = monad => Timeline.Op.apply(this)(monad);
    undo = () => Timeline.Op.undo(this);
    redo = () => Timeline.Op.redo(this);
    checkAndUndo = () => Timeline.Op.checkAndUndo(this);
    checkAndRedo = () => Timeline.Op.checkAndRedo(this);

     
}


