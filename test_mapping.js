
const feedbacks = [
    {
        message: "Real message from v1",
        rating: 5,
        created_at: "2026-02-26T01:09:44.000000Z",
        invoice: {
            email: "test@example.com",
            items: [{ product: { name: "v1 Product" } }]
        }
    },
    {
        comment: "Old comment format",
        rating: 4,
        created_at: "2024-02-24T19:18:47Z",
        order: { product: { name: "v0 Product" } }
    },
    { rating: 3, created_at: "2024-02-23T19:18:47Z" }
];

const mapped = feedbacks.map(f => ({
    user: f.invoice?.email ? f.invoice.email.split('@')[0] : "Verified User",
    date: new Date(f.created_at).toLocaleDateString(),
    rating: f.rating || 5,
    comment: f.message || f.comment || f.feedback || f.review || "No comment provided.",
    product: f.invoice?.items?.[0]?.product?.name || f.order?.product?.name || "Premium Product"
}));

console.log(JSON.stringify(mapped, null, 2));

const results = [
    mapped[0].comment === "Real message from v1",
    mapped[0].user === "test",
    mapped[0].product === "v1 Product",
    mapped[1].comment === "Old comment format",
    mapped[1].product === "v0 Product",
    mapped[2].comment === "No comment provided."
];

if (results.every(r => r)) {
    console.log("SUCCESS: Robust mapping logic is correct.");
    process.exit(0);
} else {
    console.error("FAILURE: Mapping logic returned unexpected results.");
    process.exit(1);
}
