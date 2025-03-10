const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
const SECRET_KEY = "your_secret_key"; // 🔴 Change this to a more secure key!

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ✅ Connect to MySQL Database
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Change if needed
    password: "root", // Your MySQL password
    database: "food_delivery", // ✅ Ensure correct database name
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed:", err);
        return;
    }
    console.log("✅ Connected to MySQL database");
});

// ✅ SIGNUP - Register a New Customer
app.post("/signup", async (req, res) => {
    try {
        const { name, email, phone_no, password } = req.body;

        if (!name || !email || !phone_no || !password) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // ✅ Check if email already exists
        db.query("SELECT * FROM customer WHERE email = ?", [email], async (err, results) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: "Email already exists." });
            }

            try {
                // ✅ Hash the password before storing
                const hashedPassword = await bcrypt.hash(password, 10);

                // ✅ Insert user into the database (storing hashed password in `password` column)
                const sql = "INSERT INTO customer (name, email, phone_no, password) VALUES (?, ?, ?, ?)";
                db.query(sql, [name, email, phone_no, hashedPassword], (err, result) => {
                    if (err) {
                        console.error("❌ Signup error:", err);
                        return res.status(500).json({ message: "Signup failed!" });
                    }
                    return res.status(201).json({ message: "✅ User registered successfully!" });
                });
            } catch (hashError) {
                console.error("❌ Password hashing error:", hashError);
                res.status(500).json({ message: "Password hashing failed" });
            }
        });
    } catch (error) {
        console.error("❌ Signup process failed:", error);
        res.status(500).json({ message: "Signup process failed" });
    }
});

// ✅ SIGN IN - Authenticate User
app.post("/signin", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }

    const sql = "SELECT * FROM customer WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error", details: err });

        if (results.length === 0) {
            return res.status(400).json({ message: "User not found." });
        }

        const user = results[0];

        try {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({ message: "Invalid credentials." });
            }

            const token = jwt.sign({ id: user.customer_id, email: user.email }, SECRET_KEY, {
                expiresIn: "1h",
            });

            res.json({ message: "✅ Login successful!", token, user });
        } catch (compareError) {
            res.status(500).json({ error: "Password comparison failed", details: compareError });
        }
    });
});

// ✅ Default Route
app.get("/", (req, res) => {
    res.send("Welcome to the Food Delivery API!");
});

// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});



















