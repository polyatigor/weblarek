import { IApi, IOrder, IOrderResult, IProductList } from '../../types/index';

export class LarekAPI {
    protected api: IApi;

    constructor(api: IApi) {
        this.api = api;
    }

    getProductList(): Promise<IProductList> {
        return this.api.get<IProductList>('/product/');
    }

    orderProducts(order: IOrder): Promise<IOrderResult> {
        return this.api.post<IOrderResult>('/order/', order);
    }
}