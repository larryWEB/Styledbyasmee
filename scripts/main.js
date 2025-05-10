// Main JavaScript file - initializes and connects all components

// Global site configuration
const siteConfig = {
  siteName: "StyledByAsmee",
  currency: "USD",
  taxRate: 0.08,
  freeShippingThreshold: 100,
}

// DOM Elements
let elements = {}

// Declare showNotification function
function showNotification(message, type) {
  // Remove any existing notification
  const existingNotification = document.querySelector(".notification")
  if (existingNotification) {
    existingNotification.remove()
  }

  // Create new notification
  const notification = document.createElement("div")
  notification.className = "notification"
  notification.textContent = message

  if (type) {
    notification.classList.add(type)
  }

  // Append to body
  document.body.appendChild(notification)

  // Remove after 3 seconds
  setTimeout(() => {
    notification.remove()
  }, 3000)
}

// Declare openProductModal function
function openProductModal(productId) {
  const modalOverlay = document.getElementById("product-modal-overlay")
  const modalContent = document.getElementById("modal-content")
  const product = processProducts().find((p) => p.id === productId)

  if (!product) return

  // Populate modal content
  modalContent.innerHTML = `
        <div class="modal-product-images">
            <div class="modal-product-main-image" style="background-image: url('${product.image}')"></div>
        </div>
        <div class="modal-product-details">
            <h2 class="modal-product-title">${product.name}</h2>
            <div class="modal-product-price">$${product.price.toFixed(2)}</div>
            <p class="modal-product-description">${product.description}</p>
            
            <div class="product-options">
                <div class="option-group">
                    <label class="option-label">Size:</label>
                    <div class="size-options">
                        ${product.sizes
                          .map(
                            (size) => `
                            <div class="size-option" data-size="${size}">${size}</div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
                
                <div class="option-group">
                    <label class="option-label">Color:</label>
                    <div class="color-options">
                        ${product.colors
                          .map(
                            (color) => `
                            <div class="color-option" style="background-color: ${color}" data-color="${color}"></div>
                        `,
                          )
                          .join("")}
                    </div>
                </div>
            </div>
            
            <div class="delivery-form">
                <h3>Delivery Information</h3>
                <div class="form-group">
                    <label class="form-label" for="name">Full Name</label>
                    <input type="text" class="form-control" id="name" placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label class="form-label" for="phone">Phone Number</label>
                    <input type="tel" class="form-control" id="phone" placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label class="form-label" for="address">Delivery Address</label>
                    <textarea class="form-control" id="address" rows="3" placeholder="Enter your delivery address"></textarea>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn secondary-btn" id="modal-cancel">Cancel</button>
                <button class="btn primary-btn" id="add-to-cart-btn" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `

  // Show modal
  modalOverlay.classList.add("active")

  // Add event listeners
  const sizeOptions = modalContent.querySelectorAll(".size-option")
  sizeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      sizeOptions.forEach((opt) => opt.classList.remove("selected"))
      this.classList.add("selected")
    })
  })

  const colorOptions = modalContent.querySelectorAll(".color-option")
  colorOptions.forEach((option) => {
    option.addEventListener("click", function () {
      colorOptions.forEach((opt) => opt.classList.remove("selected"))
      this.classList.add("selected")
    })
  })

  // Cancel button event
  const cancelButton = document.getElementById("modal-cancel")
  cancelButton.addEventListener("click", closeProductModal)

  // Add to cart button event
  const addToCartButton = document.getElementById("add-to-cart-btn")
  addToCartButton.addEventListener("click", () => {
    // Get selected options
    const selectedSize =
      modalContent.querySelector(".size-option.selected")?.getAttribute("data-size") || product.sizes[0]
    const selectedColor =
      modalContent.querySelector(".color-option.selected")?.getAttribute("data-color") || product.colors[0]

    // Get delivery information
    const name = document.getElementById("name").value
    const phone = document.getElementById("phone").value
    const address = document.getElementById("address").value

    // Add to cart
    addToCart(product, selectedSize, selectedColor, name, phone, address)

    // Close modal and show success notification
    closeProductModal()
    showNotification(`${product.name} has been added to your cart!`)
  })
}

// Open cart item details modal
function openCartItemDetailsModal(cartItemId) {
  const modalOverlay = document.getElementById("product-modal-overlay")
  const modalContent = document.getElementById("modal-content")

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Find the cart item
  const cartItem = cart.find((item) => item.id === cartItemId)

  if (!cartItem) return

  // Find the product details
  const product = processProducts().find((p) => p.id === cartItem.productId)

  if (!product) return

  // Populate modal content with cart item details
  modalContent.innerHTML = `
        <div class="modal-product-images">
            <div class="modal-product-main-image" style="background-image: url('${cartItem.image}')"></div>
        </div>
        <div class="modal-product-details">
            <h2 class="modal-product-title">${cartItem.name}</h2>
            <div class="modal-product-price">$${cartItem.price.toFixed(2)}</div>
            <p class="modal-product-description">${product.description}</p>
            
            <div class="cart-item-details-info">
                <h3>Selected Options</h3>
                <div class="details-row">
                    <span class="details-label">Size:</span>
                    <span class="details-value">${cartItem.size}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Color:</span>
                    <span class="details-value color-swatch" style="background-color: ${cartItem.color}"></span>
                </div>
                <div class="details-row">
                    <span class="details-label">Quantity:</span>
                    <span class="details-value">${cartItem.quantity}</span>
                </div>
            </div>
            
            <div class="cart-item-delivery-info">
                <h3>Delivery Information</h3>
                <div class="details-row">
                    <span class="details-label">Name:</span>
                    <span class="details-value">${cartItem.delivery.name || "Not provided"}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Phone:</span>
                    <span class="details-value">${cartItem.delivery.phone || "Not provided"}</span>
                </div>
                <div class="details-row">
                    <span class="details-label">Address:</span>
                    <span class="details-value">${cartItem.delivery.address || "Not provided"}</span>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn secondary-btn" id="modal-cancel">Close</button>
                <button class="btn primary-btn" id="update-cart-item-btn" data-id="${cartItem.id}">Update Item</button>
                <button class="btn danger-btn" id="remove-cart-item-btn" data-id="${cartItem.id}">Remove from Cart</button>
            </div>
        </div>
    `

  // Show modal
  modalOverlay.classList.add("active")

  // Close button event
  const cancelButton = document.getElementById("modal-cancel")
  cancelButton.addEventListener("click", closeProductModal)

  // Update cart item button event
  const updateCartItemButton = document.getElementById("update-cart-item-btn")
  updateCartItemButton.addEventListener("click", () => {
    // For now, just close the modal
    // In a real implementation, you would open an edit form
    closeProductModal()
    showNotification("Update functionality would be implemented here")
  })

  // Remove from cart button event
  const removeCartItemButton = document.getElementById("remove-cart-item-btn")
  removeCartItemButton.addEventListener("click", () => {
    removeFromCart(cartItemId)
    closeProductModal()
    showNotification(`${cartItem.name} has been removed from your cart!`)
  })
}

// Initialize the site
function initSite() {
  // Cache frequently used elements
  cacheElements()

  // Setup event listeners
  setupEventListeners()

  // Setup animations and transitions
  setupAnimations()

  // Check for URL parameters (could be used for deep linking or sharing)
  handleURLParameters()

  console.log("StyledByAsmee website initialized successfully")
}

// Cache frequently used DOM elements
function cacheElements() {
  elements = {
    header: document.querySelector("header"),
    productGrid: document.getElementById("product-grid"),
    productFilters: document.querySelector(".product-filters"),
    cartToggle: document.getElementById("cart-toggle"),
    cartSidebar: document.getElementById("cart-sidebar"),
    cartItems: document.getElementById("cart-items"),
    chatbotContainer: document.getElementById("chatbot-container"),
    menuToggle: document.getElementById("menu-toggle"),
    navLinks: document.querySelector(".nav-links"),
    newsletterForm: document.querySelector(".newsletter-form"),
    modalOverlay: document.getElementById("product-modal-overlay"),
    productModal: document.getElementById("product-modal"),
  }
}

// Setup global event listeners
function setupEventListeners() {
  // Modal close button
  const modalCloseButton = document.getElementById("modal-close")
  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", closeProductModal)
  }

  // Close modal when clicking outside
  const modalOverlay = document.getElementById("product-modal-overlay")
  if (modalOverlay) {
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeProductModal()
      }
    })
  }

  // Filter buttons
  const filterButtons = document.querySelectorAll(".filter-btn")
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      this.classList.add("active")

      // Filter products
      const filterCategory = this.getAttribute("data-filter")
      loadProducts(filterCategory)
    })
  })

  // Mobile menu toggle
  const menuToggle = document.getElementById("menu-toggle")
  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      const navLinks = document.querySelector(".nav-links")
      navLinks.classList.toggle("active")
      document.body.classList.toggle("menu-open")

      // Create or remove overlay
      if (document.body.classList.contains("menu-open")) {
        const overlay = document.createElement("div")
        overlay.className = "menu-overlay"
        document.body.appendChild(overlay)

        // Add click event to close menu
        overlay.addEventListener("click", function () {
          navLinks.classList.remove("active")
          document.body.classList.remove("menu-open")
          this.remove()
        })
      } else {
        const overlay = document.querySelector(".menu-overlay")
        if (overlay) overlay.remove()
      }
    })
  }
  // Header scroll behavior
  window.addEventListener("scroll", handleHeaderScroll)

  // Newsletter form submission
  if (elements.newsletterForm) {
    elements.newsletterForm.addEventListener("submit", handleNewsletterSubmit)
  }

  // Window resize handling
  window.addEventListener("resize", handleWindowResize)

  // Escape key for closing modals and sidebars
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllOverlays()
    }
  })

  // Chatbot toggle
  const chatbotHeader = document.getElementById("chatbot-header")
  if (chatbotHeader) {
    chatbotHeader.addEventListener("click", () => {
      const chatbotContainer = document.getElementById("chatbot-container")
      chatbotContainer.classList.toggle("minimized")
    })
  }

  // Cart toggle
  const cartToggle = document.getElementById("cart-toggle")
  if (cartToggle) {
    cartToggle.addEventListener("click", () => {
      const cartSidebar = document.getElementById("cart-sidebar")
      cartSidebar.classList.toggle("active")

      // Update cart items when opening
      if (cartSidebar.classList.contains("active")) {
        updateCartItems()
      }
    })
  }

  // Cart close
  const cartClose = document.getElementById("cart-close")
  if (cartClose) {
    cartClose.addEventListener("click", () => {
      const cartSidebar = document.getElementById("cart-sidebar")
      cartSidebar.classList.remove("active")
    })
  }
}

// Handle header scroll behavior
function handleHeaderScroll() {
  if (window.scrollY > 50) {
    elements.header.classList.add("scrolled")
  } else {
    elements.header.classList.remove("scrolled")
  }
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
  e.preventDefault()

  // Get the email input
  const emailInput = e.target.querySelector('input[type="email"]')
  const email = emailInput.value.trim()

  // Validate email (simple validation)
  if (!email || !email.includes("@") || !email.includes(".")) {
    showNotification("Please enter a valid email address", "error")
    return
  }

  // Show success message (in a real app, this would send to a server)
  showNotification("Thank you for subscribing to our newsletter!", "success")

  // Clear the input
  emailInput.value = ""
}

// Handle window resize
function handleWindowResize() {
  // Check if mobile menu should be hidden on larger screens
  if (window.innerWidth > 768 && elements.navLinks.classList.contains("active")) {
    elements.navLinks.classList.remove("active")
    document.body.classList.remove("menu-open")

    const menuOverlay = document.querySelector(".menu-overlay")
    if (menuOverlay) {
      menuOverlay.remove()
    }
  }
}

// Close all overlays (modals, sidebars, etc.)
function closeAllOverlays() {
  // Close product modal
  const modalOverlay = document.getElementById("product-modal-overlay")
  if (modalOverlay) {
    modalOverlay.classList.remove("active")
  }

  // Close cart sidebar
  const cartSidebar = document.getElementById("cart-sidebar")
  if (cartSidebar) {
    cartSidebar.classList.remove("active")
  }

  // Close mobile menu
  const navLinks = document.querySelector(".nav-links")
  if (navLinks) {
    navLinks.classList.remove("active")
    document.body.classList.remove("menu-open")
  }

  const menuOverlay = document.querySelector(".menu-overlay")
  if (menuOverlay) {
    menuOverlay.remove()
  }
}

// Setup animations and transitions
function setupAnimations() {
  // Add page transition effect on load
  const transitionElement = document.createElement("div")
  transitionElement.className = "page-transition"
  document.body.appendChild(transitionElement)

  // Remove after animation completes
  setTimeout(() => {
    transitionElement.remove()
  }, 1500)

  // Add scroll animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll")
  if (animatedElements.length > 0) {
    window.addEventListener("scroll", () => {
      animatedElements.forEach((element) => {
        if (isElementInViewport(element)) {
          element.classList.add("visible")
        }
      })
    })

    // Trigger initial check
    window.dispatchEvent(new Event("scroll"))
  }
}

// Check if element is in viewport
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect()
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
    rect.left >= 0 &&
    rect.bottom >= 0 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

// Handle URL parameters for deep linking
function handleURLParameters() {
  const urlParams = new URLSearchParams(window.location.search)

  // Check for product ID parameter
  const productId = urlParams.get("product")
  if (productId) {
    // Open product modal for the specified product
    setTimeout(() => {
      openProductModal(Number.parseInt(productId))
    }, 1000)
  }

  // Check for category filter parameter
  const category = urlParams.get("category")
  if (category) {
    // Activate the corresponding filter
    const filterButton = document.querySelector(`.filter-btn[data-filter="${category}"]`)
    if (filterButton) {
      filterButton.click()
    }
  }
}

// Custom utility function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

// Product data
const products = [
  {
    id: 1,
    name: "Elegant Silk Blouse",
    category: "women",
    price: 89.99,
    description: "A luxurious silk blouse with a timeless design, perfect for both casual and formal occasions.",
    image: "/assets/images/product-1.jpg",
    colors: ["#ffffff", "#000000", "#d3a17e"],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: 2,
    name: "Tailored Wool Blazer",
    category: "women",
    price: 149.99,
    description:
      "A sophisticated wool blazer that adds refinement to any outfit. Features structured shoulders and a flattering cut.",
    image: "/assets/images/product-2.jpg",
    colors: ["#2c3e50", "#7f8c8d", "#34495e"],
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: 3,
    name: "High-Rise Slim Jeans",
    category: "women",
    price: 79.99,
    description: "Premium denim jeans with a high-rise waist and slim fit that flatters your silhouette.",
    image: "/assets/images/product-3.jpg",
    colors: ["#1e3a8a", "#000000", "#7f8c8d"],
    sizes: ["24", "25", "26", "27", "28", "29", "30", "31", "32"],
  },
  {
    id: 4,
    name: "Classic Cotton Shirt",
    category: "men",
    price: 69.99,
    description: "A versatile cotton shirt with a clean-cut design, perfect for the modern gentleman's wardrobe.",
    image: "/assets/images/product-4.jpg",
    colors: ["#ffffff", "#87CEEB", "#FFD700", "#F08080"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: 5,
    name: "Slim-Fit Chino Trousers",
    category: "men",
    price: 89.99,
    description:
      "Comfortable yet stylish chino trousers with a slim fit, ideal for both casual and smart-casual settings.",
    image: "/assets/images/product-5.jpg",
    colors: ["#2c3e50", "#7f8c8d", "#d3a17e", "#000000"],
    sizes: ["28", "30", "32", "34", "36", "38"],
  },
  {
    id: 6,
    name: "Leather Weekend Bag",
    category: "accessories",
    price: 199.99,
    description: "A handcrafted leather weekend bag that combines functionality with timeless elegance.",
    image: "/assets/images/product-6.jpg",
    colors: ["#582f0e", "#000000"],
    sizes: ["One Size"],
  },
  {
    id: 7,
    name: "Cashmere Knit Scarf",
    category: "accessories",
    price: 59.99,
    description: "A luxuriously soft cashmere scarf that adds a touch of warmth and sophistication to any outfit.",
    image: "/assets/images/product-7.jpg",
    colors: ["#d3a17e", "#2c3e50", "#7f8c8d", "#000000", "#ffffff"],
    sizes: ["One Size"],
  },
  {
    id: 8,
    name: "Merino Wool Sweater",
    category: "men",
    price: 119.99,
    description: "A premium merino wool sweater that offers exceptional warmth without bulk, perfect for layering.",
    image: "/assets/images/product-8.jpg",
    colors: ["#2c3e50", "#d3a17e", "#000000", "#7f8c8d"],
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
]

// Generate placeholder images
function generatePlaceholderImage(id, name) {
  const colors = ["d3a17e", "2c3e50", "7f8c8d", "34495e", "1e3a8a"]
  const colorIndex = id % colors.length
  const backgroundColor = colors[colorIndex]

  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23${backgroundColor}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${name}%3C/text%3E%3C/svg%3E`
}

