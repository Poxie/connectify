import os
from dotenv import load_dotenv
import mysql.connector

# Making sure we can use environment variables
load_dotenv()

# Initializing database connectiotn
db = mysql.connector.connect(
    host=os.getenv('MYSQL_HOST'),
    user=os.getenv('MYSQL_USER'),
    passwd=os.getenv('MYSQL_PASSWORD'),
    database=os.getenv('MYSQL_DATABASE')
)