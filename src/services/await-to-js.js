import wrapMessage from '../utils/wrap-message.js';

const to = function (promise) {
    return promise
        .then((res) => {
            return [null, res];
        })
        .catch((err) => {
            return [wrapMessage(err), null];
        });
};

export default to;
