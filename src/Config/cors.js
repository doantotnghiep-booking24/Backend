const whitelist = ['http://localhost:5173', 'http://localhost:5174', 'https://frontend-booking-ovf1.onrender.com/', 'https://datn-2024-mern-k5onqkddn-tranquocduong204s-projects.vercel.app', 'http://localhost:3000', 'http://localhost:30011']

export const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    exposedHeaders: ['Authorization']
}
