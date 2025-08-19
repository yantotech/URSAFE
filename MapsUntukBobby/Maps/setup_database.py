#!/usr/bin/env python3
"""
Crime Monitoring System - Database Setup Script
Script untuk setup database MySQL dengan data sample
"""

import pymysql
import sys
import os
from config import Config

def create_database():
    """Create MySQL database if not exists"""
    try:
        print("🗄️ Creating MySQL database...")
        
        # Connect without specifying database
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USERNAME,
            password=Config.MYSQL_PASSWORD,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            # Create database if not exists
            cursor.execute(f"CREATE DATABASE IF NOT EXISTS {Config.MYSQL_DATABASE} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print(f"✅ Database '{Config.MYSQL_DATABASE}' ready")
            
            # Use database
            cursor.execute(f"USE {Config.MYSQL_DATABASE}")
            
            # Create tables manually for better control
            create_tables(cursor)
            
        connection.commit()
        connection.close()
        print("✅ Database setup completed successfully")
        return True
        
    except Exception as e:
        print(f"❌ Database setup failed: {e}")
        return False

def create_tables(cursor):
    """Create tables with proper schema"""
    
    # Incidents table
    incidents_table = """
    CREATE TABLE IF NOT EXISTS incidents (
        id INT AUTO_INCREMENT PRIMARY KEY,
        criteria VARCHAR(50) NOT NULL,
        location_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 6) NOT NULL,
        longitude DECIMAL(10, 6) NOT NULL,
        description TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_criteria (criteria),
        INDEX idx_location (latitude, longitude),
        INDEX idx_created_at (created_at)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    # CCTVs table
    cctvs_table = """
    CREATE TABLE IF NOT EXISTS cctvs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        location_name VARCHAR(255) NOT NULL,
        latitude DECIMAL(10, 6) NOT NULL,
        longitude DECIMAL(10, 6) NOT NULL,
        status VARCHAR(20) DEFAULT 'active',
        description TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_name (name),
        INDEX idx_status (status),
        INDEX idx_cctv_location (latitude, longitude),
        INDEX idx_created_at (created_at),
        
        UNIQUE KEY unique_name (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    try:
        cursor.execute(incidents_table)
        print("✅ Incidents table ready")
        
        cursor.execute(cctvs_table)
        print("✅ CCTVs table ready")
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise e

def insert_sample_data():
    """Insert sample data for testing"""
    try:
        print("📊 Inserting sample data...")
        
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USERNAME,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            # Check if data already exists
            cursor.execute("SELECT COUNT(*) as count FROM incidents")
            incident_count = cursor.fetchone()['count']
            
            cursor.execute("SELECT COUNT(*) as count FROM cctvs")
            cctv_count = cursor.fetchone()['count']
            
            if incident_count > 0 or cctv_count > 0:
                print("⚠️ Sample data already exists, skipping insertion...")
                return
            
            # Sample incidents data
            sample_incidents = [
                ('kecelakaan', 'Bundaran HI, Jakarta Pusat', -6.1951, 106.8231, 'Kecelakaan lalu lintas saat jam sibuk'),
                ('perkelahian', 'Monas, Jakarta Pusat', -6.1750, 106.8283, 'Perkelahian antar kelompok'),
                ('penyerangan', 'Mall Taman Anggrek, Jakarta Barat', -6.1785, 106.7920, 'Penyerangan di area parkir'),
                ('ledakan', 'Senayan, Jakarta Selatan', -6.2297, 106.8008, 'Ledakan gas di area komersial'),
                ('kecelakaan', 'Kemang, Jakarta Selatan', -6.2615, 106.8106, 'Kecelakaan motor vs mobil'),
                ('perkelahian', 'Glodok, Jakarta Barat', -6.1447, 106.8133, 'Perselisihan pedagang'),
                ('penyerangan', 'Menteng, Jakarta Pusat', -6.1944, 106.8294, 'Penyerangan saat malam hari'),
                ('kecelakaan', 'Kelapa Gading, Jakarta Utara', -6.1618, 106.8998, 'Kecelakaan beruntun'),
            ]
            
            # Sample CCTVs data
            sample_cctvs = [
                ('CCTV Bundaran HI-01', 'Bundaran Hotel Indonesia', -6.1952, 106.8230, 'active', 'CCTV utama monitoring bundaran'),
                ('CCTV Monas-02', 'Monumen Nasional', -6.1753, 106.8280, 'active', 'CCTV area wisata Monas'),
                ('CCTV Senayan-03', 'Kompleks Senayan', -6.2300, 106.8010, 'active', 'CCTV area olahraga Senayan'),
                ('CCTV Kemang-04', 'Kemang Raya', -6.2620, 106.8100, 'maintenance', 'CCTV area komersial Kemang'),
                ('CCTV Glodok-05', 'Pasar Glodok', -6.1450, 106.8130, 'active', 'CCTV area pasar tradisional'),
                ('CCTV Menteng-06', 'Jalan Menteng Raya', -6.1940, 106.8300, 'active', 'CCTV area perumahan elite'),
            ]
            
            # Insert incidents
            cursor.executemany(
                "INSERT INTO incidents (criteria, location_name, latitude, longitude, description) VALUES (%s, %s, %s, %s, %s)",
                sample_incidents
            )
            
            # Insert CCTVs
            cursor.executemany(
                "INSERT INTO cctvs (name, location_name, latitude, longitude, status, description) VALUES (%s, %s, %s, %s, %s, %s)",
                sample_cctvs
            )
            
            connection.commit()
            print(f"✅ Sample data inserted: {len(sample_incidents)} incidents, {len(sample_cctvs)} CCTVs")
            
    except Exception as e:
        print(f"❌ Error inserting sample data: {e}")
    finally:
        if 'connection' in locals():
            connection.close()

def check_database_status():
    """Check database tables and data"""
    try:
        connection = pymysql.connect(
            host=Config.MYSQL_HOST,
            port=Config.MYSQL_PORT,
            user=Config.MYSQL_USERNAME,
            password=Config.MYSQL_PASSWORD,
            database=Config.MYSQL_DATABASE,
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        
        with connection.cursor() as cursor:
            print(f"\n📊 Database Status: {Config.MYSQL_DATABASE}")
            print("=" * 50)
            
            # Check tables
            cursor.execute("SHOW TABLES")
            tables = cursor.fetchall()
            
            for table in tables:
                table_name = list(table.values())[0]
                cursor.execute(f"SELECT COUNT(*) as count FROM {table_name}")
                count = cursor.fetchone()['count']
                
                # Get table info
                cursor.execute(f"DESCRIBE {table_name}")
                columns = cursor.fetchall()
                
                print(f"📋 Table: {table_name}")
                print(f"   Records: {count}")
                print(f"   Columns: {len(columns)}")
                print(f"   Structure: {', '.join([col['Field'] for col in columns[:5]])}{'...' if len(columns) > 5 else ''}")
                print()
        
        connection.close()
        return True
        
    except Exception as e:
        print(f"❌ Error checking database: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Crime Monitoring System - Database Setup")
    print("=" * 60)
    print(f"📍 Host: {Config.MYSQL_HOST}:{Config.MYSQL_PORT}")
    print(f"🗄️ Database: {Config.MYSQL_DATABASE}")
    print(f"👤 User: {Config.MYSQL_USERNAME}")
    print("=" * 60)
    
    # Step 1: Create database and tables
    if not create_database():
        print("\n❌ Database setup failed. Please check your MySQL configuration:")
        print("1. MySQL server is running")
        print("2. Username and password are correct")
        print("3. User has CREATE DATABASE permissions")
        sys.exit(1)
    
    # Step 2: Insert sample data
    insert_sample_data()
    
    # Step 3: Check final status
    print("\n🔍 Final Database Status:")
    if check_database_status():
        print("🎉 Database setup completed successfully!")
        print("\n📖 Next steps:")
        print("1. Run: python app.py")
        print("2. Open: http://localhost:5000")
        print("3. Test all features")
    else:
        print("⚠️ Database setup completed but status check failed")
    
    print("\n🛠️ If you need to reset the database, run:")
    print(f"   DROP DATABASE {Config.MYSQL_DATABASE};")
    print("   Then run this script again.")

if __name__ == '__main__':
    main()
