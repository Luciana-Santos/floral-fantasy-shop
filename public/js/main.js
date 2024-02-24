const menuList = document.querySelector('[data-menu="list"]')
const openMenuIcon = document.querySelector('[data-menu="open"]')
const closeMenuIcon = document.querySelector('[data-menu="close"]')
const menuBackdrop = document.querySelector('[data-menu="backdrop"]')

const handleOpenMenu = () => {
  menuList.classList.add('active')
  menuBackdrop.classList.add('active')
}

const handleCloseMenu = () => {
  menuList.classList.remove('active')
  menuBackdrop.classList.remove('active')
}

openMenuIcon.addEventListener('click', handleOpenMenu)
closeMenuIcon.addEventListener('click', handleCloseMenu)
menuBackdrop.addEventListener('click', handleCloseMenu)
