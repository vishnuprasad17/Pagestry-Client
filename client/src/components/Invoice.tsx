import { FaDownload, FaFileInvoice } from "react-icons/fa";
import { OrderResponse } from "../types/order";

interface InvoiceProps {
  order: OrderResponse;
  onClose: () => void;
}
function Invoice({ order, onClose }: InvoiceProps) {
  const generatePDF = () => {
    const invoiceElement = document.getElementById("invoice-content");
  if (!invoiceElement) return;

  const printWindow = window.open("", "", "width=800,height=600");
  if (!printWindow) return;

  const invoiceHTML = invoiceElement.innerHTML;

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; background: #f5f5f5; }
            .invoice-container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .invoice-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 3px solid #4F46E5; padding-bottom: 20px; }
            .company-info h1 { color: #4F46E5; font-size: 32px; font-weight: bold; margin-bottom: 10px; }
            .company-info p { color: #666; font-size: 13px; line-height: 1.6; }
            .invoice-meta { text-align: right; }
            .invoice-meta h2 { font-size: 24px; color: #333; margin-bottom: 10px; }
            .invoice-meta p { color: #666; font-size: 13px; margin: 5px 0; }
            .section-title { font-size: 14px; font-weight: 600; color: #4F46E5; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; margin-top: 30px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
            .info-box { background: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #4F46E5; }
            .info-box h3 { font-size: 14px; font-weight: 600; color: #333; margin-bottom: 12px; }
            .info-box p { color: #666; font-size: 13px; line-height: 1.8; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            thead { background: #4F46E5; color: white; }
            th { padding: 15px; text-align: left; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 15px; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #333; }
            tbody tr:hover { background: #f9fafb; }
            .text-right { text-align: right; }
            .font-semibold { font-weight: 600; }
            .summary { margin-top: 20px; display: flex; flex-direction: column; align-items: flex-end; }
            .summary-row { display: flex; justify-content: space-between; width: 300px; padding: 10px 0; font-size: 14px; }
            .summary-row.total { border-top: 2px solid #4F46E5; margin-top: 10px; padding-top: 15px; font-size: 18px; font-weight: bold; color: #4F46E5; }
            .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; }
            .footer p { color: #666; font-size: 12px; line-height: 1.8; }
            .thank-you { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 8px; margin-top: 30px; }
            .thank-you h3 { font-size: 20px; margin-bottom: 8px; }
            .thank-you p { font-size: 14px; opacity: 0.9; }
            @media print {
              body { background: white; padding: 0; }
              .invoice-container { box-shadow: none; }
            }
          </style>
        </head>
        <body>
          ${invoiceHTML}
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              }
            }
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const deliveryCharge = 50;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <FaFileInvoice className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Invoice</h2>
              <p className="text-sm text-gray-600">{order.orderId}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FaDownload className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          <div id="invoice-content">
            <div className="invoice-container">
              <div className="invoice-header">
                <div className="company-info">
                  <h1>PAGESTRY</h1>
                  <p>Maruthi Extension, Gayathri Nagar<br />
                    Bangalore - 560021<br />
                    Phone: 1234567<br />
                    Email: contact@pagestry.com</p>
                </div>
                <div className="invoice-meta">
                  <h2>INVOICE</h2>
                  <p><strong>Invoice #:</strong> {order.orderId}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  <p><strong>Status:</strong> <span style={{ color: '#10b981', fontWeight: 600 }}>COD</span></p>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-box">
                  <h3>Bill To</h3>
                  <p>
                    <strong>{order.shippingAddress.fullName}</strong><br />
                    Email: {order.email}<br />
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>
                <div className="info-box">
                  <h3>Ship To</h3>
                  <p>
                    {order.shippingAddress.addressLine1}<br />
                    {order.shippingAddress.city} - {order.shippingAddress.zipCode}<br />
                    {order.shippingAddress.state}
                  </p>
                </div>
              </div>

              <div className="section-title">Order Items</div>
              <table>
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>Category</th>
                    <th className="text-right">Qty</th>
                    <th className="text-right">Price</th>
                    <th className="text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="font-semibold">{item.title}</td>
                      <td>{item.category}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td className="text-right">₹{(item.unitPrice / item.quantity).toFixed(2)}</td>
                      <td className="text-right font-semibold">₹{item.unitPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="summary">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{order.totalPrice.toLocaleString("en-IN")}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>₹{deliveryCharge}</span>
                </div>
                <div className="summary-row total">
                  <span>Total Amount:</span>
                  <span>₹{(order.totalPrice + deliveryCharge).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="thank-you">
                <h3>Thank You for Your Order!</h3>
                <p>We appreciate your business and hope you enjoy your books.</p>
              </div>

              <div className="footer">
                <p>
                  <strong>Payment Method:</strong> Cash on Delivery(COD)<br />
                  <br />
                  <strong>Terms and Conditions:</strong>
                  <br />
                  This is a computer-generated invoice and does not require a signature.<br />
                  For any queries, please contact us at contact@pagestry.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;