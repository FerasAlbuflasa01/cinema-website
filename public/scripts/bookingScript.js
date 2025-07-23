const bookedSeats = new Set()

const fetchBookedSeats = async () => {
  try {
    const fulUrl = window.location.href
    const response = await axios.get(fulUrl + '/api')
    response.data.forEach((seat) => bookedSeats.add(seat))
    attachEvent()
  } catch (error) {
    console.error('Error fetching booked seats:', error)
  }
}

const attachEvent = () => {
  const seatsHtml = document.querySelector('#seats')
  const selectedSeats = new Set()
  const unavailableSeats = new Set()

  for (let index = 0; index < 6; index++) {
    let rowElement = document.createElement('div')
    rowElement.setAttribute('id', `row-${index + 1}`)
    rowElement.setAttribute('class', 'rows')

    for (let j = 0; j < 6; j++) {
      let seatElement = document.createElement('div')
      seatElement.setAttribute('id', `seat-${index + 1}-${j + 1}`)
      seatElement.setAttribute('class', 'seat-row')

      if (bookedSeats.has(seatElement.id)) {
        seatElement.classList.add('unavailable')
        seatElement.style.cursor = 'not-allowed'
        unavailableSeats.add(seatElement.id)
      }

      seatElement.addEventListener('click', function () {
        if (!seatElement.classList.contains('unavailable')) {
          seatElement.classList.toggle('selected')

          const seatId = seatElement.id
          if (selectedSeats.has(seatId)) {
            selectedSeats.delete(seatId)
            unavailableSeats.delete(seatId)
          } else {
            selectedSeats.add(seatId)
            unavailableSeats.add(seatId)
          }
        }
      })

      rowElement.appendChild(seatElement)
    }
    seatsHtml.appendChild(rowElement)
  }

  document
    .getElementById('submitButton')
    .addEventListener('click', function () {
      if (selectedSeats.size > 0) {
        const selectedSeatsArray = Array.from(selectedSeats).join(',')
        const unavailableSeatsArray = Array.from(unavailableSeats).join(',')

        document.getElementById('selectedSeats').value = selectedSeatsArray
        document.getElementById('unavailableSeats').value =
          unavailableSeatsArray

        document.getElementById('seatForm').submit()
      } else {
        alert('Please select at least one seat.')
      }
    })
}

fetchBookedSeats()
