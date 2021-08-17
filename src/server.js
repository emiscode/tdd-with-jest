const app = require ('./app.js')
const PORT = 3000

app.listen(process.env.PORT || PORT, () => {
    console.log(`Server running on port ${PORT}`)
})