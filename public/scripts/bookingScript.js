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
  const rows = 5 // Number of rows (A, B, C...)
  const columns = 6 // Number of columns (1, 2, 3...)

  // Create header row
  const headerRow = document.createElement('div')
  headerRow.className = 'header-row'
  headerRow.appendChild(document.createElement('div')) // Empty top-left corner

  for (let j = 1; j <= columns; j++) {
    const headerCell = document.createElement('div')
    headerCell.className = 'header-cell-nums'
    headerCell.innerText = j // Column numbers
    headerRow.appendChild(headerCell)
  }
  seatsHtml.appendChild(headerRow)

  // Create seat rows
  for (let i = 0; i < rows; i++) {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', `row-${String.fromCharCode(65 + i)}`) // 'A', 'B', 'C', etc.
    rowElement.setAttribute('class', 'row')

    const rowHeader = document.createElement('div')
    rowHeader.className = 'header-cell'
    rowHeader.innerText = String.fromCharCode(65 + i) // Row letters
    rowElement.appendChild(rowHeader) // Add row header

    for (let j = 1; j <= columns; j++) {
      const seatId = `${String.fromCharCode(65 + i)}-${j}` // e.g., A-1
      const seatElement = document.createElement('div')
      seatElement.setAttribute('id', seatId)
      seatElement.setAttribute('class', 'seat-row')

      if (bookedSeats.has(seatId)) {
        seatElement.classList.add('unavailable')
        seatElement.style.cursor = 'not-allowed'
        unavailableSeats.add(seatId)
      }

      seatElement.addEventListener('click', function () {
        if (!seatElement.classList.contains('unavailable')) {
          seatElement.classList.toggle('selected')

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
