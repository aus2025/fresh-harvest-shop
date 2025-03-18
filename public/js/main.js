document.addEventListener('DOMContentLoaded', () => {
  // Initialize cart from localStorage or create empty cart
  let cart = JSON.parse(localStorage.getItem('freshHarvestCart')) || [];
  
  // Update cart display when page loads
  updateCartDisplay();
  
  // Add event listeners to all "Add to Cart" buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
  });
  
  // Add event listener to checkout button
  const checkoutBtn = document.getElementById('checkout-btn');
  checkoutBtn.addEventListener('click', () => {
    window.location.href = '/checkout';
  });
  
  // Function to add item to cart
  function addToCart(event) {
    const button = event.target;
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = parseFloat(button.getAttribute('data-price'));
    
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(item => item.id === id);
    
    if (existingItemIndex > -1) {
      // Increment quantity if item already exists
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push({
        id,
        name,
        price,
        quantity: 1
      });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart display
    updateCartDisplay();
    
    // Show confirmation message
    showAddedToCartMessage(name);
  }
  
  // Function to update cart display
  function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    // Clear current cart display
    cartItemsContainer.innerHTML = '';
    
    if (cart.length === 0) {
      // Show empty cart message
      cartItemsContainer.appendChild(emptyCartMessage);
      cartTotal.textContent = '$0.00';
      checkoutBtn.disabled = true;
    } else {
      // Hide empty cart message
      emptyCartMessage.style.display = 'none';
      
      // Add each item to the cart display
      let total = 0;
      cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
          <div class="cart-item-details">
            <span class="cart-item-name">${item.name}</span>
            <div class="cart-item-quantity">
              <button class="quantity-btn decrease" data-id="${item.id}">-</button>
              <span class="quantity-display">${item.quantity}</span>
              <button class="quantity-btn increase" data-id="${item.id}">+</button>
            </div>
          </div>
          <div class="cart-item-actions">
            <span class="cart-item-price">$${(itemTotal).toFixed(2)}</span>
            <button class="remove-item" data-id="${item.id}">Remove</button>
          </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
      });
      
      // Add event listeners to quantity buttons and remove buttons
      cartItemsContainer.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
        btn.addEventListener('click', decreaseQuantity);
      });
      
      cartItemsContainer.querySelectorAll('.quantity-btn.increase').forEach(btn => {
        btn.addEventListener('click', increaseQuantity);
      });
      
      cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', removeItem);
      });
      
      // Update total and enable checkout button
      cartTotal.textContent = `$${total.toFixed(2)}`;
      checkoutBtn.disabled = false;
    }
  }
  
  // Function to increase item quantity
  function increaseQuantity(event) {
    const id = event.target.getAttribute('data-id');
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
      cart[itemIndex].quantity += 1;
      saveCart();
      updateCartDisplay();
    }
  }
  
  // Function to decrease item quantity
  function decreaseQuantity(event) {
    const id = event.target.getAttribute('data-id');
    const itemIndex = cart.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
      if (cart[itemIndex].quantity > 1) {
        cart[itemIndex].quantity -= 1;
      } else {
        // Remove item if quantity will be 0
        cart.splice(itemIndex, 1);
        
        // Show empty cart message if cart is now empty
        if (cart.length === 0) {
          document.getElementById('empty-cart-message').style.display = 'block';
        }
      }
      
      saveCart();
      updateCartDisplay();
    }
  }
  
  // Function to remove item from cart
  function removeItem(event) {
    const id = event.target.getAttribute('data-id');
    cart = cart.filter(item => item.id !== id);
    
    // Show empty cart message if cart is now empty
    if (cart.length === 0) {
      document.getElementById('empty-cart-message').style.display = 'block';
    }
    
    saveCart();
    updateCartDisplay();
  }
  
  // Function to save cart to localStorage
  function saveCart() {
    localStorage.setItem('freshHarvestCart', JSON.stringify(cart));
  }
  
  // Function to show a message when an item is added to cart
  function showAddedToCartMessage(itemName) {
    // Check if a message already exists and remove it
    const existingMessage = document.querySelector('.add-to-cart-message');
    if (existingMessage) {
      existingMessage.remove();
    }
    
    // Create message element
    const message = document.createElement('div');
    message.className = 'add-to-cart-message';
    message.textContent = `${itemName} added to cart!`;
    
    // Style the message
    message.style.position = 'fixed';
    message.style.bottom = '20px';
    message.style.right = '20px';
    message.style.backgroundColor = '#4CAF50';
    message.style.color = 'white';
    message.style.padding = '10px 20px';
    message.style.borderRadius = '4px';
    message.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    message.style.zIndex = '1000';
    
    // Add to the document
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
      message.remove();
    }, 3000);
  }
}); 