import { NextRouter } from "next/router";

export function useDeclension(_form_1: string, _form_2: string, _form_3: string): (num: number) => string {
    return (num: number) => {
        const form_1 = _form_1;
        const form_2 = _form_2;
        const form_3 = _form_3;

        const digit = num % 10;
        if (11 <= num && num <= 20) return `${num} ${form_3}`;
        else if (digit === 1) return `${num} ${form_1}`;
        else if (2 <= digit && digit <= 4) return `${num} ${form_2}`;
        else if ((5 <= digit && digit <= 9) || digit === 0) return `${num} ${form_3}`;
    };
}

export function scrollToSection(router: NextRouter): void {
    const routerPath = router.asPath.split("/");
    const lastPath = routerPath[routerPath.length - 1];

    if (window && document && lastPath.includes("#")) {
        const sectionId = lastPath.split("#")[1];
        const yOffset = -40;
        const element = document.getElementById(sectionId);
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({ top: y });
    }
}

const cryptoJS = require("crypto-js");
const secretKey = "jalda_secret_key";

export const encryptString = (dataToEncrypt: string) => {
    const stringData = JSON.stringify(dataToEncrypt);
    return cryptoJS.AES.encrypt(stringData, secretKey).toString();
};

export const decodeString = (dataToDecode: string) => {
    const bytes = cryptoJS.AES.decrypt(dataToDecode, secretKey);
    return JSON.parse(bytes.toString(cryptoJS.enc.Utf8));
};

export function setEncryptStorage(key: string, value: string): void {
    if (localStorage) localStorage.setItem(key, encryptString(value));
}

export function getDecodeStorage(key: string): string {
    if (localStorage && localStorage.getItem(key)) return decodeString(localStorage.getItem(key));
    return null;
}
