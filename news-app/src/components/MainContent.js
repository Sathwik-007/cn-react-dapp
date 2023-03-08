import classes from "./MainContent.module.css";
import { Link } from "react-router-dom";

const MainContent = (props) => {
  const articles = props.articles;
  console.log(articles);

  return (
    <>
      {articles.map((article) => (
        // <Link to="/article-details">
          <div className={classes.card}>
            <img src={article.urlToImage} alt="" />
            <h5>{article.title}</h5>
            <span className={classes.author}>{article.author}</span>
            <p className={classes.timestamp}>
              {article.publishedAt.replace(/[a-zA-Z]/, " ")}
            </p>
          </div>
        // </Link>
      ))}
    </>
  );
};

export default MainContent;
