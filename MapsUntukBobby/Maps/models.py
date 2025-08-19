from database import db
from datetime import datetime
from sqlalchemy import Index

class Incident(db.Model):
    __tablename__ = 'incidents'
    
    id = db.Column(db.Integer, primary_key=True)
    criteria = db.Column(db.String(50), nullable=False, index=True)
    location_name = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Numeric(10, 6), nullable=False)
    longitude = db.Column(db.Numeric(10, 6), nullable=False)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite index for location queries
    __table_args__ = (
        Index('idx_location', 'latitude', 'longitude'),
        {'mysql_engine': 'InnoDB', 'mysql_charset': 'utf8mb4'}
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'criteria': self.criteria,
            'location_name': self.location_name,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def __repr__(self):
        return f'<Incident {self.id}: {self.criteria} at {self.location_name}>'

class CCTV(db.Model):
    __tablename__ = 'cctvs'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, index=True)
    location_name = db.Column(db.String(255), nullable=False)
    latitude = db.Column(db.Numeric(10, 6), nullable=False)
    longitude = db.Column(db.Numeric(10, 6), nullable=False)
    status = db.Column(db.String(20), default='active', index=True)
    description = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Composite index for location queries
    __table_args__ = (
        Index('idx_cctv_location', 'latitude', 'longitude'),
        {'mysql_engine': 'InnoDB', 'mysql_charset': 'utf8mb4'}
    )
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'location_name': self.location_name,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'status': self.status,
            'description': self.description,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }
    
    def __repr__(self):
        return f'<CCTV {self.id}: {self.name} at {self.location_name}>'
