// utils.js - Utility functions for the StyledByAsmee website

// This file provides utility functions that are used across the website,
// such as product processing and cart management.

// Product data (This should ideally come from an API or database)
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

// Generate temporary placeholder images with labels for our product images
function generatePlaceholderImage(id, name) {
  const colors = ["d3a17e", "2c3e50", "7f8c8d", "34495e", "1e3a8a"]
  const colorIndex = id % colors.length
  const backgroundColor = colors[colorIndex]

  // Return a placeholder SVG that looks like a product image
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23${backgroundColor}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='24' fill='white' text-anchor='middle' dominant-baseline='middle'%3E${name}%3C/text%3E%3C/svg%3E`
}

// Process products to use placeholder images
function processProducts() {
  return products.map((product) => {
    // For this example, we're using placeholder SVGs instead of actual images
    const placeholderImage = generatePlaceholderImage(product.id, product.name)
    return {
      ...product,
      image: placeholderImage,
    }
  })
}

// Dummy function for addToCart
function addToCart(product, size, color, name, phone, address) {
  console.log("Adding to cart:", product, size, color, name, phone, address)
}

// Make functions globally available
window.processProducts = processProducts
window.addToCart = addToCart
