const mermaidAPI = mermaid.mermaidAPI;

const svgId = "treeGraph";
const mermaidWorkingContainer = document.getElementById("mermaidWorkingContainer");
const mermaidSvgContainer = document.getElementById("mermaidSvgContainer");

let diagramString = {
    value: `
flowchart LR
    c1-->a2
    subgraph ide1 [one]
    a1-->a2
    end
    subgraph ide2 [two]
    b1-->b2
    end
    b2-->a1
    `};

mermaidAPI.initialize({
    startOnLoad: false,
    theme: "dark"
});

const mermaidRender = svgId => diagram => container => svgContainer => {
    console.log(diagram);
    const mermaid_promise = mermaidAPI.render(svgId, diagram, container);
    mermaid_promise.then(value => svgContainer.insertAdjacentHTML('afterbegin', value.svg));
    // mermaid_promise.then(value => console.log(value.svg));
};
mermaidRender(svgId)(diagramString.value)(mermaidWorkingContainer)(mermaidSvgContainer);