import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

//turn API results into json
export const getJSON = async function (url) {
    try {

        //have a race between timeout promise and getjson
        const fetchProm = fetch(url)
        const res = await Promise.race([fetchProm, timeout(TIMEOUT_SEC)]);


        const data = await res.json();

        if (!res.ok) {
            throw new Error(`${data.message} (${res.status})`)
        };
        return data;
    } catch (err) {

        //propagate error down
        throw err;
    }

}