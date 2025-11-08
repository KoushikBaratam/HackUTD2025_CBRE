import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/hello")
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "3rem" }}>
      <h1>Flask + React App</h1>
      <p>{message}</p>
    </div>
    // <Router>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/login" element={<Login />} />
    //   </Routes>
    // </Router>
  );
}

export default App;