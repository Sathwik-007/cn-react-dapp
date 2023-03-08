import classes from "./Sidebar.module.css";
import Categories from "./Categories";
import TopPosts from "./TopPosts";
import { BiSearchAlt2 } from "react-icons/bi";

const search_icon_style = {
  fontSize: "var(--search-icon-size)",
  marginLeft: "var(--search-icon-margin-left)",
  color: "var(--search-icon-color)",
};

const Sidebar = () => {
  return (
    <div className={classes.left_div}>
      <label htmlFor="search_bar"></label>
      <input id="search_bar" type="text" placeholder="Search..." />
      <BiSearchAlt2 style={search_icon_style} />
      <Categories />
      <TopPosts />
    </div>
  );
};

export default Sidebar;
