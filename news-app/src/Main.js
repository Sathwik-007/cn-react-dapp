import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

const LandingPage = () => {
  return (
    <>
    <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default LandingPage;
