import clsx from 'clsx';
import Container from '../../common/Container/Container';
import styles from './Hero.module.scss';
import useGetAllImages from '../../../hooks/useGetAllImages';
import Picture from '../../common/Picture/Picture';
import Button from '../../common/Button/Button';
import AnimatedSection from '../../common/AnimatedSection/AnimatedSection';

const Hero = () => {
  const images = useGetAllImages('hero');
  return (
    <section className={styles.hero}>
      <Container className={styles.inner}>
        <div className={styles.content}>
          <div className={styles.head}>
            <AnimatedSection animation="fade-up" immediate>
              <h1 className="_title-1">ДВТК: Профессия будущего — уже сегодня</h1>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={0.1} immediate>
              <p>
                Преврати свою энергию в профессию! Дальневосточный технический колледж — это твой шаг к востребованной
                работе. Современные мастерские, опытные преподаватели-практики и партнеры-работодатели. Получи диплом и
                стань реальным специалистом
              </p>
            </AnimatedSection>
          </div>
          <AnimatedSection animation="zoom-in" delay={0.2} immediate>
            <Button ariaLabel="Направления подготовки">Направления подготовки</Button>
          </AnimatedSection>
        </div>
        <AnimatedSection className={styles.metrics} animation="fade-left" immediate>
            <div className={styles.background}></div>
            <div className={styles.foreground}></div>

            {images.map(img => (
              <Picture key={img.name} sources={img.sources} alt={img.name} fetchpriority="high"/>
            ))}

            <AnimatedSection className={clsx(styles.item, styles.left)} animation="zoom-in" delay={0.2} immediate>
              <div className={styles.value}>500+</div>
              <div className={styles.label}>выпускников ежегодно</div>
            </AnimatedSection>
            <AnimatedSection className={clsx(styles.item, styles.right)} animation="zoom-in" delay={0.3} immediate>
              <div className={styles.value}>1000+</div>
              <div className={styles.label}>учебных дисциплин</div>
            </AnimatedSection>
            <AnimatedSection className={clsx(styles.item, styles.bottom)} animation="zoom-in" delay={0.4} immediate>
              <div className={styles.value}>200+</div>
              <div className={styles.label}>образовательных программ</div>
            </AnimatedSection>
        </AnimatedSection>
      </Container>
    </section>
  );
};

export default Hero;
