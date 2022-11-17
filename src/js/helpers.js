import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000);
    });
};

// uploadData is undefined by default, if your just trying to get JSON and there is no upload data to upload
export const AJAX = async function (url, uploadData = undefined) {
    try {
        const fetchProm = uploadData ? fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //data we want to send
            body: JSON.stringify(uploadData),

        }) : fetch(url);

        //have a race between timeout promise and getjson
        const res = await Promise.race([fetchProm, timeout(TIMEOUT_SEC)])
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

/*
//turn API results into json
export const getJSON = async function (url) {


}

//kind of like using insomnia
//post data using fetch
export const sendJSON = async function (url, uploadData) {
    try {


        const fetchProm = fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            //data we want to send
            body: JSON.stringify(uploadData),

        });

        //still have race between fetch and timeout
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
*/