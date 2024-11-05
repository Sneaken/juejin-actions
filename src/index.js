import { checkIn, doLotteryDraw, getCounts, getCurPoint, getLotteryConfig, getStatus } from './services/index.js';
import wrapMessage from './utils/wrap-message.js';

async function getInfo() {
    const [err1, res1] = await getCurPoint();
    const [err2, res2] = await getCounts();
    const message = [];
    if (!err1) {
        message.push(`当前矿石数: ${res1.data}`);
    }
    if (!err2) {
        message.push(`连续签到天数: ${res2.data.cont_count}`);
        message.push(`累计签到天数: ${res2.data.sum_count}\n`);
    }
    return message;
}

async function lotteryDraw() {
    const [err1, res1] = await getLotteryConfig();

    const result = [null, null];
    if (err1) {
        result[0] = err1;
        return result;
    }
    const count = res1.data.free_count;

    if (count === 0) {
        result[1] = wrapMessage('今日已免费抽奖！');
        return result;
    }

    const [err, res] = await doLotteryDraw();
    if (err) {
        result[0] = wrapMessage(err);
    }
    if (res) {
        result[1] = wrapMessage(`恭喜抽中${res.data.lottery_name}`);
    }

    return result;
}

export async function main() {
    const [err, res] = await getStatus();
    if (err) {
        return [wrapMessage(err), res];
    }

    if (res.err_no === 0 && !res.data) {
        // 未签到
        return [wrapMessage({ err_msg: ['今日未签到，请前去签到'] }), null];
    }

    return [];

    // if (res.err_no === 0 && !res.data) {
    //     // 未签到
    //     // 开始签到
    //     const [err1, res1] = await checkIn();
    //     const [err2, res2] = await lotteryDraw();
    //     const message = await getInfo();
    //     return [
    //         err1,
    //         wrapMessage({
    //             err_msg: [res1.err_msg === 'success' ? '签到成功！' : res1.err_msg, ...res2.err_msg, ...message],
    //         }),
    //     ];
    // } else {
    //     const message = await getInfo();
    //     const [err2, res2] = await lotteryDraw();
    //     message.unshift(...res2.err_msg);
    //     message.unshift('请勿重复签到！');
    //     return [err2, { err_msg: message }];
    // }
}
