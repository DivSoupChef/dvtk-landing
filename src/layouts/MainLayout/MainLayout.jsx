import { Outlet } from 'react-router-dom';
import Header from '../../components/feature/Header/Header';
import Footer from '../../components/feature/Footer/Footer';

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="page">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
