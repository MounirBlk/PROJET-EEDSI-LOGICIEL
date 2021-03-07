import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import fr from 'vuetify/src/locale/fr';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
      options: {
        customProperties: true,
      },
    themes: {
      light: {
        primary: '#FFCC80',
        secondary: '#FFB74D',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
      dark: {
        primary: '#272727',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    },
  },
    lang: {
      locales: { fr },
      current: 'fr',
    },
});
