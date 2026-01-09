export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Пример использования
// import { $, $$ } from '../utils/dom.js'

// $('.header')
// $$('.item').forEach(...)