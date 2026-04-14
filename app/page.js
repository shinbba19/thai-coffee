import getDb from "@/lib/db";
import MenuTabs from "@/components/MenuTabs";

export default async function HomePage() {
  const db = getDb();
  const products = db.prepare("SELECT * FROM products ORDER BY category, id").all();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Menu</h1>
      <p className="text-gray-500 mb-6">Pay with MTHB1 (My Thai Baht) via MetaMask on Sepolia testnet.</p>
      <MenuTabs products={products} />
    </div>
  );
}
