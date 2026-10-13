import { useState, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarAction,
  Tag,
  Button,
  Grid,
  Column,
  Tile,
  Pagination,
  Theme,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  InlineNotification,
} from '@carbon/react'
import {
  Logout,
  Book,
  Catalog,
  Bookmark,
  Add,
  User,
  View,
  ShoppingCart,
  Image,
  Upload,
  TrashCan,
} from '@carbon/icons-react'
import { useBooks } from '../context/BooksContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const headers = [
  { key: 'cover', header: 'Cover' },
  { key: 'title', header: 'Book Title' },
  { key: 'author', header: 'Author' },
  { key: 'category', header: 'Category' },
  { key: 'isbn', header: 'ISBN' },
  { key: 'price', header: 'Price' },
  { key: 'rating', header: 'Rating' },
  { key: 'status', header: 'Status' },
  { key: 'action', header: 'Action' },
]

const CATEGORIES = [
  'Artificial Intelligence',
  'Generative AI',
  'Software Engineering',
  'Programming',
  'Leadership & Product',
  'Education & AI',
  'Data Science',
  'Cloud Computing',
  'Cybersecurity',
  'Other',
]

const EMPTY_FORM = {
  coverImageUrl: '',
  title: '',
  author: '',
  category: '',
  isbn: '',
  price: '',
  rating: '',
  status: 'Available',
  publisher: '',
  pages: '',
  language: 'English',
  year: '',
  description: '',
}

function validate(form) {
  const errors = {}
  if (!form.coverImageUrl.trim()) errors.coverImageUrl = 'Please upload a cover image.'
  if (!form.title.trim()) errors.title = 'Book title is required.'
  if (!form.author.trim()) errors.author = 'Author is required.'
  if (!form.category) errors.category = 'Please select a category.'
  if (!form.isbn.trim()) errors.isbn = 'ISBN is required.'
  if (!form.price.trim()) errors.price = 'Price is required.'
  if (!form.rating || isNaN(Number(form.rating)) || Number(form.rating) < 0 || Number(form.rating) > 5) {
    errors.rating = 'Rating must be a number between 0 and 5.'
  }
  if (!form.year.trim() || isNaN(Number(form.year))) errors.year = 'A valid year is required.'
  if (!form.description.trim()) errors.description = 'Description is required.'
  return errors
}

function AddBookModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitError('')
    setDragOver(false)
    onClose()
  }

  const set = (field) => (e) => {
    const value = e.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
  }

  const loadImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (e) => {
      setForm((prev) => ({ ...prev, coverImageUrl: e.target.result }))
      setErrors((prev) => { const next = { ...prev }; delete next.coverImageUrl; return next })
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    loadImageFile(e.target.files[0])
    // reset input so the same file can be re-selected after removal
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    loadImageFile(e.dataTransfer.files[0])
  }

  const handleRemoveImage = () => {
    setForm((prev) => ({ ...prev, coverImageUrl: '' }))
  }

  const handleSubmit = () => {
    const validationErrors = validate(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setSubmitError('Please fix the errors below before submitting.')
      return
    }
    setSubmitError('')
    const newBook = {
      id: String(Date.now()),
      title: form.title.trim(),
      author: form.author.trim(),
      category: form.category,
      isbn: form.isbn.trim(),
      price: form.price.trim().startsWith('$') ? form.price.trim() : `$${form.price.trim()}`,
      rating: parseFloat(form.rating).toFixed(1),
      status: form.status,
      coverImage: form.coverImageUrl.trim(),
      description: form.description.trim(),
      publisher: form.publisher.trim(),
      pages: form.pages ? Number(form.pages) : 0,
      language: form.language.trim() || 'English',
      year: form.year.trim(),
    }
    onAdd(newBook)
    setForm(EMPTY_FORM)
    setErrors({})
    onClose()
  }

  return (
    <Modal
      open={open}
      modalHeading="Add New Book"
      primaryButtonText="Add Book"
      secondaryButtonText="Cancel"
      onRequestSubmit={handleSubmit}
      onRequestClose={handleClose}
      onSecondarySubmit={handleClose}
      size="lg"
      className="add-book-modal"
    >
      <div className="add-book-modal-body">
        {submitError && (
          <InlineNotification
            kind="error"
            title="Validation Error"
            subtitle={submitError}
            hideCloseButton
            className="add-book-notification"
          />
        )}

        {/* Cover Image Section */}
        <div className="add-book-section-header">
          <Image size={16} />
          <span>Book Cover *</span>
        </div>
        <div className="add-book-cover-row">
          {/* Live preview thumbnail */}
          <div className="add-book-cover-preview">
            {form.coverImageUrl ? (
              <img
                src={form.coverImageUrl}
                alt="Cover preview"
                className="add-book-preview-img"
              />
            ) : (
              <div className="add-book-preview-placeholder">
                <Image size={32} />
                <span>Preview</span>
              </div>
            )}
          </div>

          {/* Upload drop-zone */}
          <div className="add-book-cover-input">
            <p className="add-book-upload-label">Cover Image *</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            {form.coverImageUrl ? (
              <div className="add-book-upload-selected">
                <div className="add-book-upload-selected-info">
                  <Image size={16} />
                  <span>Image uploaded successfully</span>
                </div>
                <Button
                  kind="ghost"
                  size="sm"
                  renderIcon={TrashCan}
                  iconDescription="Remove image"
                  onClick={handleRemoveImage}
                  className="add-book-remove-btn"
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div
                className={`add-book-dropzone${dragOver ? ' add-book-dropzone--active' : ''}${errors.coverImageUrl ? ' add-book-dropzone--error' : ''}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
                aria-label="Upload book cover image"
              >
                <Upload size={24} />
                <p className="add-book-dropzone-title">
                  Drag &amp; drop an image here, or <span className="add-book-dropzone-link">browse</span>
                </p>
                <p className="add-book-dropzone-hint">JPG, PNG, WebP — max 5 MB</p>
              </div>
            )}
            {errors.coverImageUrl && (
              <p className="add-book-upload-error">{errors.coverImageUrl}</p>
            )}
          </div>
        </div>

        {/* Book Details Section */}
        <div className="add-book-section-header add-book-section-header--details">
          <Book size={16} />
          <span>Book Details</span>
        </div>

        <div className="add-book-two-col">
          <TextInput
            id="title"
            labelText="Book Title *"
            placeholder="e.g. Mastering React"
            value={form.title}
            onChange={set('title')}
            invalid={!!errors.title}
            invalidText={errors.title}
          />
          <TextInput
            id="author"
            labelText="Author *"
            placeholder="e.g. Jane Doe"
            value={form.author}
            onChange={set('author')}
            invalid={!!errors.author}
            invalidText={errors.author}
          />
        </div>

        <div className="add-book-two-col">
          <Select
            id="category"
            labelText="Category *"
            value={form.category}
            onChange={set('category')}
            invalid={!!errors.category}
            invalidText={errors.category}
          >
            <SelectItem value="" text="Select a category..." />
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} text={cat} />
            ))}
          </Select>
          <Select
            id="status"
            labelText="Status"
            value={form.status}
            onChange={set('status')}
          >
            <SelectItem value="Available" text="Available" />
            <SelectItem value="Borrowed" text="Borrowed" />
          </Select>
        </div>

        <div className="add-book-two-col">
          <TextInput
            id="isbn"
            labelText="ISBN *"
            placeholder="e.g. 978-0000000000"
            value={form.isbn}
            onChange={set('isbn')}
            invalid={!!errors.isbn}
            invalidText={errors.isbn}
          />
          <TextInput
            id="price"
            labelText="Price *"
            placeholder="e.g. 29.99"
            value={form.price}
            onChange={set('price')}
            invalid={!!errors.price}
            invalidText={errors.price}
          />
        </div>

        <div className="add-book-two-col">
          <TextInput
            id="rating"
            labelText="Rating (0–5) *"
            placeholder="e.g. 4.5"
            value={form.rating}
            onChange={set('rating')}
            invalid={!!errors.rating}
            invalidText={errors.rating}
          />
          <TextInput
            id="year"
            labelText="Publication Year *"
            placeholder="e.g. 2024"
            value={form.year}
            onChange={set('year')}
            invalid={!!errors.year}
            invalidText={errors.year}
          />
        </div>

        <div className="add-book-two-col">
          <TextInput
            id="publisher"
            labelText="Publisher"
            placeholder="e.g. O'Reilly Media"
            value={form.publisher}
            onChange={set('publisher')}
          />
          <TextInput
            id="pages"
            labelText="Pages"
            placeholder="e.g. 320"
            value={form.pages}
            onChange={set('pages')}
          />
        </div>

        <div className="add-book-two-col">
          <TextInput
            id="language"
            labelText="Language"
            placeholder="e.g. English"
            value={form.language}
            onChange={set('language')}
          />
        </div>

        <TextArea
          id="description"
          labelText="Description *"
          placeholder="Brief description of the book..."
          rows={4}
          value={form.description}
          onChange={set('description')}
          invalid={!!errors.description}
          invalidText={errors.description}
        />
      </div>
    </Modal>
  )
}

export default function BookList({ onLogout }) {
  const navigate = useNavigate()
  const { books, addBook } = useBooks()
  const { totalItems, setIsCartOpen } = useCart()
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [addedBookTitle, setAddedBookTitle] = useState('')

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated')
    sessionStorage.removeItem('user')
    if (onLogout) {
      onLogout()
    }
    navigate('/login')
  }

  const handleAddBook = (newBook) => {
    addBook(newBook)
    setAddedBookTitle(newBook.title)
    setTimeout(() => setAddedBookTitle(''), 4000)
  }

  const tableRows = useMemo(() => {
    return books.map((b) => ({
      id: b.id,
      cover: b.coverImage,
      title: b.title,
      author: b.author,
      category: b.category,
      isbn: b.isbn,
      price: b.price,
      rating: b.rating,
      status: b.status,
      action: b.id,
    }))
  }, [books])

  const filteredRows = useMemo(() => {
    if (!searchTerm.trim()) return tableRows
    const term = searchTerm.toLowerCase()
    return tableRows.filter(
      (b) =>
        b.title.toLowerCase().includes(term) ||
        b.author.toLowerCase().includes(term) ||
        b.category.toLowerCase().includes(term) ||
        b.isbn.toLowerCase().includes(term),
    )
  }, [tableRows, searchTerm])

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    return filteredRows.slice(startIndex, startIndex + pageSize)
  }, [filteredRows, page, pageSize])

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  const stats = useMemo(() => {
    return {
      total: books.length,
      available: books.filter((b) => b.status === 'Available').length,
      borrowed: books.filter((b) => b.status === 'Borrowed').length,
    }
  }, [books])

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
        <Grid className="book-summary-grid">
          <Column sm={4} md={8} lg={16}>
            <div className="page-heading-section">
              <h1 className="page-heading-title">Online eBook Store</h1>
              <p className="page-heading-subtitle">
                Explore the complete collection of technology, AI, and software engineering eBooks.
              </p>
            </div>
          </Column>

          <Column sm={4} md={2} lg={4}>
            <Tile className="stat-tile">
              <div className="stat-icon-wrapper">
                <Catalog size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Total Books</span>
                <span className="stat-value">{stats.total}</span>
              </div>
            </Tile>
          </Column>

          <Column sm={4} md={2} lg={4}>
            <Tile className="stat-tile">
              <div className="stat-icon-wrapper available">
                <Book size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Available</span>
                <span className="stat-value">{stats.available}</span>
              </div>
            </Tile>
          </Column>

          <Column sm={4} md={2} lg={4}>
            <Tile className="stat-tile">
              <div className="stat-icon-wrapper borrowed">
                <Bookmark size={24} />
              </div>
              <div className="stat-info">
                <span className="stat-label">Checked Out</span>
                <span className="stat-value">{stats.borrowed}</span>
              </div>
            </Tile>
          </Column>
        </Grid>

        {addedBookTitle && (
          <InlineNotification
            kind="success"
            title="Book Added"
            subtitle={`"${addedBookTitle}" has been added to the catalog.`}
            onCloseButtonClick={() => setAddedBookTitle('')}
            className="add-book-success-notification"
          />
        )}

        <Grid className="book-table-grid">
          <Column sm={4} md={8} lg={16}>
            <DataTable
              key={`${filteredRows.length}-${filteredRows[0]?.id ?? ''}`}
              rows={paginatedRows}
              headers={headers}
            >
              {({
                rows,
                headers: tableHeaders,
                getHeaderProps,
                getRowProps,
                getTableProps,
                getTableContainerProps,
              }) => (
                <TableContainer
                  title="Digital eBook Directory"
                  description="Click on any Book Title or Cover to view complete details, preview samples, and explore metadata."
                  {...getTableContainerProps()}
                >
                  <TableToolbar>
                    <TableToolbarContent>
                      <TableToolbarSearch
                        persistent
                        placeholder="Search by title, author, category, or ISBN..."
                        onChange={(e) => handleSearchChange(e.target.value)}
                        value={searchTerm}
                      />
                      <TableToolbarMenu>
                        <TableToolbarAction onClick={() => handleSearchChange('')}>
                          Reset Filter
                        </TableToolbarAction>
                      </TableToolbarMenu>
                      <Button
                        renderIcon={Add}
                        size="sm"
                        kind="primary"
                        onClick={() => setIsAddModalOpen(true)}
                      >
                        Add Book
                      </Button>
                    </TableToolbarContent>
                  </TableToolbar>

                  <Table {...getTableProps()} className="books-table">
                    <TableHead>
                      <TableRow>
                        {tableHeaders.map((header) => (
                          <TableHeader
                            key={header.key}
                            {...getHeaderProps({ header })}
                          >
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={tableHeaders.length} className="empty-cell">
                            No books match the search criteria.
                          </TableCell>
                        </TableRow>
                      ) : (
                        rows.map((row) => (
                          <TableRow key={row.id} {...getRowProps({ row })}>
                            {row.cells.map((cell) => {
                              if (cell.info.header === 'cover') {
                                return (
                                  <TableCell key={cell.id} className="cover-cell">
                                    <Link to={`/books/${row.id}`} className="cover-thumbnail-link">
                                      <img
                                        src={cell.value}
                                        alt="Book cover"
                                        className="table-cover-img"
                                      />
                                    </Link>
                                  </TableCell>
                                )
                              }

                              if (cell.info.header === 'title') {
                                return (
                                  <TableCell key={cell.id} className="title-cell">
                                    <Link
                                      to={`/books/${row.id}`}
                                      className="book-title-nav-link"
                                      title="View Book Details"
                                    >
                                      {cell.value}
                                    </Link>
                                  </TableCell>
                                )
                              }

                              if (cell.info.header === 'category') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag type="cool-gray" size="sm">
                                      {cell.value}
                                    </Tag>
                                  </TableCell>
                                )
                              }

                              if (cell.info.header === 'status') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag
                                      type={
                                        cell.value === 'Available'
                                          ? 'green'
                                          : 'red'
                                      }
                                      size="sm"
                                    >
                                      {cell.value}
                                    </Tag>
                                  </TableCell>
                                )
                              }

                              if (cell.info.header === 'rating') {
                                return (
                                  <TableCell key={cell.id}>
                                    <span className="rating-tag">★ {cell.value}</span>
                                  </TableCell>
                                )
                              }

                              if (cell.info.header === 'action') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Button
                                      kind="ghost"
                                      size="sm"
                                      renderIcon={View}
                                      onClick={() => navigate(`/books/${row.id}`)}
                                    >
                                      Details
                                    </Button>
                                  </TableCell>
                                )
                              }

                              return (
                                <TableCell key={cell.id}>
                                  {cell.value}
                                </TableCell>
                              )
                            })}
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                  <Pagination
                    backwardText="Previous page"
                    forwardText="Next page"
                    itemsPerPageText="Items per page:"
                    page={page}
                    pageNumberText="Page Number"
                    pageSize={pageSize}
                    pageSizes={[5, 10, 15, 20]}
                    totalItems={filteredRows.length}
                    onChange={({ page: newPage, pageSize: newPageSize }) => {
                      if (newPage !== page) setPage(newPage)
                      if (newPageSize !== pageSize) {
                        setPageSize(newPageSize)
                        setPage(1)
                      }
                    }}
                  />
                </TableContainer>
              )}
            </DataTable>
          </Column>
        </Grid>
      </Content>

      <AddBookModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddBook}
      />
    </Theme>
  )
}
