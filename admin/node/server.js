const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;




// MongoDB connection setup (use your connection string)
const mongoUrl =
  "mongodb+srv://kasinathan:kasinathan@cluster0.vuuz6qh.mongodb.net/test?retryWrites=true&w=majority&appName=AtlasApp";

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Define a Mongoose model for the "UserInfo" collection with an explicit collection name
const UserInfo = mongoose.model("UserInfo", {
  fname: String,
  lname: String,
  email: String,
  password: String,
}, 'UserInfo'); // Specify the collection name here

// Routes
app.get("/userinfo", async (req, res) => {
  try {
    const users = await UserInfo.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

app.post("/userinfo", async (req, res) => {
  try {
    const newUser = new UserInfo(req.body);
    await newUser.save();
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
});

app.put("/userinfo/:id", async (req, res) => {
  try {
    const updatedUser = await UserInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

app.delete("/userinfo/:id", async (req, res) => {
  try {
    await UserInfo.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting user" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
