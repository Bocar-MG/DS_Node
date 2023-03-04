
const express = require('express')
const student_impl = require('./routers/studentsImpl')

const app = express()
const port = 3000


app.use(express.json())

app.use('/api/students',student_impl);

app.listen(port,() =>{ console.log(`listen in port ${port}`)})