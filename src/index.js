import express from 'express'
import usersRoute from './routes/users.route.js'
import cors from 'cors'

const app = express();


app.use(cors('*'))

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/', (req, res) => {
    res.json({
        title: 'Proyecto hospital',
        routes: {
            users: {
                get: {
                    getAllUsers: '/api/users',
                    },
                post: {
                    createUser: '/api/users',
                    login: '/api/users/login',
                }
    }}}
    )
})

app.use('/api/users', usersRoute)

const port = 8000

app.listen(port, ()=> {
    console.log(`Server is running on port ${port}`)
})