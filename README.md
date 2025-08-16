# 🍴 Kinfoods – Food Delivery App  

Kinfoods is a web-based food delivery application that allows customers to browse menus, add food to carts, place orders, and make payments. It includes an **Admin Panel** for managing restaurants, menus, orders, delivery agents, and customers.  

---

## 🚀 Features  

### 👤 User Panel  
- Register and log in securely.  
- Browse restaurants and menus.  
- Add items to cart and apply coupons.  
- Place orders with multiple payment options (cash/card).  
- Track orders in real-time.  
- Rate and review restaurants and delivery agents.  

### 🛠 Admin Panel  
- Manage restaurants, menus, and coupons.  
- Track customers, delivery agents, and orders.  
- View and manage payments.  
- Access reviews and ratings.  
- Authentication system for admin login.  

---

## 🗄️ Database Structure  

Kinfoods uses **MySQL** for database management.  

### Database 1: `admin`  
```sql
CREATE DATABASE admin;

USE admin;

CREATE TABLE login (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE DATABASE food_delivery;

USE food_delivery;

CREATE TABLE customer (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(15),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE address (
    address_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id)
);

CREATE TABLE restaurant (
    restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    location VARCHAR(255),
    rating DECIMAL(2,1)
);

CREATE TABLE menu (
    item_id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    item_name VARCHAR(100),
    price DECIMAL(10,2),
    availability BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE coupon (
    coupon_id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE,
    discount DECIMAL(5,2),
    expiry_date DATE
);

CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    restaurant_id INT,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);

CREATE TABLE order_details (
    detail_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    item_id INT,
    quantity INT,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (item_id) REFERENCES menu(item_id)
);

CREATE TABLE payment (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    method VARCHAR(50), -- e.g. cash, card
    amount DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'Pending',
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

CREATE TABLE card_payment (
    card_id INT AUTO_INCREMENT PRIMARY KEY,
    payment_id INT,
    card_number VARCHAR(20),
    card_holder VARCHAR(100),
    expiry_date VARCHAR(10),
    cvv VARCHAR(4),
    FOREIGN KEY (payment_id) REFERENCES payment(payment_id)
);

CREATE TABLE delivery_agent (
    agent_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(15),
    status VARCHAR(50) DEFAULT 'Available'
);

CREATE TABLE review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT,
    restaurant_id INT,
    rating DECIMAL(2,1),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurant(restaurant_id)
);
⚙️ Tech Stack

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

Database: MySQL

Authentication: JWT-based login system
