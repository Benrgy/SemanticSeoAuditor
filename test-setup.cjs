#!/usr/bin/env node

/**
 * Quick setup verification script
 * Run with: node test-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 SEO Audit Tool - Setup Verification\n');
console.log('=' .repeat(50));

let hasErrors = false;

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  console.log(`${exists ? '✅' : '❌'} ${description}`);
  if (!exists) hasErrors = true;
  return exists;
}

function checkEnvVariable(name) {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log(`❌ ${name} - .env file not found`);
    hasErrors = true;
    return false;
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasVar = envContent.includes(name);
  const lines = envContent.split('\n');
  const varLine = lines.find(line => line.startsWith(name));

  if (!hasVar || !varLine || varLine.includes('your_')) {
    console.log(`❌ ${name} - Not configured or using placeholder`);
    hasErrors = true;
    return false;
  }

  console.log(`✅ ${name} - Configured`);
  return true;
}

console.log('\n📁 Checking Files:\n');
checkFile('.env', '.env file exists');
checkFile('supabase/functions/run-seo-audit/index.ts', 'Edge function source exists');
checkFile('supabase/migrations/20250716012829_warm_poetry.sql', 'Initial migration exists');
checkFile('src/services/auditService.ts', 'Audit service exists');
checkFile('src/lib/supabase.ts', 'Supabase client exists');

console.log('\n🔑 Checking Environment Variables:\n');
checkEnvVariable('VITE_SUPABASE_URL');
checkEnvVariable('VITE_SUPABASE_ANON_KEY');

console.log('\n📦 Checking Dependencies:\n');
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasSupabase = packageJson.dependencies && packageJson.dependencies['@supabase/supabase-js'];
  const hasReact = packageJson.dependencies && packageJson.dependencies['react'];

  console.log(`${hasSupabase ? '✅' : '❌'} @supabase/supabase-js installed`);
  console.log(`${hasReact ? '✅' : '❌'} React installed`);

  if (!hasSupabase || !hasReact) hasErrors = true;
}

console.log('\n📋 Next Steps:\n');
console.log('1. Run all database migrations in Supabase SQL Editor');
console.log('2. Deploy edge function: supabase functions deploy run-seo-audit');
console.log('3. Start dev server: npm run dev');
console.log('4. Test with: https://example.com');

if (hasErrors) {
  console.log('\n❌ Setup incomplete - please review the errors above');
  console.log('   See SETUP_GUIDE.md for detailed instructions');
  process.exit(1);
} else {
  console.log('\n✅ Basic setup looks good!');
  console.log('   Remember to deploy the edge function and run migrations');
  console.log('   See SETUP_GUIDE.md for complete setup instructions');
}

console.log('\n' + '='.repeat(50));
