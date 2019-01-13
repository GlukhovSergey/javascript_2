class Cart {
    constructor(source, container = '#cart') {
        this.source = source;
        this.container = container;
        this.countGoods = 0; // Общее кол-во товаров в корзине
        this.amount = 0; // Общая стоимость товаров в корзине
        this.cartItems = []; //Массив для хранения товаров
        this._init(this.source);
    }

    _render() {
        let $cartItemsDiv = $('<div/>', {
            class: 'cart-items-wrap'
        });
        let $totalGoods = $('<div/>', {
            class: 'cart-summary sum-goods'
        });
        let $totalAmount = $('<div/>', {
            class: 'cart-summary sum-price'
        });
        $(this.container).text('Корзина');
        $cartItemsDiv.appendTo($(this.container));
        $totalGoods.appendTo($(this.container));
        $totalAmount.appendTo($(this.container));
    }

    _init(source) {
        this._render();
        fetch(source)
            .then(result => result.json())
            .then(data => {
                for (let product of data.contents) {
                    this.cartItems.push(product);
                    this._renderItem(product);
                }
                this.countGoods = data.countGoods;
                this.amount = data.amount;
                this._renderSum();

                $('.cart-items-wrap').click(e => {
                    if (e.target.className === 'removeBtn') {
                        this._removeProduct(e.target);
                    }
                });
            })
    }

    _renderItem(product) {
        let $container = $('<div/>', {
            class: 'cart-item',
            'data-product': product.id_product
        });
        $container.append($(`<p class="product-name">${product.product_name}</p>`));
        $container.append($(`<p class="product-quantity">${product.quantity}</p>`));
        $container.append($(`<p class="product-price">${product.price} руб.</p>`));

        let $removeBtn = $('<button/>', {
            class: 'removeBtn',
            text: 'Удалить',
            'data-id': product.id_product,
        });
        $container.append($removeBtn);

        $container.appendTo($('.cart-items-wrap'));

    }

    _renderSum() {
        $('.sum-goods').text(`Всего товаров в корзине: ${this.countGoods}`);
        $('.sum-price').text(`Общая сумма: ${this.amount} руб.`);
    }

    _updateCart(product) {
        let $container = $(`div[data-product=${product.id_product}]`);
        $container.find('.product-quantity').text(product.quantity);
        $container.find('.product-price').text(`${product.quantity * product.price} руб.`);
    }

    addProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity++;
            this.countGoods++;
            this.amount += find.price;
            this._updateCart(find);
        } else {
            let product = {
                id_product: productId,
                product_name: $(element).data('name'),
                price: +$(element).data('price'),
                quantity: 1
            };
            this.cartItems.push(product);
            this.amount += product.price;
            this.countGoods += product.quantity;
            this._renderItem(product);
        }
        this._renderSum();
    }

    _removeProduct(element) {
        let productId = +$(element).data('id');
        let find = this.cartItems.find(product => product.id_product === productId);
        if (find) {
            find.quantity--;
            this.countGoods--;
            this.amount -= find.price;

            if (find.quantity === 0) {
                this.cartItems.splice(this.cartItems.indexOf(find), 1);
                let $container = $(`div[data-product=${productId}]`);
                $container.remove();
            } else {
                this._updateCart(find);
            }
        }
        this._renderSum();
    }
}