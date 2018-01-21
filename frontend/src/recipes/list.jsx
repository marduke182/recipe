import { Fragment } from 'react';
import PropTypes from 'prop-types';
import { WhiteSpace } from 'antd-mobile';
import recipeShape from 'lib/shapes/recipes';
import RecipeListItem from 'recipes/list-item';
import EmptyListMessage from './empty-list-message';


export default function List({ recipes }) {
  if (recipes.length === 0) {
    return <EmptyListMessage />;
  }

  return (
    <Fragment>
      {recipes.map(recipe => (
        <Fragment key={recipe.name} >
          <WhiteSpace size="lg" />
          <RecipeListItem {...recipe} />
        </Fragment>
      ))}
    </Fragment>
  )
}

List.propTypes = {
  recipes: PropTypes.arrayOf(recipeShape),
};

List.defaultProps = {
  recipes: [],
};
