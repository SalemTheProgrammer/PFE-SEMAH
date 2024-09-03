require("dotenv").config(); // Load environment variables
const express = require("express");
const path = require("path");
const connectDB = require("./config"); // Ensure this connects to your MongoDB
const User = require("./models/User");
const Hairdresser = require("./models/Hairdresser");
const Appointment = require("./models/Appointement");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const app = express();

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(apiLimiter);

// Connect to MongoDB
connectDB();

// Registration route for customers
app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !confirmPassword ||
    password !== confirmPassword
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required and passwords must match" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    const token = jwt.sign({ userId: user._id, email: user.email }, "baklewa", {
      expiresIn: "1h",
    });
    await user.save();
    res.status(201).json({ user: user, token: token });
  } catch (err) {
    console.error("Error registering user:", err);
    res
      .status(500)
      .json({ error: "Failed to register user", details: err.message });
  }
});

// Registration route for hairdressers
app.post("/register-hairdresser", async (req, res) => {
  const {
    hairdresserName,
    hairdresserEmail,
    hairdresserPassword,
    hairdresserConfirmPassword,
    profileDescription,
  } = req.body;

  if (
    !hairdresserName ||
    !hairdresserEmail ||
    !hairdresserPassword ||
    !hairdresserConfirmPassword ||
    hairdresserPassword !== hairdresserConfirmPassword ||
    !profileDescription
  ) {
    return res
      .status(400)
      .json({ error: "All fields are required and passwords must match" });
  }

  try {
    const existingHairdresser = await Hairdresser.findOne({ hairdresserEmail });
    if (existingHairdresser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(hairdresserPassword, 10);
    const hairdresser = new Hairdresser({
      hairdresserName,
      hairdresserEmail,
      hairdresserPassword: hashedPassword,
      profileDescription, // Updated field name
    });
    await hairdresser.save();

    const token = jwt.sign(
      { userId: hairdresser._id, email: hairdresser.hairdresserEmail },
      "baklewa",
      {
        expiresIn: "1h",
      }
    );
    res.status(201).json({ hairdresser: hairdresser, token: token });
  } catch (err) {
    console.error("Error registering hairdresser:", err);
    res
      .status(500)
      .json({ error: "Failed to register hairdresser", details: err.message });
  }
});


// get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users', details: err.message });
  }
});







// Update a user by ID
app.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update user', details: err.message });
  }
});


// Delete a user by ID
app.delete('/users/:id', async (req, res) => {
  try {
    const userId = req.params.id.trim();
    console.log('User attempting to delete user with ID:', userId);

    // Find and delete the user based on the string _id
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      console.log('No user found with ID:', userId);
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User deleted successfully:', userId);
    res.json({ message: 'User deleted successfully' });

  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).json({ error: 'Failed to delete user', details: err.message });
  }
});


// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    let user = await User.findOne({ email });
    let isHairdresser = false;

    if (!user) {
      user = await Hairdresser.findOne({ hairdresserEmail: email });
      isHairdresser = !!user;
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(
      password,
      isHairdresser ? user.hairdresserPassword : user.password
    );
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const userObj = user.toObject();
    delete userObj.__v;
    if (isHairdresser) {
      delete userObj.hairdresserPassword;
      userObj.userType = "hairdresser"; // Add userType to response
    } else {
      delete userObj.password;
      userObj.userType = "customer"; // Add userType to response
    }

    // Generate JWT with email
    const token = jwt.sign({ userId: user._id, email: user.email }, "baklewa", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", user: userObj, token });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Failed to login", details: err.message });
  }
});

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  });
};

// Get all hairdressers route
app.get("/hairdressers", async (req, res) => {
  try {
    const hairdressers = await Hairdresser.find().lean();
    res.json(hairdressers);
  } catch (err) {
    console.error("Error fetching hairdressers:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch hairdressers", details: err.message });
  }
});

// Get appointments for a specific hairdresser route
app.get("/appointments/:hairdresserId", async (req, res) => {
  const { hairdresserId } = req.params;

  try {
    const appointments = await Appointment.find({ hairdresserId: hairdresserId }).lean();
    if (appointments.length === 0) {
      return res.status(404).json({ error: "No appointments found for this hairdresser" });
    }
    res.json(appointments); // Return the array of appointments directly
  } catch (err) {
    console.error("Error fetching appointments:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch appointments", details: err.message });
  }
});



