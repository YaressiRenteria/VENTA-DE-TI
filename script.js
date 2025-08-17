// Variables globales
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];

// Productos de TI
const products = [
    {
        id: 1,
        name: "Laptop Gaming ROG",
        price: 1299,
        description: "Laptop gaming de alta gama con RTX 4060",
        image: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aeec8c6e-edd5-4b02-a1aa-fe8c0e4d7e91.png",
        alt: "High-end gaming laptop with RGB keyboard backlight, sleek black design, and modern screen displaying gaming interface"
    },
    {
        id: 2,
        name: "Monitor 4K 27\"",
        price: 399,
        description: "Monitor profesional 4K con HDR",
        image: "/mini.jpg",
        alt: "Professional 27-inch 4K monitor with thin bezels displaying vibrant colors and crisp resolution on a modern desk setup"
    },
    {
        id: 3,
        name: "Teclado Mecánico RGB",
        price: 149,
        description: "Teclado mecánico para gaming con switches Cherry MX",
        image: "/teclado.jpg",
        alt: "Mechanical gaming keyboard with colorful RGB lighting, black frame, and Cherry MX key switches visible"
    },
    {
        id: 4,
        name: "Mouse Gaming Wireless",
        price: 89,
        description: "Mouse inalámbrico de alta precisión",
        image: "/m2.jpg",
        alt: "Wireless gaming mouse with ergonomic design, LED lighting accents, and precision sensor visible on gaming mousepad"
    },
    {
        id: 5,
        name: "SSD NVMe 1TB",
        price: 159,
        description: "Disco sólido NVMe de alta velocidad",
        image: "/ssd2.png",
        alt: "High-speed NVMe SSD drive with heat spreader, metallic finish, and performance specifications label clearly visible"
    },
    {
        id: 6,
        name: "Tarjeta Gráfica RTX 4070",
        price: 599,
        description: "GPU de última generación para gaming",
        image: "tarjeta.jpg",
        alt: "NVIDIA RTX 4070 graphics card with dual-fan cooling system, metallic backplate, and RGB lighting elements"
    }
];

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartUI();
    updateUserUI();
    setupEventListeners();
});

// Cargar productos en el catálogo
function loadProducts() {
    const productGrid = document.getElementById('productGrid');
    productGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300';
        productCard.innerHTML = `
            <div class="relative">
                <img src="${product.image}" alt="${product.alt}" class="w-full h-48 object-cover"/>
                <div class="absolute top-4 right-4">
                    <button onclick="addToCart(${product.id})" class="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
            <div class="p-6">
                <h4 class="text-xl font-semibold mb-2">${product.name}</h4>
                <p class="text-gray-600 mb-4">${product.description}</p>
                <div class="flex justify-between items-center">
                    <span class="text-2xl font-bold text-purple-600">$${product.price}</span>
                    <button onclick="addToCart(${product.id})" class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition">
                        Agregar
                    </button>
                </div>
            </div>
        `;
        productGrid.appendChild(productCard);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Modal de login
    document.getElementById('loginBtn').addEventListener('click', () => {
        document.getElementById('loginModal').classList.remove('hidden');
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('loginModal').classList.add('hidden');
    });

    // Cambiar entre login y registro
    document.getElementById('showRegister').addEventListener('click', () => {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('registerForm').classList.remove('hidden');
    });

    document.getElementById('showLogin').addEventListener('click', () => {
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    });

    // Forms
    document.getElementById('loginFormElement').addEventListener('submit', handleLogin);
    document.getElementById('registerFormElement').addEventListener('submit', handleRegister);

    // Carrito
    document.getElementById('cartBtn').addEventListener('click', () => {
        document.getElementById('cartModal').classList.remove('hidden');
        loadCartItems();
    });

    document.getElementById('closeCartModal').addEventListener('click', () => {
        document.getElementById('cartModal').classList.add('hidden');
    });

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', handleCheckout);
    
    // Payment modals
    document.getElementById('closeCheckoutModal').addEventListener('click', () => {
        document.getElementById('checkoutModal').classList.add('hidden');
    });

    document.getElementById('cardPayment').addEventListener('click', () => {
        document.getElementById('checkoutModal').classList.add('hidden');
        document.getElementById('cardPaymentModal').classList.remove('hidden');
    });

    document.getElementById('cashPayment').addEventListener('click', () => {
        document.getElementById('checkoutModal').classList.add('hidden');
        document.getElementById('cashPaymentModal').classList.remove('hidden');
        generateBarcode();
    });

    document.getElementById('closeCardModal').addEventListener('click', () => {
        document.getElementById('cardPaymentModal').classList.add('hidden');
    });

    document.getElementById('closeCashModal').addEventListener('click', () => {
        document.getElementById('cashPaymentModal').classList.add('hidden');
    });

    document.getElementById('cardForm').addEventListener('submit', handleCardPayment);
    document.getElementById('confirmCashPayment').addEventListener('click', handleCashPayment);

    document.getElementById('closeConfirmation').addEventListener('click', () => {
        document.getElementById('confirmationModal').classList.add('hidden');
    });
}

