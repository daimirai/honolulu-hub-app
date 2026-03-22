-- Create the products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  available_quantity INTEGER DEFAULT 0,
  status TEXT DEFAULT 'Active',
  farmer_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public to read products (for the storefront)
CREATE POLICY "Public can view products" ON products
  FOR SELECT USING (true);

-- Allow farmers to manage their own products
CREATE POLICY "Farmers can manage their own products" ON products
  FOR ALL USING (auth.uid() = farmer_id);

-- Insert sample data
INSERT INTO products (name, description, price, available_quantity, status)
VALUES 
  ('Apple Bananas (Bunch)', 'Grown in Waimanalo. Sweet and dense.', 6.00, 40, 'Active'),
  ('Taro / Kalo (1 lb)', 'Freshly harvested. Perfect for poi or roasting.', 4.50, 100, 'Active'),
  ('Okinawan Sweet Potato (2 lb)', 'Vibrant purple, naturally sweet.', 7.50, 50, 'Active'),
  ('Cherry Tomatoes (Pint)', 'Sun-ripened in Waimanalo.', 5.00, 30, 'Active');
