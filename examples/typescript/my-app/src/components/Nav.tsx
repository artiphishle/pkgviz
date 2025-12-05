// Relative import with '../'
import A from '../components/A';

// Relative import with only '..'
import H2 from '..';

export default function Nav() {
  return (
    <>
      <H2 />
      <nav>
        <A />
      </nav>
    </>
  );
}
