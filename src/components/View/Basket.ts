import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IBasketView {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._list = container.querySelector('.basket__list')!;
        this._total = container.querySelector('.basket__price')!;
        this._button = container.querySelector('.basket__button')!;

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
    }

    set items(items: HTMLElement[]) {
        if (items.length) {
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.innerHTML = '<p>Корзина пуста</p>';
            this._button.disabled = true;
        }
    }

    set total(total: number) {
        this._total.textContent = `${total} синапсов`;
    }
}