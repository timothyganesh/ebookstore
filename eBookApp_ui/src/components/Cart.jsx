import { useState } from 'react'
import {
  Modal,
  Button,
  Tag,
  InlineNotification,
  Tile,
} from '@carbon/react'
import {
  ShoppingCart,
  TrashCan,
  Add,
  Subtract,
  Purchase,
  CheckmarkFilled,
} from '@carbon/icons-react'
import { useCart } from '../context/CartContext.jsx'

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalAmount,
    isCartOpen,
    setIsCartOpen,
  } = useCart()

  const [checkoutSuccess, setCheckoutSuccess] = useState(false)

  const handleCheckout = () => {
    setCheckoutSuccess(true)
    setTimeout(() => {
      clearCart()
      setCheckoutSuccess(false)
      setIsCartOpen(false)
    }, 2500)
  }

  const handleClose = () => {
    setIsCartOpen(false)
    setCheckoutSuccess(false)
  }

  return (
    <Modal
      open={isCartOpen}
      onRequestClose={handleClose}
      modalHeading={`Shopping Cart (${totalItems} ${totalItems === 1 ? 'item' : 'items'})`}
      primaryButtonText={cartItems.length > 0 && !checkoutSuccess ? 'Proceed to Checkout' : undefined}
      secondaryButtonText={cartItems.length > 0 && !checkoutSuccess ? 'Continue Browsing' : 'Close'}
      onRequestSubmit={cartItems.length > 0 && !checkoutSuccess ? handleCheckout : handleClose}
      onSecondarySubmit={handleClose}
      size="md"
      className="cart-modal"
    >
      {checkoutSuccess && (
        <InlineNotification
          kind="success"
          title="Order Placed Successfully!"
          subtitle={`Thank you for your purchase! Total charged: $${totalAmount}. Your eBooks are now accessible.`}
          lowContrast
          hideCloseButton
          className="cart-checkout-notification"
        />
      )}

      {cartItems.length === 0 && !checkoutSuccess ? (
        <div className="empty-cart-state">
          <div className="empty-cart-icon-wrapper">
            <ShoppingCart size={48} />
          </div>
          <h4>Your cart is empty</h4>
          <p>
            Explore the eBook collection and click <strong>&quot;Add to Cart&quot;</strong> on any book to add it to your order.
          </p>
        </div>
      ) : (
        <div className="cart-content-wrapper">
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <Tile key={item.id} className="cart-item-tile">
                <div className="cart-item-main">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="cart-item-thumbnail"
                  />
                  <div className="cart-item-info">
                    <h5 className="cart-item-title">{item.title}</h5>
                    <p className="cart-item-author">By {item.author}</p>
                    {item.category && (
                      <Tag type="cool-gray" size="sm" className="cart-item-tag">
                        {item.category}
                      </Tag>
                    )}
                    <div className="cart-item-price-unit">
                      Unit price: <strong>{item.price}</strong>
                    </div>
                  </div>
                </div>

                <div className="cart-item-actions">
                  <div className="quantity-controls">
                    <Button
                      hasIconOnly
                      renderIcon={Subtract}
                      iconDescription="Decrease quantity"
                      size="sm"
                      kind="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    />
                    <span className="quantity-number">{item.quantity}</span>
                    <Button
                      hasIconOnly
                      renderIcon={Add}
                      iconDescription="Increase quantity"
                      size="sm"
                      kind="ghost"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    />
                  </div>

                  <div className="item-subtotal-column">
                    <span className="subtotal-label">Subtotal</span>
                    <span className="item-subtotal-val">
                      $
                      {(
                        (item.numericPrice ||
                          parseFloat(String(item.price).replace(/[^0-9.]/g, '')) ||
                          0) * item.quantity
                      ).toFixed(2)}
                    </span>
                  </div>

                  <Button
                    hasIconOnly
                    renderIcon={TrashCan}
                    iconDescription="Remove item"
                    kind="danger--ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                  />
                </div>
              </Tile>
            ))}
          </div>

          <div className="cart-summary-section">
            <div className="cart-summary-row">
              <span>Items Total:</span>
              <span>{totalItems} books</span>
            </div>
            <div className="cart-summary-row">
              <span>Estimated Tax (0% Digital):</span>
              <span>$0.00</span>
            </div>
            <div className="cart-summary-row total-row">
              <span>Total Amount:</span>
              <span className="cart-total-price">${totalAmount}</span>
            </div>

            <div className="cart-clear-btn-wrap">
              <Button
                kind="danger--ghost"
                size="sm"
                renderIcon={TrashCan}
                onClick={clearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}
