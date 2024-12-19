import csv
import random
import uuid
import hashlib

def generate_mongodb_id():
    """Generate a 24-character hexadecimal string similar to MongoDB ObjectId."""
    # Use UUID to generate a unique base
    unique_base = str(uuid.uuid4())
    
    # Hash the base to get a consistent hexadecimal string
    hash_object = hashlib.sha256(unique_base.encode())
    hex_dig = hash_object.hexdigest()
    
    # Take first 24 characters to match MongoDB ObjectId format
    return hex_dig[:24]

# Predefined categories and product types
categories = ['Shirt', 'Trousers', 'Shorts', 'Tshirt', 'Shoes', 'Socks', 'Accessories', 'Jackets', 'Sweaters']

color_prefixes = ['Black', 'White', 'Red', 'Blue', 'Green', 'Grey', 'Yellow', 'Brown', 'Navy', 'Olive', 'Maroon', 'Purple']

brand_prefixes = ['Nike', 'Adidas', 'Puma', 'Levi\'s', 'Calvin Klein', 'Under Armour', 'Zara', 'H&M']

product_bases = {
    'Shirt': ['Cotton Shirt', 'Polo Shirt', 'Dress Shirt', 'Flannel Shirt', 'Linen Shirt'],
    'Trousers': ['Chinos', 'Jeans', 'Cargo Pants', 'Dress Pants', 'Joggers'],
    'Shorts': ['Cargo Shorts', 'Denim Shorts', 'Athletic Shorts', 'Swim Shorts'],
    'Tshirt': ['V-Neck Tshirt', 'Crew Neck Tshirt', 'Long Sleeve Tshirt', 'Sports Tshirt'],
    'Shoes': ['Running Shoes', 'Sneakers', 'Casual Shoes', 'Basketball Shoes', 'Hiking Shoes'],
    'Socks': ['Athletic Socks', 'Wool Socks', 'Compression Socks', 'Dress Socks'],
    'Accessories': ['Belt', 'Cap', 'Scarf', 'Sunglasses', 'Watch'],
    'Jackets': ['Denim Jacket', 'Leather Jacket', 'Windbreaker', 'Bomber Jacket'],
    'Sweaters': ['Wool Sweater', 'Cardigan', 'Pullover', 'Hoodie']
}

def generate_product_name(category):
    color = random.choice(color_prefixes)
    base = random.choice(product_bases[category])
    brand = random.choice(brand_prefixes) if random.random() > 0.6 else ''
    return f"{color} {brand} {base}".strip()

def generate_product_price(category):
    price_ranges = {
        'Shirt': (20, 100),
        'Trousers': (30, 150),
        'Shorts': (15, 50),
        'Tshirt': (8, 40),
        'Shoes': (50, 250),
        'Socks': (4, 20),
        'Accessories': (10, 100),
        'Jackets': (50, 300),
        'Sweaters': (30, 150)
    }
    low, high = price_ranges[category]
    return round(random.uniform(low, high), 2)

def generate_additional_rows(existing_ids, num_rows=150):
    new_rows = []
    start_id = max(existing_ids) + 1 if existing_ids else 25

    for i in range(num_rows):
        category = random.choice(categories)
        product_name = generate_product_name(category)
        price = generate_product_price(category)
        quantity = random.randint(1, 15)
        
        row = {
            '_id': generate_mongodb_id(),  # Generate MongoDB-style ID
            'productId': start_id + i,
            'productName': product_name,
            'price': price,
            'quantity': quantity,
            'category': category,
            '__v': 0
        }
        new_rows.append(row)

    return new_rows

def main():
    # Read existing IDs from the original file
    with open('test.products.csv', 'r') as f:
        reader = csv.DictReader(f)
        existing_ids = [int(row['productId']) for row in reader]

    # Generate additional rows
    new_rows = generate_additional_rows(existing_ids)

    # Append to the existing CSV
    with open('test.products.csv', 'a', newline='') as f:
        fieldnames = ['_id', 'productId', 'productName', 'price', 'quantity', 'category', '__v']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerows(new_rows)

    # Print the new rows for preview
    for row in new_rows:
        print(row)

if __name__ == '__main__':
    main()