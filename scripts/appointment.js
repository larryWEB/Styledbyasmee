// Appointment Booking JavaScript

document.addEventListener("DOMContentLoaded", () => {
  // Initialize the appointment booking system
  initAppointmentBooking()
})

// Global variables to store appointment data
const appointmentData = {
  service: null,
  date: null,
  time: null,
  customerInfo: {
    name: "",
    email: "",
    phone: "",
    notes: "",
  },
}

// Service data
const services = {
  "personal-styling": {
    name: "Personal Styling",
    duration: "60 minutes",
    price: "$120",
  },
  "wardrobe-consultation": {
    name: "Wardrobe Consultation",
    duration: "90 minutes",
    price: "$150",
  },
  "special-event-styling": {
    name: "Special Event Styling",
    duration: "120 minutes",
    price: "$200",
  },
}

// Initialize the appointment booking system
function initAppointmentBooking() {
  // Set up navigation between steps
  setupStepNavigation()

  // Set up service selection
  setupServiceSelection()

  // Set up calendar
  setupCalendar()

  // Set up form submission
  setupFormSubmission()

  // Set up "Add to Calendar" functionality
  setupAddToCalendar()

  // Update cart count
  updateCartCount()

  // Declare updateCartCount function if it's not imported
  function updateCartCount() {
    // Add your cart count update logic here
    // This is a placeholder, replace with your actual implementation
    console.log("Cart count updated (placeholder)")
  }
}

// Set up navigation between steps
function setupStepNavigation() {
  // Next step buttons
  const nextButtons = document.querySelectorAll(".next-step")
  nextButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStep = Number.parseInt(this.closest(".appointment-step-content").id.split("-")[1])
      const nextStep = Number.parseInt(this.getAttribute("data-next"))

      // Validate current step before proceeding
      if (validateStep(currentStep)) {
        // Hide current step
        document.getElementById(`step-${currentStep}`).classList.remove("active")

        // Show next step
        document.getElementById(`step-${nextStep}`).classList.add("active")

        // Update step indicators
        updateStepIndicators(nextStep)

        // If moving to confirmation step, populate confirmation details
        if (nextStep === 4) {
          populateConfirmationDetails()
        }

        // Scroll to top of the step
        window.scrollTo({
          top: document.querySelector(".appointment-steps").offsetTop - 100,
          behavior: "smooth",
        })
      }
    })
  })

  // Previous step buttons
  const prevButtons = document.querySelectorAll(".prev-step")
  prevButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const currentStep = Number.parseInt(this.closest(".appointment-step-content").id.split("-")[1])
      const prevStep = Number.parseInt(this.getAttribute("data-prev"))

      // Hide current step
      document.getElementById(`step-${currentStep}`).classList.remove("active")

      // Show previous step
      document.getElementById(`step-${prevStep}`).classList.add("active")

      // Update step indicators
      updateStepIndicators(prevStep)

      // Scroll to top of the step
      window.scrollTo({
        top: document.querySelector(".appointment-steps").offsetTop - 100,
        behavior: "smooth",
      })
    })
  })
}

// Update step indicators
function updateStepIndicators(activeStep) {
  const steps = document.querySelectorAll(".step")

  steps.forEach((step) => {
    const stepNumber = Number.parseInt(step.getAttribute("data-step"))

    // Remove all classes first
    step.classList.remove("active", "completed")

    // Add appropriate class
    if (stepNumber === activeStep) {
      step.classList.add("active")
    } else if (stepNumber < activeStep) {
      step.classList.add("completed")
    }
  })
}

// Validate current step
function validateStep(step) {
  switch (step) {
    case 1:
      // Validate service selection
      return appointmentData.service !== null
    case 2:
      // Validate date and time selection
      return appointmentData.date !== null && appointmentData.time !== null
    case 3:
      // Validate form
      const form = document.getElementById("appointment-form")
      if (form.checkValidity()) {
        // Store form data
        appointmentData.customerInfo.name = document.getElementById("name").value
        appointmentData.customerInfo.email = document.getElementById("email").value
        appointmentData.customerInfo.phone = document.getElementById("phone").value
        appointmentData.customerInfo.notes = document.getElementById("notes").value
        return true
      } else {
        // Trigger form validation
        form.reportValidity()
        return false
      }
    default:
      return true
  }
}

