import { sql } from "../config/db.js";
import fs from "fs";
import multer from "multer";
import { btoa } from "abab"; // For encoding image to base64

export const getProducts = async (req, res) => {
  try {
    const products = await sql`
      SELECT * FROM products
      ORDER BY created_at DESC
    `;

    //console.log("fetched products", products);
    //console.log("res.headers", res.headers);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log("Error in getProducts function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, image } = req.body;
  //console.log("createProduct function called with body:", req.body);
  if (!name || !price || !image) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    //const imageBuffer = fs.readFileSync({image});
    //console.log("Image Buffer", imageBuffer);
    //console.log("Image", image);
    const newProduct = await sql`
      INSERT INTO products (name,price,image)
      VALUES (${name},${price},${image})
      RETURNING *
    `;
    //console.log("New product created", newProduct[0]);

    res.status(201).json({ success: true, data: newProduct[0] });
  } catch (error) {
    console.log("Error in createProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getProduct = async (req, res) => {
  const { id } = req.params;

  //console.log("getProduct function called with ID:", id);
  if (!id || id.trim() === "check-auth") {
    console.log("Product ID is missing or invalid");
    return res.status(400).json({ success: false, message: "Product ID is required" });
  }
  //console.log("Fetching product with ID:", id);
  //console.log("req.params", req.params);
  //console.log("req.body", req.body);
  //console.log("req.query", req.query);
  //console.log("req.headers", req.headers);
  //console.log("req", req);
  try {
    const product = await sql`
     SELECT * FROM products WHERE id=${id}
    `;
    //console.log("Fetched product", product[0]);
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(product[0].image_base24))); //.toString("base64");
    //res.status(200).json({
    //  success: true,
    //  data: { ...product,  } , //image_base24: `data:image/jpeg;base64,${base64Image}` },
    //});

    res.status(200).json( { success: true, 
                            data: { ...product[0]   , 
                                    image_base24: `data:image/png;base64,${base64Image}` }
                        });
  } catch (error) {
    console.log("Error in getProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, image } = req.body;
 

  try {

    //    console.log("Image: ", image);

//    const storage = multer.memoryStorage();
//    const upload = multer({ storage: storage });
 
    // Middleware to handle file uploads
//    const uploadImage = await upload.single('image')(req, res, (err) => {
//      if (err) {
//        console.error("Error uploading image:", err);
//        return res.status(500).json({ success: false, message: "Image upload failed" });
//      }
//    }
//    );
//    console.log("Upload Image: ", uploadImage);
    //console.log("Uploaded Image: ", uploadImage);
    // Convert the uploaded image to base64
    //const base64Image = btoa(String.fromCharCode(...new Uint8Array(uploadImage))); //.toString("base64");
    //const base64Image = uploadImage.toString("base64");
    //console.log("Base64 Image: ", base64Image);
    //const uploadImage2 = Buffer.from(base64Image, 'base64');
    //const imageBuffer = fs.readFileSync({image});
    //const imageBuffer = Buffer.from(image, 'base64');
    //console.log("Image Buffer: ", uploadImage2);
    //console.log("length: ", uploadImage2.length);
 
    const updateProduct = await sql`
      UPDATE products
      SET name=${name}, price=${price}, image=${image}
      WHERE id=${id}
      RETURNING *
    `;

    if (updateProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, data: updateProduct[0] });
  } catch (error) {
    console.log("Error in updateProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await sql`
      DELETE FROM products WHERE id=${id} RETURNING *
    `;

    if (deletedProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({ success: true, data: deletedProduct[0] });
  } catch (error) {
    console.log("Error in deleteProduct function", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
