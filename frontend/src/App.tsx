import React from "react";
import ChatWidget from "./components/ChatWidget";

const App: React.FC = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <header style={{ textAlign: "center", margin: "20px 0" }}>
        <h1>💬 Chat with Us</h1>
        <p>Ask anything — we’re happy to assist!</p>
      </header>
      <main>
        <ChatWidget />
      </main>
    </div>
  );
};

// function App() {
//   return (
//     <div className="App">
//       <h1>Hello World!</h1>
//     </div>
//   );
// }

export default App;
