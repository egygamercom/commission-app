-- Run this in Supabase SQL Editor to add the order_number column
ALTER TABLE sales ADD COLUMN IF NOT EXISTS order_number text DEFAULT '';
