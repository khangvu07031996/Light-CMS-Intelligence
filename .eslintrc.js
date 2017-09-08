module.exports = {
  "extends": "airbnb-base",
  rules: {
    "linebreak-style": ["error", "windows"],
    "no-plusplus": [2, { allowForLoopAfterthoughts: true }],
    "no-param-reassign": [2, { "props": false }],
    "no-shadow": "off",
    "no-multi-assign": "off",
    "no-unused-vars": "off",
    "no-undef": "off",
    "func-names": "off",
    "consistent-return": "off",
    "array-callback-return": "off",
    "prefer-const": "off",
    "quotes": ["off", "double"],
    "no-plusplus": ["off", { "allowForLoopAfterthoughts": true }],
    "no-underscore-dangle": "off",
    "no-use-before-define": "off",
    "import/no-extraneous-dependencies": ["warn", {"peerDependencies": true}],
    "new-cap": "off", 
    "comma-dangle": ["off", "never"],
    "no-console":"off"
    // "import/no-unresolved": "error"
  }
};