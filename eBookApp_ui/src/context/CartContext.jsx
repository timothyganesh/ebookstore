import { createContext, useContext, useState, useEffect, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = sessionStorage.getItem('eBook_cart')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [isCartOpen, setIsCartOpen] = useState(false)

  useEffect(() => {
    try {
      sessionStorage.setItem('eBook_cart', JSON.stringify(cartItems))
    } catch (e) {
      console.error('Failed to save cart to storage:', e)
    }
  }, [cartItems])

  const addToCart = (book) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.id === book.id)
      if (existingIndex > -1) {
        const updated = [...prevItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        }
        return updated
      } else {
        return [
          ...prevItems,
          {
            id: book.id,
            title: book.title,
            author: book.author,
            price: book.price,
            numericPrice: parseFloat(String(book.price).replace(/[^0-9.]/g, '')) || 0,
            coverImage: book.coverImage,
            category: book.category,
            quantity: 1,
          },
        ]
      }
    })
  }

  const removeFromCart = (bookId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== bookId))
  }

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(bookId)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId ? { ...item, quantity: newQuantity } : item,
      ),
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const totalItems = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0)
  }, [cartItems])

  const totalAmount = useMemo(() => {
    const rawTotal = cartItems.reduce((acc, item) => {
      const price = item.numericPrice || parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0
      return acc + price * item.quantity
    }, 0)
    return rawTotal.toFixed(2)
  }, [cartItems])

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
