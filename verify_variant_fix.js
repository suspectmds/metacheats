const testProduct = {
    name: "Test Product",
    variants: [
        { id: 1, name: "1 Day Key", price: "5.00" },
        { id: 2, title: "7 Days Access", price: "20.00" },
        { id: 3, price: "50.00" } // Should fallback to Plan 3
    ]
};

function getVariantName(v, product) {
    return v.name || v.title || v.label || `Plan ${product.variants.indexOf(v) + 1}`;
}

console.log("Testing variant name priority:");
testProduct.variants.forEach(v => {
    console.log(`ID: ${v.id}, Display Name: "${getVariantName(v, testProduct)}"`);
});
