import { defer } from "react-router-dom";
import classes from "./TopPosts.module.css";
/**
 * @dev 1. remove static data
 *      2. load data using api.
 */
const TOP_POSTS = [
  {
    key: 1,
    author: "Yahoo Sports",
    title:
      "NFL combine 2023 tracker: 40-yard dash, drills, highlights - Yahoo Sports",
    publishedAt: "2023-03-03T04:37:00Z",
  },
  {
    key: 2,
    author: "Reuters.com",
    title:
      "US Justice Dept seeks rejection of Trump immunity claim in Jan. 6 lawsuits - Reuters.com",
    publishedAt: "2023-03-03T04:22:00Z",
  },
  {
    key: 3,
    author: "BBC",
    title:
      "Californians snow-stranded as twisters hit Texas and Louisiana - BBC",
    publishedAt: "2023-03-03T04:06:22Z",
  },
  {
    key: 4,
    author: "CBS Sports",
    title:
      "Antoine Davis four points shy of NCAA career scoring mark after Detroit Mercy falls in conference tournament - CBS Sports",
    publishedAt: "2023-03-03T04:06:00Z",
  },
  {
    key: 5,
    author: "BBC",
    title: "Adani Group: Embattled Indian giant strikes $1.87bn US deal - BBC",
    publishedAt: "2023-03-03T03:52:29Z",
  },
];

const TopPosts = () => {
  return (
    <div className={classes.side_card}>
      <h4>Top Posts</h4>
      <ol>
        {TOP_POSTS.map((post) => (
          <>
            <li>
              <h6>{post.title}</h6>
            </li>
            <span>{post.author}</span>
            <p>{post.publishedAt}</p>
            <hr />
          </>
        ))}
      </ol>
    </div>
  );
};

export default TopPosts;

async function loader() {
  
}

export function headlinesLoader() {
  return defer({
    topHeadlines: loader(),
  })
};