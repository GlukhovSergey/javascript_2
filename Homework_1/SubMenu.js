class SubMenu extends Menu {
    constructor(id, className, title, items) {
        super(id, className, items);
        this.title = title;
    }

    render() {
        return `<li><a href=#>${this.title}</a>${super.render()}</li>`;
    }
}