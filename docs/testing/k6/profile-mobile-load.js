
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '20s', target: 10 },
    { duration: '40s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<500'],
  },
};

const BASE = __ENV.BASE_URL;

export function setup() {
  const res = http.post(
    `${BASE}/auth/login`,
    JSON.stringify({
      email: __ENV.PARENT_EMAIL,
      password: __ENV.PARENT_PASSWORD,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  check(res, {
    'login ok': (r) => r.status === 200,
  });

  return { token: res.json('data.accessToken') };
}

export default function (data) {
  const res = http.get(`${BASE}/profile/me`, {
    headers: {
      Authorization: `Bearer ${data.token}`,
    },
  });

  check(res, {
    'status 200': (r) => r.status === 200,
    'has children': (r) =>
      Array.isArray(r.json('data.children')),
  });

  sleep(1);
}
