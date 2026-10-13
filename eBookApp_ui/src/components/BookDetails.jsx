import { useState, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  Theme,
} from '@carbon/react'
import {
  ArrowLeft,
  Logout,
  StarFilled,
  Calendar,
  Document,
  Translate,
  Building,
  User,
  UserAvatarFilled,
  ShoppingCart,
  CheckmarkOutline,
} from '@carbon/icons-react'
import { useBooks } from '../context/BooksContext.jsx'
import { useCart } from '../context/CartContext.jsx'

export default function BookDetails({ onLogout }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { books } = useBooks()
  const { addToCart, totalItems, setIsCartOpen } = useCart()
  const [notification, setNotification] = useState(null)

  const book = useMemo(() => {
    return books.find((b) => b.id === id) || null
  }, [books, id])

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
    if (onLogout) {
      onLogout()
    }
    navigate('/login')
  }

  const handleAddToCart = () => {
    if (!book) return
    addToCart(book)
    setNotification(`"${book.title}" was added to your shopping cart!`)
  }

  if (!book) {
    return (
      <Theme theme="g10" className="book-page-wrapper">
        <Header aria-label="eBookStore Admin Platform">
          <HeaderName prefix="IBM">eBookStore</HeaderName>
          <HeaderGlobalBar>
            <div className="user-greeting">
              <span>Admin</span>
            </div>
            <HeaderGlobalAction
              aria-label="User Profile"
              tooltipAlignment="end"
            >
              <User size={20} />
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Shopping Cart"
              tooltipAlignment="end"
              onClick={() => setIsCartOpen(true)}
              className="cart-header-action"
            >
              <div className="cart-icon-container">
                <ShoppingCart size={20} />
                {totalItems > 0 && <span className="cart-badge-count">{totalItems}</span>}
              </div>
            </HeaderGlobalAction>
            <HeaderGlobalAction
              aria-label="Logout"
              tooltipAlignment="end"
              onClick={handleLogout}
            >
              <Logout size={20} />
            </HeaderGlobalAction>
          </HeaderGlobalBar>
        </Header>

        <Content className="book-content-container">
          <Tile className="not-found-tile">
            <h2>Book Not Found</h2>
            <p>The requested book with ID #{id} does not exist in the catalog.</p>
            <Button
              kind="primary"
              renderIcon={ArrowLeft}
              onClick={() => navigate('/books')}
              style={{ marginTop: '1.5rem' }}
            >
              Back to Online eBook Store
            </Button>
          </Tile>
        </Content>
      </Theme>
    )
  }

  return (
    <Theme theme="g10" className="book-page-wrapper">
      <Header aria-label="eBookStore Admin Platform">
        <HeaderName prefix="IBM">eBookStore</HeaderName>
        <HeaderGlobalBar>
          <div className="user-greeting">
            <span>Admin</span>
          </div>
          <HeaderGlobalAction
            aria-label="User Profile"
            tooltipAlignment="end"
          >
            <User size={20} />
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Shopping Cart"
            tooltipAlignment="end"
            onClick={() => setIsCartOpen(true)}
            className="cart-header-action"
          >
            <div className="cart-icon-container">
              <ShoppingCart size={20} />
              {totalItems > 0 && <span className="cart-badge-count">{totalItems}</span>}
            </div>
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Logout"
            tooltipAlignment="end"
            onClick={handleLogout}
          >
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <Content className="book-content-container">
        <div className="details-nav-section">
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem>
              <Link to="/books">Online eBook Store</Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>{book.title}</BreadcrumbItem>
          </Breadcrumb>

          <Button
            kind="ghost"
            size="sm"
            renderIcon={ArrowLeft}
            onClick={() => navigate('/books')}
            className="back-catalog-btn"
          >
            Back to Books List
          </Button>
        </div>

        {notification && (
          <InlineNotification
            kind="success"
            title="Cart Updated"
            subtitle={notification}
            lowContrast
            onClose={() => setNotification(null)}
            className="book-cart-notification"
            actions={
              <Button
                kind="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
              >
                View Cart ({totalItems})
              </Button>
            }
          />
        )}

        <Grid className="book-details-grid">
          <Column sm={4} md={3} lg={5} xlg={4}>
            <div className="book-cover-wrapper">
              <img
                src={book.coverImage}
                alt={book.title}
                className="book-detail-cover-img"
              />
              <div className="cover-status-badge">
                <Tag
                  type={book.status === 'Available' ? 'green' : 'red'}
                  size="md"
                >
                  {book.status}
                </Tag>
              </div>
            </div>
          </Column>

          <Column sm={4} md={5} lg={11} xlg={12}>
            <Tile className="book-detail-info-tile">
              <div className="detail-header-group">
                <Tag type="blue" size="sm">
                  {book.category}
                </Tag>
                <div className="detail-rating">
                  <StarFilled size={18} className="star-icon" />
                  <span>{book.rating} / 5.0</span>
                </div>
              </div>

              <h1 className="detail-book-title">{book.title}</h1>
              <p className="detail-book-author">By {book.author}</p>

              <div className="detail-price-box">
                <span className="detail-price-label">Price:</span>
                <span className="detail-price-val">{book.price}</span>
              </div>

              <div className="detail-description-section">
                <h3>Overview</h3>
                <p>{book.description}</p>
              </div>

              <div className="detail-meta-grid">
                <div className="meta-item">
                  <Building size={16} />
                  <div>
                    <span className="meta-label">Publisher</span>
                    <span className="meta-val">{book.publisher}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Calendar size={16} />
                  <div>
                    <span className="meta-label">Publication Year</span>
                    <span className="meta-val">{book.year}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Document size={16} />
                  <div>
                    <span className="meta-label">Pages</span>
                    <span className="meta-val">{book.pages} pages</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Translate size={16} />
                  <div>
                    <span className="meta-label">Language</span>
                    <span className="meta-val">{book.language}</span>
                  </div>
                </div>

                <div className="meta-item">
                  <Document size={16} />
                  <div>
                    <span className="meta-label">ISBN</span>
                    <span className="meta-val">{book.isbn}</span>
                  </div>
                </div>
              </div>

              <div className="detail-actions-row">
                <Button
                  kind="primary"
                  renderIcon={ShoppingCart}
                  size="md"
                  onClick={handleAddToCart}
                  className="add-to-cart-btn"
                >
                  Add to Cart
                </Button>
                <Button
                  kind="secondary"
                  size="md"
                  onClick={() => alert(`Downloaded sample preview for "${book.title}"`)}
                >
                  Preview Sample
                </Button>
              </div>
            </Tile>
          </Column>
        </Grid>
      </Content>
    </Theme>
  )
}
