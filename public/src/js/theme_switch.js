let switchBtn = document.getElementById('switchInput')
let switchDiv = document.getElementById('switchDiv')
let switchDot = document.getElementById('switchDot')

window.addEventListener('load', () => {
  // prelevo il theme dal cookie
  let theme = document.cookie.split('=')
  if(theme[1] == 'dark') {
    switchBtn.click()
  }
})

switchBtn.onchange = () => {
  if(switchBtn.checked) {
    switchDiv.classList.remove('bg-gray-300')
    switchDiv.classList.add('bg-primary-color')
    switchDot.classList.remove('left-1')
    switchDot.classList.add('right-1')
    document.body.classList.add('dark')

    // imposto il cookie
    document.cookie = 'theme=dark'
  } else {
    switchDiv.classList.remove('bg-primary-color')
    switchDiv.classList.add('bg-gray-300')
    switchDot.classList.remove('right-1')
    switchDot.classList.add('left-1')
    document.body.classList.remove('dark')

    // imposto il cookie
    document.cookie = 'theme=light'
  }
}