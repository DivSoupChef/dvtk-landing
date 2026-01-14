import AnimatedSection from '../../../../components/common/AnimatedSection/AnimatedSection';
import Container from '../../../../components/common/Container/Container';
import styles from './Contacts.module.scss';

const Contacts = () => {
  return (
    <AnimatedSection lazy className="lazy-section">
      <section className={styles.contacts}>
        <Container>
          <AnimatedSection>
            <h2 className="_title-2">Контакты</h2>
          </AnimatedSection>
          <div className={styles.cards}>
            <AnimatedSection>
              <address className={styles.card}>
                <h3 className="_title-3">Контактная информация:</h3>
                <div className={styles.description}>
                  <p>Юридический адрес колледжа: 692519, г. Уссурийск, ул. Советская 35.</p>
                  <p>Фактический адрес колледжа: 692519, г. Уссурийск, ул. Советская 35.‌‌</p>
                </div>
                <div className={styles.links}>
                  <div className={styles.linkItem}>
                    <p>Телефон приемной директора:</p>
                    <a href="#!">8 (4234) 32-11-44</a>
                  </div>
                  <div className={styles.linkItem}>
                    <p>Телефон приемной комиссии:</p>
                    <a href="#!">8 (4234) 32-08-96</a>
                  </div>
                  <div className={styles.linkItem}>
                    <p>Вахта:</p>
                    <a href="#!">8 (4234) 32-08-96</a>
                  </div>
                  <div className={styles.linkItem}>
                    <p>Электронная почта:</p>
                    <a href="#!">dvtk@dvtk.pro</a>
                  </div>
                  <div className={styles.linkItem}>
                    <p>‌‌Официальный сайт:</p>
                    <a href="#!">www.dvtk.pro</a>
                  </div>
                </div>
              </address>
            </AnimatedSection>
            <AnimatedSection>
              <div className={styles.card}>
                <h3 className="_title-3">Режим работы</h3>
                <div className={styles.description}>
                  <p>Понедельник – пятница 08:00 — 17:00</p>
                  <p>Обед 12:00 — 13:00</p>
                  <p>Суббота, воскресенье — выходной</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </Container>
      </section>
    </AnimatedSection>
  );
};

export default Contacts;
