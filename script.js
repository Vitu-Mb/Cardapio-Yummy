const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cancelOrderBtn = document.getElementById("cancel-order-btn")
const cartCounter = document.getElementById("cart-count")
const orderOwnerInput = document.getElementById("owner")
const orderWarn = document.getElementById("order-warn")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

// Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex"
})

// fechar o modal do carrinho
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal)
        cartModal.style.display = "none"
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)

        //Adicionar item ao carrinho
    }
})

//Função para incluir item no carrinho
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    //Incrementa o item ao inves de duplicar
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
    updateCartModal();
}

//Atualiza o carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>  
                <p class= "font-medium">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class= "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
             </button>   

        </div>`

        total += item.price * item.quantity;


        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    cartCounter.innerHTML = cart.length;
}

//Função para remover items
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }

})

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


//Alerta de nome vazio
orderOwnerInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (this.inputValue !== "") {
        orderOwnerInput.classList.remove("border-red-500")
        orderWarn.classList.add("hidden")
    }
})

// Alerta de endereço vazio
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;
    if (this.inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {

    const isOpen = checkRestaurantOpen();
    if (!isOpen) {
        Toastify({
            text: "Lanchonete fechada no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#FF0000",
            },
        }).showToast();
        return;
    }

    if (cart.lenght === 0) {
        return;
    }

       if (orderOwnerInput.value === "") {
        orderWarn.classList.remove("hidden")
        orderOwnerInput.classList.add("border-red-500")
        return;
    } 

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    } 

    if (cart.length ===0 || orderOwnerInput.value === "" || addressInput.value === ""){
        return;
    }


    //Enviar para api do whatsapp
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "000000000"

    window.open(`https://wa.me/${phone}?text=${message} Endereço ${addressInput.value}`, "_blank")

    cart = [];
})

// Fechar carrinho e limpar carrinho
cancelOrderBtn.addEventListener("click", function (event) {
    if (event.target === cancelOrderBtn)
        cartModal.style.display = "none"
    cart = [];
    updateCartModal();
})


//verificação de restaurante aberto
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 17 && hora < 24;
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-700")
    spanItem.classList.add("bg-yellow-700")
} else {
    spanItem.classList.remove("bg-yellow-700")
    spanItem.classList.add("bg-red-700")
}
