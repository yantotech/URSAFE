from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
import pymysql

# Install PyMySQL sebagai MySQLdb
pymysql.install_as_MySQLdb()

db = SQLAlchemy()

def init_db(app):
    """Initialize database dengan Flask app"""
    db.init_app(app)
    
    with app.app_context():
        try:
            # Test koneksi database
            db.session.execute(text('SELECT 1'))
            print("✅ MySQL connection established successfully")
            
            # Buat semua tabel
            db.create_all()
            print("✅ Database tables created successfully")
            
            return True
            
        except Exception as e:
            print(f"❌ Database initialization failed: {e}")
            print("Please check your MySQL configuration:")
            print("1. MySQL server is running")
            print("2. Database exists or user has CREATE permission")
            print("3. Username and password are correct")
            print("4. User has necessary permissions")
            return False

# def create_sample_data():
    """Buat sample data untuk testing"""
    from models import Incident, CCTV
    
    try:
        # Check jika data sudah ada
        if Incident.query.count() > 0 or CCTV.query.count() > 0:
            print("Sample data already exists, skipping...")
            return
        
        # Sample incidents
        incidents = [
            Incident(criteria='kecelakaan', location_name='Bundaran HI, Jakarta', 
                    latitude=-6.1951, longitude=106.8231),
            Incident(criteria='perkelahian', location_name='Monas, Jakarta', 
                    latitude=-6.1750, longitude=106.8283),
            Incident(criteria='penyerangan', location_name='Mall Taman Anggrek', 
                    latitude=-6.1785, longitude=106.7920),
            Incident(criteria='ledakan', location_name='Senayan, Jakarta', 
                    latitude=-6.2297, longitude=106.8008),
        ]
        
        # Sample CCTVs
        cctvs = [
            CCTV(name='CCTV Bundaran HI-01', location_name='Bundaran Hotel Indonesia',
                 latitude=-6.1952, longitude=106.8230),
            CCTV(name='CCTV Monas-02', location_name='Monumen Nasional',
                 latitude=-6.1753, longitude=106.8280),
            CCTV(name='CCTV Senayan-03', location_name='Kompleks Senayan',
                 latitude=-6.2300, longitude=106.8010),
        ]
        
        # Add to database
        for incident in incidents:
            db.session.add(incident)
        
        for cctv in cctvs:
            db.session.add(cctv)
        
        db.session.commit()
        print(f"✅ Sample data created: {len(incidents)} incidents, {len(cctvs)} CCTVs")
        
    except Exception as e:
        db.session.rollback()
        print(f"❌ Error creating sample data: {e}")
