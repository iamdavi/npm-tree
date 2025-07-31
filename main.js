class TreeCategoryHeader {
    /**
     * @var {object} levels Array of levels of tree, Each element 
     *                      represent a column
     */
    #levels;

    constructor(levels) {
        this.levels = levels;
    }

    createHeader() {
        const headerDiv = document.createElement('div')
        headerDiv.className = 'categoriesHeader'

        this.levels.forEach(l => {
            const header = this.createHeaderItem(l)
            headerDiv.appendChild(header)
        });

        return headerDiv
    }

    /**
     * Method to create a DIV that has the level.label with a button to add 
     * elements to the tree.
     * 
     * @param {object} level        Level information
     * @param {string} level.key    Internal lavel value 
     * @param {string} level.label  Label to show in DOM 
     */
    createHeaderItem(level) {
        const template = `
            <div class="header-col">
                <div class="header-text">${level.label}</div>
                <div class="header-actions">
                    <button 
                        class="header-actions action-add butn butn-outline-primary" 
                        data-add-level="${level.key}"
                    >
                        +
                    </button>
                </div>
            </div>
        `;
        const tmp = document.createElement('div')
        tmp.innerHTML = template
        return tmp.children[0]
    }

    set levels(val) { 
        this.#levels = val;
    }
    
    get levels() {
        return this.#levels;
    }
}

class TreeCategoryItem {
    parent;
    type;
    index;
    categories;
    totalLength;
    childs;

    #itemDOM

    constructor(parent, type, index, categories) {
        this.parent = parent
        this.type = type
        this.index = index
        this.categories = categories
        this.totalLength = categories.length
        this.childs = []

        this.rowWrapperDOM = this.createRow()
    }

    createRow() {
        this.itemDOM = this.createItemDom()
        this.childDOM = this.createChildDom()

        const div = document.createElement('div')
        div.style.gap = '12px'
        div.style.display = 'grid'
        div.style.gridTemplateRows = '1fr'
        div.style.gridTemplateColumns = `repeat(${this.totalLength - this.index}, 1fr)`

        div.appendChild(this.itemDOM)
        div.appendChild(this.childDOM)

        this.treeWrapper = this.childDOM

        this.parent.treeWrapper.appendChild(div)
    }

    createChildDom() {
        const div = document.createElement('div')
        div.style.gridColumnStart = 2
        div.style.gridColumnEnd = this.totalLength + - (this.index - 1)
        return div
    }

    createItemDom() {
        const template = `
            <div class="input-group">
                <div class="pre-input-group">
                    <div>
                        <span>C</span>
                    </div>
                </div>
                <div class="input-group-content">
                    <input type='text' value='${this.index}' />
                </div>
                <div class="post-input-group">
                    <div>
                        <button class="butn butn-sm butn-outline-danger">
                            x
                        </button>
                    </div>
                    <div>
                        <button class="butn butn-sm butn-outline-success category-add-child">
                            +
                        </button>
                    </div>
                </div>
            </div>
        `;
        const tmp = document.createElement('div')
        tmp.innerHTML = template

        const item = tmp.children[0]
        item.style.gridColumnStart = 1
        item.style.gridColumnEnd = 1

        const addButton = item.querySelector('.category-add-child')
        addButton.addEventListener('click', (e) => {
            const nextCategory = this.getNextLevel(this.type)
            const child = new TreeCategoryItem(
                this,
                nextCategory,
                this.index + 1,
                this.categories
            );

            this.childs.push(child)
            document.dispatchEvent(new CustomEvent("newchildcategory", {
                detail: {
                    parent: this,
                    child: child
                },
            }));
        })

        return item
    }

    /**
     * @param {string} search
     */
    getNextLevel(search) {
        return this.categories[
            this.categories.findIndex((tl) => tl.key == search) + 1
        ]
    }

    set itemDOM(val) {
        this.#itemDOM = val
    }

    get itemDOM() {
        return this.#itemDOM
    }
}

class TreeCategory {
    #selectorId;
    #treeWrapper;
    #treeLevels;
    #treeChilds;
    #treeHeader;
    #treeHeaderDOM;
    #treeHeaderDOMButtons;

    constructor(
        selectorId = "tree-category",
        treeLevels = [
            { key: 'group', label: 'Grupo' },
            { key: 'category', label: 'Categoría' },
            { key: 'type', label: 'Tipo' }
        ]
    ) {
        this.selectorId = selectorId
        this.treeLevels = treeLevels
        // this.treeChilds is defined at this point
        this.treeHeader = new TreeCategoryHeader(this.treeLevels)
    }

    createTreeItem(type) {
        const typeIndex = this.treeChilds.findIndex((tc) => tc.key == type)
        const item = new TreeCategoryItem(
            this,
            type,
            typeIndex,
            this.treeLevels
        )
        this.treeChilds[typeIndex].childs.push(item)
    }

    /**
     * @param {TreeCategoryHeader} treeHeader
     */
    set treeHeader(treeHeader) {
        this.#treeHeader = treeHeader
        this.treeHeaderDOM = treeHeader.createHeader()
        this.treeWrapper.querySelector('.categoriesHeader')?.remove()
        this.treeWrapper.appendChild(this.treeHeaderDOM)
    }

    /**
     * @param {DOMElement} treeHeaderDOM
     */
    set treeHeaderDOM(treeHeaderDOM) {
        this.#treeHeaderDOM = treeHeaderDOM
        const addButtons = this.treeHeaderDOM.querySelectorAll('button.action-add')
        this.treeHeaderDOMButtons = addButtons
    }

    /**
     * @param {Object} treeHeaderDOMButtons Array of buttons elements
     */
    set treeHeaderDOMButtons(treeHeaderDOMButtons) {
        this.#treeHeaderDOMButtons = treeHeaderDOMButtons
        this.treeHeaderDOMButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                this.createTreeItem(btn.dataset.addLevel)
            })
        })
    }

    set treeLevels(val) {
        this.#treeLevels = val
        this.treeChilds = this.treeLevels.map(tl => {
            return { key: tl.key, childs: [] }
        })
        this.treeHeader = new TreeCategoryHeader(this.treeLevels)
    }

    set treeChilds(val) {
        this.#treeChilds = val
    }

    /**
     * @var DOMElement DOMElement
     */
    set treeWrapper(DOMElement) {
        this.#treeWrapper = DOMElement
    }

    set selectorId(val) {
        this.#selectorId = val
        const treeWrapper = document.getElementById(val)
        if (treeWrapper) this.treeWrapper = treeWrapper
    }

    get treeLevels() { return this.#treeLevels }
    get treeChilds() { return this.#treeChilds }
    get treeWrapper() { return this.#treeWrapper }
    get selectorId() { return this.#selectorId }
    get treeHeader() { return this.#treeHeader}
    get treeHeaderDOM() { return this.#treeHeaderDOM}
    get treeHeaderDOMButtons() { return this.#treeHeaderDOMButtons}

}


document.addEventListener('DOMContentLoaded', () => {
    const tree = new TreeCategory();
})

document.addEventListener('newchildcategory', (e) => {
    console.log(e.detail)
})