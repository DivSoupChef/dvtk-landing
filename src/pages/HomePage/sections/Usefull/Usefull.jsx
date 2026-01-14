import { NavLink } from 'react-router-dom';
import Container from '../../../../components/common/Container/Container';
import { USEFULL_ITEMS } from '../../../../constants/usefull';

import styles from './Usefull.module.scss';
import AnimatedSection from '../../../../components/common/AnimatedSection/AnimatedSection';

const Usefull = () => {
  return (
    <AnimatedSection lazy className="lazy-section">
      <section className={styles.usefull}>
        <Container>
          <AnimatedSection animation="fade-up">
            <h2 className="_title-2">Полезное</h2>
          </AnimatedSection>
          <div className={styles.cards}>
            {USEFULL_ITEMS.map(item => (
              <AnimatedSection key={item.id} animation="fade-up">
                <article className={styles.card} >
                  <h3 className="_title-3">{item.title}</h3>
                  <ul className={styles.list}>
                    {item.links.map(link => (
                      <li key={link.id}>
                        <NavLink to={link.to}>{link.label}</NavLink>
                      </li>
                    ))}
                  </ul>
                </article>
              </AnimatedSection>
            ))}
          </div>
        </Container>
      </section>
    </AnimatedSection>
  );
};

export default Usefull;
