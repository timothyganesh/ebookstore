import { createContext, useContext, useState, useEffect } from 'react'
import { booksData } from '../data/books.js'

const STORAGE_KEY = 'eBook_books'

const BooksContext = createContext(null)

export function BooksProvider({ children }) {
  const [books, setBooks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {
      // fall through to seed data
    }
    return booksData
  })

  useEffect(() => {
    try {
      // Only persist the non-asset fields — coverImage for seeded books is an
      // imported asset URL (blob/data) that survives the session fine, and for
      // user-added books it is already a plain https:// URL string.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(books))
    } catch (e) {
      console.error('Failed to persist books to localStorage:', e)
    }
  }, [books])

  const addBook = (newBook) => {
    setBooks((prev) => [newBook, ...prev])
  }

  return (
    <BooksContext.Provider value={{ books, addBook }}>
      {children}
    </BooksContext.Provider>
  )
}

export function useBooks() {
  const context = useContext(BooksContext)
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider')
  }
  return context
}
