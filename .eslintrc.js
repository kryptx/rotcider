module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": [ "error", 2, { "MemberExpression": "off" } ],
        "linebreak-style": [ "error", "unix" ],
        "quotes": [ "error", "single" ],
        "semi": [ "error", "always" ],
        "block-spacing": [ 2, "always" ], // not working for me
        "complexity": [ "warn", 5 ],
    }
};