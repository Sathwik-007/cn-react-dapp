import classes from "./Home.module.css";
import MainContent from "../components/MainContent";
import { Await, json, useLoaderData, defer } from "react-router-dom";
import { Suspense } from "react";
import Sidebar from "../components/Sidebar";
import Loading from "../components/Loading";

const HomePage = () => {
  const { articles } = useLoaderData();
  return (
    <div className={classes.main_content}>
      <Sidebar />
      <div className={classes.right_div}>
        <Suspense fallback={<Loading />}>
          <Await resolve={articles}>
            {(loadedArticles) => <MainContent articles={loadedArticles} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
};

export default HomePage;

async function loadArticles() {
  let url =
    "https://newsapi.org/v2/top-headlines?country=us&apiKey=4eb113ee24fe46fa98fa59709908fb59";
  const response = await fetch(url);
  console.log(response.ok)

  if (!response.ok) {
    throw json({ message: "Unable to retrieve articles" }, { status: 500 });
  } else {
    const responseData = await response.json();
    return responseData.articles;
  }
}

export function loader() {
  return defer({
    articles: loadArticles(),
  });
}
