import { useState, useEffect } from "react";
import "./style.css";

const serviceCosts = {
  "General Service": 4200,
  "Oil Change": 2500,
  "Brake Inspection": 1500,
  "Engine Check": 3000,
  "Tyre Replacement": 6000,
};

function App() {
  const [currentUser, setCurrentUser] = useState(null); 
  const [history, setHistory] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [formData, setFormData] = useState({
    vehicleRegNo: "", 
    service: "General Service",
    date: "",
    time: "",
    notes: "",
    damages: "",
  });

  const [vehicleForm, setVehicleForm] = useState({
    model: "",
    regNo: "",
    fuel: "Petrol",
    year: "",
    km: "",
  });

  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [authMessage, setAuthMessage] = useState("");

  useEffect(() => {
    if (!currentUser) {
      setVehicles([]);
      setHistory([]);
      return;
    }
    fetchVehicles(currentUser.id);
    fetchBookings(currentUser.id);
  }, [currentUser]);

  useEffect(() => {
    if (vehicles.length > 0 && !formData.vehicleRegNo) {
      setFormData((prev) => ({ ...prev, vehicleRegNo: vehicles[0].regNo }));
    }
  }, [vehicles]);

  const fetchVehicles = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8082/api/vehicles/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setVehicles(data);
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const fetchBookings = async (userId) => {
    try {
      const res = await fetch(`http://localhost:8082/api/bookings/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleVehicleChange = (e) => {
    const { name, value } = e.target;
    setVehicleForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthChange = (e) => {
    const { name, value } = e.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to extract service name and vehicle registration
  const parseServiceDetails = (rawService) => {
    let serviceName = rawService;
    let vehicleReg = "Unknown Vehicle";
    if (rawService && rawService.includes(" (") && rawService.endsWith(")")) {
      const parts = rawService.split(" (");
      serviceName = parts[0];
      vehicleReg = parts[1].replace(")", "");
    }
    return { serviceName, vehicleReg };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in first to book a service.");
      scrollToSection("auth-section");
      return;
    }

    const { vehicleRegNo, service, date, time, notes, damages } = formData;

    if (!vehicleRegNo) {
      alert("Please select a vehicle from your garage first.");
      return;
    }

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    const calculatedCost = serviceCosts[service] || 0;
    const formattedDate = formatDate(date);

    const newBooking = {
      userId: currentUser.id,
      date: formattedDate,
      service: `${service} (${vehicleRegNo})`, 
      cost: calculatedCost,
      status: "Booked",
      time,
      notes,
      damages: damages.trim() ? damages : "None reported",
    };

    try {
      const res = await fetch("http://localhost:8082/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBooking),
      });

      if (res.ok) {
        fetchBookings(currentUser.id);
        alert(`Service Booked Successfully for ${vehicleRegNo}!`);
        setFormData({ 
          vehicleRegNo: vehicles.length > 0 ? vehicles[0].regNo : "", 
          service: "General Service", 
          date: "", 
          time: "", 
          notes: "", 
          damages: "" 
        });
      }
    } catch (err) {
      alert("Failed to book service.");
    }
  };

  const handleVehicleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please log in first to register a vehicle.");
      scrollToSection("auth-section");
      return;
    }

    const { model, regNo, fuel, year, km } = vehicleForm;

    if (!model || !regNo || !year || !km) {
      alert("Please fill in all vehicle details.");
      return;
    }

    const numericKm = parseInt(km.replace(/[^0-9]/g, "")) || 0;
    const autoStatus = numericKm > 80000 ? "Damaged / Needs Attention" : "Healthy";

    const newVehicle = {
      userId: currentUser.id,
      model,
      regNo,
      fuel,
      year,
      km: km.includes("km") ? km : `${km} km`,
      status: autoStatus, 
    };

    try {
      const res = await fetch("http://localhost:8082/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newVehicle),
      });

      if (res.ok) {
        fetchVehicles(currentUser.id);
        alert(`New Vehicle (${model}) Added!\nSystem Status: ${autoStatus}`);
        setVehicleForm({ model: "", regNo: "", fuel: "Petrol", year: "", km: "" });
      }
    } catch (err) {
      alert("Failed to add vehicle.");
    }
  };

  const handleStatusToggle = async (id) => {
    try {
      // 1. Find the booking we are completing to get the vehicle registration
      const bookingToComplete = history.find(b => b.id === id);
      let vehicleToHeal = null;

      if (bookingToComplete) {
        const { vehicleReg } = parseServiceDetails(bookingToComplete.service);
        vehicleToHeal = vehicles.find(v => v.regNo === vehicleReg);
      }

      // 2. Mark the service booking as "Completed"
      const res = await fetch(`http://localhost:8082/api/bookings/${id}/complete`, {
        method: "PUT",
      });

      if (res.ok && currentUser) {
        // 3. Automated Healing Logic: If the vehicle exists and is damaged, update it to "Healthy"
        if (vehicleToHeal && vehicleToHeal.status !== "Healthy") {
          const updatedVehicle = { ...vehicleToHeal, status: "Healthy" };
          
          await fetch("http://localhost:8082/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedVehicle), // Sending existing ID forces a database UPDATE
          });
        }

        // 4. Refresh both tables to update the UI
        fetchBookings(currentUser.id);
        fetchVehicles(currentUser.id);
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDownloadInvoice = (item) => {
    const { serviceName, vehicleReg } = parseServiceDetails(item.service);

    const invoiceContent = `
========================================
            MOTORMILE INVOICE          
========================================
Date of Service: ${item.date}
Vehicle Reg No:  ${vehicleReg}
Service Type:    ${serviceName}
Status:          ${item.status}
----------------------------------------
Reported Damages/Issues:
${item.damages || "None reported"}
----------------------------------------
Total Cost:      ₹${item.cost ? item.cost.toLocaleString("en-IN") : 0}
----------------------------------------
Notes:           ${item.notes || "Standard periodic maintenance check performed successfully."}
========================================
Thank you for choosing MotorMile!
Vehicle Maintenance Management System
========================================
    `.trim();

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MotorMile-Invoice-${serviceName.replace(/[^a-zA-Z0-9]/g, "-")}-${item.date.replace(/\s+/g, "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const totalExpense = history
    .filter((item) => item.status === "Completed")
    .reduce((acc, curr) => acc + (curr.cost || 0), 0);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthMessage("");

    const endpoint =
      authMode === "register"
        ? "http://localhost:8082/api/users/register"
        : "http://localhost:8082/api/users/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });

      const textResponse = await response.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch {
        data = { message: textResponse };
      }

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (authMode === "login") {
        setCurrentUser(data);
        setAuthMessage(`Welcome back, ${data.username || authForm.username}!`);
      } else {
        setAuthMessage(`Account created successfully for ${data.username || authForm.username}! Please log in.`);
        setAuthMode("login");
      }
      setAuthForm({ username: "", password: "" });
    } catch (err) {
      setAuthMessage(err.message);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setVehicles([]);
    setHistory([]);
    setAuthMessage("Logged out successfully.");
  };

  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">🚗</span>
          <span>
            Motor<span className="logo-highlight">Mile</span>
          </span>
        </div>

        <div className="nav-links">
          <a href="#dashboard" onClick={(e) => { e.preventDefault(); scrollToSection("dashboard"); }}>Dashboard</a>
          <a href="#analytics" onClick={(e) => { e.preventDefault(); scrollToSection("analytics"); }}>Analytics</a>
          <a href="#auth-section" onClick={(e) => { e.preventDefault(); scrollToSection("auth-section"); }}>Account</a>
          <a href="#vehicle" onClick={(e) => { e.preventDefault(); scrollToSection("vehicle"); }}>My Vehicles</a>
          <a href="#service" onClick={(e) => { e.preventDefault(); scrollToSection("service"); }}>Book Service</a>
          <a href="#history" onClick={(e) => { e.preventDefault(); scrollToSection("history"); }}>Service History</a>
        </div>
      </nav>

      <main className="container" id="dashboard">
        <section className="welcome">
          <div className="welcome-text">
            <span className="welcome-tag">DATABASE-BACKED ARCHITECTURE</span>
            <h1>
              Welcome to <span>MotorMile</span>
            </h1>
          </div>

          <div className="welcome-status">
            <div className="status-dot" style={{ backgroundColor: currentUser ? "green" : "orange" }}></div>
            <span>
              {currentUser ? (
                <>Logged in as: <strong>{currentUser.username}</strong> ({vehicles.length} Vehicle(s))</>
              ) : (
                <>Status: <strong>Please Log In</strong></>
              )}
            </span>
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <div className="card-top">
              <div className="card-icon">🚗</div>
              <span className="card-label">GARAGE</span>
            </div>
            <h3>Total Vehicles</h3>
            <p>{vehicles.length} Cars</p>
            <span className="card-info">Your registered vehicles</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">💰</div>
              <span className="card-label">EXPENSES</span>
            </div>
            <h3>Total Spent</h3>
            <p>₹{totalExpense.toLocaleString("en-IN")}</p>
            <span className="card-info">Completed maintenance</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">🔧</div>
              <span className="card-label">SERVICES</span>
            </div>
            <h3>Total Services</h3>
            <p>{history.length}</p>
            <span className="card-info">Logged in database</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">🛡️</div>
              <span className="card-label">FLEET HEALTH</span>
            </div>
            <h3>Garage Status</h3>
            <p style={{ color: vehicles.filter(v => v.status !== "Healthy").length > 0 ? "#dc3545" : "green", fontSize: "18px", fontWeight: "bold" }}>
              {vehicles.filter(v => v.status !== "Healthy").length > 0 ? "⚠️ Action Needed" : "● Optimal"}
            </p>
            <span className="card-info">
              {vehicles.filter(v => v.status !== "Healthy").length} vehicle(s) damaged
            </span>
          </div>
        </section>

        <section className="box" id="analytics">
          <div className="section-heading">
            <div>
              <span className="section-tag">DATA INSIGHTS</span>
              <h2>Service Cost Breakdown & Analytics</h2>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #0066cc" }}>
              <h4>Total Completed Maintenance</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#0066cc", margin: "10px 0 0 0" }}>
                ₹{totalExpense.toLocaleString("en-IN")}
              </p>
              <small style={{ color: "#666" }}>Accumulated from MySQL records</small>
            </div>
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #28a745" }}>
              <h4>Average Cost per Service</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#28a745", margin: "10px 0 0 0" }}>
                ₹{history.filter(h => h.status === "Completed").length > 0 ? Math.round(totalExpense / history.filter(h => h.status === "Completed").length).toLocaleString("en-IN") : 0}
              </p>
              <small style={{ color: "#666" }}>Calculated on completed records</small>
            </div>
            <div style={{ background: "#f8f9fa", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #ffc107" }}>
              <h4>Pending Bookings</h4>
              <p style={{ fontSize: "24px", fontWeight: "bold", color: "#d97706", margin: "10px 0 0 0" }}>
                {history.filter(h => h.status === "Booked").length} Service(s)
              </p>
              <small style={{ color: "#666" }}>Upcoming scheduled appointments</small>
            </div>
          </div>
        </section>

        <section className="box" id="auth-section">
          <div className="section-heading">
            <div>
              <span className="section-tag">SECURITY & ACCESS</span>
              <h2>{currentUser ? "User Account" : authMode === "register" ? "Register Account" : "User Login"}</h2>
            </div>
            <div>
              {!currentUser && (
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
                  style={{ cursor: "pointer", background: "none", border: "none", color: "#0066cc", fontWeight: "bold" }}
                >
                  Switch to {authMode === "login" ? "Register" : "Login"}
                </button>
              )}
            </div>
          </div>

          {currentUser ? (
            <div style={{ padding: "10px 0" }}>
              <p style={{ fontSize: "16px", marginBottom: "15px" }}>
                You are currently logged in as <strong>{currentUser.username}</strong>.
              </p>
              <button
                type="button"
                onClick={handleLogout}
                style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}
              >
                Logout 🚪
              </button>
            </div>
          ) : (
            <form onSubmit={handleAuthSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username" value={authForm.username} onChange={handleAuthChange} placeholder="Enter username" required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password" value={authForm.password} onChange={handleAuthChange} placeholder="Enter password" required />
              </div>

              <button type="submit">{authMode === "register" ? "Create Account →" : "Login →"}</button>
            </form>
          )}

          {authMessage && (
            <p style={{ marginTop: "15px", fontWeight: "500", color: authMessage.includes("success") || authMessage.includes("Welcome") ? "green" : "red" }}>
              {authMessage}
            </p>
          )}
        </section>

        <section className="box" id="vehicle">
          <div className="section-heading">
            <div>
              <span className="section-tag">MY GARAGE</span>
              <h2>Registered Vehicles ({vehicles.length})</h2>
            </div>
          </div>

          {!currentUser ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>Please log in to view and manage your garage vehicles.</p>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "30px" }}>
                {vehicles.map((car) => (
                  <div key={car.id} style={{ border: "1px solid #e0e0e0", borderRadius: "10px", padding: "20px", background: "#f9f9f9" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                      <strong style={{ fontSize: "18px" }}>🚘 {car.model}</strong>
                      <span style={{ color: car.status === "Healthy" ? "green" : "#dc3545", fontWeight: "bold", fontSize: "13px" }}>
                        ● {car.status}
                      </span>
                    </div>
                    <p style={{ margin: "5px 0" }}><small>Registration No:</small> <strong>{car.regNo}</strong></p>
                    <p style={{ margin: "5px 0" }}><small>Fuel Type:</small> <strong>{car.fuel}</strong></p>
                    <p style={{ margin: "5px 0" }}><small>Model Year:</small> <strong>{car.year}</strong></p>
                    <p style={{ margin: "5px 0" }}><small>Current KM:</small> <strong>{car.km}</strong></p>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "2px solid #eee", paddingTop: "25px" }}>
                <h3>Register a New Vehicle</h3>
                <form onSubmit={handleVehicleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="model">Vehicle Model (e.g. Hyundai Creta)</label>
                      <input type="text" id="model" name="model" value={vehicleForm.model} onChange={handleVehicleChange} placeholder="Enter vehicle model" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="regNo">Registration No. (e.g. MP 19 XY 1234)</label>
                      <input type="text" id="regNo" name="regNo" value={vehicleForm.regNo} onChange={handleVehicleChange} placeholder="Enter registration number" required />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="fuel">Fuel Type</label>
                      <select id="fuel" name="fuel" value={vehicleForm.fuel} onChange={handleVehicleChange}>
                        <option value="Petrol">Petrol</option>
                        <option value="Diesel">Diesel</option>
                        <option value="Electric">Electric</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="year">Model Year</label>
                      <input type="text" id="year" name="year" value={vehicleForm.year} onChange={handleVehicleChange} placeholder="e.g. 2024" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="km">Current KM</label>
                      <input type="text" id="km" name="km" value={vehicleForm.km} onChange={handleVehicleChange} placeholder="e.g. 12,000" required />
                    </div>
                  </div>

                  <button type="submit">Add Vehicle to Database →</button>
                </form>
              </div>
            </>
          )}
        </section>

        <section className="box" id="service">
          <div className="section-heading">
            <div>
              <span className="section-tag">SERVICE CENTER</span>
              <h2>Book a Service & Report Damages</h2>
            </div>
          </div>

          {!currentUser ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>Please log in to book a service appointment.</p>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="vehicleRegNo">Select Vehicle from Garage</label>
                {vehicles.length === 0 ? (
                  <p style={{ color: "red", fontSize: "14px", marginTop: "5px" }}>You must register a vehicle in your garage first.</p>
                ) : (
                  <select id="vehicleRegNo" name="vehicleRegNo" value={formData.vehicleRegNo} onChange={handleChange} required>
                    <option value="" disabled>-- Select a vehicle --</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.regNo}>{v.model} ({v.regNo})</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="service">Select Service Type</label>
                <select id="service" name="service" value={formData.service} onChange={handleChange}>
                  <option value="General Service">General Service</option>
                  <option value="Oil Change">Oil Change</option>
                  <option value="Brake Inspection">Brake Inspection</option>
                  <option value="Engine Check">Engine Check</option>
                  <option value="Tyre Replacement">Tyre Replacement</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="date">Preferred Date</label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
                </div>

                <div className="form-group">
                  <label htmlFor="time">Preferred Time</label>
                  <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="damages">Reported Damages / Dents / Scratches</label>
                <input
                  type="text"
                  id="damages"
                  name="damages"
                  placeholder="e.g. Front bumper scratch, left mirror crack"
                  value={formData.damages}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Service Notes</label>
                <textarea id="notes" name="notes" placeholder="Describe any additional issue with your vehicle" value={formData.notes} onChange={handleChange}></textarea>
              </div>

              <button type="submit">Book Service in DB →</button>
            </form>
          )}
        </section>

        <section className="box" id="history">
          <div className="section-heading">
            <div>
              <span className="section-tag">RECORDS</span>
              <h2>Service History & Damage Logs</h2>
            </div>
            <span className="history-count">{history.length} Records</span>
          </div>

          {!currentUser ? (
            <p style={{ color: "#666", fontStyle: "italic" }}>Please log in to view your service history.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Service & Vehicle Details</th>
                    <th>Cost</th>
                    <th>Status & Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: "center", padding: "20px", color: "#666" }}>
                        No service records found for your account.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => {
                      const { serviceName, vehicleReg } = parseServiceDetails(item.service);
                      return (
                        <tr key={item.id}>
                          <td>{item.date}</td>
                          <td>
                            <strong>{serviceName}</strong>
                            {vehicleReg !== "Unknown Vehicle" && (
                              <div style={{ fontSize: "13px", color: "#0066cc", marginTop: "4px", fontWeight: "bold" }}>
                                🚘 Vehicle: {vehicleReg}
                              </div>
                            )}
                            <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                              🛠️ <em>Damages:</em> {item.damages || "None reported"}
                            </div>
                          </td>
                          <td>₹{item.cost ? item.cost.toLocaleString("en-IN") : 0}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                              <span className={`status-badge ${item.status === "Completed" ? "status-completed" : "status-booked"}`}>
                                {item.status}
                              </span>
                              {item.status === "Booked" && (
                                <button
                                  type="button"
                                  onClick={() => handleStatusToggle(item.id)}
                                  style={{ padding: "4px 10px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                                >
                                  Mark Complete
                                </button>
                              )}
                              {item.status === "Completed" && (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadInvoice(item)}
                                  style={{ padding: "4px 10px", backgroundColor: "#0066cc", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
                                >
                                  📥 Download Invoice
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="footer-logo">🚗 MotorMile</div>
        <p>Vehicle Service & Maintenance Management System</p>
        <small>© 2026 MotorMile. All rights reserved.</small>
      </footer>
    </>
  );
}

export default App;