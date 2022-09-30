export default class Select {
  constructor(element) {
    this.element = element;
    // dontunderstand the thing with options, we making a new select and you grab from the old one
    this.options = getFormattedOptions(element.querySelectorAll('option'))
    // actually building the whole element
    this.customElement = document.createElement('div')
    this.labelElement = document.createElement('span')
    this.optionsCustomElement = document.createElement('ul')
    // calling the function with our item, smart.
    setupCustomElement(this)
    element.style.display = "none"
    element.after(this.customElement)
  }

  // we dont have a selected option, so we make a getter
  get selectedOption() {
    console.log(this.options.find(option => option.selected))
    return this.options.find(option => option.selected)
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption)
  }

  selectValue(value) {
    const newSelectedOption = this.options.find(option => {
      return option.value === value
    })

    const prevSelectedOption = this.selectedOption
    prevSelectedOption.selected = false
    prevSelectedOption.element.selected = false

    newSelectedOption.selected = true
    newSelectedOption.element.selected = true

    this.labelElement.innerText = newSelectedOption.label
    this.optionsCustomElement.querySelector(`[data-value="${prevSelectedOption.value}"]`).classList.remove('selected')
    const newCustomElement = this.optionsCustomElement.querySelector(`[data-value="${newSelectedOption.value}"]`)
    newCustomElement.classList.add('selected')
    newCustomElement.scrollIntoView({ block: "nearest"})
  }

}

// to make sure the functions classes are not available like when u do "select.setup"
// write functions outside :D

// the argument "select" is the actually the class
function setupCustomElement(select) {
  // adding a funk name to our class div 
  select.customElement.classList.add('custom-select-container') 

  // tabulations
  select.customElement.tabIndex = 0

  // label element is the span, its the value also FROM the select BLOCK
  select.labelElement.classList.add('custom-select-value')
  select.labelElement.innerText = select.selectedOption.label
  select.customElement.append(select.labelElement)

  // ul each option kindof
  select.optionsCustomElement.classList.add('custom-select-options')

  // now options is created we loopin in
  select.options.forEach(option => {
    const optionElement = document.createElement('li')
    optionElement.classList.add('custom-select-option')
    optionElement.classList.toggle('selected', option.selected)
    optionElement.innerText = option.label
    optionElement.dataset.value = option.value
    optionElement.addEventListener('click', () => {
      select.selectValue(option.value)

      select.optionsCustomElement.classList.remove('show')
    })
    select.optionsCustomElement.append(optionElement)
  })

  select.customElement.append(select.optionsCustomElement)

  select.labelElement.addEventListener('click', () => {
    select.optionsCustomElement.classList.toggle('show')
  })

  select.customElement.addEventListener('blur', () => {
    select.optionsCustomElement.classList.remove("show")
  })

  let debounceTimeout
  let searchTerm = ""

  select.customElement.addEventListener('keydown', e => {
    switch (e.code) {
      case "Space":
        select.optionsCustomElement.classList.toggle('show')
        break
      case "ArrowUp":
        const prevOption = select.options[select.selectedOptionIndex - 1]
        if (prevOption) {
          select.selectValue(prevOption.value)
        }
        break
      case "ArrowDown":
        const nextOption = select.options[select.selectedOptionIndex + 1]
        if (nextOption) {
          select.selectValue(nextOption.value)
        }
        break
      case "Enter":
      case "Escape":
        select.optionsCustomElement.classList.remove('show')
        break
      
      default: // any key will be used for this search functionnality
        clearTimeout(debounceTimeout)
        searchTerm += e.key
        debounceTimeout = setTimeout(() => {
          searchTerm = ""
        }, 500) // if we wait too long it's gonna reset our searchTerm
        console.log(searchTerm)

        const searchedOption = select.options.find(option => {
          return option.label.toLowerCase().startsWith(searchTerm)
        })
        if (searchedOption) select.selectValue(searchedOption.value)
    }
  })
}


function getFormattedOptions(optionElements) {
  // in order to use .map on a node, convert it like this into an array using spread operator
  return [...optionElements].map(optionElement => {
    return { // alright we return an object .. ( i never do that )
      value: optionElement.value,
      label: optionElement.label,
      selected: optionElement.selected,
      element: optionElement
    } // allé le double return 
  })
}