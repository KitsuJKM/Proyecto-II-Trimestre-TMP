// Demo users used for local authentication in la app.
// Cada entrada tiene: password, role (usuario/tecnico/admin) y name (para mostrar en la UI).
const demoUsers = {
  "usuario@demo.com": { password: "123456", role: "usuario", name: "Usuario Demo" },
  "tecnico@demo.com": { password: "123456", role: "tecnico", name: "Técnico Demo" },
  "admin@demo.com": { password: "123456", role: "admin", name: "Admin Demo" },
}

// Inicializa datos de ejemplo en localStorage si aún no existen.
// Esto facilita pruebas sin backend: crea tickets, categorías y prioridades por defecto.
function initializeData() {
  // Si no hay tickets guardados, crea un conjunto demo con estructura completa.
  if (!localStorage.getItem("tickets")) {
    const demoTickets = [
      {
        id: 1, // Identificador numérico único
        titulo: "Problema con impresora",
        descripcion: "La impresora no responde",
        categoria: "Hardware",
        prioridad: "Media",
        estado: "Abierto", // Estados típicos: Abierto, En Proceso, Cerrado
        usuario: "usuario@demo.com", // email del creador
        tecnico: "tecnico@demo.com", // email del técnico asignado
        fecha: new Date().toISOString().split("T")[0], // fecha en formato YYYY-MM-DD
      },
      {
        id: 2,
        titulo: "Error en sistema",
        descripcion: "El sistema se cierra inesperadamente",
        categoria: "Software",
        prioridad: "Alta",
        estado: "En Proceso",
        usuario: "usuario@demo.com",
        tecnico: "tecnico@demo.com",
        fecha: new Date().toISOString().split("T")[0],
      },
    ]
    // Guardar el arreglo en localStorage como JSON
    localStorage.setItem("tickets", JSON.stringify(demoTickets))
  }

  // Si no hay categorías, crear algunas por defecto
  if (!localStorage.getItem("categories")) {
    const categories = ["Hardware", "Software", "Red", "Seguridad", "Otros"]
    localStorage.setItem("categories", JSON.stringify(categories))
  }

  // Si no hay prioridades, crear la lista por defecto
  if (!localStorage.getItem("priorities")) {
    const priorities = ["Baja", "Media", "Alta", "Crítica"]
    localStorage.setItem("priorities", JSON.stringify(priorities))
  }
}

// Alterna la visibilidad del input de contraseña en el formulario de login.
// Cambia el type entre "password" y "text" y actualiza el texto del control.
function togglePassword() {
  const passwordInput = document.getElementById("password")
  const toggleIcon = document.getElementById("toggleIcon")

  if (passwordInput.type === "password") {
    passwordInput.type = "text"
    toggleIcon.textContent = "Ocultar" // Indica que ahora puede ocultarse
  } else {
    passwordInput.type = "password"
    toggleIcon.textContent = "Ver" // Indica que ahora puede verse
  }
}

// Maneja el envío del formulario de login.
// Valida credenciales contra demoUsers, guarda currentUser en localStorage y redirige según rol.
function handleLogin(event) {
  event.preventDefault() // Evita recarga de página al enviar el formulario

  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  // Verificar credenciales contra el objeto demoUsers
  if (demoUsers[email] && demoUsers[email].password === password) {
    const user = demoUsers[email]
    // Guardar usuario actual en localStorage para sesiones simuladas
    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        email: email,
        role: user.role,
        name: user.name,
      }),
    )

    // Redirigir a la vista correspondiente según el rol del usuario
    switch (user.role) {
      case "usuario":
        window.location.href = "usuario.html"
        break
      case "tecnico":
        window.location.href = "tecnico.html"
        break
      case "admin":
        window.location.href = "admin.html"
        break
    }
  } else {
    // Credenciales incorrectas: mensaje para el usuario
    alert("Credenciales incorrectas. Usa las cuentas de demostración.")
  }
}

// Cierra la sesión removiendo currentUser de localStorage y vuelve al index.
function logout() {
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
}

// Verifica si hay un usuario autenticado en localStorage.
// Si no hay usuario, redirige a index y devuelve null.
// Si hay usuario, devuelve el objeto parseado.
function checkAuth() {
  const currentUser = localStorage.getItem("currentUser")
  if (!currentUser) {
    window.location.href = "index.html"
    return null
  }
  return JSON.parse(currentUser)
}

// Genera un ID único para un nuevo ticket.
// Lee todos los tickets, toma el máximo id existente y devuelve +1.
// Si no hay tickets retorna 1.
function generateTicketId() {
  const tickets = JSON.parse(localStorage.getItem("tickets") || "[]")
  return tickets.length > 0 ? Math.max(...tickets.map((t) => t.id)) + 1 : 1
}

// Devuelve el arreglo de tickets guardado en localStorage.
// Si no existe, retorna un arreglo vacío.
function getTickets() {
  return JSON.parse(localStorage.getItem("tickets") || "[]")
}

// Guarda el arreglo de tickets en localStorage (serializado como JSON).
function saveTickets(tickets) {
  localStorage.setItem("tickets", JSON.stringify(tickets))
}

// Devuelve el arreglo de categorías desde localStorage (o vacío si no hay).
function getCategories() {
  return JSON.parse(localStorage.getItem("categories") || "[]")
}

// Guarda las categorías en localStorage.
function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories))
}

// Devuelve la lista de prioridades desde localStorage (o vacío si no hay).
function getPriorities() {
  return JSON.parse(localStorage.getItem("priorities") || "[]")
}

// Guarda las prioridades en localStorage.
function savePriorities(priorities) {
  localStorage.setItem("priorities", JSON.stringify(priorities))
}

// Inicialización al cargar el DOM:
// - Asegura que existan datos demo en localStorage.
// - Si la página tiene formulario de login, asocia el handler.
// Esto mantiene la app lista para usarse sin backend.
document.addEventListener("DOMContentLoaded", () => {
  initializeData()

  // Si la plantilla actual contiene el formulario de login, conectar la función handleLogin.
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }
})
