export class Room {
    childs = [];

    constructor(childs = []) {
        this.childs = childs;
    }

    setup() {
        this.childs.forEach(child => {
            if (!child || typeof child.setup !== "function" || typeof child.render !== "function") {
                throw new TypeError("Every room child must implement setup() and render().");
            }
            child.setup();
        });
    }

    render(parentMatrix, prepareChild = null) {
        this.childs.forEach((child, index) => {
            const modelMatrix = prepareChild ? prepareChild(child, index) : null;
            child.render(parentMatrix, modelMatrix);
        });
    }
}
