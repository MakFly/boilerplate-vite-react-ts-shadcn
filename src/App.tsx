import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Users from "./pages/users/page";
import Layout from "./Layout";
import { ThemeProvider } from "@/components/theme-provider";
import RequestDisplay from "./pages/builder-request/page";
import PostPage from "./pages/post/page";

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/users" element={<Users />} />
            <Route path="/builder-request" element={<RequestDisplay />} />
            <Route path="/posts" element={<PostPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
