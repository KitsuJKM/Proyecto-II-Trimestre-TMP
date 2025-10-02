// Admin.js - Funcionalidad del Panel de Administración

// Variables globales
let currentUser = null
let allTickets = []
let categories = []

// Función para simular autenticación

function checkAuth() {
  return { name: "Admin User", role: "admin" }
}


// Función para obtener tickets (simulada)
// // En un futuro puedes reemplazarla por fetch a una API o localStorage
function getTickets() {
  return JSON.parse(localStorage.getItem("tickets")) || [
    { id: 1, categoria: "Soporte", prioridad: "Alta", estado: "Abierto" },
    { id: 2, categoria: "Ventas", prioridad: "Normal", estado: "Cerrado" }
  ]
}


// Manejo de categorías en localStorage

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories))
}

function getCategories() {
  const storedCategories = localStorage.getItem("categories")
  return storedCategories ? JSON.parse(storedCategories) : []
}

// Inicialización del panel de administración

function initAdminDashboard() {
  currentUser = checkAuth()
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "index.html"
    return
  }

  // Mostrar usuario
  document.getElementById("userName").textContent = currentUser.name

  // Cargar datos
  loadData()

  // Actualizar estadísticas
  updateDashboardStats()

  // Cargar categorías en tabla
  loadCategoriesTable()

  // Configurar formulario categorías
  document.getElementById("categoryForm").addEventListener("submit", handleAddCategory)

  // Configurar botón de reportes
  const reportBtn = document.querySelector(".reports-controls button")
  if (reportBtn) {
    reportBtn.addEventListener("click", generateReport)
  }
}


// Cargar datos

function loadData() {
  allTickets = getTickets()
  categories = getCategories()
}


// Actualizar estadísticas del panel

function updateDashboardStats() {
  const total = allTickets.length
  const open = allTickets.filter((t) => t.estado === "Abierto").length
  const closed = allTickets.filter((t) => t.estado === "Cerrado").length
  const highPriority = allTickets.filter((t) => t.prioridad === "Alta").length

  document.getElementById("totalTickets").textContent = total
  document.getElementById("openTickets").textContent = open
  document.getElementById("closedTickets").textContent = closed
  document.getElementById("highPriorityTickets").textContent = highPriority
}


// Reportes dinámicos (Estado, Categoría, Prioridad)

function generateReport() {
  document.getElementById("reportResults").style.display = "block"

  generateStatusReport()
  generateCategoryReport()
  generatePriorityReport()
}

// Reporte por Estado
function generateStatusReport() {
  const tbody = document.getElementById("statusReportBody")
  tbody.innerHTML = ""
  const total = allTickets.length

  const estados = [...new Set(allTickets.map((t) => t.estado))]
  estados.forEach((estado) => {
    const cantidad = allTickets.filter((t) => t.estado === estado).length
    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0
    const row = `
      <tr>
        <td>${estado}</td>
        <td>${cantidad}</td>
        <td>${porcentaje}%</td>
      </tr>
    `
    tbody.innerHTML += row
  })
}

// Reporte por Categoría
function generateCategoryReport() {
  const tbody = document.getElementById("categoryReportBody")
  tbody.innerHTML = ""
  const total = allTickets.length

  const categorias = [...new Set(allTickets.map((t) => t.categoria))]
  categorias.forEach((categoria) => {
    const cantidad = allTickets.filter((t) => t.categoria === categoria).length
    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0
    const row = `
      <tr>
        <td>${categoria}</td>
        <td>${cantidad}</td>
        <td>${porcentaje}%</td>
      </tr>
    `
    tbody.innerHTML += row
  })
}

// Reporte por Prioridad
function generatePriorityReport() {
  const tbody = document.getElementById("priorityReportBody")
  tbody.innerHTML = ""
  const total = allTickets.length

  const prioridades = [...new Set(allTickets.map((t) => t.prioridad))]
  prioridades.forEach((prioridad) => {
    const cantidad = allTickets.filter((t) => t.prioridad === prioridad).length
    const porcentaje = total > 0 ? ((cantidad / total) * 100).toFixed(1) : 0
    const row = `
      <tr>
        <td>${prioridad}</td>
        <td>${cantidad}</td>
        <td>${porcentaje}%</td>
      </tr>
    `
    tbody.innerHTML += row
  })
}


// Gestión de Categorías

function loadCategoriesTable() {
  const tbody = document.getElementById("categoriesTableBody")
  tbody.innerHTML = ""

  categories.forEach((category) => {
    const ticketCount = allTickets.filter((t) => t.categoria === category).length
    const row = document.createElement("tr")
    row.innerHTML = `
      <td>${category}</td>
      <td>${ticketCount}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick="editCategory('${category}')">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCategory('${category}')">Eliminar</button>
      </td>
    `
    tbody.appendChild(row)
  })
}

function handleAddCategory(event) {
  event.preventDefault()
  const newCategory = document.getElementById("newCategory").value.trim()

  if (newCategory && !categories.includes(newCategory)) {
    categories.push(newCategory)
    saveCategories(categories)
    loadCategoriesTable()
    document.getElementById("categoryForm").reset()
    alert("Categoría agregada exitosamente")
  } else {
    alert("La categoría ya existe o está vacía")
  }
}

function editCategory(category) {
  const newName = prompt(`Editar categoría "${category}":`, category)
  if (newName && newName !== category && !categories.includes(newName)) {
    const index = categories.indexOf(category)
    categories[index] = newName
    saveCategories(categories)
    loadCategoriesTable()
    alert("Categoría actualizada exitosamente")
  }
}

function deleteCategory(category) {
  const ticketCount = allTickets.filter((t) => t.categoria === category).length
  if (ticketCount > 0) {
    alert(`No se puede eliminar la categoría "${category}" porque tiene ${ticketCount} tickets asociados.`)
    return
  }

  if (confirm(`¿Está seguro de eliminar la categoría "${category}"?`)) {
    categories = categories.filter((c) => c !== category)
    saveCategories(categories)
    loadCategoriesTable()
    alert("Categoría eliminada exitosamente")
  }
}

// Inicialización

document.addEventListener("DOMContentLoaded", initAdminDashboard)
