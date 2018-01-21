import { shallow } from 'enzyme';
import RecipeListItem from '../list-item';

const CHEESE_CAKE = { name: 'Cheesecake' };

describe('RecipeListItem', () => {
  it('should show recipe data', () => {
    const recipeListItem = shallow(<RecipeListItem {...CHEESE_CAKE }/>);

    expect(recipeListItem.text()).toMatch(new RegExp(CHEESE_CAKE.name))
  });
});
