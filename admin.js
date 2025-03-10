// Admin authentication endpoint
app.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    
    // Query the admin database
    const sql = "SELECT * FROM admin.login WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });
        
        if (results.length === 0) {
            return res.status(400).json({ message: "Admin not found." });
        }
        
        const admin = results[0];
        
        // For simplicity, we're doing a direct comparison
        // In production, use bcrypt.compare() like in your user authentication
        if (password !== admin.password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }
        
        const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, SECRET_KEY, {
            expiresIn: "1h",
        });
        
        res.json({ 
            message: "Login successful!", 
            token, 
            admin: { 
                id: admin.id,
                email: admin.email,
                name: admin.name
            } 
        });
    });
});

// Admin middleware to verify admin token
const verifyAdminToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Unauthorized. No token provided." });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden. Admin access required." });
        }
        
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
};

// Get all food items
app.get("/admin/items", verifyAdminToken, (req, res) => {
    const sql = `
        SELECT i.*, r.name as restaurant_name 
        FROM food_items i
        JOIN restaurants r ON i.restaurant_id = r.id
        ORDER BY i.id DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        res.json({ success: true, items: results });
    });
});

// Add a new food item
app.post("/admin/items", verifyAdminToken, (req, res) => {
    const { restaurant_id, category, name, price, description, is_veg } = req.body;
    
    // Validate required fields
    if (!restaurant_id || !category || !name || !price) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Handle image upload (in a real app, you'd use multer or similar)
    let image_url = null;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }
    
    const sql = `
        INSERT INTO food_items (restaurant_id, category, name, price, description, is_veg, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.query(sql, [restaurant_id, category, name, price, description, is_veg, image_url], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to add item" });
        }
        
        res.json({ success: true, message: "Item added successfully", item_id: result.insertId });
    });
});

// Update a food item
app.put("/admin/items/:id", verifyAdminToken, (req, res) => {
    const itemId = req.params.id;
    const { restaurant_id, category, name, price, description, is_veg } = req.body;
    
    // Validate required fields
    if (!restaurant_id || !category || !name || !price) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    
    // Handle image update if provided
    let updateQuery = `
        UPDATE food_items
        SET restaurant_id = ?, category = ?, name = ?, price = ?, description = ?, is_veg = ?
        WHERE id = ?
    `;
    
    let params = [restaurant_id, category, name, price, description, is_veg, itemId];
    
    // If image is updated
    if (req.file) {
        updateQuery = `
            UPDATE food_items
            SET restaurant_id = ?, category = ?, name = ?, price = ?, description = ?, is_veg = ?, image_url = ?
            WHERE id = ?
        `;
        params.push(`/uploads/${req.file.filename}`);
    }
    
    db.query(updateQuery, params, (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to update item" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        
        res.json({ success: true, message: "Item updated successfully" });
    });
});

// Delete a food item
app.delete("/admin/items/:id", verifyAdminToken, (req, res) => {
    const itemId = req.params.id;
    
    const sql = "DELETE FROM food_items WHERE id = ?";
    
    db.query(sql, [itemId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to delete item" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }
        
        res.json({ success: true, message: "Item deleted successfully" });
    });
});

// Get all orders
app.get("/admin/orders", verifyAdminToken, (req, res) => {
    const sql = `
        SELECT o.*, c.name as customer_name, c.phone_no as phone
        FROM orders o
        JOIN customer c ON o.customer_id = c.customer_id
        ORDER BY o.created_at DESC
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }
        
        // Format order items
        results.forEach(order => {
            try {
                order.items = JSON.parse(order.items);
            } catch (e) {
                order.items = [];
            }
        });
        
        res.json({ success: true, orders: results });
    });
});

// Update order status
app.put("/admin/orders/:id/status", verifyAdminToken, (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    
    if (!status) {
        return res.status(400).json({ success: false, message: "Status is required" });
    }
    
    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    
    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to update order status" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.json({ success: true, message: "Order status updated successfully" });
    });
});

// Delete an order
app.delete("/admin/orders/:id", verifyAdminToken, (req, res) => {
    const orderId = req.params.id;
    
    const sql = "DELETE FROM orders WHERE id = ?";
    
    db.query(sql, [orderId], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ success: false, message: "Failed to delete order" });
        }
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        
        res.json({ success: true, message: "Order deleted successfully" });
    });
});