export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // new feature
        'fix',      // bug fix
        'perf',     // performance improvement
        'refactor', // code change that neither fixes a bug nor adds a feature
        'style',    // formatting, whitespace, etc.
        'test',     // adding or updating tests
        'docs',     // documentation only
        'build',    // build system or external dependency changes
        'ci',       // CI/CD configuration changes
        'chore',    // maintenance, no production code change
        'revert',   // revert a previous commit
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'header-max-length': [2, 'always', 100],
  },
}
