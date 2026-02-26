/**
 * SellAuth API Integration Helper
 * 
 * Credentials provided by User:
 * Shop ID: 218489
 * API Key: 5555320|TN3mUsZ8TB4ESf5JrN5ovQEtunDOR4ykLoePdu2f2629f464
 * Secret: 124d8b1cc90fb23210cf286faa5b7fcd8bb37123cbd049516d59fed9387c896c
 */

const SELLAUTH_CONFIG = {
    SHOP_ID: '169969',
    API_KEY: '5561865|TOancIGgSuESgevxAri1HQKVpysGfjfrrXKrKl3Laed0e7f8',
    SECRET: '74193d0b18f84470e0e69f452c152d8d9083f071f2c00b620aa6510692c9b976',
    BASE_URL: 'https://api.sellauth.com/v1',
    STORE_URL: 'https://metacheat.org'
};

export const SellAuth = {
    /**
     * Fetches all active products for the shop.
     */
    getProducts: async () => {
        try {
            const response = await fetch(`${SELLAUTH_CONFIG.BASE_URL}/shops/${SELLAUTH_CONFIG.SHOP_ID}/products?per_page=100`, {
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_CONFIG.API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.error('SellAuth API Response Not OK:', response.status, response.statusText);
                throw new Error('Failed to fetch products from SellAuth');
            }

            const data = await response.json();
            return data.data || data.products || data || [];
        } catch (error) {
            console.error('SellAuth Error:', error);
            return [];
        }
    },

    /**
     * Fetches full details (including description) for a single product.
     */
    getProductDetails: async (productId) => {
        try {
            const response = await fetch(`${SELLAUTH_CONFIG.BASE_URL}/shops/${SELLAUTH_CONFIG.SHOP_ID}/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_CONFIG.API_KEY}`,
                    'Accept': 'application/json'
                }
            });
            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            return null;
        }
    },

    /**
     * Fetches all groups for the shop.
     */
    getGroups: async () => {
        try {
            const response = await fetch(`${SELLAUTH_CONFIG.BASE_URL}/shops/${SELLAUTH_CONFIG.SHOP_ID}/groups`, {
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_CONFIG.API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return [];

            const data = await response.json();
            return data.data || data.groups || data || [];
        } catch (error) {
            console.error('SellAuth Groups Error:', error);
            return [];
        }
    },

    /**
     * Creates a checkout session and returns the redirect URL.
     * This bypasses the product page and goes straight to payment selection.
     */
    createCheckout: async (productId, variantId) => {
        try {
            // Use Vite proxy (/sellauth-api → api.sellauth.com/v1) to avoid CORS
            const response = await fetch(`/sellauth-api/shops/${SELLAUTH_CONFIG.SHOP_ID}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_CONFIG.API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    cart: [{ productId: productId, variantId: variantId, quantity: 1 }]
                })
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Checkout API error:', data);
                return null;
            }
            return data.url || data.checkout_url || data.redirect_url || null;
        } catch (error) {
            console.error('SellAuth Checkout Error:', error);
            return null;
        }
    },

    /**
     * Fetches shop feedbacks/reviews.
     */
    getFeedbacks: async () => {
        try {
            const response = await fetch(`${SELLAUTH_CONFIG.BASE_URL}/shops/${SELLAUTH_CONFIG.SHOP_ID}/feedbacks?per_page=5`, {
                headers: {
                    'Authorization': `Bearer ${SELLAUTH_CONFIG.API_KEY}`,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) return [];

            const data = await response.json();
            const raw = data.data || data.feedbacks || [];
            return raw.map(f => ({
                rating: f.stars || f.rating || 5,
                comment: f.message || f.comment || f.feedback || "",
                customer_email: f.invoice?.email || f.email || "Anonymous"
            }));
        } catch (error) {
            console.error('SellAuth Feedbacks Error:', error);
            return [];
        }
    }
};
