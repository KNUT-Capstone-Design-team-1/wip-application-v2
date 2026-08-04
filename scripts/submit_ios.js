const { execSync } = require('node:child_process');

const ipa = process.argv[2];

if (!ipa) {
  console.error('Usage: yarn submit-ipa <ipa-file>');
  process.exit(1);
}

execSync(`eas submit --platform ios --path ${ipa}`, {
  stdio: 'inherit',
});
