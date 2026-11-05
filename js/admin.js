const loginSection = document.querySelector("#login-section");
const panelSection = document.querySelector("#panel-section");
const loginForm = document.querySelector("#login-form");
const loginStatus = document.querySelector("#login-status");
const panelStatus = document.querySelector("#panel-status");
const logoutButton = document.querySelector("#logout-button");
const messagesList = document.querySelector("#messages-list");
const stockList = document.querySelector("#stock-list");

// ---------- Guardar el token ----------
function getToken() {
    try { return sessionStorage.getItem("ps_token"); } catch { return null; }
}
function saveToken(token) {
    try { sessionStorage.setItem("ps_token", token); } catch { /* sin almacenamiento */ }
}
function clearToken() {
    try { sessionStorage.removeItem("ps_token"); } catch { /* sin almacenamiento */ }
}

function showStatus(element, text, isError) {
    element.textContent = text;
    element.classList.toggle("error", isError);
}

// ---------- Mostrar u ocultar el panel ----------
function showPanel(isLoggedIn) {
    loginSection.hidden = isLoggedIn;
    panelSection.hidden = !isLoggedIn;
    logoutButton.hidden = !isLoggedIn;
}

function logout(message = "") {
    clearToken();
    showPanel(false);
    showStatus(loginStatus, message, Boolean(message));
}

// ---------- Petición a la API enviando el token ----------
async function apiFetch(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`
        }
    });
    const data = await response.json();

    if (response.status === 401) {
        logout("Tu sesión terminó. Ingresa de nuevo.");
        throw new Error("No autorizado");
    }
    if (!response.ok) throw new Error(data.error || "Error en la petición.");
    return data;
}

// ---------- Dibujar los mensajes ----------
function renderMessages(messages) {
    if (!messages.length) {
        const empty = document.createElement("p");
        empty.textContent = "Aún no hay mensajes.";
        messagesList.replaceChildren(empty);
        return;
    }

    messagesList.replaceChildren(...messages.map((m) => {
        const item = document.createElement("article");
        item.className = "admin-item";

        const title = document.createElement("h3");
        title.textContent = `${m.name} · ${m.email}`;

        const date = document.createElement("p");
        date.className = "admin-date";
        date.textContent = new Date(m.createdAt).toLocaleString("es-CO");

        const text = document.createElement("p");
        text.textContent = m.message;

        item.append(title, date, text);
        return item;
    }));
}

// ---------- Dibujar el inventario ----------
function renderStock(products) {
    stockList.replaceChildren(...products.map((product) => {
        const item = document.createElement("div");
        item.className = "admin-item admin-stock";

        const name = document.createElement("span");
        name.textContent = `${product.name} (${product.brand})`;

        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.step = "1";
        input.value = product.stock;
        input.setAttribute("aria-label", `Stock de ${product.name}`);

        const button = document.createElement("button");
        button.type = "button";
        button.className = "buy-button";
        button.textContent = "Guardar";
        button.addEventListener("click", async () => {
            try {
                await apiFetch(`/api/admin/products/${product._id}/stock`, {
                    method: "PATCH",
                    body: JSON.stringify({ stock: Number(input.value) })
                });
                showStatus(panelStatus, `Stock de "${product.name}" actualizado.`, false);
            } catch (error) {
                if (error.message !== "No autorizado") showStatus(panelStatus, error.message, true);
            }
        });

        item.append(name, input, button);
        return item;
    }));
}

// ---------- Cargar el panel ----------
async function loadPanel() {
    try {
        const [messages, products] = await Promise.all([
            apiFetch("/api/admin/messages"),
            fetch(`${API_BASE}/api/products`).then((response) => response.json())
        ]);
        showPanel(true);
        showStatus(panelStatus, "", false);
        renderMessages(messages);
        renderStock(products);
    } catch (error) {
        if (error.message !== "No autorizado") {
            showStatus(panelStatus, "No se pudo cargar el panel. ¿Está encendido el backend?", true);
        }
    }
}

// ---------- Eventos ----------
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
        const response = await fetch(`${API_BASE}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(Object.fromEntries(new FormData(loginForm)))
        });
        const data = await response.json();

        if (!response.ok) {
            showStatus(loginStatus, data.error || "No se pudo iniciar sesión.", true);
            return;
        }

        saveToken(data.token);
        loginForm.reset();
        showStatus(loginStatus, "", false);
        loadPanel();
    } catch (error) {
        console.error(error);
        showStatus(loginStatus, "No se pudo conectar con la API. ¿Está encendido el backend?", true);
    }
});

logoutButton.addEventListener("click", () => logout());

if (getToken()) loadPanel();