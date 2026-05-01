export default function ResultCard({ result }: any) {
  if (!result) return null;

  return (
    <div style={card}>
      <h3>📊 Export Result</h3>

      <p><strong>Product:</strong> {result.product}</p>
      <p><strong>Country:</strong> {result.country}</p>
      <p><strong>Status:</strong> {result.allowed ? "✅ Allowed" : "❌ Restricted"}</p>
      <p><strong>HS Code:</strong> {result.hs_code}</p>

      <h4>💰 Profit</h4>
      <p>Profit: £{result.profit}</p>
      <p>ROI: {result.roi}</p>

      <h4>📄 Documents</h4>
      <ul>
        {result.documents.map((doc: string, i: number) => (
          <li key={i}>{doc}</li>
        ))}
      </ul>
    </div>
  );
}

const card = {
  background: "#0F172A",
  padding: 20,
  borderRadius: 10,
  marginTop: 20,
};