import http from 'k6/http';
import { check, sleep, fail } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '1m', target: 10 },
    { duration: '10s', target: 0 },
  ],

  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE = __ENV.BASE_URL || 'http://localhost:3001/api';

export function setup() {
  if (!__ENV.EMAIL || !__ENV.PASSWORD) {
    fail('Set EMAIL and PASSWORD before running the test.');
  }

  const res = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({
      email: __ENV.EMAIL,
      password: __ENV.PASSWORD,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const loginOK = check(res, {
    'login status is 200': (r) => r.status === 200,
  });

  if (!loginOK) {
    fail('Login failed. Check your local backend and test credentials.');
  }

  const token = res.json('data.accessToken');

  if (!token) {
    fail('Login response did not contain an access token.');
  }

  return { token };
}

export default function (data) {
  const params = {
    headers: {
      Authorization: `Bearer ${data.token}`,
      'Content-Type': 'application/json',
    },
  };

  const get = http.get(`${BASE}/profile/me`, params);

  check(get, {
    'GET /profile/me is 200': (r) => r.status === 200,
  });

  if (Math.random() < 0.2) {
    const put = http.put(
      `${BASE}/profile/me`,
      JSON.stringify({
        phone: '+94 76 345 6789',
      }),
      params
    );

    check(put, {
      'PUT /profile/me is 200': (r) => r.status === 200,
    });
  }

  sleep(1);
}
