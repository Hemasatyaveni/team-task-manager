const fetch = global.fetch || require('node-fetch');

(async () => {
  const creds = [
    { email: 'admin@company.com', password: 'admin123' },
    { email: 'member@company.com', password: 'member123' },
  ];

  for (const cred of creds) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cred),
      });
      const data = await res.text();
      console.log(`\n${cred.email}:`);
      console.log('Status:', res.status);
      console.log(data);
    } catch (err) {
      console.error('Error:', err.message);
    }
  }
})();
