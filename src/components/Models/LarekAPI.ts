import { IApi, IOrder, IOrderResult, IProductList } from '../../types/index';

export class LarekAPI {
    readonly cdn: string;
    protected api: IApi;

    constructor(cdn: string, api: IApi) {
        this.cdn = cdn;
        this.api = api;
    }

    getProductList(): Promise<IProductList> {
        return this.api.get<IProductList>('/product/').then((data: IProductList) => {
            return {
                ...data,
                items: data.items.map(item => ({
                    ...item,
                    image: this.cdn + item.image
                }))
            };
        });
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}