// Process products to use placeholder images
function processProducts() {
  return products.map((product) => {
    const placeholderImage = generatePlaceholderImage(product.id, product.name)
    return {
      ...product,
      image: placeholderImage,
    }
  })
}

// Load products into the grid
function loadProducts(filterCategory = "all") {
  const productGrid = document.getElementById("product-grid")
  if (!productGrid) return

  productGrid.innerHTML = ""
  const processedProducts = processProducts()

  const filteredProducts =
    filterCategory === "all"
      ? processedProducts
      : processedProducts.filter((product) => product.category === filterCategory)

  filteredProducts.forEach((product) => {
    const productCard = document.createElement("div")
    productCard.className = "product-card"
    productCard.dataset.id = product.id

    productCard.innerHTML = `
            <div class="product-image" style="background-image: url('${product.image}')"></div>
            <div class="product-details">
                <div class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <p class="product-description">${product.description}</p>
                <button class="product-btn quick-view-btn" data-id="${product.id}">Quick View</button>
            </div>
        `

    productGrid.appendChild(productCard)
  })

  // Add event listeners to the quick view buttons
  const quickViewButtons = document.querySelectorAll(".quick-view-btn")
  quickViewButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const productId = Number.parseInt(this.getAttribute("data-id"))
      openProductModal(productId)
    })
  })
}

