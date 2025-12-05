// Relative import with '../'
import A from '../components/A';
import H2 from '../components/H2';

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
