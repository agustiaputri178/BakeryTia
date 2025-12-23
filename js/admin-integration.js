// Integration between admin panel and store frontend
class StoreIntegration {
    constructor() {
        this.initialize();
    }
    
    initialize() {
        this.syncProducts();
    }
    
    syncProducts() {
        // Get admin products from localStorage
        const adminProducts = JSON.parse(localStorage.getItem('admin-products')) || [];
        
        // Get store products from localStorage
        const storeProducts = JSON.parse(localStorage.getItem('store-products')) || [];
        
        // If no store products but admin products exist, use admin products
        if (storeProducts.length === 0 && adminProducts.length > 0) {
            this.updateStoreFromAdmin(adminProducts);
        }
        
        // Update the global products array
        this.updateGlobalProducts();
    }
    
    updateStoreFromAdmin(adminProducts) {
        // Convert admin products to store format
        const storeProducts = adminProducts
            .filter(product => product.active !== false) // Only active products
            .map(product => ({
                id: product.id,
                name: product.name,
                category: product.category,
                price: product.price,
                rating: product.rating || 4.5,
                image: product.image || 'default.jpg',
                description: product.description,
                ingredients: product.ingredients || [],
                popular: product.popular || false
            }));
        
        // Save to localStorage
        localStorage.setItem('store-products', JSON.stringify(storeProducts));
        
        return storeProducts;
    }
    
    updateGlobalProducts() {
        // Get store products
        const storeProducts = JSON.parse(localStorage.getItem('store-products')) || [];
        
        // Update the global products array if it exists
        if (typeof products !== 'undefined') {
            // Merge with default products
            const defaultProducts = window.products || [];
            const mergedProducts = [...defaultProducts];
            
            storeProducts.forEach(storeProduct => {
                const index = mergedProducts.findIndex(p => p.id === storeProduct.id);
                if (index !== -1) {
                    mergedProducts[index] = storeProduct;
                } else {
                    mergedProducts.push(storeProduct);
                }
            });
            
            // Filter out inactive products
            window.products = mergedProducts.filter(p => p.active !== false);
        }
    }
    
    // Function to be called from admin after saving products
    static refreshStoreProducts() {
        const integration = new StoreIntegration();
        integration.syncProducts();
        
        // Dispatch event to notify store pages
        window.dispatchEvent(new CustomEvent('productsUpdated'));
    }
}

// Initialize integration when page loads
document.addEventListener('DOMContentLoaded', function() {
    new StoreIntegration();
});

// Listen for product updates from admin
window.addEventListener('storage', function(e) {
    if (e.key === 'admin-products' || e.key === 'store-products') {
        new StoreIntegration().syncProducts();
    }
});