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

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
        
        this._card = container.elements.namedItem('card') as HTMLButtonElement;
        this._cash = container.elements.namedItem('cash') as HTMLButtonElement;

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
}

export class ContactsForm extends Form<IContactsForm> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }
}