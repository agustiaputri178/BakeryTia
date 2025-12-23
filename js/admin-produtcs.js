// Admin Products Management System
class ProductManager {
    constructor() {
        this.products = JSON.parse(localStorage.getItem('admin-products')) || [];
        this.currentProductId = null;
        this.isEditing = false;
        
        this.initialize();
    }
    
    initialize() {
        this.loadProducts();
        this.setupEventListeners();
        this.setupFormValidation();
    }
    
    loadProducts() {
        const tableBody = document.getElementById('products-table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (this.products.length === 0) {
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        this.products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="product-image-cell">
                    <img src="${product.image || 'images/products/default.jpg'}" 
                         alt="${product.name}" 
                         class="product-image">
                </td>
                <td>
                    <strong>${product.name}</strong>
                    <p class="product-description">${product.description.substring(0, 50)}...</p>
                </td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>
                    ${this.getStarRating(product.rating)}
                    <span>(${product.rating})</span>
                </td>
                <td>
                    <span class="status-badge ${product.active ? 'status-active' : 'status-inactive'}">
                        ${product.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" onclick="productManager.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action btn-delete" onclick="productManager.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    getCategoryName(category) {
        const categories = {
            'bread': 'Roti',
            'pastry': 'Pastry',
            'cake': 'Kue',
            'donut': 'Donat',
            'other': 'Lainnya'
        };
        return categories[category] || category;
    }
    
    getStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star" style="color: #ffc107;"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt" style="color: #ffc107;"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star" style="color: #ffc107;"></i>';
        }
        
        return stars;
    }
    
    openAddModal() {
        this.isEditing = false;
        this.currentProductId = null;
        
        document.getElementById('modal-title').textContent = 'Tambah Produk Baru';
        document.getElementById('product-form').reset();
        document.getElementById('image-preview').style.display = 'none';
        document.getElementById('upload-text').textContent = 'Klik untuk upload gambar produk';
        document.getElementById('product-active').checked = true;
        document.getElementById('product-popular').checked = false;
        
        this.openModal();
    }
    
    editProduct(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;
        
        this.isEditing = true;
        this.currentProductId = productId;
        
        document.getElementById('modal-title').textContent = 'Edit Produk';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-rating').value = product.rating;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-ingredients').value = product.ingredients ? product.ingredients.join(', ') : '';
        document.getElementById('product-popular').checked = product.popular || false;
        document.getElementById('product-active').checked = product.active !== false;
        
        // Set image preview if exists
        if (product.image) {
            document.getElementById('preview-image').src = product.image;
            document.getElementById('image-preview').style.display = 'block';
            document.getElementById('upload-text').textContent = 'Ganti gambar';
        } else {
            document.getElementById('image-preview').style.display = 'none';
            document.getElementById('upload-text').textContent = 'Klik untuk upload gambar produk';
        }
        
        this.openModal();
    }
    
    saveProduct(formData) {
        // Generate ID for new products
        if (!this.isEditing) {
            const newId = this.products.length > 0 ? 
                Math.max(...this.products.map(p => p.id)) + 1 : 1;
            formData.id = newId;
            this.products.push(formData);
        } else {
            // Update existing product
            const index = this.products.findIndex(p => p.id === this.currentProductId);
            if (index !== -1) {
                formData.id = this.currentProductId;
                this.products[index] = formData;
            }
        }
        
        // Save to localStorage
        localStorage.setItem('admin-products', JSON.stringify(this.products));
        
        // Update main products list for the store
        this.updateStoreProducts();
        
        // Show success message
        this.showAlert('success', `Produk berhasil ${this.isEditing ? 'diperbarui' : 'ditambahkan'}!`);
        
        // Reload products table
        this.loadProducts();
        
        // Close modal
        this.closeModal();
    }
    
    updateStoreProducts() {
        // Update the main products.js file with admin products
        const adminProducts = JSON.parse(localStorage.getItem('admin-products')) || [];
        
        // Convert admin products format to store format
        const storeProducts = adminProducts.map(product => ({
            id: product.id,
            name: product.name,
            category: product.category,
            price: product.price,
            rating: product.rating,
            image: product.image || 'default.jpg',
            description: product.description,
            ingredients: product.ingredients || [],
            popular: product.popular || false,
            active: product.active !== false
        })).filter(product => product.active); // Only include active products
        
        // Save to localStorage for store use
        localStorage.setItem('store-products', JSON.stringify(storeProducts));
        
        // Also update the global products array if it exists
        if (typeof products !== 'undefined') {
            // Merge admin products with default products
            const defaultProducts = window.products || [];
            const mergedProducts = [...defaultProducts];
            
            storeProducts.forEach(adminProduct => {
                const index = mergedProducts.findIndex(p => p.id === adminProduct.id);
                if (index !== -1) {
                    mergedProducts[index] = adminProduct;
                } else {
                    mergedProducts.push(adminProduct);
                }
            });
            
            window.products = mergedProducts;
        }
    }
    
