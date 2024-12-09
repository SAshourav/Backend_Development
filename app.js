const express = require('express')
const app = express()
const path = require('path')
const userModel = require('./models/user')

app.set("view engine", 'ejs')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res)=>{
    res.render("index")
})
app.get('/read', async(req, res)=>{
    let allUser = await userModel.find()
    res.render("read", {users: allUser})
})
app.get('/delete/:id', async(req, res)=>{
    let user = await userModel.findOneAndDelete({_id: req.params.id})
    res.redirect('/read')
})
app.get('/edit/:id', async(req, res)=>{
    let user = await userModel.findOne({_id: req.params.id})
    res.render('edit',{user})
})
app.post('/update/:id', async(req, res)=>{
    let {name, email, image} = req.body
    let user = await userModel.findOneAndUpdate({_id: req.params.id},{name, email, image})
    res.redirect('/read')
})
app.get("/readone/:id", async (req, res) => {
    try {
        const id = req.params.id;

        // Validate the ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ error: "Invalid ObjectId" });
        }

        // Query the database
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        res.send(user);
    } catch (error) {
        console.error("Error reading user:", error.message);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/create', async(req, res)=>{
    let {name, email, image} = req.body
    let createdUser = await userModel.create({
        name,
        email,
        image
    })

    res.redirect('/read')
})

app.listen(3000)