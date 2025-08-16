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

