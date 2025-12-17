export async function submitContactForm(e, state) {
  e.preventDefault();
  const res = await fetch('/api/send-contact-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: state.name,
      email: state.email,
      message: state.message,
    }),
  });
  if (res.ok) {
    // Success UI
  } else {
    // Error UI
  }
}

export async function submitHiringForm(e, state) {
  e.preventDefault();
  const formData = new FormData();
  formData.append('name', state.name);
  formData.append('email', state.email);
  formData.append('phone', state.phone);
  formData.append('message', state.message);
  formData.append('resume', state.resume);
  const res = await fetch('/api/send-hiring-email', {
    method: 'POST',
    body: formData,
  });

  if (res.ok) {
    // Success UI
  } else {
    // Error UI
  }
}