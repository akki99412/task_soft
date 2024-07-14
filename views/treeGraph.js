const mermaidAPI = mermaid.mermaidAPI;

const svgId = "treeGraph";
const mermaidWorkingContainer = document.getElementById("mermaidWorkingContainer");
const mermaidSvgContainer = document.getElementById("mermaidSvgContainer");

const treeGraph = new Observable({
    value:
        `
flowchart LR
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end
    subgraph ide2 [two]
    b1-->b2
    end
    b2-->a1
    `
});

mermaidAPI.initialize({
    startOnLoad: false,
    theme: "dark"
});

const mermaidRender = svgId => diagram => container => svgContainer => {
    console.log(diagram);
    const mermaidPromise = mermaidAPI.render(svgId, diagram, container);
    return mermaidPromise.then(value => svgContainer.insertAdjacentHTML('afterbegin', value.svg));
    // mermaidPromise.then(value => console.log(value.svg));
};


let treeGraphPromise = (Promise.resolve());


treeGraph.subscribe(diagram =>{
    treeGraphPromise = treeGraphPromise.then(_=>mermaidRender(svgId)(diagram.value)(mermaidSvgContainer)(mermaidSvgContainer))
});


treeGraph.notify({
    value:
        `
flowchart LR
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end
    `});
treeGraph.notify({
    value:
        `
flowchart LR
    test-->test2
    subgraph ide1 [one]
    test3-->a2
    end
    `});
