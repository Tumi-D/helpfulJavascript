// diagnostic.js
// Run with: node diagnostic.js
const nodemailer = require('nodemailer');
const net = require('net');
const path = require('path');

require('dotenv').config();


// ANSI color codes for prettier output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

console.log(`${colors.cyan}====================================${colors.reset}`);
console.log(`${colors.cyan}SMTP Connection Diagnostic Tool${colors.reset}`);
console.log(`${colors.cyan}====================================${colors.reset}\n`);

// 1. Check for required environment variables
console.log(`${colors.blue}[1] Checking environment variables...${colors.reset}`);
const requiredVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USERNAME', 'SMTP_PASSWORD'];
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log(`${colors.red}Missing required environment variables: ${missingVars.join(', ')}${colors.reset}`);
  console.log(`${colors.yellow}Please check your .env file or environment settings.${colors.reset}\n`);
} else {
  console.log(`${colors.green}All required environment variables found.${colors.reset}\n`);
}

// 2. Display current SMTP configuration
console.log(`${colors.blue}[2] Current SMTP Configuration:${colors.reset}`);
console.log(`   - Host: ${process.env.SMTP_HOST}`);
console.log(`   - Port: ${process.env.SMTP_PORT}`);
console.log(`   - Secure: ${process.env.SMTP_SECURE || 'false'}`);
console.log(`   - Username: ${process.env.SMTP_USERNAME}`);
console.log(`   - Password: ${process.env.SMTP_PASSWORD ? '******** (hidden)' : 'Not set'}\n`);

// 3. Perform a telnet test
console.log(`${colors.blue}[3] Testing basic connectivity (telnet)...${colors.reset}`);

const testTelnet = () => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT || 587;
    let responseData = '';
    
    // Set a timeout of 5 seconds
    socket.setTimeout(5000);
    
    socket.on('connect', () => {
      console.log(`${colors.green}Successfully connected to ${host}:${port}${colors.reset}`);
      socket.end();
      resolve(true);
    });
    
    socket.on('data', (data) => {
      responseData += data.toString();
    });
    
    socket.on('timeout', () => {
      console.log(`${colors.red}Connection timed out${colors.reset}`);
      socket.destroy();
      resolve(false);
    });
    
    socket.on('error', (err) => {
      console.log(`${colors.red}Connection error: ${err.message}${colors.reset}`);
      resolve(false);
    });
    
    socket.connect(port, host);
  });
};

// 4. Test SMTP verification
const testSmtpVerification = async (secure = undefined) => {
  console.log(`${colors.blue}[4] Testing SMTP verification with secure=${secure !== undefined ? secure : process.env.SMTP_SECURE || 'false'}...${colors.reset}`);
  
  try {
    const testTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || (secure ? 465 : 587),
      secure: secure !== undefined ? secure : (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      debug: true,
      logger: true
    });
    
    await testTransporter.verify();
    console.log(`${colors.green}SMTP verification successful!${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}SMTP verification failed: ${error.message}${colors.reset}`);
    return false;
  }
};

// 5. Try sending a test email
const sendTestEmail = async (secure = undefined) => {
  console.log(`${colors.blue}[5] Attempting to send test email with secure=${secure !== undefined ? secure : process.env.SMTP_SECURE || 'false'}...${colors.reset}`);
  
  // Skip if no test recipient is set
  if (!process.env.TEST_EMAIL_RECIPIENT) {
    console.log(`${colors.yellow}No TEST_EMAIL_RECIPIENT set in .env, skipping test email send.${colors.reset}`);
    return false;
  }
  
  try {
    const testTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || (secure ? 465 : 587),
      secure: secure !== undefined ? secure : (process.env.SMTP_SECURE === 'true'),
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      tls: {
        rejectUnauthorized: false
      }
    });
    
    const result = await testTransporter.sendMail({
      from: process.env.SMTP_USERNAME,
      to: process.env.TEST_EMAIL_RECIPIENT,
      subject: 'SMTP Diagnostic Test',
      text: 'If you receive this email, your SMTP configuration is working correctly!',
      html: '<p>If you receive this email, your SMTP configuration is working correctly!</p>'
    });
    
    console.log(`${colors.green}Test email sent successfully! Message ID: ${result.messageId}${colors.reset}`);
    return true;
  } catch (error) {
    console.log(`${colors.red}Failed to send test email: ${error.message}${colors.reset}`);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  // Test basic connectivity
  const telnetSuccess = await testTelnet();
  
  if (!telnetSuccess) {
    console.log(`${colors.yellow}Basic connectivity test failed. Possible causes:${colors.reset}`);
    console.log(`${colors.yellow}- The SMTP server host is incorrect${colors.reset}`);
    console.log(`${colors.yellow}- The SMTP port is blocked by a firewall${colors.reset}`);
    console.log(`${colors.yellow}- There are network connectivity issues${colors.reset}\n`);
  }
  
  // Get the current secure setting
  const currentSecure = process.env.SMTP_SECURE === 'true';
  
  // Try SMTP verification with current settings
  const verificationSuccess = await testSmtpVerification();
  
  // If verification failed, try the opposite secure setting
  let alternativeSuccess = false;
  if (!verificationSuccess) {
    console.log(`${colors.yellow}Trying with alternative secure setting...${colors.reset}`);
    alternativeSuccess = await testSmtpVerification(!currentSecure);
    
    if (alternativeSuccess) {
      console.log(`${colors.green}Success with secure=${!currentSecure}! Consider updating your .env file.${colors.reset}\n`);
    }
  }
  
  // Try sending a test email if verification succeeded with either setting
  if (verificationSuccess) {
    await sendTestEmail();
  } else if (alternativeSuccess) {
    await sendTestEmail(!currentSecure);
  } else {
    console.log(`${colors.red}SMTP verification failed with both secure=true and secure=false.${colors.reset}`);
    console.log(`${colors.yellow}Please double check your SMTP credentials and settings.${colors.reset}\n`);
  }
  
  // Final summary
  console.log(`${colors.cyan}====================================${colors.reset}`);
  console.log(`${colors.cyan}Diagnostic Summary${colors.reset}`);
  console.log(`${colors.cyan}====================================${colors.reset}`);
  console.log(`Telnet connectivity: ${telnetSuccess ? colors.green + 'SUCCESS' : colors.red + 'FAILED'}`);
  console.log(`SMTP verification (secure=${currentSecure}): ${verificationSuccess ? colors.green + 'SUCCESS' : colors.red + 'FAILED'}`);
  console.log(`SMTP verification (secure=${!currentSecure}): ${alternativeSuccess ? colors.green + 'SUCCESS' : colors.red + 'FAILED'}`);
  
  if (verificationSuccess || alternativeSuccess) {
    console.log(`\n${colors.green}Recommended SMTP Configuration:${colors.reset}`);
    console.log(`SMTP_HOST=${process.env.SMTP_HOST}`);
    console.log(`SMTP_PORT=${process.env.SMTP_PORT || (verificationSuccess ? (currentSecure ? 465 : 587) : (!currentSecure ? 465 : 587))}`);
    console.log(`SMTP_SECURE=${verificationSuccess ? currentSecure : !currentSecure}`);
  } else {
    console.log(`\n${colors.red}No working configuration found.${colors.reset}`);
    console.log(`${colors.yellow}Please refer to the troubleshooting guide for additional steps.${colors.reset}`);
  }
};

// Run all the tests
runTests();
