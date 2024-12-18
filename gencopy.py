import csv
import random
import uuid
from datetime import datetime, timedelta

def load_products(file_path='test.products.csv'):
    """Load available products from the products CSV."""
    products = []
    with open(file_path, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            products.append(row)
    return products

def generate_full_name():
    """Generate a realistic Sri Lankan name."""
    first_names = [
        'Amila', 'Nimali', 'Heshan', 'Shanika', 'Kanthi', 'Gagani', 'Bimala', 
        'Priyantha', 'Dilini', 'Ruwan', 'Chamara', 'Ishara', 'Sunil', 'Deepika', 
        'Lakshan', 'Thisara', 'Nimesha', 'Sasanka', 'Chamindi', 'Asanka'
    ]
    
    last_names = [
        'Jayasinghe', 'Fernando', 'Gunawardana', 'Rathnayake', 'Perera', 
        'Silva', 'Dias', 'Wickramasinghe', 'Bandara', 'Cooray', 'Samarasinghe', 
        'Abeysekara', 'Ratnayake', 'Dissanayake', 'Kurukulasuriya', 'Warnakulasooriya'
    ]
    
    return f"{random.choice(first_names)} {random.choice(last_names)}"

def generate_mobile_number():
    """Generate a realistic Sri Lankan mobile number."""
    prefixes = ['077', '071', '070', '075', '076', '078', '011']
    return f"0{random.choice(prefixes)}{random.randint(1000000, 9999999)}"

def generate_order(products, existing_order_ids):
    """Generate a single order with 1-4 unique products."""
    # Ensure unique order ID
    while True:
        order_id = str(uuid.uuid4()).replace('-', '')[:24]
        if order_id not in existing_order_ids:
            break
    
    # Randomly select number of items (1-4)
    num_items = random.randint(1, 4)
    
    # Select unique random products
    selected_products = random.sample(products, min(num_items, len(products)))
    
    # Prepare order details
    order = {
        '_id': order_id,
        'customerName': generate_full_name(),
        'mobileNumber': generate_mobile_number(),
        'createdAt': (datetime.now() + timedelta(days=random.randint(0, 30))).isoformat() + 'Z',
        'updatedAt': (datetime.now() + timedelta(days=random.randint(0, 30))).isoformat() + 'Z',
        '__v': 0
    }
    
    # Add product details
    for i, product in enumerate(selected_products):
        order[f'items[{i}].productId'] = product['productId']
        order[f'items[{i}].productName'] = product['productName']
        order[f'items[{i}].quantity'] = random.randint(1, 3)
        order[f'items[{i}]._id'] = str(uuid.uuid4()).replace('-', '')[:24]
    
    # Fill remaining slots with empty strings
    for i in range(num_items, 4):
        order[f'items[{i}].productId'] = ''
        order[f'items[{i}].productName'] = ''
        order[f'items[{i}].quantity'] = ''
        order[f'items[{i}]._id'] = ''
    
    return order

def generate_orders(num_orders=20):
    """Generate multiple orders."""
    # Load products
    products = load_products()
    
    # Keep track of existing order IDs to ensure uniqueness
    existing_order_ids = set()
    
    # Generate orders
    orders = []
    for _ in range(num_orders):
        order = generate_order(products, existing_order_ids)
        existing_order_ids.add(order['_id'])
        orders.append(order)
    
    return orders

def append_orders_to_csv(orders, filename='test.orders.csv'):
    """Append generated orders to the CSV file."""
    # Determine fieldnames
    fieldnames = [
        '_id', 'customerName', 'mobileNumber', 
        'items[0].productId', 'items[1].productId', 'items[2].productId', 'items[3].productId',
        'items[0].productName', 'items[1].productName', 'items[2].productName', 'items[3].productName',
        'items[0].quantity', 'items[1].quantity', 'items[2].quantity', 'items[3].quantity',
        'items[0]._id', 'items[1]._id', 'items[2]._id', 'items[3]._id',
        'createdAt', 'updatedAt', '__v'
    ]
    
    # Check if file exists and has content
    try:
        with open(filename, 'r') as f:
            existing_content = f.read()
        write_header = not existing_content
    except FileNotFoundError:
        write_header = True
    
    # Write to file
    with open(filename, 'a', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        
        # Write header if needed
        if write_header:
            writer.writeheader()
        
        # Write orders
        writer.writerows(orders)
    
    return orders

def main():
    # Generate and append orders
    orders = generate_orders(num_orders=100)
    
    # Print generated orders for preview
    print("Generated Orders:")
    for order in orders:
        print(order)
    
    # Append to CSV
    appended_orders = append_orders_to_csv(orders)
    print(f"\nSuccessfully generated and appended {len(appended_orders)} orders to test.orders.csv")

if __name__ == '__main__':
    main()