// Close product modal
function closeProductModal() {
  const modalOverlay = document.getElementById("product-modal-overlay")
  modalOverlay.classList.remove("active")
}

// Add message to chat
function addChatMessage(text, sender) {
  const messagesContainer = document.getElementById("chatbot-messages")
  if (!messagesContainer) return

  const messageElement = document.createElement("div")
  messageElement.className = `message ${sender}`
  messageElement.innerHTML = `<p>${text}</p>`

  messagesContainer.appendChild(messageElement)

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight
}

// Add to cart function
function addToCart(product, size, color, name, phone, address) {
  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Add new item
  cart.push({
    id: Date.now(),
    productId: product.id,
    name: product.name,
    price: product.price,
    image: product.image,
    size: size,
    color: color,
    quantity: 1,
    delivery: {
      name: name || "",
      phone: phone || "",
      address: address || "",
    },
  })

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Update cart items if cart is open
  const cartSidebar = document.getElementById("cart-sidebar")
  if (cartSidebar && cartSidebar.classList.contains("active")) {
    updateCartItems()
  }
}

// Remove from cart function
function removeFromCart(cartItemId) {
  // Get existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Filter out the item to remove
  cart = cart.filter((item) => item.id !== cartItemId)

  // Save to localStorage
  localStorage.setItem("cart", JSON.stringify(cart))

  // Update cart count
  updateCartCount()

  // Update cart items if cart is open
  const cartSidebar = document.getElementById("cart-sidebar")
  if (cartSidebar && cartSidebar.classList.contains("active")) {
    updateCartItems()
  }
}