// Manejar login
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        document.getElementById('loginModal').classList.add('hidden');
        updateUserUI();
        alert('¡Bienvenido de vuelta!');
    } else {
        alert('Credenciales incorrectas');
    }
}

// Manejar registro
function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const address = document.getElementById('registerAddress').value;
    const password = document.getElementById('registerPassword').value;

    if (users.find(u => u.email === email)) {
        alert('El email ya está registrado');
        return;
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        address,
        password
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    document.getElementById('loginModal').classList.add('hidden');
    updateUserUI();
    alert('¡Cuenta creada exitosamente!');
}

// Actualizar UI del usuario
function updateUserUI() {
    const loginBtn = document.getElementById('loginBtn');
    if (currentUser) {
        loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>${currentUser.name}`;
        loginBtn.onclick = () => {
            if (confirm('¿Deseas cerrar sesión?')) {
                currentUser = null;
                localStorage.removeItem('currentUser');
                updateUserUI();
            }
        };
    } else {
        loginBtn.innerHTML = `<i class="fas fa-user mr-2"></i>Iniciar Sesión`;
        loginBtn.onclick = () => {
            document.getElementById('loginModal').classList.remove('hidden');
        };
    }
}

// Agregar al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
    showNotification('Producto agregado al carrito');
}

// Actualizar UI del carrito
function updateCartUI() {
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.classList.remove('hidden');
    } else {
        cartBadge.classList.add('hidden');
    }
}

// Cargar items del carrito
function loadCartItems() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-center text-gray-500 py-8">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0';
        return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach(item => {
        total += item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'flex items-center justify-between border-b pb-4 mb-4';
        cartItem.innerHTML = `
            <div class="flex items-center space-x-4">
                <img src="${item.image}" alt="${item.alt}" class="w-16 h-16 object-cover rounded"/>
                <div>
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600">$${item.price}</p>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <button onclick="updateQuantity(${item.id}, -1)" class="bg-gray-200 px-2 py-1 rounded">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)" class="bg-gray-200 px-2 py-1 rounded">+</button>
                <button onclick="removeFromCart(${item.id})" class="text-red-500 ml-4">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total}`;
}

// Actualizar cantidad
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            loadCartItems();
            updateCartUI();
        }
    }
}

// Remover del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartUI();
}

// Manejar checkout
function handleCheckout() {
    if (!currentUser) {
        alert('Debes iniciar sesión para realizar una compra');
        document.getElementById('cartModal').classList.add('hidden');
        document.getElementById('loginModal').classList.remove('hidden');
        return;
    }

    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }

    document.getElementById('cartModal').classList.add('hidden');
    document.getElementById('checkoutModal').classList.remove('hidden');
}

// Generar código de barras
function generateBarcode() {
    const barcodeNumber = Math.floor(Math.random() * 9000000000000) + 1000000000000;
    document.getElementById('barcodeNumber').textContent = barcodeNumber;
}

// Manejar pago con tarjeta
function handleCardPayment(e) {
    e.preventDefault();
    
    // Simulación de procesamiento de pago
    setTimeout(() => {
        completePurchase();
        document.getElementById('cardPaymentModal').classList.add('hidden');
    }, 2000);
}

// Manejar pago en efectivo
function handleCashPayment() {
    completePurchase();
    document.getElementById('cashPaymentModal').classList.add('hidden');
}

// Completar compra
function completePurchase() {
    const order = {
        id: Date.now(),
        user: currentUser,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        date: new Date().toISOString(),
        status: 'confirmed'
    };

    // Guardar orden
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    // Enviar correo de confirmación (simulado)
    sendConfirmationEmail(order);

    // Limpiar carrito
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();

    // Mostrar confirmación
    document.getElementById('confirmationModal').classList.remove('hidden');
}

// Enviar correo de confirmación (simulado)
function sendConfirmationEmail(order) {
    console.log('Enviando correo de confirmación a:', currentUser.email);
    console.log('Detalles del pedido:', order);
    
    // En una aplicación real, aquí se enviaría el correo
    const emailContent = `
        Estimado/a ${currentUser.name},
        
        Gracias por tu compra en TechStore.
        
        Detalles del pedido #${order.id}:
        ${order.items.map(item => `- ${item.name} x${item.quantity} - $${item.price * item.quantity}`).join('\n')}
        
        Total: $${order.total}
        
        Tu pedido será enviado a: ${currentUser.address}
        
        Gracias por confiar en nosotros.
        
        Equipo TechStore
    `;
    
    alert('Correo de confirmación enviado a: ' + currentUser.email);
}

// Mostrar notificación
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Smooth scrolling para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
