import styles from './Partners.module.scss';

import Container from '../../../../components/common/Container/Container';
import { PARTNERS_ITEMS } from '../../../../constants/partners';
import useGetAllImages from '../../../../hooks/useGetAllImages';
import Picture from '../../../../components/common/Picture/Picture';
import AnimatedSection from '../../../../components/common/AnimatedSection/AnimatedSection';

const Partners = () => {
  const images = useGetAllImages('partners');
  return (
    <AnimatedSection lazy className="lazy-section">
      <section className={styles.partners}>
        <Container className={styles.inner}>
          <h2 className="_title-2">Наши партнеры</h2>
          <div className={styles.marquee}>
            <div className={styles.track}>
              <div className={styles.group}>
                {PARTNERS_ITEMS.map((item, index) => {
                  const img = images[index];
                  if (!img) return null;

                  return <Picture key={img.name} sources={img.sources} loading="lazy" alt={item.name} />;
                })}
              </div>
              <div className={styles.group}>
                {PARTNERS_ITEMS.map((item, index) => {
                  const img = images[index];
                  if (!img) return null;

                  return <Picture key={img.name} sources={img.sources} loading="lazy" alt={item.name} />;
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </AnimatedSection>
  );
};

export default Partners;
