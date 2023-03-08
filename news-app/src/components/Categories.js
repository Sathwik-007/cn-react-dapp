import classes from "./Categories.module.css";

const CATEGORIES = [
  "World",
  "Technology",
  "Politics",
  "Finance",
  "Sports",
  "Travel",
];

const Categories = () => {
  return (
    <div className={classes.side_card}>
      <h4>Categories</h4>
      <br />
      {CATEGORIES.map((category) => (
        <>
          <h6>{category}</h6>
          <hr />
        </>
      ))}
    </div>
  );
};

export default Categories;
