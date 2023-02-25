export const sleep = ms => new Promise(r => setTimeout(r, ms));
export const rand = (n,x) => Math.random() * (x-n) + n;
export const irand = (n,x) => Math.round(Math.random() * (x-n) + n);
export const choose = a => a[irand(0,a.length - 1)];