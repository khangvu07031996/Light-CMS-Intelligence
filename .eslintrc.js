module.exports = {
  "extends": "airbnb-base",
  //"extends": "eslint:recommended",
  "rules": {
      // enable additional rules
      "indent": ["warn", 4],
      //"linebreak-style": ["error", "unix"],
      "quotes": ["warn", "double"],
      "semi": ["warn", "always"],

      // override default options for rules from base configurations
      "comma-dangle": ["off", "always"],
      "no-cond-assign": ["warn", "always"],      
      // disable rules from base configurations
      "no-console": "off",
      "no-plusplus": ["off", { "allowForLoopAfterthoughts": true }],
      "no-underscore-dangle": "off",
      "no-unused-vars": "warn",
      "prefer-const": "off",
      "no-var": "error",
      "no-use-before-define": "off",
      "import/no-extraneous-dependencies": ["warn", {"peerDependencies": true}],
      "new-cap": "off",
      "no-param-reassign": [2, { "props": false }],
      "prefer-template": "error",
      "func-names": ["off", "as-needed"],
      "import/no-unresolved": "off"
  }
};