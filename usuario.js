// Funcionalidad del panel de usuario

let currentUser = null
let categories = []
const priorities = ["Baja", "Media", "Alta"] // Prioridades predefinidas

// Obtener las categorías desde localStorage
function getCategories() {
  const storedCategories = localStorage.getItem("categories")
  return storedCategories ? JSON.parse(storedCategories) : []
}

// Inicializar el panel de usuario
function initUserDashboard() {
  currentUser = checkAuth() // Verificar autenticación
  if (!currentUser || currentUser.role !== "usuario") {
    window.location.href = "index.html" // Redirigir si no es usuario
    return
  }

  // Mostrar nombre del usuario en la interfaz
  document.getElementById("userName").textContent = currentUser.name

  // Cargar categorías y prioridades en el formulario
  loadCategories()
  loadPriorities()

  // Escuchar la creación de tickets
  document.getElementById("createTicketForm").addEventListener("submit", handleCreateTicket)

  // Cargar tickets del usuario
  loadUserTickets()
}

// Cargar categorías en el formulario
function loadCategories() {
  categories = getCategories()
  const select = document.getElementById("categoria")
  select.innerHTML = "<option value=''>Seleccionar categoría</option>"

  categories.forEach((category) => {
    const option = document.createElement("option")
    option.value = category
    option.textContent = category
    select.appendChild(option)
  })
}

// Cargar prioridades en el formulario
function loadPriorities() {
  const select = document.getElementById("prioridad")
  select.innerHTML = "<option value=''>Seleccionar prioridad</option>"

  priorities.forEach((priority) => {
    const option = document.createElement("option")
    option.value = priority
    option.textContent = priority
    select.appendChild(option)
  })
}

// Crear un nuevo ticket
function handleCreateTicket(event) {
  event.preventDefault()

  // Obtener los datos del formulario
  const formData = new FormData(event.target)
  const newTicket = {
    id: generateTicketId(), // ID único
    titulo: formData.get("titulo"),
    descripcion: formData.get("descripcion"),
    categoria: formData.get("categoria"),
    prioridad: formData.get("prioridad"),
    estado: "Abierto", // Estado inicial
    usuario: currentUser.email, // Asociar al usuario
    fecha: new Date().toISOString().split("T")[0], // Fecha actual
  }

  // Guardar en localStorage
  const tickets = getTickets()
  tickets.push(newTicket)
  saveTickets(tickets)

  // Limpiar formulario y recargar la tabla
  event.target.reset()
  loadUserTickets()

  alert("Ticket creado exitosamente")
}

// Obtener todos los tickets desde localStorage
function getTickets() {
  const tickets = localStorage.getItem("tickets")
  return tickets ? JSON.parse(tickets) : []
}

// Guardar tickets en localStorage
function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets))
}

// Mostrar tickets del usuario
function loadUserTickets() {
  const tickets = getTickets().filter((t) => t.usuario === currentUser.email)
  const tbody = document.getElementById("ticketsTableBody")
  tbody.innerHTML = ""

  // Si no hay tickets mostrar mensaje
  if (tickets.length === 0) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No has creado tickets</td></tr>'
    return
  }

  // Insertar filas con los tickets
  tickets.forEach((ticket) => {
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>#${ticket.id}</td>
      <td>${ticket.titulo}</td>
      <td>${ticket.categoria}</td>
      <td>${ticket.prioridad}</td>
      <td>${ticket.estado}</td>
      <td>${ticket.fecha}</td>
    `
    tbody.appendChild(row)
  })
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initUserDashboard)
