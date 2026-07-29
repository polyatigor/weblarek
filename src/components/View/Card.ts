import { Component } from '../base/Component';
import { IProduct } from '../../types';

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

// 1. Создаем интерфейс, расширяющий IProduct, чтобы добавить индекс
export interface ICard extends IProduct {
    index?: string;
}

// 2. Указываем Component<ICard> вместо Component<IProduct>
export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _category?: HTMLElement;
    protected _price: HTMLElement;
    protected _button?: HTMLButtonElement;
    protected _description?: HTMLElement; // Поле для описания в модалке
    protected _index?: HTMLElement;       // Поле для номера в корзине

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._title = container.querySelector('.card__title')!;
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;
        this._price = container.querySelector('.card__price')!;
        
        // 3. Ищем кнопку добавления ИЛИ кнопку удаления (для корзины)
        this._button = container.querySelector('.card__button') || container.querySelector('.basket__item-delete') as HTMLButtonElement;
        
        // 4. Ищем элементы описания и индекса
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._index = container.querySelector('.basket__item-index') as HTMLElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set image(value: string) {
        if (this._image) {
            this.setImage(this._image, value, this.title);
        }
    }

    set price(value: number | null) {
        if (value === null) {
            this._price.textContent = 'Бесценно';
            // Не блокируем кнопку удаления бесценного товара из корзины
            if (this._button && !this.container.classList.contains('basket__item')) {
                this._button.disabled = true;
            }
        } else {
            this._price.textContent = `${value} синапсов`;
            if (this._button) {
                this._button.disabled = false;
            }
        }
    }

    set category(value: string) {
        if (this._category) {
            this._category.textContent = value;
        }
    }

    // 5. Добавляем сеттеры для описания и индекса
    set description(value: string) {
        if (this._description) {
            this._description.textContent = value;
        }
    }

    set index(value: string) {
        if (this._index) {
            this._index.textContent = value;
        }
    }
    
    // 6. Управление текстом кнопки
    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }
}