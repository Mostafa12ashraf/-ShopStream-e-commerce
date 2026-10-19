import { createSlice } from '@reduxjs/toolkit'

// Safely load cart items from localStorage
function loadCartFromStorage() {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return []
    const data = window.localStorage.getItem('cartItems')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

// Safely write cart items to localStorage
function saveCartToStorage(items) {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('cartItems', JSON.stringify(items))
    }
  } catch {
    // Ignore storage write errors
  }
}

const initialState = {
  items: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload
      const existing = state.items.find((item) => item.id === product.id)
      const maxStock = product.stock || 99

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxStock)
      } else {
        state.items.push({
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          stock: product.stock,
          brand: product.brand || '',
          category: product.category || '',
          discountPercentage: product.discountPercentage || 0,
          quantity: Math.min(quantity, maxStock),
        })
      }
      saveCartToStorage(state.items)
    },

    increaseQuantity: (state, action) => {
      const id = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item) {
        const maxStock = item.stock || 99
        if (item.quantity < maxStock) {
          item.quantity += 1
          saveCartToStorage(state.items)
        }
      }
    },

    decreaseQuantity: (state, action) => {
      const id = action.payload
      const item = state.items.find((i) => i.id === id)
      if (item && item.quantity > 1) {
        item.quantity -= 1
        saveCartToStorage(state.items)
      }
    },

    removeFromCart: (state, action) => {
      const id = action.payload
      state.items = state.items.filter((item) => item.id !== id)
      saveCartToStorage(state.items)
    },

    clearCart: (state) => {
      state.items = []
      saveCartToStorage(state.items)
    },
  },
})

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions

export default cartSlice.reducer
