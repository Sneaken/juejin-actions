import axios from 'axios';
import to from './await-to-js.js';
import { headers } from '../config/index.js';
import wrapMessage from '../utils/wrap-message.js';

export const isObject = (val) => typeof val === 'object' && val !== null;

export const request = async function (options) {
    console.log('调用的接口：', options);
    const lastOptions = Object.assign({}, options, { headers });
    const [err, res] = await to(axios(lastOptions));
    // res.data
    // { err_no: 0, err_msg: 'success', data: 52055 }
    // { err_no: 403, err_msg: 'must login', data: null }
    if (err || !isObject(res)) {
        return [err, res];
    }
    const {
        data: { err_no: dataErrNo },
    } = res;

    switch (dataErrNo) {
        case 0:
            return [null, res && res.data];
        case 403:
            return [
                wrapMessage({
                    ...res.data,
                    err_msg: ['目前未登录，请检查 JUEJIN_COOKIE 是否正确'],
                }),
                null,
            ];
        default:
            return [wrapMessage({ ...res.data }), res.data];
    }
};
