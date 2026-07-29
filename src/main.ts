import './scss/styles.scss';
import { EventEmitter } from './components/base/Events';
import { Api } from './components/base/Api';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekAPI } from './components/Models/LarekAPI';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';
import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { Order } from './components/View/Order';
import { Contacts } from './components/View/Contacts';
import { Success } from './components/View/Success';
import { Card } from './components/View/Card';
import { IProduct } from './types/index';

// Вспомогательная функция для клонирования HTML-шаблонов
function cloneTemplate(template: HTMLTemplateElement): HTMLElement {
    return template.content.firstElementChild!.cloneNode(true) as HTMLElement;
}

// 1. Создаем глобальный брокер событий
const events = new EventEmitter();

// 2. Инициализируем API
const baseApi = new Api(API_URL);
const api = new LarekAPI(baseApi);

// 3. Создаем экземпляры Моделей данных
const productsModel = new Products();
const cartModel = new Cart();
const buyerModel = new Buyer();

// 4. Получаем все шаблоны из HTML
const cardCatalogTemplate = document.querySelector('#card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.querySelector('#card-preview') as HTMLTemplateElement;
const cardBasketTemplate = document.querySelector('#card-basket') as HTMLTemplateElement;
const basketTemplate = document.querySelector('#basket') as HTMLTemplateElement;
const orderTemplate = document.querySelector('#order') as HTMLTemplateElement;
const contactsTemplate = document.querySelector('#contacts') as HTMLTemplateElement;
const successTemplate = document.querySelector('#success') as HTMLTemplateElement;

// 5. Создаем глобальные Представления (View)
const page = new Page(document.body, events);
const modal = new Modal(document.querySelector('#modal-container') as HTMLElement, events);

// Создаем переиспользуемые компоненты
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new Order(cloneTemplate(orderTemplate) as HTMLFormElement, events);
const contactsForm = new Contacts(cloneTemplate(contactsTemplate) as HTMLFormElement, events);


// БИЗНЕС-ЛОГИКА (СВЯЗЬ ЧЕРЕЗ СОБЫТИЯ)

// Блокировка прокрутки страницы при открытии/закрытии модалки
events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

// Отрисовка каталога товаров (срабатывает, когда мы получаем товары с сервера)
events.on('items:changed', () => {
    console.log('3. Начинаем рисовать карточки!');
    page.catalog = productsModel.getItems().map(item => {
        const card = new Card(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: CDN_URL + item.image,
            price: item.price,
            category: item.category
        });
    });
});

// Открытие карточки товара (предпросмотр)
events.on('card:select', (item: IProduct) => {
    // Вспомогательная функция проверки: есть ли товар в корзине?
    const isItemInCart = () => cartModel.getItems().some(cartItem => cartItem.id === item.id);

    const card = new Card(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (isItemInCart()) {
                // Если товар уже в корзине - удаляем
                events.emit('product:delete', item);
                card.buttonText = 'Купить';
            } else {
                // Если товара нет в корзине - добавляем
                events.emit('product:add', item);
                card.buttonText = 'Удалить из корзины'; // Меняем надпись
            }
        }
    });
    
    card.buttonText = isItemInCart() ? 'Удалить из корзины' : 'Купить';
    
    modal.render({
        content: card.render({
            title: item.title,
            image: CDN_URL + item.image,
            description: item.description,
            price: item.price,
            category: item.category
        })
    });
});

// Добавление/удаление товара и обновление корзины
events.on('product:add', (item: IProduct) => { cartModel.addProduct(item); events.emit('basket:changed'); });
events.on('product:delete', (item: IProduct) => { cartModel.removeProduct(item.id); events.emit('basket:changed'); });

events.on('basket:changed', () => {
    page.counter = cartModel.getTotalCount();
    
    // Пересобираем список товаров в корзине
    basket.items = cartModel.getItems().map((item, index) => {
        const card = new Card(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('product:delete', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: (index + 1).toString()
        });
    });
    basket.total = cartModel.getTotalPrice();
});

// Открытие корзины по клику на иконку в шапке
events.on('basket:open', () => {
    modal.render({ content: basket.render() });
});

// Переход к оформлению заказа
events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            valid: Object.keys(buyerModel.validateAddressForm()).length === 0,
            errors: []
        })
    });
});

// РУЧНАЯ ВАЛИДАЦИЯ ФОРМЫ ЗАКАЗА
// Отслеживаем клик по кнопке оплаты
events.on('order.payment:change', (data: { field: string, value: string }) => {
    buyerModel.setField(data.field as any, data.value);
    validateOrderForm();
});

// Отслеживаем ввод текста в поле адреса
events.on('order.address:change', (data: { field: string, value: string }) => {
    buyerModel.setField(data.field as any, data.value);
    validateOrderForm();
});

// Функция обновления состояния формы заказа
function validateOrderForm() {
    // Получаем ошибки напрямую из модели
    const errors = buyerModel.validateAddressForm();
    // Если ошибок нет (длина массива ключей = 0), форма валидна
    orderForm.valid = Object.keys(errors).length === 0;
    // Выводим текст ошибок на экран
    orderForm.errors = Object.values(errors).filter(Boolean).join('; ');
}


// РУЧНАЯ ВАЛИДАЦИЯ ФОРМЫ КОНТАКТОВ
events.on('contacts.email:change', (data: { field: string, value: string }) => {
    buyerModel.setField(data.field as any, data.value);
    validateContactsForm();
});

events.on('contacts.phone:change', (data: { field: string, value: string }) => {
    buyerModel.setField(data.field as any, data.value);
    validateContactsForm();
});

function validateContactsForm() {
    const errors = buyerModel.validateContactForm(); // используем название метода из вашего кода
    contactsForm.valid = Object.keys(errors).length === 0;
    contactsForm.errors = Object.values(errors).filter(Boolean).join('; ');
}
// Переход к форме контактов
events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            valid: Object.keys(buyerModel.validateContactForm()).length === 0,
            errors: []
        })
    });
});

// Окончательная отправка заказа на сервер
events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getBuyerInfo(),
        total: cartModel.getTotalPrice(),
        items: cartModel.getItems().map(item => item.id)
    };

    api.orderProducts(orderData)
        .then((result) => {
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });

            modal.render({
                content: success.render({ total: cartModel.getTotalPrice() })
            });

            // Очищаем корзину после успешной покупки
            cartModel.clearCart();
            events.emit('basket:changed');
        })
        .catch(err => console.error(err));
});

api.getProductList()
.then(data => {
    productsModel.setItems(data.items);
    events.emit('items:changed');
})
.catch(err => {
    console.error(err);
});