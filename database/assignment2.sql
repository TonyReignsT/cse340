-- Data for table `account`
INSERT INTO public.account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Updating the accoount_type column to 'Admin'
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Deleting a record from the `account` table
DELETE FROM public.account
WHERE account_id = 1;

-- Updating the `inventory` table by replacing a part of a text using the REPLACE() function
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- Creating an inner join between `inventory` table and `classification` table
SELECT inv_make, inv_model, classification_name
FROM public.inventory
INNER JOIN public.classification
ON inventory.classification_id = classification.classification_id;

-- Updating the images path using the REPLACE() function on the `inventory` table
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');