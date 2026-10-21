const ALLOWED_FIELDS = ['fullName', 'phone'];

export function validateProfileUpdate(body) {
  const errors = {};
  const data = {};

  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { data, errors: { body: 'Request body is required.' } };
  }

  const unknown = Object.keys(body).filter((k) => !ALLOWED_FIELDS.includes(k));
  if (unknown.length) {
    errors.fields = `These fields cannot be changed: ${unknown.join(', ')}.`;
  }

  if ('fullName' in body) {
    const name = typeof body.fullName === 'string' ? body.fullName.trim() : '';
    if (!name) errors.fullName = 'Full name is required.';
    else if (name.length < 2 || name.length > 40) errors.fullName = 'Full name must be 2 to 40 characters.';
    else data.fullName = name;
  }

  if ('phone' in body) {
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const digits = phone.replace(/\D/g, '').length;
    if (!phone) errors.phone = 'Phone number is required.';
    else if (!/^[+0-9\s()-]+$/.test(phone) || digits < 9 || digits > 15 || phone.length > 20) {
      errors.phone = 'Enter a valid phone number (9 to 15 digits).';
    } else data.phone = phone;
  }

  if (!Object.keys(errors).length && !Object.keys(data).length) {
    errors.body = 'Nothing to update.';
  }
  return { data, errors };
}
