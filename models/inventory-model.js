const pool = require("../database/")  // Load db connection

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
      JOIN public.classification AS c
      ON i.classification_id = c.classification_id
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getClassificationsbyid error" + error)
  }
}

// Getting one vehicle
async function getVehicleById(inv_id){
  try {
    const sql = `SELECT * FROM public.inventory WHERE inv_id = $1`
    const data = await pool.query(sql, [inv_id])

    // Return first row
    return data.rows[0]
  } catch (error) {
    throw error
  }
}

/* *****************************
 * Insert new classification
 * *************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 * Insert new vehicle into inventory
 * *************************** */
async function addInventory(
  classification_id, inv_make, inv_model, inv_year, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
) {
  try {
    const sql = `INSERT INTO public.inventory 
      (classification_id, inv_make, inv_model, inv_year, inv_description, 
       inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`
    return await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_year, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
    ])
  } catch (error) {
    return error.message
  }
}




module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory}