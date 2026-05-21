const fetch = global.fetch || require('node-fetch');

(async () => {
  const users = [
    { email: 'admin@teamtask.com', password: 'Admin123!' },
    { email: 'member@teamtask.com', password: 'Member123!' },
  ];

  for (const user of users) {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
      const body = await res.text();
      console.log('USER', user.email, 'STATUS', res.status);
      console.log(body);
    } catch (err) {
      console.error('FETCH ERR', err.message);
    }
  }
})();
