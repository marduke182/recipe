import RecipeList from 'recipes/list';
import PropTypes from 'prop-types';
import recipeShape from 'lib/shapes/recipes';

export default function Home({ recipes }) {
  return <RecipeList recipes={recipes} />;
}

Home.propTypes = {
  recipes: PropTypes.arrayOf(
    recipeShape,
  ),
};

Home.defaultProps = {
  recipes: [],
};
