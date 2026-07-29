import { IProduct } from '../../types/index';

export class Cart {
    protected items: IProduct[] = [];

    getItems(): IProduct[] {
        return this.items;
    }

    addProduct(item: IProduct): void {
        if (!this.containsProduct(item.id)) {
            this.items.push(item);
        }
    }

    removeProduct(id: string): void {
        this.items = this.items.filter(item => item.id !== id);
    }

    clearCart(): void {
        this.items = [];
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