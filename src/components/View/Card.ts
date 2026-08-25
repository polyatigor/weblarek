import { Component } from '../base/Component';

const categoryColors: Record<string, string> = {
    "софт-скил": "soft",
    "другое": "other",
    "дополнительное": "additional",
    "кнопка": "button",
    "хард-скил": "hard"
};

export interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export interface ICard {
    title: string;
    price: number | null;
    image?: string;
    category?: string;
    description?: string;
    buttonText?: string;
    index?: number;
    buttonDisabled?: boolean;
}

export class Card extends Component<ICard> {
    protected _title: HTMLElement;
    protected _price: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);
        this._title = container.querySelector('.card__title') as HTMLElement;
        this._price = container.querySelector('.card__price') as HTMLElement;
    }

    set title(value: string) {
        this._title.textContent = value;
    }

    set price(value: number | null) {
        this._price.textContent = value === null ? 'Бесценно' : `${value} синапсов`;
    }
}

export class CatalogItem extends Card {
    protected _image: HTMLImageElement;
    protected _category: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._image = container.querySelector('.card__image') as HTMLImageElement;
        this._category = container.querySelector('.card__category') as HTMLElement;

        if (actions?.onClick) {
            container.addEventListener('click', actions.onClick);
        }
    }

    set image(value: string) {
        this.setImage(this._image, value);
    }

    set category(value: string) {
        this._category.textContent = value;
        this._category.className = `card__category card__category_${categoryColors[value] || 'other'}`;
    }
}

export class PreviewItem extends CatalogItem {
    protected _description: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container); 
        this._description = container.querySelector('.card__text') as HTMLElement;
        this._button = container.querySelector('.card__button') as HTMLButtonElement;

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            }
        }
    }

    set description(value: string) {
        this._description.textContent = value;
    }

    set buttonText(value: string) {
        if (this._button) {
            this._button.textContent = value;
        }
    }

    set buttonDisabled(state: boolean) {
        if (this._button) {
            this._button.disabled = state;
        }
    }
}

export class BasketItem extends Card {
    protected _index: HTMLElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);
        this._index = container.querySelector('.basket__item-index') as HTMLElement;
        
        if (actions?.onClick) {
            const deleteBtn = container.querySelector('.basket__item-delete') as HTMLButtonElement;
            if (deleteBtn) {
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    actions.onClick(e);
                });
            }
        }
    }

    set index(value: number) {
        this._index.textContent = String(value);
    }
}