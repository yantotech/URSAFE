import os
from datetime import timedelta

class Config:
    # Database MySQL Configuration
    MYSQL_HOST = '127.0.0.1'
    MYSQL_PORT = 3306
    MYSQL_USERNAME = 'root'
    MYSQL_PASSWORD = 'bobbyandreanjapri'  # Sesuaikan dengan password MySQL Anda
    MYSQL_DATABASE = 'ursafe_db'
    
    # Flask Configuration
    SECRET_KEY = 'ursafe_db-secret-key-2024'
    SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{MYSQL_USERNAME}:{MYSQL_PASSWORD}@{MYSQL_HOST}:{MYSQL_PORT}/{MYSQL_DATABASE}?charset=utf8mb4"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
        'pool_timeout': 20,
        'connect_args': {
            'connect_timeout': 10,
            'charset': 'utf8mb4'
        }
    }
    
    # Session Configuration
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)
    
    # Development Configuration
    DEBUG = True
    TESTING = False
