import { IProduct } from '../../types/index';
import { IEvents } from '../base/Events';

export class Cart {
    protected items: IProduct[] = [];
    protected events: IEvents;

    constructor(events: IEvents) {
        this.events = events;
    }

    getItems(): IProduct[] {
        return this.items;
    }

    addProduct(item: IProduct): void {
        if (!this.containsProduct(item.id)) {
            this.items.push(item);
            this.events.emit('basket:changed', this.items);
        }
    }

    removeProduct(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
        this.events.emit('basket:changed', this.items);
    }

    clearCart(): void {
        this.items = [];
        this.events.emit('basket:changed', this.items);
    }

    getTotalPrice(): number {
        return this.items.reduce((total, item) => total + (item.price || 0), 0);
    }

    getTotalCount(): number {
        return this.items.length;
    }

    containsProduct(id: string): boolean {
        return this.items.some(item => item.id === id);
    }
}