// Set up service selection
function setupServiceSelection() {
  const serviceCards = document.querySelectorAll(".service-card")
  const nextButton = document.querySelector("#step-1 .next-step")

  serviceCards.forEach((card) => {
    card.addEventListener("click", function () {
      // Remove selected class from all cards
      serviceCards.forEach((c) => c.classList.remove("selected"))

      // Add selected class to clicked card
      this.classList.add("selected")

      // Store selected service
      const serviceId = this.getAttribute("data-service")
      appointmentData.service = serviceId

      // Enable next button
      nextButton.disabled = false
    })
  })
}

// Set up calendar
function setupCalendar() {
  // Get current date
  const today = new Date()
  let currentMonth = today.getMonth()
  let currentYear = today.getFullYear()

  // Calendar navigation
  const prevMonthBtn = document.querySelector(".prev-month")
  const nextMonthBtn = document.querySelector(".next-month")
  const currentMonthElement = document.querySelector(".current-month")

  // Time slots
  const timeSlotsContainer = document.querySelector(".time-slots")
  const selectedDateElement = document.querySelector(".selected-date")
  const nextButton = document.querySelector("#step-2 .next-step")

  // Generate calendar for current month
  generateCalendar(currentMonth, currentYear)

  // Previous month button
  prevMonthBtn.addEventListener("click", () => {
    currentMonth--
    if (currentMonth < 0) {
      currentMonth = 11
      currentYear--
    }
    generateCalendar(currentMonth, currentYear)
  })

  // Next month button
  nextMonthBtn.addEventListener("click", () => {
    currentMonth++
    if (currentMonth > 11) {
      currentMonth = 0
      currentYear++
    }
    generateCalendar(currentMonth, currentYear)
  })

  // Generate calendar
  function generateCalendar(month, year) {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]

    // Update month and year display
    currentMonthElement.textContent = `${monthNames[month]} ${year}`

    // Clear previous calendar days
    const calendarGrid = document.querySelector(".calendar-grid")
    const dayHeaders = document.querySelectorAll(".calendar-day-header")

    // Remove all days but keep headers
    const days = document.querySelectorAll(".calendar-day")
    days.forEach((day) => day.remove())

    // Add days from previous month
    const prevMonthDays = firstDay
    const prevMonth = month === 0 ? 11 : month - 1
    const prevMonthYear = month === 0 ? year - 1 : year
    const daysInPrevMonth = new Date(prevMonthYear, prevMonth + 1, 0).getDate()

    for (let i = prevMonthDays - 1; i >= 0; i--) {
      const day = document.createElement("div")
      day.className = "calendar-day other-month disabled"
      day.textContent = daysInPrevMonth - i
      calendarGrid.appendChild(day)
    }

    // Add days for current month
    for (let i = 1; i <= daysInMonth; i++) {
      const day = document.createElement("div")
      day.className = "calendar-day"
      day.textContent = i

      // Check if day is in the past
      const currentDate = new Date(year, month, i)
      const isToday = currentDate.toDateString() === today.toDateString()
      const isPast = currentDate < new Date(today.setHours(0, 0, 0, 0))

      if (isToday) {
        day.classList.add("today")
      }

      if (isPast) {
        day.classList.add("disabled")
      } else {
        // Add click event for future dates
        day.addEventListener("click", function () {
          // Remove selected class from all days
          document.querySelectorAll(".calendar-day").forEach((d) => d.classList.remove("selected"))

          // Add selected class to clicked day
          this.classList.add("selected")

          // Store selected date
          const selectedDate = new Date(year, month, Number.parseInt(this.textContent))
          appointmentData.date = selectedDate

          // Update selected date display
          const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
          selectedDateElement.textContent = selectedDate.toLocaleDateString("en-US", options)

          // Generate time slots for selected date
          generateTimeSlots(selectedDate)
        })
      }

      calendarGrid.appendChild(day)
    }

    // Add days from next month
    const totalDaysAdded = prevMonthDays + daysInMonth
    const nextMonthDays = 42 - totalDaysAdded // 6 rows of 7 days

    for (let i = 1; i <= nextMonthDays; i++) {
      const day = document.createElement("div")
      day.className = "calendar-day other-month disabled"
      day.textContent = i
      calendarGrid.appendChild(day)
    }
  }

  // Generate time slots for selected date
  function generateTimeSlots(date) {
    // Clear previous time slots
    timeSlotsContainer.innerHTML = ""

    // Reset time selection
    appointmentData.time = null
    nextButton.disabled = true

    // Generate time slots (9 AM to 5 PM)
    const startHour = 9
    const endHour = 17

    // Get day of week (0 = Sunday, 6 = Saturday)
    const dayOfWeek = date.getDay()

    // If weekend, show message
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const message = document.createElement("p")
      message.className = "no-slots-message"
      message.textContent = "No appointments available on weekends. Please select a weekday."
      timeSlotsContainer.appendChild(message)
      return
    }

    // Generate time slots
    for (let hour = startHour; hour <= endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        // Skip 12:30 PM (lunch break)
        if (hour === 12 && minute === 30) continue

        const timeSlot = document.createElement("div")
        timeSlot.className = "time-slot"

        // Format time
        const ampm = hour >= 12 ? "PM" : "AM"
        const displayHour = hour % 12 || 12
        const displayMinute = minute === 0 ? "00" : minute
        const timeString = `${displayHour}:${displayMinute} ${ampm}`

        timeSlot.textContent = timeString

        // Randomly disable some time slots (for demo purposes)
        // In a real app, this would check against a database of booked appointments
        if (Math.random() < 0.3) {
          timeSlot.classList.add("disabled")
        } else {
          timeSlot.addEventListener("click", function () {
            // Remove selected class from all time slots
            document.querySelectorAll(".time-slot").forEach((slot) => slot.classList.remove("selected"))

            // Add selected class to clicked time slot
            this.classList.add("selected")

            // Store selected time
            appointmentData.time = timeString

            // Enable next button
            nextButton.disabled = false
          })
        }

        timeSlotsContainer.appendChild(timeSlot)
      }
    }
  }
}

