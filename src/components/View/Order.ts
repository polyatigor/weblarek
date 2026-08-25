import { Form } from './Form';
import { IEvents } from '../base/Events';

export interface IOrderForm {
    payment: string;
    address: string;
}

export interface IContactsForm {
    email: string;
    phone: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;
    protected _address: HTMLInputElement; 

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._card = container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;
        this._address = container.elements.namedItem('address') as HTMLInputElement; 

        if (this._card) {
            this._card.addEventListener('click', () => {
                this.events.emit('order.payment:change', { field: 'payment', value: 'card' });
            });
        }
        if (this._cash) {
            this._cash.addEventListener('click', () => {
                this.events.emit('order.payment:change', { field: 'payment', value: 'cash' });
            });
        }
    }

    set payment(name: string) {
        this._card.classList.toggle('button_alt-active', name === 'card');
        this._cash.classList.toggle('button_alt-active', name === 'cash');
    }

    set address(value: string) {
        this._address.value = value;
    }
}

export class ContactsForm extends Form<IContactsForm> {
    protected _email: HTMLInputElement;
    protected _phone: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        this._email = container.elements.namedItem('email') as HTMLInputElement;
        this._phone = container.elements.namedItem('phone') as HTMLInputElement;
    }

    set phone(value: string) {
        this._phone.value = value;
    }

    set email(value: string) {
        this._email.value = value;
    }
}