
const compose = {
    operation: f => g => a => g(f(a)),
    _: function (g) {
        return compose.operation(this)(g);
    }
};
//-----------------------------------------
Object.assign(Function.prototype, compose);