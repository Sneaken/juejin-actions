export default function wrapMessage(error) {
    if (!error) return null;
    const { err_msg, ...params } = error;
    const isMsgArray = Array.isArray(err_msg);
    return { ...params, err_msg: err_msg ? (isMsgArray ? [...err_msg] : [err_msg]) : [error] };
}
