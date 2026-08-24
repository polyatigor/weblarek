import './scss/styles.scss';
import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { LarekAPI } from './components/Models/LarekAPI';
import { Products } from './components/Models/Products';
import { Cart } from './components/Models/Cart';
import { Buyer } from './components/Models/Buyer';

import { Page } from './components/View/Page';
import { Modal } from './components/View/Modal';
import { Basket } from './components/View/Basket';
import { CatalogItem, PreviewItem, BasketItem } from './components/View/Card';
import { OrderForm, ContactsForm } from './components/View/Order';
import { Success } from './components/View/Success';

const events = new EventEmitter();
const baseApi = new Api(API_URL);
const api = new LarekAPI(CDN_URL, baseApi);

const productsModel = new Products(events);
const cartModel = new Cart(events);
const buyerModel = new Buyer(events);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);

events.on('modal:open', () => { page.locked = true; });
events.on('modal:close', () => { page.locked = false; });

events.on('items:changed', () => {
    page.catalog = productsModel.getItems().map(item => {
        const card = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        return card.render({
            title: item.title,
            image: item.image,
            price: item.price,
            category: item.category
        });
    });
});

events.on('card:select', (item: any) => {
    productsModel.setPreview(item);
});

events.on('preview:changed', (item: any) => {
    const card = new PreviewItem(cloneTemplate(cardPreviewTemplate), {
        onClick: () => {
            if (cartModel.containsProduct(item.id)) {
                events.emit('basket:remove', item);
            } else {
                events.emit('basket:add', item);
            }
            modal.close();
        }
    });

    const isAdded = cartModel.containsProduct(item.id);
    
    modal.render({
        content: card.render({
            title: item.title,
            image: item.image,
            description: item.description,
            price: item.price,
            category: item.category,
            buttonText: item.price === null ? 'Недоступно' : (isAdded ? 'Удалить из корзины' : 'В корзину')
        })
    });
});

events.on('basket:add', (item: any) => cartModel.addProduct(item));
events.on('basket:remove', (item: any) => cartModel.removeProduct(item.id));

events.on('basket:changed', () => {
    page.counter = cartModel.getTotalCount();
    basket.total = cartModel.getTotalPrice();
    
    basket.items = cartModel.getItems().map((item, index) => {
        const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
            onClick: () => events.emit('basket:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price,
            index: index + 1
        });
    });
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

events.on('order:open', () => {
    modal.render({
        content: orderForm.render({
            valid: false,
            errors: []
        })
    });
});

events.on(/^(order\..*):change/, (data: { field: string, value: string }) => {
    if (data.field === 'payment') {
        orderForm.payment = data.value;
    }
    buyerModel.setField(data.field as any, data.value);
    buyerModel.validate();
});

events.on(/^(contacts\..*):change/, (data: { field: string, value: string }) => {
    buyerModel.setField(data.field as any, data.value);
    buyerModel.validate();
});

events.on('formErrors:change', (errors: Partial<any>) => {
    const { payment, address, email, phone } = errors;
    orderForm.valid = !payment && !address;
    orderForm.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
    
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({email, phone}).filter(i => !!i).join('; ');
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
            valid: false,
            errors: []
        })
    });
});

events.on('contacts:submit', () => {
    const orderData = {
        ...buyerModel.getBuyerInfo(),
        items: cartModel.getItems().map(item => item.id),
        total: cartModel.getTotalPrice()
    };

    api.orderProducts(orderData as any)
        .then((result) => {
            cartModel.clearCart();
            buyerModel.clearBuyer();
            
            const success = new Success(cloneTemplate(successTemplate), {
                onClick: () => modal.close()
            });
            
            modal.render({
                content: success.render({
                    total: result.total
                })
            });
        })
        .catch(err => {
            console.error('Ошибка оформления заказа:', err);
        });
});

api.getProductList()
    .then(data => {
        productsModel.setItems(data.items);
    })
    .catch(err => {
        console.error('Ошибка при загрузке каталога:', err);
    });