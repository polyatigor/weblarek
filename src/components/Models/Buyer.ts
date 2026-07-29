import { IBuyer, TPayment } from '../../types/index';

export class Buyer {
    protected payment: string = '';
    protected email: string = '';
    protected phone: string = '';
    protected address: string = '';

    setField(field: keyof IBuyer, value: string): void {
        if (field === 'payment') {
            this.payment = value;
        } else if (field === 'email') {
            this.email = value;
        } else if (field === 'phone') {
            this.phone = value;
        } else if (field === 'address') {
            this.address = value;
        }
    }

    getBuyerInfo(): IBuyer {
        return {
            payment: this.payment as TPayment,
            email: this.email,
            phone: this.phone,
            address: this.address
        };
    }

    clearBuyer(): void {
        this.payment = '';
        this.email = '';
        this.phone = '';
        this.address = '';
    }

    validateAddressForm(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if (!this.address) {
            errors.address = 'Необходимо указать адрес доставки';
        }
        if (!this.payment) {
            errors.payment = 'Выберите способ оплаты';
        }
        return errors;
    }

    validateContactForm(): Partial<Record<keyof IBuyer, string>> {
        const errors: Partial<Record<keyof IBuyer, string>> = {};
        if (!this.email) {
            errors.email = 'Необходимо указать email';
        }
        if (!this.phone) {
            errors.phone = 'Необходимо указать телефон';
        }
        return errors;
    }
}