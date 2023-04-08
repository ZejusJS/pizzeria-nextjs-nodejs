const production = process.env.NODE_ENV === 'production'

export const server = production ? 'https://pizzeria-backend-4vij.onrender.com' : 'http://localhost:8000'
export const captchaKey = production ? '6Lf6I20lAAAAAEEjkzdWOe50wd6LmweSKlE24kH5' : '6LeFgWwlAAAAADwgY8s6bUNHdk6HWjhV7AR4b9Q1'
// export const server = dev ? 'https://pizzeria-backend-4vij.onrender.com' : 'https://pizzeria-backend-4vij.onrender.com'