import PropTypes from 'prop-types';
import { Card } from 'antd-mobile';

function RecipeListItem({ name, description }) {
  return (
    <Card full>
      <Card.Header
        title={name}
        thumb={`http://lorempixel.com/64/64/food/${name}`}
      />
      <Card.Body>
        <div>{description}</div>
      </Card.Body>
    </Card>
  );
}

RecipeListItem.propTypes = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

RecipeListItem.defaultProps = {};

export default RecipeListItem;
