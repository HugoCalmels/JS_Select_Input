const overlay = document.querySelector(".overlay")
const wrapper = document.querySelector('.container')
let grid = document.querySelector(".another-container")
export default class Selectino{
  constructor(options){
    this.options = options;
    this.customSelectElement = document.createElement("div")
    this.labelElement = document.createElement('span')
    this.optionList = document.createElement('ul')
    build(this)
    listen(this)
    listenKeyboard(this)
  }
  get currentOption() {
    return document.querySelector('.option-element.selected')
  }
  get allOptions() {
    return document.querySelectorAll('.option-element')
  }
}

function build(item){
  // container & title
  item.customSelectElement.className = 'select-container'
  item.customSelectElement.innerText = 'Pick a city : '

  // setting label to array[0]
  item.labelElement.innerText = item.options[0]

  // container onclick
  item.customSelectElement.addEventListener("click", () => {
    item.optionList.classList.toggle("show") // dropdown menu
    overlay.classList.toggle("show") // overlay
    grid.classList.toggle("lock") // lock another element while overlay is on
    item.customSelectElement.classList.toggle('focus') // container focus, optionna
    // when closing the container, we save
    item.labelElement.innerText = item.currentOption.getAttribute('name')
    item.labelElement.setAttribute('value', item.currentOption.getAttribute('name'))
    // other events has same saving mechanics, like overlay, keyboard, and dropdown onclick.
  })

  overlay.addEventListener("click", () => {
    overlay.classList.remove("show")
    item.optionList.classList.remove("show")
    grid.classList.remove("lock")
    item.customSelectElement.classList.remove('focus')
    // i have no options to save here, idk why actually .. ?
  })

  // building options from the dropdown menu
  item.options.forEach((option, index) => {
    let buildOneOption = document.createElement('option')
    buildOneOption.innerText = option
    if (index === 0) { // by default style of 1st index is styled
      buildOneOption.className = "option-element selected" 
    } else {
      buildOneOption.className = "option-element"
    }
    
    buildOneOption.setAttribute("name", option)
    item.optionList.append(buildOneOption)
  })

  // then building the dropdown container, and appendChild everything
  item.optionList.className = 'options-container'
  item.customSelectElement.append(item.labelElement)
  wrapper.append(item.customSelectElement)
  wrapper.append(item.optionList)
}


function listen(item) {

  item.allOptions.forEach((option) => {
    option.addEventListener('click', (event) => {
      // removing last options values, and undisplaying the dropdown, the overlay, and the lock
      item.allOptions.forEach((el) => { el.classList.remove('selected')})
      overlay.classList.remove("show")
      item.optionList.classList.remove("show")
      grid.classList.remove("lock")
      item.customSelectElement.classList.remove('focus')
     
      // returning new values to the label, and some style
      option.classList.add('selected') 
      item.labelElement.innerText = event.target.getAttribute('name')
      item.labelElement.setAttribute('value', item.labelElement.innerText)
    })
  })
}

function listenKeyboard(item) {
  let debounceTimeout
  let searchString = ''
  
  window.addEventListener('keydown', (keyboard) => {

    // will listen only if the dropdownmenu is displayed
    if (document.querySelector('.options-container').classList.contains('show')) {
      
      let lastSelectedValue = (item.labelElement.getAttribute('value'))
      let lastOption = document.querySelector('.option-element.selected')
      let selectedIndex 
    
      switch (keyboard.key) {

        case "ArrowUp":
          selectedIndex = [...item.options].indexOf(lastSelectedValue) - 1 
          if (selectedIndex >= 0 && selectedIndex < [...item.options].length ) {
            lastSelectedValue = [...item.options][selectedIndex]
            item.labelElement.setAttribute('value', lastSelectedValue)
          } 
      
          item.allOptions.forEach((option) => {
            option.classList.remove('selected')
            if (lastSelectedValue === option.getAttribute('name')) {
              option.classList.add('selected')
            } 
          })
          break
        
        case "ArrowDown":
          selectedIndex = [...item.options].indexOf(lastSelectedValue) + 1
          if (item.currentOption.classList.contains('default')) {
            selectedIndex += 1
            item.currentOption.classList.remove('default')
          }
          if (selectedIndex > 0 && selectedIndex < [...item.options].length) {
            lastSelectedValue = [...item.options][selectedIndex]
            item.labelElement.setAttribute('value', lastSelectedValue)
          }

          item.allOptions.forEach((option) => {
            option.classList.remove('selected')
            if (lastSelectedValue === option.getAttribute('name')) {
              option.classList.add('selected')
            }
          })
          break;
        
        case "Enter"  :
        case "Escape":
          overlay.classList.remove("show")
          item.optionList.classList.remove("show")
          grid.classList.remove("lock")
          item.customSelectElement.classList.remove('focus')
          item.labelElement.innerText = lastOption.getAttribute('name')
          item.labelElement.setAttribute('value', item.labelElement.innerText)
          break;
        
        default:
          searchString += keyboard.key
          clearTimeout(debounceTimeout)
          debounceTimeout = setTimeout(() => { 
            searchString = ''
          },500)
    
          const res = [...item.allOptions].find(option => {
            return (option.getAttribute('name').toLowerCase().startsWith(searchString)) 
          })

          if (res !== undefined) {
            item.lastOption = res
            res.classList.add('selected')
          } 
          
          item.allOptions.forEach((option) => {
            option.classList.remove('selected')
          })
          
          item.lastOption.classList.add('selected')
          break;
      }
      overlay.addEventListener('click', () => {
        let lastOption2 = document.querySelector('.option-element.selected')
        item.labelElement.innerText = lastOption2.getAttribute('name')
        item.labelElement.setAttribute('value', item.labelElement.innerText)
      })
    }
  })

}