import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import BookList from './components/BookList.jsx'
import BookDetails from './components/BookDetails.jsx'
import Cart from './components/Cart.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { BooksProvider } from './context/BooksContext.jsx'
import './App.css'

function ProtectedRoute({ children }) {
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true'
  if (!isAuth) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true'
  })

  const handleLoginSuccess = () => {
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
  }

  return (
    <BooksProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/books" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/books"
            element={
              <ProtectedRoute>
                <BookList onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/books/:id"
            element={
              <ProtectedRoute>
                <BookDetails onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? '/books' : '/login'} replace />}
          />
        </Routes>
        <Cart />
      </BrowserRouter>
    </CartProvider>
    </BooksProvider>
  )
}
