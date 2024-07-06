class ElmLike {
    constructor({ model = null, init, view, update, render = _ => _ } = {}) {
        [init, view, update].forEach(arg => { if (arg===undefined) { throw Error("引数が足りない") } });
        this.model = model;
        // this.functions = [];
        this.isRendering = false;
        this.initFunction = init;
        this.viewFunction = view;
        this.updateFunction = update;
        this.renderFunction = render;
    }
    init = arg => {
        if (this.isRendering) return;
        this.model = this.initFunction(arg);
        this.isRendering = true;
        this.renderFunction(this.viewFunction(this.model));
        this.isRendering = false;
    }; 
    update = message => {
        if (this.isRendering) return;
        const model = this.updateFunction(this.model)(message);
        if (model !== this.model) {
            this.model = model;
            this.isRendering = true;
            this.renderFunction(this.viewFunction(this.model));
            this.isRendering = false;
            
        }
    };
    // command = arg => this.functions.forEach(arg);
    // subscribe = arg => this.functions.push(arg);
    //messageReceiverは実装しない(updateを使えばよいため);
}