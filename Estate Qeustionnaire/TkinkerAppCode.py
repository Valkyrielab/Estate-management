import tkinter as tk
from tkinter import filedialog, messagebox
import pdfplumber
import re
import mysql.connector

# MySQL Config
db_config = {
    "host": "localhost",
    "user": "root",
    "password": "yourpassword",
    "database": "EstateManagement"
}

def get_db_connection():
    return mysql.connector.connect(**db_config)

def extract_text_from_pdf(pdf_path):
    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text

def parse_client_info(text):
    name = re.search(r"Full Name:\s*(.*)", text)
    id_number = re.search(r"Identity Number:\s*(.*)", text)
    tax_number = re.search(r"Tax Number:\s*(.*)", text)
    occupation = re.search(r"Occupation:\s*(.*)", text)
    salary = re.search(r"Approximate monthly salary:\s*(.*)", text)
    residence = re.search(r"Residence prior to death:\s*(.*)", text)

    return {
        "name": name.group(1).strip() if name else None,
        "id_number": id_number.group(1).strip() if id_number else None,
        "tax_number": tax_number.group(1).strip() if tax_number else None,
        "occupation": occupation.group(1).strip() if occupation else None,
        "salary": float(salary.group(1).replace(",", "")) if salary else None,
        "residence": residence.group(1).strip() if residence else None
    }

def insert_client_info(client_info):
    conn = get_db_connection()
    cursor = conn.cursor()
    sql = """INSERT INTO ClientInfo (client_id, name, surname, id_number, tax_number, occupation, salary, residence)
             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"""
    name_parts = client_info["name"].split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    cursor.execute(sql, (1, first_name, last_name, client_info["id_number"], client_info["tax_number"],
                         client_info["occupation"], client_info["salary"], client_info["residence"]))
    conn.commit()
    cursor.close()
    conn.close()

def upload_pdf():
    file_path = filedialog.askopenfilename(filetypes=[("PDF Files", "*.pdf")])
    if file_path:
        try:
            text = extract_text_from_pdf(file_path)
            client_info = parse_client_info(text)
            insert_client_info(client_info)
            messagebox.showinfo("Success", f"Data inserted successfully:\n{client_info}")
        except Exception as e:
            messagebox.showerror("Error", str(e))

# Tkinter GUI
root = tk.Tk()
root.title("Estate Management Data Loader")
root.geometry("400x200")

label = tk.Label(root, text="Upload Estates Questionnaire PDF", font=("Arial", 14))
label.pack(pady=20)

upload_btn = tk.Button(root, text="Upload PDF & Insert Data", command=upload_pdf, font=("Arial", 12))
upload_btn.pack(pady=20)

root.mainloop()