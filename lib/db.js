import Database from "better-sqlite3";
import path from "path";

const DB_PATH = path.join(process.cwd(), "coffeeshop.db");

let db;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    initDb(db);
  }
  return db;
}

function initDb(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price_eth REAL NOT NULL,
      image_url TEXT,
      description TEXT,
      category TEXT NOT NULL DEFAULT 'coffee'
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      wallet_address TEXT NOT NULL,
      total_eth REAL NOT NULL,
      tx_hash TEXT,
      status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `);

  const count = db.prepare("SELECT COUNT(*) as cnt FROM products").get();
  if (count.cnt === 0) {
    const insert = db.prepare(
      "INSERT INTO products (name, price_eth, image_url, description, category) VALUES (?, ?, ?, ?, ?)"
    );
    const seed = db.transaction(() => {
      // Coffee
      insert.run("Espresso", 80, "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400", "Rich, bold single shot pulled from premium Arabica beans.", "coffee");
      insert.run("Cappuccino", 120, "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400", "Velvety espresso topped with perfectly steamed milk foam.", "coffee");
      insert.run("Cold Brew", 150, "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400", "Slow-steeped for 18 hours. Smooth, low-acid, and refreshing.", "coffee");
      insert.run("Latte", 130, "https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=400", "Silky espresso and steamed milk in perfect harmony.", "coffee");
      insert.run("Americano", 90, "https://images.unsplash.com/photo-1580933073521-dc49ac0d4e6a?w=400", "Espresso diluted with hot water for a clean, full-bodied cup.", "coffee");
      // Bakery
      insert.run("Butter Croissant", 60, "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400", "Flaky, golden layers of buttery pastry baked fresh daily.", "bakery");
      insert.run("Blueberry Muffin", 55, "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400", "Fluffy muffin packed with juicy blueberries and a crunchy sugar top.", "bakery");
      insert.run("Banana Bread", 70, "https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400", "Moist, dense loaf made with ripe bananas and a hint of cinnamon.", "bakery");
      insert.run("Cinnamon Roll", 75, "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400", "Soft, pillowy roll swirled with cinnamon sugar and cream cheese glaze.", "bakery");
      insert.run("Chocolate Brownie", 65, "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=400", "Dense and fudgy with a crinkly top. Pure chocolate indulgence.", "bakery");
    });
    seed();
  }
}

export default getDb;