// Approve an appointment for a specific hairdresser
app.post("/approve-appointment", async (req, res) => {
  const { hairdresserId, appointmentId } = req.body;

  try {
    // Find the appointment by hairdresserId and appointmentId
    const appointment = await Appointment.findOne({ _id: appointmentId, hairdresserId: hairdresserId });

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found for this hairdresser" });
    }

    // Update the appointment's approved status
    appointment.approved = true;
    await appointment.save();

    // Send email to the customer
    const customer = await User.findById(appointment.customerId);
    if (customer) {
      await sendAppointmentApprovedEmail(customer.email, appointment);
    }

    res.json({ message: "Appointment approved successfully", appointment });
  } catch (err) {
    console.error("Error approving appointment:", err);
    res
      .status(500)
      .json({ error: "Failed to approve appointment", details: err.message });
  }
});


// Get a specific hairdresser by ID
app.get('/hairdressers/:id', async (req, res) => {
  try {
    const hairdresser = await Hairdresser.findById(req.params.id).lean();
    if (!hairdresser) {
      return res.status(404).json({ error: 'Hairdresser not found' });
    }
    res.json(hairdresser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch hairdresser', details: err.message });
  }
});


// Delete an appointment by ID
app.delete('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndDelete(req.params.id).lean();
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete appointment', details: err.message });
  }
});



// Update an appointment by ID
app.put('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update appointment', details: err.message });
  }
});


app.get('/appointments/:id', async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).lean();
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointment', details: err.message });
  }
});


// Delete a hairdresser by ID
app.delete('/hairdressers/:id', async (req, res) => {
  try {
    const hairdresser = await Hairdresser.findByIdAndDelete(req.params.id).lean();
    if (!hairdresser) {
      return res.status(404).json({ error: 'Hairdresser not found' });
    }
    res.json({ message: 'Hairdresser deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete hairdresser', details: err.message });
  }
});



// Update a hairdresser by ID
app.put('/hairdressers/:id', async (req, res) => {
  try {
    const hairdresser = await Hairdresser.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
    if (!hairdresser) {
      return res.status(404).json({ error: 'Hairdresser not found' });
    }
    res.json(hairdresser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update hairdresser', details: err.message });
  }
});


// get all appointments
app.get('/appointments', async (req, res) => {
  try {
    const appointments = await Appointment.find().lean();
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
}
});



async function sendAppointmentApprovedEmail(customerEmail, appointment) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: customerEmail,
    subject: "Your Appointment Has Been Approved",
    html: `
      <h2>Appointment Approved</h2>
      <p>Dear customer,</p>
      <p>We are pleased to inform you that your appointment with the hairdresser has been approved.</p>
      <p>Appointment Details:</p>
      <ul>
        <li>Date: ${appointment.date}</li>
        <li>Time: ${appointment.time}</li>
      </ul>
      <p>Thank you for choosing our services.</p>
      <p>Best regards,</p>
      <p>The Hairdresser Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}







// Book an appointment route
app.post('/book-appointment', async (req, res) => {
  const { hairdresserId, customerId, date, time } = req.body;

  try {
    const existingAppointment = await Appointment.findOne({
      hairdresserId,
      customerId,
      date,
      time,
    });

    if (existingAppointment) {
      return res.status(400).json({ error: 'You already have an appointment scheduled at this time.' });
    }

    const appointment = new Appointment({
      hairdresserId,
      customerId,
      date,
      time,
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (err) {
    console.error('Error booking appointment:', err);
    res.status(500).json({ error: 'Failed to book appointment', details: err.message });
  }
});





// Email sending route
app.post("/send-email", async (req, res) => {
  const { cart, email } = req.body; // Retrieve email and cart from request body

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable
      pass: process.env.EMAIL_PASS, // Use environment variable
    },
  });

  const cartDetails = Object.values(cart)
    .map((item) => `<li>${item.name}: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}</li>`)
    .join("");

  const total = Object.values(cart).reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  ).toFixed(2);

  const mailOptions = {
    from: process.env.EMAIL_USER, // Use environment variable
    to: email, // Send email to the provided email
    subject: "Your Cart Details",
    html: `<h2>Your Cart</h2><ul>${cartDetails}</ul><h3>Total: $${total}</h3>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});
// Serve static files from the React app
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../home/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../home/build", "index.html"));
  });
}

// Set the port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});