import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd-mobile';

function RecipeListItem({ name }) {
  return (
    <Card full>
      <Card.Header
        title={name}
        thumb={`http://lorempixel.com/64/64/food/${name}`}
      />
      <Card.Body>
        <div>This is content of `Card`</div>
      </Card.Body>
    </Card>
  );
}

RecipeListItem.propTypes = {
  name: PropTypes.string.isRequired,
};

RecipeListItem.defaultProps = {};

export default RecipeListItem;
