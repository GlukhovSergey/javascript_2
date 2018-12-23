class Menu {
    constructor(id, className, items) {
        this.id = id;
        this.className = className;
        this.items = items;
    }

    render() {
        let result = `<ul class="${this.className}" id="${this.id}">`;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i] instanceof MenuItem) {
                result += this.items[i].render();
            } else if (this.items[i] instanceof SubMenu) {
                result += this.items[i].render();
            }
        }
        result += `</ul>`;
        return result;
    }
}

class SubMenu extends Menu {
    constructor(href, title, id, className, items) {
        super(id, className, items);
        this.href = href;
        this.title = title;
    }

    render() {
        //return `<li class="menu__list"><a href="${this.href}"  class="menu__link">${this.title}</a>${super.render()}</li>`;

        return `<li class="menu__list"><a href="${this.href}" class="menu__link">${this.title}</a><div class="mega__box"><div class="mega__flex">${super.render()}</div></div></li>`;
    }
}

class MenuItem {
    constructor(href, title, level) {
        this.href = href;
        this.title = title;
        this.level = level;
    }

    render() {
        if (this.level === 1) {
            return `<li class="menu__list"><a href="${this.href}" class="menu__link">${this.title}</a></li>`;
        } else {
            return `<li><a class="mega__link" href="${this.href}">${this.title}</a></li>`;
        }
    }
}