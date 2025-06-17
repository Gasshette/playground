import { Title } from './Title';

export const View = () => (
  <div
    style={{
      height: '100%',
      boxSizing: 'border-box',
      overflow: 'auto',
      padding: 10
    }}>
    <Title>Groceries</Title>
    <ul>
      <li>- &#128512; Pasta</li>
      <li>
        - &#129321; cheese: take a
        loooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooot!!!
      </li>
      <li>- &#129300; some sauce</li>
    </ul>
  </div>
);
