// Frontend PowerSport: comportamiento del menú y consumo de la API REST.
// En desarrollo, la API corre en http://localhost:3000.
const API_URL = "http://localhost:3000/api/products";

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector("#main-nav");

menuButton?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

nav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
        menuButton?.setAttribute("aria-label", "Abrir menú");
    });
});

const grids = {
    proteina: document.querySelector("#protein-grid"),
    creatina: document.querySelector("#creatine-grid"),
    preentreno: document.querySelector("#preworkout-grid")
};
const statusMessage = document.querySelector("#api-status");

function formatPrice(price) {
    return new Intl.NumberFormat("es-CO", {
        style: "currency", currency: "COP", maximumFractionDigits: 0
    }).format(price);
}

function createProductCard(product) {
    const article = document.createElement("article");
    article.className = "product-card";

    const imageBox = document.createElement("div");
    imageBox.className = "product-image";
    const image = document.createElement("img");
    image.src = product.image || "assets/img/productos/imagen-pendiente.jpg";
    image.alt = product.name;
    image.loading = "lazy";
    image.addEventListener("error", () => {
        image.remove();
        const placeholder = document.createElement("p");
        placeholder.className = "image-placeholder";
        placeholder.textContent = "Imagen próximamente";
        imageBox.appendChild(placeholder);
    }, { once: true });
    imageBox.appendChild(image);

    const info = document.createElement("div");
    info.className = "product-info";
    const brand = document.createElement("span");
    brand.className = "brand";
    brand.textContent = product.brand;
    const title = document.createElement("h3");
    title.textContent = product.name;
    const description = document.createElement("p");
    description.className = "description";
    description.textContent = product.description;
    const price = document.createElement("p");
    price.className = "price";
    price.textContent = formatPrice(product.price);
    const stock = document.createElement("p");
    stock.className = "stock";
    stock.textContent = product.stock > 0 ? `Disponible: ${product.stock}` : "Agotado";
    const button = document.createElement("button");
    button.className = "buy-button";
    button.type = "button";
    button.textContent = "Ver producto";
    button.addEventListener("click", () => {
        window.alert(`${product.name}\nMarca: ${product.brand}\nPrecio de demostración: ${formatPrice(product.price)}`);
    });

    info.append(brand, title, description, price, stock, button);
    article.append(imageBox, info);
    return article;
}

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`La API respondió con estado ${response.status}`);
        const products = await response.json();

        Object.values(grids).forEach((grid) => { if (grid) grid.replaceChildren(); });
        products.forEach((product) => {
            const grid = grids[product.category];
            if (grid) grid.appendChild(createProductCard(product));
        });
        statusMessage.textContent = products.length
            ? `Mostrando ${products.length} productos del catálogo.`
            : "Todavía no hay productos registrados.";
        statusMessage.classList.remove("error");
    } catch (error) {
        console.error("No fue posible cargar el catálogo:", error);
        statusMessage.textContent = "No se pudo conectar con la API. Comprueba que el backend esté iniciado en http://localhost:3000.";
        statusMessage.classList.add("error");
        Object.values(grids).forEach((grid) => {
            if (grid) grid.innerHTML = '<p class="description">Catálogo no disponible en este momento.</p>';
        });
    }
}

loadProducts();
