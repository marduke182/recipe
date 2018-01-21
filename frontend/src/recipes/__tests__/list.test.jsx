import { shallow } from 'enzyme';
import RecipeList from '../list';
import RecipeListItem from '../list-item';
import EmptyListMessage from '../empty-list-message';

const CHEESE_CAKE = { name: 'Cheesecake' };
const BROWNIE = { name: 'brownie' };

describe('RecipeList', () => {
  it('should show an empty message if no recipes given', () => {
    const recipeList = shallow(<RecipeList />);

    const emptyListMessage = recipeList.find(EmptyListMessage);

    expect(emptyListMessage).toBePresent();
  });

  it('should show each recipe', () => {
    const recipeList = shallow(<RecipeList recipes={[ CHEESE_CAKE, BROWNIE ]}/>);

    const recipesItems = recipeList.find(RecipeListItem);

    expect(recipesItems.length).toBe(2);
  });
});
