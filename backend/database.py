import os
from flask import abort
from dotenv import load_dotenv
import mysql.connector
from mysql.connector.cursor import MySQLCursorBufferedDict

# Making sure we can use environment variables
load_dotenv()

class Database():
    def __init__(self):
        self.db = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST'),
            user=os.getenv('MYSQL_USER'),
            passwd=os.getenv('MYSQL_PASSWORD'),
            database=os.getenv('MYSQL_DATABASE')
        )
        self.cursor = self.db.cursor(buffered=True, dictionary=True)

    # Fuction to commit changes to database
    def __commit(self):
        self.db.commit()
    
    # Function to reset cursor
    def __reset(self):
        self.cursor.reset()

    # Function to insert
    def insert(self, query, values):
        self.cursor.execute(query, values)
        self.__commit()
        self.__reset()

    # Function to fetch one
    def fetch_one(self, query, values):
        self.cursor.execute(query, values)
        response = self.cursor.fetchone()
        self.__reset()
        return response

    # Function to fetch many
    def fetch_all(self, query, values):
        self.cursor.execute(query, values)
        response = self.cursor.fetchall()
        if response is None:
            print(response)
            abort(500)

        self.__reset()
        return response

    # Function to delete
    def delete(self, query, values):
        self.cursor.execute(query, values)
        self.__commit()
        self.__reset()

    # Function to update
    def update(self, query, values=None):
        self.cursor.execute(query, values)
        self.__commit()
        self.__reset()

db = Database()