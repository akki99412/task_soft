const pipe = a => f => f(a);
const throughPipeAndFunc = a => f => {
    f(a);
    return a;
}