// Update cart count
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (!cartCount) return

  const cart = JSON.parse(localStorage.getItem("cart")) || []
  cartCount.textContent = cart.length
}

// Update cart items in the sidebar
function updateCartItems() {
  const cartItemsContainer = document.getElementById("cart-items")
  if (!cartItemsContainer) return

  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem("cart")) || []

  // Clear container
  cartItemsContainer.innerHTML = ""

  // If cart is empty, show message
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<div class="empty-cart-message">Your cart is empty</div>'

    // Update total
    const cartTotalAmount = document.getElementById("cart-total-amount")
    if (cartTotalAmount) {
      cartTotalAmount.textContent = "$0.00"
    }

    return
  }

  // Calculate total
  let totalAmount = 0

  // Add each item to the cart
  cart.forEach((item) => {
    totalAmount += item.price * item.quantity

    const cartItemElement = document.createElement("div")
    cartItemElement.className = "cart-item"
    cartItemElement.innerHTML = `
      <div class="cart-item-image" style="background-image: url('${item.image}')"></div>
      <div class="cart-item-details">
        <h3 class="cart-item-title">${item.name}</h3>
        <div class="cart-item-options">
          Size: ${item.size} | Color: <span style="display: inline-block; width: 12px; height: 12px; background-color: ${item.color}; border-radius: 50%; margin-bottom: -1px;"></span>
        </div>
        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
        <div class="cart-item-actions">
          <button class="quantity-btn decrease-quantity" data-id="${item.id}">-</button>
          <span class="cart-item-quantity">${item.quantity}</span>
          <button class="quantity-btn increase-quantity" data-id="${item.id}">+</button>
          <button class="cart-item-remove" data-id="${item.id}">×</button>
        </div>
        <button class="btn secondary-btn view-details-btn" data-id="${item.id}">View Details</button>
      </div>
    `

    cartItemsContainer.appendChild(cartItemElement)
  })

  // Update total amount
  const cartTotalAmount = document.getElementById("cart-total-amount")
  if (cartTotalAmount) {
    cartTotalAmount.textContent = `$${totalAmount.toFixed(2)}`
  }

  // Add event listeners to cart item buttons

  // View details buttons
  const viewDetailsButtons = cartItemsContainer.querySelectorAll(".view-details-btn")
  viewDetailsButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItemId = Number.parseInt(this.getAttribute("data-id"))
      openCartItemDetailsModal(cartItemId)
    })
  })

  // Decrease quantity buttons
  const decreaseButtons = cartItemsContainer.querySelectorAll(".decrease-quantity")
  decreaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItemId = Number.parseInt(this.getAttribute("data-id"))
      updateCartItemQuantity(cartItemId, -1)
    })
  })

  // Increase quantity buttons
  const increaseButtons = cartItemsContainer.querySelectorAll(".increase-quantity")
  increaseButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItemId = Number.parseInt(this.getAttribute("data-id"))
      updateCartItemQuantity(cartItemId, 1)
    })
  })

  // Remove buttons
  const removeButtons = cartItemsContainer.querySelectorAll(".cart-item-remove")
  removeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const cartItemId = Number.parseInt(this.getAttribute("data-id"))
      removeFromCart(cartItemId)
    })
  })
}

// Update cart item quantity
function updateCartItemQuantity(cartItemId, change) {
  // Get existing cart from localStorage
  let cart = JSON.parse(localStorage.getItem("cart")) || []

  // Find the item
  const itemIndex = cart.findIndex((item) => item.id === cartItemId)

  if (itemIndex !== -1) {
    // Update quantity
    cart[itemIndex].quantity += change

    // Remove item if quantity is 0 or less
    if (cart[itemIndex].quantity <= 0) {
      cart = cart.filter((item) => item.id !== cartItemId)
    }

    // Save to localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Update cart count
    updateCartCount()

    // Update cart items
    updateCartItems()
  }
}

// Initialize site when document is ready
document.addEventListener("DOMContentLoaded", () => {
  // Initialize products
  loadProducts()

  // Update cart count
  updateCartCount()

  // Setup event listeners
  setupEventListeners()

  // Setup animations
  setupAnimations()
})
