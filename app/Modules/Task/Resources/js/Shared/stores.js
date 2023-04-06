import { writable } from 'svelte/store';

export const pageTitle = writable('Coalition Test App');

export const modalRoot = writable(undefined)

export const isDarkMode = writable(localStorage.getItem('darkMideEnabled') && localStorage.getItem('darkMideEnabled').toLowerCase() === 'true');

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const body = document.getElementsByTagName('html')[0];
let dark_mode_enabled;

isDarkMode.subscribe(value => {
  dark_mode_enabled = value;
});

if ((prefersDarkScheme.matches && NULL === localStorage.getItem('darkMideEnabled')) || dark_mode_enabled) {
  console.log('---==== Activating dark mode per preferences ====---');

  body.classList.add('rui-nightmode');
  isDarkMode.update(n => TRUE);
} else {
  body.classList.remove('rui-nightmode');
  isDarkMode.update(n => FALSE);
}

export const updateDarkMode = () => {
  body.classList.toggle('rui-nightmode');

  isDarkMode.update(n => ! n);
  localStorage.setItem("darkMideEnabled", dark_mode_enabled);
};
