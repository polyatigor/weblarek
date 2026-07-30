import './scss/styles.scss';
import { Api } from './components/base/Api';
import { API_URL } from './utils/constants';
import { LarekAPI } from './components/Models/LarekAPI';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { IProduct } from './types/index';

// 1. Инициализируем API (Слой коммуникации)
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// 2. Создание экземпляров всех классов - моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 3. Тестирование всех методов моделей данных в консоли

console.log('--- ТЕСТ: Модель Корзины (Cart) ---');

const testItem1: IProduct = { 
    id: '1', 
    title: 'Тестовый товар', 
    price: 1000, 
    description: 'Тестовое описание', 
    image: '/test.jpg', 
    category: 'софт-скил' 
};

const testItem2: IProduct = { 
    id: '2', 
    title: 'Второй товар', 
    price: 500, 
    description: 'Описание второго', 
    image: '/test2.jpg', 
    category: 'другое' 
};

cartModel.addProduct(testItem1);
cartModel.addProduct(testItem2);
console.log('Товары в корзине:', cartModel.getItems());
console.log('Количество товаров:', cartModel.getTotalCount());
console.log('Общая сумма корзины:', cartModel.getTotalPrice());

cartModel.removeProduct('1');
console.log('Корзина после удаления первого товара:', cartModel.getItems());
console.log('Сумма после удаления:', cartModel.getTotalPrice());


console.log('--- ТЕСТ: Модель Покупателя (Buyer) ---');

buyerModel.setField('email', 'test@example.com');
buyerModel.setField('phone', '+79991234567');
buyerModel.setField('payment', 'card');
buyerModel.setField('address', 'г. Москва, ул. Тестовая, д. 1');

console.log('Данные покупателя:', buyerModel.getBuyerInfo());

console.log('Ошибки формы доставки:', buyerModel.validateAddressForm());
console.log('Ошибки формы контактов:', buyerModel.validateContactForm());

buyerModel.clearBuyer();
console.log('Данные после очистки:', buyerModel.getBuyerInfo());


console.log('--- ТЕСТ: Запрос к API и Модель Каталога (Products) ---');

api.getProductList()
    .then(data => {
        productsModel.setItems(data.items);
        
        console.log('Массив товаров из каталога:', productsModel.getItems());
    })
    .catch(err => {
        console.error('Ошибка при получении товаров:', err);
    });