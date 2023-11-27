import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import open from 'open';
import path from 'path';


const app = express();
app.use(express.json());
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
    res.redirect('/adminPage.html');
  } else {
    // Handle authentication failure,  show an error message
    res.send('Authentication failed. Please check your email and password.');
  }
});

app.post('/add', (req, res) => {
  const productData = {
    ID: req.body.productId,
    Name: req.body.name,
    Price: req.body.price,
    Quantity: req.body.quantity
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

  // Check if product exists and if product exists do not duplicate user
  const existingProduct = jsonData.Products.find((Product) => Product.Name === productData.Name);

  if (existingProduct) {
    res.status(400).send('Product already exists');
    console.log('Received data:', req.body);
    console.log('Existing product:', existingProduct);

  } else {
    // Add the product input data to the JSON array
    jsonData.Products.push(productData);

    // Display in the console "product added successfully"
    res.send('Product added successfully');

    // Convert the updated data back to JSON string
    const updatedData = JSON.stringify(jsonData, null, 2);
    // Write the updated data to the JSON file
    fs.writeFileSync('data.json', updatedData);
  }
});


app.post('/post_sale', (req, res) => {
  const saleData = {
    Customer: req.body.customerName,
    productID: req.body.productId,
    Name: req.body.name,
    Price: req.body.price,
    Quantity: req.body.quantity,
    Date_of_sale: req.body.date
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


    // Add the product input data to the JSON array
    jsonData.Sales.push(saleData);

    // Display in the console "product added successfully"
    res.send('Sale added successfully');

    // Convert the updated data back to JSON string
    const updatedData = JSON.stringify(jsonData, null, 2);
    // Write the updated data to the JSON file
    fs.writeFileSync('data.json', updatedData);
  }
);


app.get('/fetchProducts', (req, res) => {
  const dataPath = path.join('data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).send('Internal Server Error');
    }
    try {
      const jsonData = JSON.parse(data);
      const products = jsonData.Products; // Access the "products" dataset
      res.json(products);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('/fetchSales', (req, res) => {
  const dataPath = path.join('data.json');
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading data.json:', err);
      return res.status(500).send('Internal Server Error');
    }
    try {
      const jsonData = JSON.parse(data);
      const sales = jsonData.Sales; // Access the "products" dataset
      res.json(sales);
    } catch (parseError) {
      console.error('Error parsing JSON:', parseError);
      res.status(500).send('Internal Server Error');
    }
  });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
open(`http://localhost:${port}`);