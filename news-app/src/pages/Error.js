import { useRouteError } from "react-router-dom";
import Navbar from "../components/Navbar";
import classes from "./Error.module.css";

const ErrorPage = () => {
  const error = useRouteError();
  let title = "An error occured!";
  let message = "Something went wrong!";
  if (error.status === 500) {
    message = error.data.message;
  } else if (error.status === 404) {
    title = "404 Not found!";
    message = "Cannot find the page you are looking for!";
  }
  return (
    <>
      <Navbar />
      <h1 className={classes.title}>{title}</h1>
      <p className={classes.desc}>{message}</p>
    </>
  );
};

export default ErrorPage;
