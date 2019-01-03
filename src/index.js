const addBtn = document.querySelector('#new-listing-btn')
let addListing = false
const listingForm = document.querySelector('.container')
const editForm =  document.querySelector('.edit-container')
const newListingForm = document.querySelector('.new-listing-form')
newListingForm.addEventListener('submit', createListing)
const listingCollection = document.getElementById('listings-collection')
listingCollection.addEventListener('click', renderShow)
const homeBtn = document.getElementById('home')
const loginForm = document.getElementById('login-form')
const loginBtn = document.getElementById('login')
let userId = null


document.addEventListener('DOMContentLoaded', () => {
  if (!userId) {
    homeBtn.style.display = 'none'
    addBtn.style.display = 'none'
  }
})

loginBtn.addEventListener('click', () => {
  event.preventDefault()
  const username = document.getElementById('username').value
  const name = document.getElementById('name').value
  fetch(`http://localhost:3000/api/v1/users/${username}`)
  .then(r => r.json())
  .then(data => {
    if (data) {
      userId = data.id
      loginForm.style.display = 'none'
      homeBtn.style.display = ''
      addBtn.style.display = ''
      fetch('http://localhost:3000/api/v1/listings/')
      .then(r => r.json())
      .then(renderListings)
    } else {
      alert('create account')
    }
  })
})

homeBtn.addEventListener('click', () => {
  listingCollection.innerHTML = ''
  editForm.style.display = 'none'
  fetch('http://localhost:3000/api/v1/listings/')
  .then(r => r.json())
  .then(renderListings)
})

function renderShow(event) {
  if (event.target.tagName === 'H4' || event.target.tagName === 'IMG') {
    let listingId = event.target.parentNode.dataset.id
    console.log(listingId);
    fetch(`http://localhost:3000/api/v1/listings/${listingId}`)
    .then(r => r.json())
    .then(renderOneListing)
  }
}

function renderOneListing(data) {
  listingCollection.innerHTML = ''
  const div = document.createElement('div')
  div.setAttribute('class', 'card')
  div.dataset.id = data.id
  const h4 = document.createElement('h4')
  h4.innerText = `${data.title}`
  const priceSpan = document.createElement('span')
  priceSpan.innerText = data.price
  priceSpan.setAttribute('id', 'price-span')
  const img = document.createElement('img')
  img.src = data.image_url
  const span = document.createElement('span')
  span.innerText = data.location
  const p = document.createElement('p')
  p.innerText = `Description: ${data.description}`
  const editBtn = document.createElement('button')
  editBtn.innerText = 'Edit Listing'
  editBtn.setAttribute('id', 'edit-listing')
  const deleteBtn = document.createElement('button')
  deleteBtn.innerText = 'Delete Listing'
  deleteBtn.setAttribute('id', 'delete-listing')
  img.setAttribute('class', 'listing-image')
  div.appendChild(span)
  div.appendChild(h4)
  div.appendChild(priceSpan)
  div.appendChild(img)
  div.appendChild(p)
  div.appendChild(editBtn)
  div.appendChild(deleteBtn)
  listingCollection.appendChild(div)
  const edit = document.getElementById('edit-listing')
  edit.addEventListener('click', editListing)
}

function editListing(event) {
  if (event.target.id === 'edit-listing') {
    editForm.style.display = 'block'
    let listingId = document.querySelector('.listing-id')
    const titleValue = document.getElementById('t-edit')
    const imageValue = document.getElementById('image-edit')
    const descriptionValue = document.getElementById('des-edit')
    const locationValue = document.getElementById('location-edit')
    const priceValue = document.getElementById('price-edit')
    const titleInput = event.target.parentElement.children[1].innerText
    const imageInput = event.target.parentElement.children[3].attributes.src.value
    const descriptionInput = event.target.parentElement.children[4].innerText.split(':')[1]
    const locationInput = event.target.parentElement.children[0].innerText
    const priceInput = event.target.parentElement.children[2].innerText
    titleValue.value = titleInput
    imageValue.value = imageInput
    descriptionValue.value = descriptionInput
    locationValue.value = locationInput
    priceValue.value = priceInput
    listingId.value = event.target.parentNode.dataset.id

  }
}

editForm.addEventListener('submit', editFetch)

function editFetch(event) {
  event.preventDefault()
  let listingId = document.querySelector('.listing-id').value
  const titleValue = document.getElementById('t-edit').value
  const imageValue = document.getElementById('image-edit').value
  const descriptionValue = document.getElementById('des-edit').value
  const locationValue = document.getElementById('location-edit').value
  const priceValue = document.getElementById('price-edit').value
  fetch(`http://localhost:3000/api/v1/listings/${listingId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: titleValue,
      image_url: imageValue,
      description: descriptionValue,
      location: locationValue,
      price: priceValue
    })
  })
  .then(r => r.json())
  .then(data => {
    let div = document.querySelector(`[data-id='${listingId}']`)
    div.children[1].innerText = data.title
    div.children[3].innerText = data.image
    div.children[4].innerText = `Description: ${data.description}`
    div.children[0].innerText = data.location
    div.children[2].innerText = data.price
  })
}

function createListing(event) {
  event.preventDefault()
  const titleValue = document.getElementById('listing-title').value
  const imageValue = document.getElementById('listing-image').value
  const descriptionValue = document.getElementById('listing-description').value
  const locationValue = document.getElementById('listing-location').value
  const priceValue = document.getElementById('listing-price').value
  fetch('http://localhost:3000/api/v1/listings/', {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: titleValue,
      image_url: imageValue,
      description: descriptionValue,
      location: locationValue,
      price: priceValue
    })
  })
  .then(r => r.json())
  .then(listings)
}

addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addListing = !addListing
  if (addListing) {
    listingForm.style.display = 'block'
    // submit listener here
  } else {
    listingForm.style.display = 'none'
  }
})


fetch('http://localhost:3000/api/v1/listings/')
.then(r => r.json())
.then(renderListings)


function renderListings(data) {
  if (userId)
    data.forEach(listings)
  else
    console.log('not logged in')
}

function listings(listing) {
  const div = document.createElement('div')
  div.setAttribute('class', 'card')
  div.dataset.id = listing.id
  const h4 = document.createElement('h4')
  h4.innerText = `${listing.title} - $ ${listing.price}`
  const img = document.createElement('img')
  img.src = listing.image_url
  const span = document.createElement('span')
  span.innerText = listing.location
  const p = document.createElement('p')
  p.innerText = `Description: ${listing.description}`
  img.setAttribute('class', 'listing-image')
  div.appendChild(span)
  div.appendChild(h4)
  div.appendChild(img)
  div.appendChild(p)
  listingCollection.appendChild(div)

}
