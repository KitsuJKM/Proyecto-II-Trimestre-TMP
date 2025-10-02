// Variables globales para almacenar información del técnico y los tickets
let currentUser = null
let allTickets = []
let filteredTickets = []
let currentTicketId = null

// Simulación de autenticación (en un sistema real se consultaría al servidor)
function checkAuth() {
  return { name: "Tecnico", email: "john.doe@example.com", role: "tecnico" }
}

// Obtiene la lista de tickets desde localStorage
function getTickets() {
  const tickets = localStorage.getItem("tickets")
  return tickets ? JSON.parse(tickets) : []
}

// Guarda la lista de tickets en localStorage
function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets))
}

// Inicializa el panel del técnico
function initTechnicianDashboard() {
  // Verifica autenticación y rol
  currentUser = checkAuth()
  if (!currentUser || currentUser.role !== "tecnico") {
    // Si no es técnico, redirige a inicio
    window.location.href = "index.html"
    return
  }

  // Muestra el nombre del técnico en el header
  document.getElementById("userName").textContent = currentUser.name
  // Carga los tickets asignados al técnico
  loadAssignedTickets()
  // Actualiza las estadísticas (total, abiertos, en proceso, cerrados)
  updateStatistics()
}

// Carga los tickets asignados (por ahora carga todos desde localStorage)
function loadAssignedTickets() {
  const tickets = getTickets()
  allTickets = tickets
  filteredTickets = [...allTickets]
  // Muestra los tickets en la tabla de tecnico.html
  displayTickets(filteredTickets)
}

// Renderiza los tickets en la tabla del panel técnico
function displayTickets(tickets) {
  const tbody = document.getElementById("ticketsTableBody")
  tbody.innerHTML = ""

  // Si no hay tickets, muestra un mensaje vacío
  if (tickets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align: center;">No hay tickets asignados</td></tr>'
    return
  }

  // Crea una fila por cada ticket
  tickets.forEach((ticket) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>#${ticket.id}</td>
      <td>${ticket.titulo}</td>
      <td>${ticket.usuario}</td>
      <td>${ticket.categoria}</td>
      <td><span class="priority-badge priority-${ticket.prioridad.toLowerCase()}">${ticket.prioridad}</span></td>
      <td><span class="status-badge status-${ticket.estado.toLowerCase().replace(" ", "-")}">${ticket.estado}</span></td>
      <td>${formatDate(ticket.fecha)}</td>
      <td>
          <button class="btn btn-primary btn-sm" onclick="viewTicketDetails(${ticket.id})">Ver</button> 
      </td>
    `
    tbody.appendChild(row)
  })
}

// Filtra los tickets según estado y prioridad
function filterTickets() {
  const statusFilter = document.getElementById("statusFilter")?.value || ""
  const priorityFilter = document.getElementById("priorityFilter")?.value || ""

  filteredTickets = allTickets.filter((ticket) => {
    const statusMatch = !statusFilter || ticket.estado === statusFilter
    const priorityMatch = !priorityFilter || ticket.prioridad === priorityFilter
    return statusMatch && priorityMatch
  })

  displayTickets(filteredTickets)
}

// Abre el modal con los detalles del ticket
function viewTicketDetails(ticketId) {
  const ticket = allTickets.find((t) => t.id === ticketId)
  if (!ticket) return

  currentTicketId = ticketId
  // Llena los campos del modal con la información del ticket
  document.getElementById("modalTicketId").textContent = `#${ticket.id}`
  document.getElementById("modalTicketTitle").textContent = ticket.titulo
  document.getElementById("modalTicketUser").textContent = ticket.usuario
  document.getElementById("modalTicketCategory").textContent = ticket.categoria
  document.getElementById("modalTicketPriority").textContent = ticket.prioridad
  document.getElementById("modalTicketDescription").textContent = ticket.descripcion
  document.getElementById("modalTicketStatus").textContent = ticket.estado
  document.getElementById("newStatus").value = ticket.estado

  // Muestra el modal
  document.getElementById("ticketModal").style.display = "block"
}

// Permite cambiar el estado del ticket rápidamente con un prompt
function quickStatusUpdate(ticketId) {
  const ticket = allTickets.find((t) => t.id === ticketId)
  if (!ticket) return

  const newStatus = prompt(
    `Estado actual: ${ticket.estado}\n\nSelecciona nuevo estado:\n1. Abierto\n2. En Proceso\n3. Cerrado\n\nIngresa el número:`
  )

  const statusMap = { 1: "Abierto", 2: "En Proceso", 3: "Cerrado" }

  if (statusMap[newStatus]) {
    updateStatus(ticketId, statusMap[newStatus])
  }
}

// Actualiza el estado del ticket desde el modal
function updateTicketStatus() {
  if (!currentTicketId) return
  const newStatus = document.getElementById("newStatus").value
  updateStatus(currentTicketId, newStatus)
  closeModal()
}

// Lógica central para actualizar un ticket en localStorage
function updateStatus(ticketId, newStatus) {
  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((t) => t.id === ticketId)

  if (ticketIndex !== -1) {
    tickets[ticketIndex].estado = newStatus
    saveTickets(tickets)
    loadAssignedTickets()
    updateStatistics()
    alert(`Ticket #${ticketId} actualizado a: ${newStatus}`)
  }
}

// Elimina un ticket si está cerrado
function deleteTicket() {
  if (!currentTicketId) return

  const tickets = getTickets()
  const ticketIndex = tickets.findIndex((t) => t.id === currentTicketId)

  if (ticketIndex !== -1) {
    const ticket = tickets[ticketIndex]

    // Solo se pueden borrar los tickets cerrados
    if (ticket.estado !== "Cerrado") {
      alert("Solo se pueden eliminar tickets en estado 'Cerrado'.")
      return
    }

    // Confirmación antes de borrar
    if (confirm(`¿Estás seguro de eliminar el ticket #${ticket.id}?`)) {
      tickets.splice(ticketIndex, 1) // Elimina el ticket de la lista
      saveTickets(tickets)
      loadAssignedTickets()
      updateStatistics()
      closeModal()
      alert(`Ticket #${ticket.id} eliminado correctamente.`)
    }
  }
}

// Cierra el modal de detalles
function closeModal() {
  document.getElementById("ticketModal").style.display = "none"
  currentTicketId = null
}

// Calcula estadísticas y actualiza el panel de resumen
function updateStatistics() {
  const total = allTickets.length
  const open = allTickets.filter((t) => t.estado === "Abierto").length
  const inProgress = allTickets.filter((t) => t.estado === "En Proceso").length
  const closed = allTickets.filter((t) => t.estado === "Cerrado").length

  document.getElementById("totalTickets").textContent = total
  document.getElementById("openTickets").textContent = open
  document.getElementById("inProgressTickets").textContent = inProgress
  document.getElementById("closedTickets").textContent = closed
}

// Da formato legible a la fecha de creación del ticket
function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES")
}

// Permite cerrar el modal si se hace clic fuera de él
window.onclick = (event) => {
  const modal = document.getElementById("ticketModal")
  if (event.target === modal) closeModal()
}

// Ejecuta la inicialización del panel cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", initTechnicianDashboard)
