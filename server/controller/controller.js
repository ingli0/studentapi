var Userdb = require('../model/model');
var accdb = require('../model/accmodel');
const bcrypt = require('bcrypt');


// create and save new user
exports.create = (req,res)=>{
    // validate request
    if(!req.body){
        res.status(400).send({ message : "Content can not be emtpy!"});
        return;
    }

    // new user
    const user = new Userdb({
        name : req.body.name,
        email : req.body.email,
        gender: req.body.gender,
        status : req.body.status
    })

    // save user in the database
    user
        .save(user)
        .then(data => {
            //res.send(data)
            res.redirect('/add-user');
        })
        .catch(err =>{
            res.status(500).send({
                message : err.message || "Some error occurred while creating a create operation"
            });
        });

}

exports.createacc = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({ message: "Content cannot be empty!" });
        return;
    } 

    // Hash the password
    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
            res.status(500).send({
                message: "Error hashing the password"
            });
            return;
        }

        // Create a new user with the hashed password
        const acc = new accdb({
            email: req.body.email,
            password: hashedPassword // Store the hashed password in the database
        });

        // Save the user in the database
        acc.save()
            .then(data => {
                // res.send(data)
                res.redirect('/');
            })
            .catch(err => {
                res.status(500).send({
                    message: err.message || "Some error occurred while creating a create operation"
                });
            });
    });
}


exports.login = async (req, res) => {
    // Validate request
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).send({ message: "Email and password are required!" });
    }

    const { email, password } = req.body;

    try {
        // Check if the email exists in the database
        const user = await accdb.findOne({ email: email });

        if (!user) {
            return res.status(401).send({ message: "User not found" });
        }

        // Compare the provided password with the hashed password in the database
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
            // Passwords match, create a session or generate a token for the authenticated user
            // You can use libraries like Express Session or JSON Web Tokens (JWT) for this.
            // Here's a simple example using Express Session:

            req.session.user = user.name; // Store user information in the session
            res.redirect('/');  
            
        } else {
            return res.status(401).send({ message: "Invalid password" });
        }
    } catch (error) {
        // Log the error for debugging
        console.error("Login error:", error);
        return res.status(500).send({ message: "Error during login" });
    }
};


// retrieve and return all users/ retrive and return a single user
exports.find = (req, res)=>{

    if(req.query.id){
        const id = req.query.id;

        Userdb.findById(id)
            .then(data =>{
                if(!data){
                    res.status(404).send({ message : "Not found user with id "+ id})
                }else{
                    res.send(data)
                }
            })
            .catch(err =>{
                res.status(500).send({ message: "Erro retrieving user with id " + id})
            })

    }else{
        Userdb.find()
            .then(user => {
                res.send(user)
            })
            .catch(err => {
                res.status(500).send({ message : err.message || "Error Occurred while retriving user information" })
            })
    }

    
}

// Update a new idetified user by user id
exports.update = (req, res)=>{
    if(!req.body){
        return res
            .status(400)
            .send({ message : "Data to update can not be empty"})
    }

    const id = req.params.id;
    Userdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false})
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Update user with ${id}. Maybe user not found!`})
            }else{
                res.send(data)
            }
        })
        .catch(err =>{
            res.status(500).send({ message : "Error Update user information"})
        })
}

// Delete a user with specified user id in the request
exports.delete = (req, res)=>{
    const id = req.params.id;

    Userdb.findByIdAndDelete(id)
        .then(data => {
            if(!data){
                res.status(404).send({ message : `Cannot Delete with id ${id}. Maybe id is wrong`})
            }else{
                res.send({
                    message : "User was deleted successfully!"
                })
            }
        })
        .catch(err =>{
            res.status(500).send({
                message: "Could not delete User with id=" + id
            });
        });
}