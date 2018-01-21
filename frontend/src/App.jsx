import Home from './home';

export default function App() {
  return (<Home recipes={[
    { name: 'test' },
    { name: 'test2' },
  ]}/>);
}
