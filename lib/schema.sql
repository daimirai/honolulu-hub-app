-- Tables for Honolulu Hub MVP

-- 1. Products (Live Inventory)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  available_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  farmer_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Orders (Customer Transactions)
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email TEXT,
  total_amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'paid', -- pending, paid, picked_up, cancelled
  pickup_hub TEXT DEFAULT 'Kailua Coffee Co.',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Order Items (Line Items for Each Box)
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_purchase DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Settings
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Simple Public Policies for MVP
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Public Create Order Items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON order_items FOR SELECT USING (true);
CREATE POLICY "Admin Update Orders" ON orders FOR UPDATE USING (true);

-- Sample Data
INSERT INTO products (name, description, price, available_quantity, status)
VALUES 
  ('Apple Bananas (Bunch)', 'Grown in Waimanalo. Sweet and dense.', 6.00, 40, 'Active'),
  ('Taro / Kalo (1 lb)', 'Freshly harvested. Perfect for poi or roasting.', 4.50, 100, 'Active'),
  ('Okinawan Sweet Potato (2 lb)', 'Vibrant purple, naturally sweet.', 7.50, 50, 'Active'),
  ('Cherry Tomatoes (Pint)', 'Sun-ripened in Waimanalo.', 5.00, 30, 'Active')
ON CONFLICT DO NOTHING;
