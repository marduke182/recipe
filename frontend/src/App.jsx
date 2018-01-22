import Home from './home';

const CHEESE_CAKE = { name: 'CheeseCake', description: "It's a cheesecake" };
export default function App() {
  return <Home recipes={[CHEESE_CAKE]} />;
}
