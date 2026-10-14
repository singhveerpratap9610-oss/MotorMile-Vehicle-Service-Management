import { useState, useEffect } from "react";
import "./style.css";

const initialHistory = [
  { date: "10 Jun 2026", service: "Oil Change", cost: 2500, status: "Completed" },
  { date: "12 Mar 2026", service: "General Service", cost: 4200, status: "Completed" },
  { date: "20 Dec 2025", service: "Brake Inspection", cost: 1500, status: "Completed" },
];

const serviceCosts = {
  "General Service": 4200,
  "Oil Change": 2500,
  "Brake Inspection": 1500,
  "Engine Check": 3000,
  "Tyre Replacement": 6000,
};

function App() {
  const [history, setHistory] = useState(initialHistory);
  const [formData, setFormData] = useState({
    service: "General Service",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    const savedServices = localStorage.getItem("motorMileServices");
    if (savedServices) {
      try {
        const parsedServices = JSON.parse(savedServices);
        setHistory([...initialHistory, ...parsedServices]);
      } catch (err) {
        console.error("Error reading saved services:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { service, date, time, notes } = formData;

    if (!date || !time) {
      alert("Please select both date and time.");
      return;
    }

    const calculatedCost = serviceCosts[service] || 0;
    const formattedDate = formatDate(date);

    const newService = {
      date: formattedDate,
      service,
      cost: calculatedCost,
      status: "Booked",
      time,
      notes,
    };

    setHistory((prev) => [...prev, newService]);

    const savedServices = JSON.parse(
      localStorage.getItem("motorMileServices") || "[]"
    );
    savedServices.push(newService);
    localStorage.setItem("motorMileServices", JSON.stringify(savedServices));

    alert(
      `Service Booked Successfully!\n\nService: ${service}\nDate: ${formattedDate}\nTime: ${time}`
    );

    setFormData({
      service: "General Service",
      date: "",
      time: "",
      notes: "",
    });
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
          <a
            href="#dashboard"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("dashboard");
            }}
          >
            Dashboard
          </a>
          <a
            href="#vehicle"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("vehicle");
            }}
          >
            My Vehicle
          </a>
          <a
            href="#service"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("service");
            }}
          >
            Book Service
          </a>
          <a
            href="#history"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("history");
            }}
          >
            Service History
          </a>
        </div>
      </nav>

      <main className="container" id="dashboard">
        <section className="welcome">
          <div className="welcome-text">
            <span className="welcome-tag">VEHICLE MANAGEMENT</span>
            <h1>
              Welcome to <span>MotorMile</span>
            </h1>
            <p>
              Manage your vehicle service, maintenance and service history
              easily from one place.
            </p>
          </div>

          <div className="welcome-status">
            <div className="status-dot"></div>
            <span>
              Vehicle Status: <strong>Healthy</strong>
            </span>
          </div>
        </section>

        <section className="cards">
          <div className="card">
            <div className="card-top">
              <div className="card-icon">🚗</div>
              <span className="card-label">VEHICLE</span>
            </div>
            <h3>My Vehicle</h3>
            <p>Honda City</p>
            <span className="card-info">2022 Model</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">📅</div>
              <span className="card-label">UPCOMING</span>
            </div>
            <h3>Next Service</h3>
            <p>15 September 2026</p>
            <span className="card-info">In 28 days</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">🔧</div>
              <span className="card-label">SERVICES</span>
            </div>
            <h3>Total Services</h3>
            <p>{history.length + 5}</p>
            <span className="card-info">Completed & scheduled</span>
          </div>

          <div className="card">
            <div className="card-top">
              <div className="card-icon">✓</div>
              <span className="card-label">RECENT</span>
            </div>
            <h3>Last Service</h3>
            <p>10 June 2026</p>
            <span className="card-info">Oil Change</span>
          </div>
        </section>

        <section className="box" id="vehicle">
          <div className="section-heading">
            <div>
              <span className="section-tag">MY VEHICLE</span>
              <h2>Vehicle Details</h2>
            </div>
            <span className="vehicle-status">● Healthy</span>
          </div>

          <div className="vehicle-details">
            <div className="detail-item">
              <span className="detail-icon">🚘</span>
              <div>
                <small>Vehicle</small>
                <strong>Honda City</strong>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🔖</span>
              <div>
                <small>Registration No.</small>
                <strong>MP 19 CA 9610</strong>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">⛽</span>
              <div>
                <small>Fuel Type</small>
                <strong>Petrol</strong>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">📆</span>
              <div>
                <small>Year</small>
                <strong>2022</strong>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-icon">🛣️</span>
              <div>
                <small>Current KM</small>
                <strong>24,500 km</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="box" id="service">
          <div className="section-heading">
            <div>
              <span className="section-tag">SERVICE CENTER</span>
              <h2>Book a Service</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="service">Select Service</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
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
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="time">Preferred Time</label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                placeholder="Describe any issue with your vehicle"
                value={formData.notes}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit">Book Service →</button>
          </form>
        </section>

        <section className="box" id="history">
          <div className="section-heading">
            <div>
              <span className="section-tag">RECORDS</span>
              <h2>Service History</h2>
            </div>
            <span className="history-count">{history.length} Records</span>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Service</th>
                  <th>Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={`${item.date}-${item.service}-${index}`}>
                    <td>{item.date}</td>
                    <td>{item.service}</td>
                    <td>₹{item.cost.toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          item.status === "Completed"
                            ? "status-completed"
                            : "status-booked"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="box">
          <div className="section-heading">
            <div>
              <span className="section-tag">UPCOMING</span>
              <h2>Maintenance Reminders</h2>
            </div>
          </div>

          <div className="reminder-list">
            <div className="reminder">
              <div className="reminder-left">
                <div className="reminder-icon">🛢️</div>
                <div>
                  <p>Engine Oil</p>
                  <span>Regular oil replacement</span>
                </div>
              </div>
              <strong>Due in 500 km</strong>
            </div>

            <div className="reminder">
              <div className="reminder-left">
                <div className="reminder-icon">🛞</div>
                <div>
                  <p>Tyre Check</p>
                  <span>Check tyre pressure and condition</span>
                </div>
              </div>
              <strong>Due in 1,000 km</strong>
            </div>

            <div className="reminder">
              <div className="reminder-left">
                <div className="reminder-icon">🔧</div>
                <div>
                  <p>Brake Inspection</p>
                  <span>Inspect brake pads and discs</span>
                </div>
              </div>
              <strong>Due in 2,000 km</strong>
            </div>
          </div>
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