import Hero from '../../components/feature/Hero/Hero';
import Contacts from './sections/Contacts/Contacts';
import FederalProject from './sections/FederalProject/FederalProject';
import News from './sections/News/News';
import Partners from './sections/Partners/Partners';
import Usefull from './sections/Usefull/Usefull';

const HomePage = () => {
  return (
    <>
      <Hero />
      <FederalProject />
      <Usefull />
      <News />
      <Partners />
      <Contacts />
    </>
  );
};

export default HomePage;
