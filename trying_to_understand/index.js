import Selectino from './selectino.js';

const options = ['Paris', 'London', 'Venice', 'Chicago', 'Lima', 'Shangai', 'Hannover']

const select = new Selectino(options)




let btn = document.querySelector('.button-click-me')

btn.addEventListener('click', () => {
  console.log("button has been clicked")
})