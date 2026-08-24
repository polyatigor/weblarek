import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

interface IPageController {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

export class Page extends Component<IPageController> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._counter = container.querySelector('.header__basket-counter')!;
        this._catalog = container.querySelector('.gallery')!;
        this._wrapper = container.querySelector('.page__wrapper')!;
        this._basket = container.querySelector('.header__basket')!;

        // Клик по иконке корзины открывает саму корзину
        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    }

    set counter(value: number) {
        this._counter.textContent = String(value);
    }

    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    set locked(value: boolean) {
        if (value) {
            this._wrapper.classList.add('page__wrapper_locked');
        } else {
            this._wrapper.classList.remove('page__wrapper_locked');
        }
    }
}