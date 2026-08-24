import { IBuyer, TPayment, FormErrors } from '../../types/index';
import { IEvents } from '../base/Events';

export class Buyer {
    protected payment: TPayment | null = null;
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            if (value === 'card' || value === 'cash') {
                this.payment = value;
            }
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'address') {
            this.address = value;
        }
        this.events.emit('buyer:changed');
    }

    getBuyerInfo(): IBuyer {
        return {
            payment: this.payment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clearBuyer(): void {
        this.payment = null;
        this.email = '';
        this.phone = '';
        this.address = '';
        this.events.emit('buyer:changed');
    }

    validate(): FormErrors {
        const errors: FormErrors = {};

        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        if (!this.address) {
            errors.address = 'Укажите адрес доставки';
        }
        if (!this.email) {
            errors.email = 'Укажите электронную почту';
        }
        if (!this.phone) {
            errors.phone = 'Укажите номер телефона';
        }

        this.events.emit('formErrors:change', errors);
        return errors;
    }
}