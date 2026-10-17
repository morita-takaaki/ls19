document.addEventListener("DOMContentLoaded", () => {
    fetchOrders();
});

function fetchOrders() {
    fetch("/api/orders")
        .then(response => {
            if (!response.ok) {
                throw new Error("注文履歴の取得に失敗しました。");
            }
            return response.json();
        })
        .then(orders => {
            const orderItemsTbody = document.getElementById("order-items");
            orderItemsTbody.innerHTML = "";

            if (!orders || orders.length === 0) {
                orderItemsTbody.innerHTML = `
                    <tr>
                        <td colspan="4" style="text-align: center;">注文履歴はありません。</td>
                    </tr>
                `;
                return;
            }

            orders.forEach(item => {
                const subtotal = item.price * item.quantity;

                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${escapeHtml(item.product_name)}</td>
                    <td style="text-align: right;">¥${item.price.toLocaleString()}</td>
                    <td style="text-align: center;">${item.quantity}</td>
                    <td style="text-align: right;">¥${subtotal.toLocaleString()}</td>
                `;
                orderItemsTbody.appendChild(row);
            });
        })
        .catch(error => {
            console.error(error);
            const orderItemsTbody = document.getElementById("order-items");
            orderItemsTbody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center;">注文履歴の取得に失敗しました。</td>
                </tr>
            `;
        });
}

function escapeHtml(str) {
    if (!str) return "";
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[m];
    });
}