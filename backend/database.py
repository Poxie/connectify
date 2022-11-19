import os
from flask import abort
from dotenv import load_dotenv
import mysql.connector
from mysql.connector.cursor import MySQLCursorBufferedDict
from mysql.connector.errors import DatabaseError

# Making sure we can use environment variables
load_dotenv()

MYSQL_DATABASE = os.getenv('MYSQL_DATABASE')
config = {
    'host': os.getenv('MYSQL_HOST'),
    'user': os.getenv('MYSQL_USER'),
    'passwd': os.getenv('MYSQL_PASSWORD'),
    'database': os.getenv('MYSQL_DATABASE')
}
class Database():
    def __init__(self):
        self.connection = None
        self.connection = self.__create_connection()

    def __create_connection(self):
        try:
            return mysql.connector.connect(**config)
        except DatabaseError as e:
            # Database does not exist
            db = mysql.connector.connect(
                host=config['host'],
                user=config['user'],
                passwd=['passwd']
            )

            cursor = db.cursor(buffered=True)
            
            # Creating database
            cursor.execute(f'CREATE DATABASE IF NOT EXISTS `{MYSQL_DATABASE}`')
            cursor.execute(f'USE {MYSQL_DATABASE}')

            # Creating tables
            cursor.execute('CREATE TABLE IF NOT EXISTS users (id BIGINT(20), username VARCHAR(255), password VARCHAR(255), email VARCHAR(255) DEFAULT NULL, display_name VARCHAR(255), bio VARCHAR(255) DEFAULT NULL, avatar VARCHAR(255), banner VARCHAR(255) DEFAULT NULL)')
            cursor.execute('CREATE TABLE IF NOT EXISTS followers (follower_id BIGINT(20), followee_id BIGINT(20), timestamp BIGINT(20))')
            cursor.execute('CREATE TABLE IF NOT EXISTS posts (id BIGINT(20), author_id BIGINT(20), title VARCHAR(255), content VARCHAR(255), timestamp BIGINT(20))')
            cursor.execute('CREATE TABLE IF NOT EXISTS comments (id BIGINT(20), author_id BIGINT(20), post_id BIGINT(20), content VARCHAR(255), timestamp BIGINT(20))')
            cursor.execute('CREATE TABLE IF NOT EXISTS likes (user_id BIGINT(20), parent_id BIGINT(20), type BIGINT(20), timestamp BIGINT(20))')
            cursor.execute('CREATE TABLE IF NOT EXISTS channels (id BIGINT(20), type INT(4), last_message_timestamp BIGINT(20) DEFAULT NULL, last_message_id BIGINT(20) DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, icon VARCHAR(255) DEFAULT NULL)')
            cursor.execute('CREATE TABLE IF NOT EXISTS recipients (id BIGINT(20), channel_id BIGINT(20), unread_count BIGINT(20) DEFAULT 0)')
            cursor.execute('CREATE TABLE IF NOT EXISTS messages (id BIGINT(20), author_id BIGINT(20), channel_id BIGINT(20), content VARCHAR(255), timestamp BIGINT(20))')
            cursor.execute('CREATE TABLE IF NOT EXISTS notifications (id BIGINT(20), type BIGINT(20), user_id BIGINT(20), reference_id BIGINT(20), user_reference_id BIGINT(20), created_at BIGINT(20), unread BOOLEAN DEFAULT 1)')
            cursor.execute('CREATE TABLE IF NOT EXISTS attachments (id BIGINT(20), parent_id BIGINT(20), extension VARCHAR(255))')

            # Creating new connection after database structure created
            return self.__create_connection()

    def query(self, query, values):
        cursor = self.connection.cursor(dictionary=True)
        cursor.execute(query, values)
        return cursor

    def fetch_all(self, query, values):
        data = []
        cursor = self.query(query, values)
        if cursor.with_rows:
            data = cursor.fetchall()
        cursor.close()
        return data

    def fetch_one(self, query, values):
        data = None
        cursor = self.query(query, values)
        if cursor.with_rows:
            data = cursor.fetchone()
        cursor.close()
        return data

    def update(self, query, values):
        cursor = self.query(query, values)
        rowcount = cursor.rowcount
        self.connection.commit()
        cursor.close()
        return rowcount
    
    def insert(self, query, values):
        cursor = self.query(query, values)
        id = cursor.lastrowid
        self.connection.commit()
        cursor.close()
        return id

    def delete(self, query, values):
        cursor = self.query(query, values)
        id = cursor.lastrowid
        self.connection.commit()
        cursor.close()
        return id

db = Database()