const addBtn = document.querySelector('#new-listing-btn')
let addListing = false
const listingForm = document.querySelector('.container')
const newListingForm = document.querySelector('.new-listing-form')
newListingForm.addEventListener('submit', createListing)
const listing = document.getElementById('listings-collection')
listing.addEventListener('click', renderShow)

function renderShow(event) {
  if (event.target.tagName === 'H4' || event.target.tagName === 'IMG') {
    console.log(event);
  }
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

const listingCollection = document.getElementById('listings-collection')

function renderListings(data) {
  data.forEach(listings)

}

function listings(listing) {
  const div = document.createElement('div')
  div.setAttribute('class', 'card')
  div.dataset.id = listing.id
  const h4 = document.createElement('h4')
  h4.innerText = `${listing.title} - $${listing.price}`
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
