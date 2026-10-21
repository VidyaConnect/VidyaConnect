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

export function validatePasswordChange(body) {
  const errors = {};
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { errors: { body: 'Request body is required.' } };
  }
  const { currentPassword, newPassword } = body;

  if (typeof currentPassword !== 'string' || !currentPassword) {
    errors.currentPassword = 'Current password is required.';
  }
  if (typeof newPassword !== 'string' || !newPassword) {
    errors.newPassword = 'New password is required.';
  } else if (newPassword.trim().length < 8) {
    errors.newPassword = 'New password must be at least 8 characters (spaces alone do not count).';
  } else if (newPassword.length > 128) {
    errors.newPassword = 'New password must be at most 128 characters.';
  } else if (newPassword === currentPassword) {
    errors.newPassword = 'New password must be different from your current password.';
  }
  return { errors };
}