import i18next from 'i18next';
import ru from './locales/ru.js';

export default () => {
  const i18n = i18next.createInstance();
  const initialization = i18n.init({
    lng: 'ru',
    debug: true,
    resources: { ru },
  });

  return {
    i18n: {
      instance: i18n,
      promise: initialization,
    },
  };
};