// Set up form submission
function setupFormSubmission() {
  const form = document.getElementById("appointment-form")
  const submitButton = document.querySelector("#step-3 .next-step")

  // Add input event listeners to enable/disable submit button
  const requiredInputs = form.querySelectorAll("[required]")
  requiredInputs.forEach((input) => {
    input.addEventListener("input", () => {
      // Check if all required fields are filled
      const allFilled = Array.from(requiredInputs).every((input) => input.value.trim() !== "")
      submitButton.disabled = !allFilled
    })
  })
}

// Populate confirmation details
function populateConfirmationDetails() {
  // Get service details
  const service = services[appointmentData.service]

  // Format date
  const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
  const formattedDate = appointmentData.date.toLocaleDateString("en-US", options)

  // Update confirmation details
  document.getElementById("confirm-service").textContent = service.name
  document.getElementById("confirm-date").textContent = formattedDate
  document.getElementById("confirm-time").textContent = appointmentData.time
  document.getElementById("confirm-duration").textContent = service.duration
  document.getElementById("confirm-email").textContent = appointmentData.customerInfo.email
}

// Set up "Add to Calendar" functionality
function setupAddToCalendar() {
  const addToCalendarBtn = document.getElementById("add-to-calendar")

  addToCalendarBtn.addEventListener("click", () => {
    // Get appointment details
    const service = services[appointmentData.service]
    const date = appointmentData.date
    const time = appointmentData.time

    // Parse time string to get hours and minutes
    const timeMatch = time.match(/(\d+):(\d+) (AM|PM)/)
    if (!timeMatch) return

    let hours = Number.parseInt(timeMatch[1])
    const minutes = Number.parseInt(timeMatch[2])
    const ampm = timeMatch[3]

    // Convert to 24-hour format
    if (ampm === "PM" && hours < 12) hours += 12
    if (ampm === "AM" && hours === 12) hours = 0

    // Set start time
    const startTime = new Date(date)
    startTime.setHours(hours, minutes, 0, 0)

    // Set end time based on service duration
    const endTime = new Date(startTime)
    const durationMatch = service.duration.match(/(\d+)/)
    if (durationMatch) {
      const durationMinutes = Number.parseInt(durationMatch[1])
      endTime.setMinutes(endTime.getMinutes() + durationMinutes)
    }

    // Create calendar event URL (Google Calendar format)
    const eventTitle = `StyledByAsmee: ${service.name}`
    const eventDetails = `Your ${service.name} appointment with StyledByAsmee.
      
Name: ${appointmentData.customerInfo.name}
Phone: ${appointmentData.customerInfo.phone}
Notes: ${appointmentData.customerInfo.notes || "None"}`

    const eventStart = formatDateForCalendar(startTime)
    const eventEnd = formatDateForCalendar(endTime)

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${eventStart}/${eventEnd}&details=${encodeURIComponent(eventDetails)}&location=StyledByAsmee%20Studio`

    // Open calendar in new tab
    window.open(calendarUrl, "_blank")
  })

  // Helper function to format date for Google Calendar
  function formatDateForCalendar(date) {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")

    return `${year}${month}${day}T${hours}${minutes}00`
  }
}

// Add a link to the appointment page in the index.html navigation
function addAppointmentLink() {
  // This function would be called when loading the index page
  // For this demo, we'll just add the link in the HTML directly
}
