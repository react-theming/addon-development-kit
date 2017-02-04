import { decorator } from '../src/store/decorator';

export function addonDecorator(initData) {
    return decorator(initData);
}

export function globalDecorator(initData) {
    return decorator(initData, 'gl');
}

