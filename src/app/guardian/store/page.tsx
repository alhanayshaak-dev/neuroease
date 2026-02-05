'use client';

import { useState } from 'react';
import { GuardianLayout } from '@/components/GuardianLayout';
import {
  ShoppingCart,
  Star,
  Search,
  Wrench,
  MessageSquare,
  Plus,
  Minus,
  X,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  category: string;
  inStock: boolean;
  description: string;
  image: string;
  specs?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<'browse' | 'repair' | 'cart'>('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [repairIssue, setRepairIssue] = useState('');
  const [repairDevice, setRepairDevice] = useState('');
  const [aiRepairAnalysis, setAiRepairAnalysis] = useState<any>(null);

  // Comprehensive product catalog
  const allProducts: Product[] = [
    // Devices
    { id: '1', name: 'Neurobud Pro', price: 299, rating: 4.8, reviews: 1240, category: 'Devices', inStock: true, description: 'Advanced wireless earbuds with brainwave monitoring', image: 'neurobud', specs: ['Brainwave Sensors', '8hr Battery', 'Noise Cancellation'] },
    { id: '2', name: 'NeuroLens Elite', price: 499, rating: 4.9, reviews: 856, category: 'Devices', inStock: true, description: 'Smart glasses with eye tracking and AR', image: 'neurolens', specs: ['Eye Tracking', 'AR Display', '6hr Battery'] },
    { id: '3', name: 'Neuroband Max', price: 199, rating: 4.7, reviews: 2103, category: 'Devices', inStock: true, description: 'Wrist band with heart rate and movement tracking', image: 'neuroband', specs: ['Heart Rate Monitor', '14 Day Battery', 'Water Resistant'] },
    
    // Charging & Power
    { id: '4', name: 'Neurobud Charging Case', price: 79, rating: 4.6, reviews: 543, category: 'Charging', inStock: true, description: 'Replacement charging case for Neurobud', image: 'charging-case', specs: ['Wireless Charging', 'LED Indicator', 'Compact Design'] },
    { id: '5', name: 'Universal USB-C Charger', price: 29, rating: 4.5, reviews: 1876, category: 'Charging', inStock: true, description: 'Fast charging for all NeuroFlow devices', image: 'usb-charger', specs: ['65W Output', 'Multi-Device', 'Travel Friendly'] },
    { id: '6', name: 'Wireless Charging Pad', price: 49, rating: 4.7, reviews: 892, category: 'Charging', inStock: true, description: 'Qi-compatible charging pad for devices', image: 'wireless-pad', specs: ['15W Fast Charge', 'Non-Slip Base', 'LED Status'] },
    { id: '7', name: 'Power Bank 20000mAh', price: 59, rating: 4.8, reviews: 3421, category: 'Charging', inStock: true, description: 'Portable power bank with multiple ports', image: 'power-bank', specs: ['20000mAh', 'Dual USB-C', 'Fast Charging'] },
    
    // Replacement Parts
    { id: '8', name: 'Neurobud Ear Tips Set', price: 19, rating: 4.9, reviews: 2156, category: 'Parts', inStock: true, description: 'Replacement silicone ear tips (S/M/L)', image: 'ear-tips', specs: ['3 Sizes', 'Premium Silicone', 'Hypoallergenic'] },
    { id: '9', name: 'NeuroLens Lens Protector', price: 39, rating: 4.7, reviews: 634, category: 'Parts', inStock: true, description: 'Protective lens covers and cleaning kit', image: 'lens-protector', specs: ['Anti-Scratch', 'Anti-Glare', 'Cleaning Kit'] },
    { id: '10', name: 'Neuroband Strap Replacement', price: 34, rating: 4.6, reviews: 789, category: 'Parts', inStock: true, description: 'Replacement wrist strap in multiple colors', image: 'strap', specs: ['Multiple Colors', 'Adjustable Fit', 'Durable Material'] },
    { id: '11', name: 'Battery Replacement Kit', price: 49, rating: 4.5, reviews: 456, category: 'Parts', inStock: true, description: 'Replacement battery for any NeuroFlow device', image: 'battery', specs: ['Extended Life', 'Easy Installation', 'Warranty Included'] },
    
    // Accessories
    { id: '12', name: 'Protective Case Bundle', price: 44, rating: 4.8, reviews: 1203, category: 'Accessories', inStock: true, description: 'Hard case for all three devices', image: 'case-bundle', specs: ['Waterproof', 'Shock Resistant', 'Compact'] },
    { id: '13', name: 'Screen Protector Pack', price: 24, rating: 4.6, reviews: 876, category: 'Accessories', inStock: true, description: 'Tempered glass protectors for NeuroLens', image: 'screen-protector', specs: ['9H Hardness', 'Easy Application', '3 Pack'] },
    { id: '14', name: 'Cleaning Kit Pro', price: 19, rating: 4.9, reviews: 1543, category: 'Accessories', inStock: true, description: 'Professional cleaning tools for all devices', image: 'cleaning-kit', specs: ['Microfiber Cloth', 'Cleaning Solution', 'Brush Set'] },
    { id: '15', name: 'Travel Organizer', price: 34, rating: 4.7, reviews: 654, category: 'Accessories', inStock: true, description: 'Compact organizer for all NeuroFlow devices', image: 'organizer', specs: ['Multiple Compartments', 'Lightweight', 'TSA Approved'] },
    
    // Tools & Repair
    { id: '16', name: 'Precision Screw Set', price: 14, rating: 4.8, reviews: 2341, category: 'Tools', inStock: true, description: 'Micro screwdriver set for device maintenance', image: 'screwdriver-set', specs: ['8 Pieces', 'Magnetic Tips', 'Storage Case'] },
    { id: '17', name: 'Thermal Paste', price: 12, rating: 4.6, reviews: 567, category: 'Tools', inStock: true, description: 'High-performance thermal paste for sensors', image: 'thermal-paste', specs: ['5g Tube', 'Long Lasting', 'Easy Application'] },
    { id: '18', name: 'Adhesive Strips Pack', price: 9, rating: 4.7, reviews: 1203, category: 'Tools', inStock: true, description: 'Strong adhesive strips for device assembly', image: 'adhesive', specs: ['20 Strips', 'Waterproof', 'Reusable'] },
  ];

  const categories = ['All', 'Devices', 'Charging', 'Parts', 'Accessories', 'Tools'];

  const filteredProducts = allProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: Product) => {
    const existing = cart.find(item => item.product.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const handleRepairAnalysis = () => {
    if (!repairIssue.trim() || !repairDevice.trim()) return;

    // AI-powered repair analysis
    const issueKeywords = repairIssue.toLowerCase();
    const isSevere = issueKeywords.includes('broken') || issueKeywords.includes('shattered') || issueKeywords.includes('not working') || issueKeywords.includes('water damage');
    const isMajor = issueKeywords.includes('battery') || issueKeywords.includes('screen') || issueKeywords.includes('sensor');

    const analysis = {
      device: repairDevice,
      issue: repairIssue,
      severity: isSevere ? 'Critical' : isMajor ? 'Major' : 'Minor',
      recommendation: isSevere ? 'repurchase' : 'repair',
      repairCost: isSevere ? 0 : isMajor ? 149 : 79,
      replacementCost: repairDevice.includes('Neurobud') ? 299 : repairDevice.includes('NeuroLens') ? 499 : 199,
      reason: isSevere
        ? 'This damage is beyond economical repair. We recommend purchasing a replacement device.'
        : isMajor
        ? 'This issue requires professional repair. Our technicians can fix it for less than replacement.'
        : 'This is a minor issue that can be fixed with our repair service or DIY parts.',
      suggestedParts: isMajor ? ['Battery Replacement Kit', 'Precision Screw Set'] : ['Cleaning Kit Pro'],
      estimatedTime: isSevere ? 'N/A' : '3-5 business days',
    };

    setAiRepairAnalysis(analysis);
  };

  return (
    <GuardianLayout>
      <div className="max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">NeuroFlow Store</h1>
            <p className="text-xs text-gray-400">Devices, parts, accessories & repair services</p>
          </div>
          <div className="flex items-center gap-4">
            {cart.length > 0 && (
              <div className="bg-teal-600/20 border border-teal-600 rounded-lg px-4 py-2">
                <p className="text-teal-400 font-semibold">{cart.length} items in cart</p>
              </div>
            )}
            <button
              onClick={() => window.history.back()}
              type="button"
              className="text-gray-400 hover:text-white transition-colors p-2"
              title="Go back"
              aria-label="Go back"
            >
              <span className="text-2xl font-bold">✕</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-teal-600/30 overflow-x-auto">
          <button type="button"
            onClick={() => setActiveTab('browse')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'browse'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-gray-400 hover:text-teal-300'
            }`}
          >
            <ShoppingCart size={18} className="inline mr-2" />
            Browse Store
          </button>
          <button type="button"
            onClick={() => setActiveTab('repair')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'repair'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-gray-400 hover:text-teal-300'
            }`}
          >
            <Wrench size={18} className="inline mr-2" />
            Repair Diagnostic
          </button>
          <button type="button"
            onClick={() => setActiveTab('cart')}
            className={`px-4 py-2 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'cart'
                ? 'text-teal-400 border-b-2 border-teal-400'
                : 'text-gray-400 hover:text-teal-300'
            }`}
          >
            <ShoppingCart size={18} className="inline mr-2" />
            Cart ({cart.length})
          </button>
        </div>

        {/* Browse Store Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Search & Filters */}
            <div className="mb-6 space-y-4">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-navy-900 border border-teal-600/30 rounded pl-10 pr-4 py-2 text-white placeholder-gray-500"
                />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button type="button"
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white'
                        : 'bg-navy-900 border border-teal-600/30 text-gray-300 hover:text-teal-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid - Amazon Style */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-navy-900 border border-teal-600/30 rounded-lg overflow-hidden hover:shadow-lg hover:border-teal-400 transition-all"
                >
                  {/* Product Image */}
                  <div className="bg-black/50 h-40 flex items-center justify-center">
                    <Package size={48} className="text-teal-600/50" />
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-400 text-xs mb-2">{product.description}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}
                        />
                      ))}
                      <span className="text-gray-400 text-xs ml-1">({product.reviews})</span>
                    </div>

                    {/* Price */}
                    <p className="text-teal-400 font-bold text-lg mb-3">${product.price}</p>

                    {/* Stock Status */}
                    <div className="mb-3">
                      {product.inStock ? (
                        <span className="text-green-400 text-xs font-semibold">In Stock</span>
                      ) : (
                        <span className="text-red-400 text-xs font-semibold">Out of Stock</span>
                      )}
                    </div>

                    {/* Add to Cart Button */}
                    <button type="button"
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-2 rounded font-semibold transition-colors ${
                        product.inStock
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Repair Diagnostic Tab */}
        {activeTab === 'repair' && (
          <div className="space-y-6">
            {/* AI Repair Diagnostic */}
            <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-2 flex items-center gap-2">
                <Wrench size={24} />
                AI Repair Diagnostic
              </h2>
              <p className="text-gray-400 mb-6">Describe your device issue and our AI will analyze whether repair or replacement is recommended</p>

              <div className="space-y-4">
                {/* Device Selection */}
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Which device needs repair?</label>
                  <select
                    value={repairDevice}
                    onChange={(e) => setRepairDevice(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-2 text-white"
                  >
                    <option value="">Select a device...</option>
                    <option value="Neurobud">Neurobud</option>
                    <option value="NeuroLens">NeuroLens</option>
                    <option value="Neuroband">Neuroband</option>
                  </select>
                </div>

                {/* Issue Description */}
                <div>
                  <label className="text-gray-300 text-sm block mb-2">Describe the issue</label>
                  <textarea
                    placeholder="e.g., Left earbud not charging, screen cracked, battery drains quickly, water damage, not turning on..."
                    value={repairIssue}
                    onChange={(e) => setRepairIssue(e.target.value)}
                    className="w-full bg-black/50 border border-teal-600/30 rounded px-4 py-3 text-white placeholder-gray-500 h-24"
                  />
                </div>

                <button type="button"
                  onClick={handleRepairAnalysis}
                  disabled={!repairDevice || !repairIssue.trim()}
                  className="w-full bg-teal-600 hover:bg-teal-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-3 rounded font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <MessageSquare size={18} />
                  Analyze with AI
                </button>
              </div>

              {/* AI Analysis Result */}
              {aiRepairAnalysis && (
                <div className="mt-6 space-y-4">
                  {/* Severity Badge */}
                  <div className={`p-4 rounded-lg border ${
                    aiRepairAnalysis.severity === 'Critical'
                      ? 'bg-red-900/20 border-red-600/30'
                      : aiRepairAnalysis.severity === 'Major'
                      ? 'bg-yellow-900/20 border-yellow-600/30'
                      : 'bg-green-900/20 border-green-600/30'
                  }`}>
                    <p className={`font-semibold ${
                      aiRepairAnalysis.severity === 'Critical'
                        ? 'text-red-400'
                        : aiRepairAnalysis.severity === 'Major'
                        ? 'text-yellow-400'
                        : 'text-green-400'
                    }`}>
                      Severity: {aiRepairAnalysis.severity}
                    </p>
                  </div>

                  {/* Recommendation */}
                  <div className="bg-black/50 border border-teal-600/30 rounded p-4">
                    <p className="text-gray-400 text-sm mb-2">AI Recommendation</p>
                    <div className="flex items-center gap-2 mb-3">
                      {aiRepairAnalysis.recommendation === 'repair' ? (
                        <>
                          <CheckCircle size={24} className="text-green-400" />
                          <p className="text-white font-bold text-lg">Repair Recommended</p>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={24} className="text-red-400" />
                          <p className="text-white font-bold text-lg">Replacement Recommended</p>
                        </>
                      )}
                    </div>
                    <p className="text-gray-300 mb-4">{aiRepairAnalysis.reason}</p>

                    {/* Cost Comparison */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {aiRepairAnalysis.recommendation === 'repair' && (
                        <div className="bg-teal-900/20 border border-teal-600/30 rounded p-3">
                          <p className="text-gray-400 text-xs mb-1">Repair Cost</p>
                          <p className="text-teal-400 font-bold text-lg">${aiRepairAnalysis.repairCost}</p>
                          <p className="text-gray-500 text-xs mt-1">Est. {aiRepairAnalysis.estimatedTime}</p>
                        </div>
                      )}
                      <div className="bg-gray-900/20 border border-gray-600/30 rounded p-3">
                        <p className="text-gray-400 text-xs mb-1">Replacement Cost</p>
                        <p className="text-gray-300 font-bold text-lg">${aiRepairAnalysis.replacementCost}</p>
                        <p className="text-gray-500 text-xs mt-1">New device</p>
                      </div>
                    </div>

                    {/* Suggested Parts */}
                    {aiRepairAnalysis.suggestedParts && aiRepairAnalysis.suggestedParts.length > 0 && (
                      <div className="mb-4">
                        <p className="text-gray-400 text-sm mb-2">Suggested Parts/Tools</p>
                        <div className="space-y-2">
                          {aiRepairAnalysis.suggestedParts.map((part: string, idx: number) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-black/50 rounded">
                              <span className="text-gray-300 text-sm">{part}</span>
                              <button type="button"
                                onClick={() => {
                                  const product = allProducts.find(p => p.name === part);
                                  if (product) addToCart(product);
                                }}
                                className="text-teal-400 hover:text-teal-300 text-xs font-semibold"
                              >
                                Add to Cart
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <button type="button"
                      className={`w-full py-3 rounded font-semibold transition-colors flex items-center justify-center gap-2 ${
                        aiRepairAnalysis.recommendation === 'repair'
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <Truck size={18} />
                      {aiRepairAnalysis.recommendation === 'repair'
                        ? 'Schedule Repair Service'
                        : 'Browse Replacement Devices'}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Shopping Cart Tab */}
        {activeTab === 'cart' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              {cart.length === 0 ? (
                <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-12 text-center">
                  <ShoppingCart size={48} className="mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400 mb-4">Your cart is empty</p>
                  <button type="button"
                    onClick={() => setActiveTab('browse')}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded font-semibold transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="bg-navy-900 border border-teal-600/30 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{item.product.name}</h3>
                        <p className="text-gray-400 text-sm">${item.product.price} each</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 mx-4">
                        <button type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button type="button"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right mr-4">
                        <p className="text-teal-400 font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>

                      {/* Remove Button */}
                      <button type="button"
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cart Summary */}
            {cart.length > 0 && (
              <div className="bg-navy-900 border border-teal-600/30 rounded-lg p-6 h-fit">
                <h3 className="text-white font-bold text-lg mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4 pb-4 border-b border-teal-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white">${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Shipping</span>
                    <span className="text-white">Free</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Tax</span>
                    <span className="text-white">${(cartTotal * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-teal-400 font-bold text-xl">${(cartTotal * 1.08).toFixed(2)}</span>
                </div>

                <button type="button" className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded font-semibold transition-colors mb-2">
                  Proceed to Checkout
                </button>
                <button type="button"
                  onClick={() => setActiveTab('browse')}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 rounded font-semibold transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </GuardianLayout>
  );
}
