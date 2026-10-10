const telefonoWhatsApp = '51973023044';

function mostrarSeccion(idSeccion, event) {
    if (event) event.preventDefault();

    const secciones = document.querySelectorAll('.content-section');
    secciones.forEach(sec => sec.classList.remove('active-section'));

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(l => l.classList.remove('active'));

    const seccionActual = document.getElementById(idSeccion);
    if (seccionActual) {
        seccionActual.classList.add('active-section');
    }

    if (event && event.target && event.target.tagName === 'A') {
        event.target.classList.add('active');
    }
}

const productos = [
    { id: 1, name: "Galletas Oreo Original", price: 1.50, category: "snacks" },
    { id: 2, name: "Papas Lays Clásica 45g", price: 2.00, category: "snacks" },
    { id: 3, name: "Chocolate Sublime 30g", price: 3.50, category: "snacks" },
    { id: 4, name: "Gaseosa Inca Kola 500ml", price: 2.50, category: "bebidas" },
    { id: 5, name: "Agua San Mateo 600ml", price: 2.00, category: "bebidas" },
    { id: 6, name: "Leche Evaporada Gloria", price: 4.50, category: "abarrotes" },
    { id: 7, name: "Atún Florida 170g", price: 5.50, category: "abarrotes" },
    { id: 8, name: "Arroz Extra Costeño 1kg", price: 5.20, category: "abarrotes" }
];

let carrito = {};
productos.forEach(p => carrito[p.id] = { ...p, quantity: 0 });

function renderProductos(categoria = 'todos') {
    const list = document.getElementById('product-list');
    list.innerHTML = '';

    const filtrados = categoria === 'todos' ? productos : productos.filter(p => p.category === categoria);

    filtrados.forEach(prod => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-info">
                <h3>${prod.name}</h3>
                <div class="price">S/ ${prod.price.toFixed(2)}</div>
            </div>
            <div class="card-controls" data-id="${prod.id}">
                <button onclick="cambiarCantidad(${prod.id}, -1)">-</button>
                <span class="qty">${carrito[prod.id].quantity}</span>
                <button onclick="cambiarCantidad(${prod.id}, 1)">+</button>
            </div>
        `;
        list.appendChild(card);
    });
}

function cambiarCantidad(id, cambio) {
    if (carrito[id].quantity + cambio >= 0) {
        carrito[id].quantity += cambio;
        actualizarTotales();
        renderProductos(document.querySelector('.cat-btn.active').dataset.cat);
    }
}

function actualizarTotales() {
    let totalItems = 0;
    let totalPrecio = 0;

    Object.values(carrito).forEach(item => {
        totalItems += item.quantity;
        totalPrecio += item.quantity * item.price;
    });

    document.getElementById('header-count').textContent = totalItems;
    document.getElementById('header-total').textContent = totalPrecio.toFixed(2);
}

document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderProductos(e.target.dataset.cat);
    });
});

document.getElementById('checkout-whatsapp').addEventListener('click', () => {
    let mensaje = "Hola, deseo hacer el siguiente pedido:%0A";
    let totalGeneral = 0;
    let hayItems = false;

    Object.values(carrito).forEach(item => {
        if (item.quantity > 0) {
            hayItems = true;
            const subtotal = item.quantity * item.price;
            totalGeneral += subtotal;
            mensaje += `- ${item.quantity}x ${item.name} (S/ ${subtotal.toFixed(2)})%0A`;
        }
    });

    if (!hayItems) {
        alert("Tu carrito está vacío.");
        return;
    }

    mensaje += `%0ATotal a pagar: S/ ${totalGeneral.toFixed(2)}`;
    window.open(`https://api.whatsapp.com/send/?phone=${telefonoWhatsApp}&text=${mensaje}`, '_blank');
});

renderProductos();