    deleteProduct(productId) {
        if (!confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            return;
        }
        
        this.products = this.products.filter(p => p.id !== productId);
        localStorage.setItem('admin-products', JSON.stringify(this.products));
        
        this.showAlert('success', 'Produk berhasil dihapus!');
        this.loadProducts();
        this.updateStoreProducts();
    }
    
    searchProducts(searchTerm) {
        const filteredProducts = this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            this.getCategoryName(product.category).toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        this.displayFilteredProducts(filteredProducts);
    }
    
    displayFilteredProducts(filteredProducts) {
        const tableBody = document.getElementById('products-table-body');
        const emptyState = document.getElementById('empty-state');
        
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        if (filteredProducts.length === 0) {
            emptyState.style.display = 'block';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Tidak ada produk ditemukan</h3>
                <p>Tidak ada produk yang cocok dengan pencarian Anda</p>
            `;
            return;
        }
        
        emptyState.style.display = 'none';
        
        filteredProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="product-image-cell">
                    <img src="${product.image || 'images/products/default.jpg'}" 
                         alt="${product.name}" 
                         class="product-image">
                </td>
                <td>
                    <strong>${product.name}</strong>
                    <p class="product-description">${product.description.substring(0, 50)}...</p>
                </td>
                <td>${this.getCategoryName(product.category)}</td>
                <td>Rp ${product.price.toLocaleString('id-ID')}</td>
                <td>
                    ${this.getStarRating(product.rating)}
                    <span>(${product.rating})</span>
                </td>
                <td>
                    <span class="status-badge ${product.active ? 'status-active' : 'status-inactive'}">
                        ${product.active ? 'Aktif' : 'Nonaktif'}
                    </span>
                </td>
                <td class="actions-cell">
                    <button class="btn-action btn-edit" onclick="productManager.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-action btn-delete" onclick="productManager.deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i> Hapus
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
    
    openModal() {
        document.getElementById('product-modal').classList.add('active');
    }
    
    closeModal() {
        document.getElementById('product-modal').classList.remove('active');
        document.getElementById('product-form').reset();
    }
    
    showAlert(type, message) {
        const alert = document.getElementById(`alert-${type}`);
        if (alert) {
            alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}-circle"></i> ${message}`;
            alert.style.display = 'block';
            
            setTimeout(() => {
                alert.style.display = 'none';
            }, 3000);
        }
    }
    
    setupEventListeners() {
        // Form submission
        const form = document.getElementById('product-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Search input
        const searchInput = document.getElementById('search-products');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
        
        // Close modal on overlay click
        const modalOverlay = document.getElementById('product-modal');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', (e) => {
                if (e.target === modalOverlay) {
                    this.closeModal();
                }
            });
        }
    }
    
    setupFormValidation() {
        const form = document.getElementById('product-form');
        
        // Add custom validation
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        inputs.forEach(input => {
            input.addEventListener('invalid', (e) => {
                e.preventDefault();
                this.showAlert('error', 'Harap isi semua field yang wajib diisi');
            });
        });
    }
    
    handleFormSubmit() {
        // Get form values
        const name = document.getElementById('product-name').value.trim();
        const category = document.getElementById('product-category').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const rating = parseFloat(document.getElementById('product-rating').value) || 4.5;
        const description = document.getElementById('product-description').value.trim();
        const ingredients = document.getElementById('product-ingredients').value
            .split(',')
            .map(i => i.trim())
            .filter(i => i);
        const popular = document.getElementById('product-popular').checked;
        const active = document.getElementById('product-active').checked;
        
        // Get image (if uploaded)
        const imageInput = document.getElementById('image-input');
        let image = '';
        
        if (imageInput.files && imageInput.files[0]) {
            // For demo purposes, we'll store a placeholder
            // In a real app, you would upload to a server
            const fileName = imageInput.files[0].name;
            image = `images/products/${fileName}`;
        } else if (this.isEditing) {
            // Keep existing image if editing and no new image uploaded
            const existingProduct = this.products.find(p => p.id === this.currentProductId);
            image = existingProduct?.image || '';
        }
        
        // Validate
        if (!name || !category || !price || !description) {
            this.showAlert('error', 'Harap isi semua field yang wajib diisi');
            return;
        }
        
        // Prepare product data
        const productData = {
            name,
            category,
            price,
            rating,
            description,
            ingredients,
            popular,
            active,
            image
        };
        
        // Save product
        this.saveProduct(productData);
    }
}

// Image preview function
function previewImage(event) {
    const input = event.target;
    const preview = document.getElementById('preview-image');
    const previewContainer = document.getElementById('image-preview');
    const uploadText = document.getElementById('upload-text');
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            preview.src = e.target.result;
            previewContainer.style.display = 'block';
            uploadText.textContent = 'Ganti gambar';
        };
        
        reader.readAsDataURL(input.files[0]);
    }
}

// Global functions for HTML onclick events
function openAddModal() {
    productManager.openAddModal();
}

function closeModal() {
    productManager.closeModal();
}

// Initialize product manager when page loads
let productManager;

document.addEventListener('DOMContentLoaded', function() {
    productManager = new ProductManager();
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});