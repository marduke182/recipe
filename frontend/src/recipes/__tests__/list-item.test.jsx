import { mount} from 'enzyme';
import RecipeListItem from '../list-item';

const CHEESE_CAKE = { name: 'Cheesecake', description: "It's a cheescake" };

describe('RecipeListItem', () => {
  it('should show recipe name and description', () => {
    const recipeListItem = mount(<RecipeListItem {...CHEESE_CAKE} />);

    expect(recipeListItem.text()).toMatch(new RegExp(CHEESE_CAKE.name));
    expect(recipeListItem.text()).toMatch(new RegExp(CHEESE_CAKE.description));
  });
});
