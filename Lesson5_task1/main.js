$(document).ready(() => {
    //Товары
    let product1 = new Product(123, 'Ноутбук', 45600);
    let product2 = new Product(124, 'Мышь', 600);
    let product3 = new Product(125, 'Клавиатура', 1600);

    //Корзина
    let cart = new Cart('getCart.json');

    //Добавление товара
    $('.buyBtn').click(e => {
        cart.addProduct(e.target);
    });
});