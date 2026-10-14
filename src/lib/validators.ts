// Rwanda-aware validators. Server-side validation must repeat these checks.
export const RW_PHONE = /^(\+?250|0)?7[2389]\d{7}$/;
export const strongPassword = (p: string) => p.length >= 10 && /[A-Za-z]/.test(p) && /\d/.test(p);
