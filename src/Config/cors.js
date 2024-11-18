const whitelist = ['http://localhost:5173', 'http://localhost:5174']

export const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    exposedHeaders: ['Authorization']
}