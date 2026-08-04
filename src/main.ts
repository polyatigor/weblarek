import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekAPI } from './components/Models/LarekAPI';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { apiProducts } from './utils/data';

// 1. Инициализируем API
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// 2. Создание экземпляров моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 3. Тестирование всех методов в консоли

console.log('--- ТЕСТ: Модель Каталога (Products) ---');
productsModel.setItems(apiProducts.items);
console.log('Сохраненный список продуктов:', productsModel.getItems());

console.log('Поиск продукта по id:', productsModel.getProduct(apiProducts.items[0].id));
productsModel.setPreview(apiProducts.items[0]);
console.log('Выбранный продукт:', productsModel.getPreview());


console.log('--- ТЕСТ: Модель Корзины (Cart) ---');
cartModel.addProduct(apiProducts.items[0]);
cartModel.addProduct(apiProducts.items[1]);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Общая сумма корзины:', cartModel.getTotalPrice());

console.log('Есть ли первый товар в корзине?', cartModel.containsProduct(apiProducts.items[0].id));

cartModel.removeProduct(apiProducts.items[0].id);
console.log('Корзина после удаления первого товара:', cartModel.getItems());

cartModel.clearCart();
console.log('Корзина после полной очистки:', cartModel.getItems());


console.log('--- ТЕСТ: Модель Покупателя (Buyer) ---');
console.log('Ошибки валидации (пустые данные):', buyerModel.validate());

buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+79991234567');
buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'г. Москва, ул. Тестовая, д. 1');

console.log('Данные покупателя:', buyerModel.getBuyerInfo());
console.log('Ошибки валидации (заполненные данные):', buyerModel.validate());

buyerModel.clearBuyer();
console.log('Данные после очистки:', buyerModel.getBuyerInfo());


console.log('--- ТЕСТ: Запрос к API ---');
api.getProductList()
    .then(data => {
        productsModel.setItems(data.items);
        console.log('Массив товаров из каталога (от сервера):', productsModel.getItems());
    })
    .catch(err => {
        console.error('Ошибка при получении товаров:', err);
    });