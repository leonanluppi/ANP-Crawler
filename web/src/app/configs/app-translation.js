(function(angular) {
  'use strict';

  /** @ngInject */
  var ModuleConfig = function($translateProvider, ENV, LANG_BR, LANG_EN) {
    var languages       = {};
    var defaultLanguage = 'pt-BR';

    languages.avaiableKeys = ['pt-BR', 'en-US', 'es-MX'];
    languages.references   = {
      'pt': 'pt-BR',
      'es': 'es-MX',
      'en': 'en-US',
      'es-CR': 'es',
      'en-AU': 'en-US',
      'en-NZ': 'en-US'
    };

    var translationsByLang = {
      'pt-BR': LANG_BR,
      'en-US': LANG_EN
    };

    var useLanguage = window.navigator.language || window.navigator.userLanguage || defaultLanguage;

    console.info(useLanguage);

    var getTranslationsByType = function getTranslationsByType() {
      return translationsByLang[useLanguage];
    };

    $translateProvider
      .registerAvailableLanguageKeys(languages.avaiableKeys, languages.references)
      .useSanitizeValueStrategy('escape')
      .preferredLanguage(useLanguage)
      .translations(useLanguage, getTranslationsByType());
  };

  angular
    .module('softruck.translation', [
            'pascalprecht.translate',
            'ngSanitize'
    ])
    .config(ModuleConfig);
})(angular);
