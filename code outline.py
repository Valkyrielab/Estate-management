import pdfplumber
import mysql.connector

# Connect to MySQL
conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="yourpassword",
    database="EstateManagement"
)
cursor = conn.cursor()

# Extract text from PDF
with pdfplumber.open("Estates Questionnaire (Pre Populated) 2024.pdf") as pdf:
    text = ""
    for page in pdf.pages:
        text += page.extract_text()

# Example: Extract Client Info
def extract_client_info(text):
    # Simple regex or keyword search
    import re
    name = re.search(r"Full Name:\s*(.*)", text)
    id_number = re.search(r"Identity Number:\s*(.*)", text)
    tax_number = re.search(r"Tax Number:\s*(.*)", text)
    return {
        "name": name.group(1) if name else None,
        "id_number": id_number.group(1) if id_number else None,
        "tax_number": tax_number.group(1) if tax_number else None
    }

client_info = extract_client_info(text)

# Insert into MySQL
sql = """INSERT INTO ClientInfo (client_id, name, surname, id_number, tax_number)
         VALUES (%s, %s, %s, %s, %s)"""
cursor.execute(sql, (1, client_info["name"], "", client_info["id_number"], client_info["tax_number"]))
conn.commit()