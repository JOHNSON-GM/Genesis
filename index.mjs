import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import open from 'open';


const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static('Public'));

app.post('/submit', (req, res) => {
  const userData = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  // Read existing JSON data from the file
  let jsonData = [];
  try {
    const existingData = fs.readFileSync('data.json', 'utf-8');
    try {
      jsonData = JSON.parse(existingData);
    } catch (parseError) {
      console.log(parseError)
      // Handle the parsing error, e.g., by initializing jsonData to an empty array
      jsonData = [];
    }
  } catch (err) {
    console.error(err);
  }

// Check if user exists and if user exists do not duplicate user

  const existingUser = jsonData.people.find((user) => user.email === userData.email);

  if(!existingUser) {
      // Add the user input data to the JSON array
      jsonData.people.push(userData);
  } else {
      console.log("User already exists");
  }

  // const bcrypt = require('bcrypt');

  // // Hash the user's password before storing it
  // const hashedPassword = bcrypt.hashSync(userData.password, 10);
  // userData.password = hashedPassword;


  // Convert the updated data back to JSON string
  const updatedData = JSON.stringify(jsonData, null, 2);

  // Write the updated data to the JSON file
  fs.writeFileSync('data.json', updatedData);

  res.redirect('/loginPage.html');

});

// Handle login form submission
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Read existing user data from the file
  const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  // Check if the user exists in the JSON data
  const user = jsonData.people.find((userData) => userData.email === email && userData.password === password);

  if (user) {
    // Redirect to the homepage if the user is found
    res.redirect('/home.html');
  } else {
    // Handle authentication failure,  show an error message
    res.send('Authentication failed. Please check your email and password.');
  }
});

app.post('/adminLogin', (req, res) => {
  const { email, password } = req.body;

  // Read existing user data from the file
  const jsonData = JSON.parse(fs.readFileSync('data.json', 'utf-8'));

  // Check if the user exists in the JSON data
  const user = jsonData.Admin.find((userData) => userData.email === email && userData.password === password);

  if (user) {
    // Redirect to the homepage if the user is found
    res.redirect('/home.html');
  } else {
    // Handle authentication failure,  show an error message
    res.send('Authentication failed. Please check your email and password.');
  }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
open(`http://localhost:${port}`);