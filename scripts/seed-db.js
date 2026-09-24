#!/usr/bin/env node
/**
 * Builds server/data/workspace.db from scratch: a small storefront schema
 * with enough rows that pagination actually matters. Safe to re-run, it
 * wipes and recreates the file each time.
 */

const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3');

const DB_PATH = path.join(__dirname, '..', 'server', 'data', 'workspace.db');
const CATEGORIES = ['electronics', 'kitchen', 'office', 'outdoor', 'toys'];
const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

function seededRandom(seed) {
  let value = seed;
  return () => {
    value = (value * 1103515245 + 12345) & 0x7fffffff;
    return value / 0x7fffffff;
  };
}

const random = seededRandom(42);
const randInt = (min, max) => min + Math.floor(random() * (max - min + 1));

function isoDaysFrom(base, days, hours = 0) {
  const d = new Date(base.getTime() + days * 86400000 + hours * 3600000);
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

function main() {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  if (fs.existsSync(DB_PATH)) fs.unlinkSync(DB_PATH);

  const db = new sqlite3.Database(DB_PATH);
  const base = new Date('2025-01-01T00:00:00Z');

  db.serialize(() => {
    db.run(`CREATE TABLE customers (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE products (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price_cents INTEGER NOT NULL
    )`);
    db.run(`CREATE TABLE orders (
      id INTEGER PRIMARY KEY,
      customer_id INTEGER NOT NULL REFERENCES customers(id),
      status TEXT NOT NULL,
      created_at TEXT NOT NULL
    )`);
    db.run(`CREATE TABLE order_items (
      id INTEGER PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id),
      product_id INTEGER NOT NULL REFERENCES products(id),
      quantity INTEGER NOT NULL,
      unit_price_cents INTEGER NOT NULL
    )`);
    db.run('CREATE INDEX idx_orders_customer_id ON orders(customer_id)');
    db.run('CREATE INDEX idx_order_items_order_id ON order_items(order_id)');
    db.run('CREATE INDEX idx_order_items_product_id ON order_items(product_id)');

    const insertCustomer = db.prepare('INSERT INTO customers VALUES (?, ?, ?, ?)');
    for (let i = 1; i <= 60; i++) {
      insertCustomer.run(i, `Customer ${i}`, `customer${i}@example.com`, isoDaysFrom(base, randInt(0, 400)));
    }
    insertCustomer.finalize();

    const products = [];
    const insertProduct = db.prepare('INSERT INTO products VALUES (?, ?, ?, ?)');
    for (let i = 1; i <= 40; i++) {
      const category = CATEGORIES[i % CATEGORIES.length];
      const price = randInt(500, 25000);
      products.push({ id: i, price });
      insertProduct.run(i, `Product ${i}`, category, price);
    }
    insertProduct.finalize();

    const insertOrder = db.prepare('INSERT INTO orders VALUES (?, ?, ?, ?)');
    for (let i = 1; i <= 500; i++) {
      const customerId = randInt(1, 60);
      const status = STATUSES[randInt(0, STATUSES.length - 1)];
      insertOrder.run(i, customerId, status, isoDaysFrom(base, randInt(0, 400), randInt(0, 23)));
    }
    insertOrder.finalize();

    const insertItem = db.prepare('INSERT INTO order_items VALUES (?, ?, ?, ?, ?)');
    let itemId = 1;
    let itemCount = 0;
    for (let orderId = 1; orderId <= 500; orderId++) {
      const lines = randInt(1, 4);
      for (let l = 0; l < lines; l++) {
        const productId = randInt(1, 40);
        const quantity = randInt(1, 5);
        const unitPrice = products[productId - 1].price;
        insertItem.run(itemId, orderId, productId, quantity, unitPrice);
        itemId++;
        itemCount++;
      }
    }
    insertItem.finalize();

    db.close(() => {
      console.log(`Seeded ${DB_PATH} with 60 customers, 40 products, 500 orders, ${itemCount} order_items.`);
    });
  });
}

main();
