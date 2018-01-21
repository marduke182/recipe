import { shallow } from 'enzyme';
import EmptyListMessage from '../empty-list-message';

describe('RecipeEmptyListMessage', () => {
  it('should render empty message', () => {
    const emptyListMessage = shallow(<EmptyListMessage />);

    expect(emptyListMessage.text()).toEqual('No tienes ninguna receta.')
  });
});
