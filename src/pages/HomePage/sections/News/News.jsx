import { NavLink } from 'react-router-dom';
import Button from '../../../../components/common/Button/Button';
import Container from '../../../../components/common/Container/Container';
import Picture from '../../../../components/common/Picture/Picture';
import { NEWS_ITEMS } from '../../../../constants/news';
import useGetAllImages from '../../../../hooks/useGetAllImages';
import styles from './News.module.scss';
import AnimatedSection from '../../../../components/common/AnimatedSection/AnimatedSection';

const News = () => {
  const images = useGetAllImages('news');
  return (
    <AnimatedSection lazy className="lazy-section">
      <section className={styles.news}>
        <Container>
          <AnimatedSection>
            <h2 className="_title-2">Новости и события в нашем учебном заведении</h2>
          </AnimatedSection>
          <div className={styles.cards}>
            {NEWS_ITEMS.map((item, index) => {
              const img = images[index];
              if (!img) return null;

              return (
                <AnimatedSection key={img.name}>
                  <article className={styles.card}>
                    <Picture sources={img.sources} alt={item.title} loading="lazy" />
                    <div className={styles.head}>
                      <h3 className="_title-3">
                        <NavLink to={item.to}>{item.title}</NavLink>
                      </h3>
                      <time dateTime={item.dataTime}>{item.dataTimeText}</time>
                    </div>
                    <p className={styles.description}>{item.description}</p>
                  </article>
                </AnimatedSection>
              );
            })}
          </div>
          <AnimatedSection animation="zoom-in">
            <Button ariaLabel="Все новости">Все новости</Button>
          </AnimatedSection>
        </Container>
      </section>
    </AnimatedSection>
  );
};

export default News;
