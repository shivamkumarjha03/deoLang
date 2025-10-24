import { useState } from 'preact/hooks'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MobileNav } from './components/MobileNav'
import { HomePage } from './pages/HomePage'
import { CatalogPage } from './pages/CatalogPage'
import { CartPage } from './pages/CartPage'
import { ProfilePage } from './pages/ProfilePage'
import { LoginPage } from './pages/LoginPage'
import { QuickOrderPopup } from './components/QuickOrderPopup'
import './styles/index.css'

export interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
  discount: number
}

export function App() {
  const [currentPage, setCurrentPage] = useState<string>('home')
  const [cart, setCart] = useState<CartItem[]>([])
  const [showQuickOrder, setShowQuickOrder] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [successMessage, setSuccessMessage] = useState('')

  const handleAddToCart = (product: any) => {
    setSelectedProduct(product)
    setShowQuickOrder(true)
  }

  const handleQuickOrderSubmit = (contact: string) => {
    if (selectedProduct) {
      const existingItem = cart.find(item => item.id === selectedProduct.id)
      if (existingItem) {
        setCart(cart.map(item =>
          item.id === selectedProduct.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setCart([...cart, {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: selectedProduct.image,
          quantity: 1,
          discount: selectedProduct.discount
        }])
      }
      setShowQuickOrder(false)
      setSuccessMessage(`${selectedProduct.name} added to cart!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleRemoveFromCart = (productId: number) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId)
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ))
    }
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onAddToCart={handleAddToCart} />
      case 'catalog':
        return <CatalogPage onAddToCart={handleAddToCart} />
      case 'cart':
        return (
          <CartPage
            cart={cart}
            onRemoveFromCart={handleRemoveFromCart}
            onUpdateQuantity={handleUpdateQuantity}
          />
        )
      case 'profile':
        return <ProfilePage />
      case 'login':
        return (
          <LoginPage
            onLoginSuccess={() => setCurrentPage('home')}
            onNavigate={setCurrentPage}
          />
        )
      default:
        return <HomePage onAddToCart={handleAddToCart} />
    }
  }

  return (
    <div class="app">
      <Header cartCount={cart.length} onNavigate={setCurrentPage} />
      <main class="main-content">
        {successMessage && (
          <div class="success-toast">{successMessage}</div>
        )}
        {renderPage()}
      </main>
      <Footer />
      {showQuickOrder && (
        <QuickOrderPopup
          product={selectedProduct}
          onSubmit={handleQuickOrderSubmit}
          onClose={() => setShowQuickOrder(false)}
        />
      )}
      <MobileNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  )
}
