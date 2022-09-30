import Select from './select.js'

const selectElements = document.querySelectorAll('[data-custom]')

 // select.setValue('NE') -- cool tip


// the plan :
// iterate over all the options available, and make a new Class from each of thoses
selectElements.forEach((selectElement) => {
  console.log(new Select(selectElement))
})


