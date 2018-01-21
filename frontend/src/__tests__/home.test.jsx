import { shallow } from 'enzyme';
import Home from '../home';
import RecipeList from '../recipes/list';

describe('Home', () => {
  const recipes = [
    { name: 'Test' },
  ];

  it('should show a list of recipes', () => {
    const home = shallow(<Home recipes={recipes} />);

    const recipesList = home.find(RecipeList);

    expect(recipesList).toBePresent();
    expect(recipesList.props()).toHaveProperty('recipes', recipes);
  });
});
