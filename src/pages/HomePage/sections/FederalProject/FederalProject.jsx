import Button from '../../../../components/common/Button/Button';
import Container from '../../../../components/common/Container/Container';

import styles from './FederalProject.module.scss';

import Picture from '../../../../components/common/Picture/Picture';
import useGetAllImages from '../../../../hooks/useGetAllImages';
import AnimatedSection from '../../../../components/common/AnimatedSection/AnimatedSection';

const FederalProject = () => {
  const images = useGetAllImages('federal-project');

  return (
    <AnimatedSection lazy className="lazy-section">
      <section className={styles.federalProject}>
        <Container className={styles.inner}>
          <AnimatedSection animation="fade-up">
            <h2 className={styles.title}>Федеральный проект "Профессионалитет"</h2>
          </AnimatedSection>
          <div className={styles.descriptions}>
            <AnimatedSection animation="fade-up">
              <p>
                Федеральный проект «Профессионалитет» — это новый уровень среднего профессионального образования.
                Обучение ведётся с прицелом на конкретные предприятия-партнёры
              </p>
            </AnimatedSection>
            <AnimatedSection animation="fade-up">
              <p>
                Вы получаете максимум практики, актуальные навыки и гарантированное трудоустройство сразу после выпуска.
              </p>
            </AnimatedSection>
          </div>
          <AnimatedSection animation="zoom-in">
            <Button variant="secondary" ariaLabel="Подробнее">
              Подробнее
            </Button>
          </AnimatedSection>
        </Container>
        {images.map(img => (
          <Picture key={img.name} className="_ibg" sources={img.sources} alt={img.name} />
        ))}
      </section>
    </AnimatedSection>
  );
};

export default FederalProject;
