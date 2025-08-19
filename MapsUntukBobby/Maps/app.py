from flask import Flask, render_template, request, jsonify
from config import Config
from database import db, init_db #reate_sample_data
from models import Incident, CCTV
from sqlalchemy import text, func
import logging
import sys

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def create_app():
    """Factory function untuk membuat Flask app"""
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize database
    if not init_db(app):
        logger.error("Failed to initialize database")
        sys.exit(1)
    
    return app

app = create_app()

# Routes
@app.route('/')
def index():
    """Halaman dashboard utama"""
    try:
        # Statistik dashboard
        total_incidents = Incident.query.count()
        total_cctvs = CCTV.query.count()
        active_cctvs = CCTV.query.filter_by(status='active').count()
        
        # Kejadian terbaru (5 terakhir)
        recent_incidents = Incident.query.order_by(Incident.created_at.desc()).limit(5).all()
        
        # Statistik per kriteria
        criteria_stats = {}
        criteria_list = ['kecelakaan', 'perkelahian', 'ledakan', 'penyerangan']
        for criteria in criteria_list:
            count = Incident.query.filter_by(criteria=criteria).count()
            criteria_stats[criteria] = count
        
        return render_template('index.html',
                             total_incidents=total_incidents,
                             total_cctvs=total_cctvs,
                             active_cctvs=active_cctvs,
                             recent_incidents=recent_incidents,
                             criteria_stats=criteria_stats)
                             
    except Exception as e:
        logger.error(f"Error in index route: {e}")
        return render_template('index.html',
                             total_incidents=0,
                             total_cctvs=0,
                             active_cctvs=0,
                             recent_incidents=[],
                             criteria_stats={})

@app.route('/add-incident')
def add_incident_page():
    """Halaman form tambah kejadian"""
    return render_template('add_incident.html')

@app.route('/add-cctv')  
def add_cctv_page():
    """Halaman form tambah CCTV"""
    return render_template('add_cctv.html')

# API Routes
@app.route('/api/incidents', methods=['GET', 'POST'])
def incidents_api():
    """API untuk mengelola incidents"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validasi input
            required_fields = ['criteria', 'location_name', 'latitude', 'longitude']
            for field in required_fields:
                if field not in data or not str(data[field]).strip():
                    return jsonify({'error': f'Field {field} wajib diisi'}), 400
            
            # Validasi koordinat
            try:
                lat = float(data['latitude'])
                lng = float(data['longitude'])
                if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                    return jsonify({'error': 'Koordinat tidak valid'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': 'Format koordinat tidak valid'}), 400
            
            # Validasi kriteria
            valid_criteria = ['kecelakaan', 'perkelahian', 'ledakan', 'penyerangan']
            if data['criteria'] not in valid_criteria:
                return jsonify({'error': 'Kriteria tidak valid'}), 400
            
            # Buat incident baru
            incident = Incident(
                criteria=data['criteria'],
                location_name=data['location_name'].strip(),
                latitude=lat,
                longitude=lng,
                description=data.get('description', '').strip()
            )
            
            db.session.add(incident)
            db.session.commit()
            
            logger.info(f"New incident created: ID {incident.id}")
            return jsonify({
                'message': 'Kejadian berhasil ditambahkan',
                'incident': incident.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating incident: {e}")
            return jsonify({'error': 'Gagal menyimpan data kejadian'}), 500
    
    else:  # GET
        try:
            incidents = Incident.query.order_by(Incident.created_at.desc()).all()
            return jsonify([incident.to_dict() for incident in incidents])
        except Exception as e:
            logger.error(f"Error fetching incidents: {e}")
            return jsonify({'error': 'Gagal mengambil data kejadian'}), 500

@app.route('/api/cctvs', methods=['GET', 'POST'])
def cctvs_api():
    """API untuk mengelola CCTVs"""
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Validasi input
            required_fields = ['name', 'location_name', 'latitude', 'longitude']
            for field in required_fields:
                if field not in data or not str(data[field]).strip():
                    return jsonify({'error': f'Field {field} wajib diisi'}), 400
            
            # Validasi koordinat
            try:
                lat = float(data['latitude'])
                lng = float(data['longitude'])
                if not (-90 <= lat <= 90) or not (-180 <= lng <= 180):
                    return jsonify({'error': 'Koordinat tidak valid'}), 400
            except (ValueError, TypeError):
                return jsonify({'error': 'Format koordinat tidak valid'}), 400
            
            # Cek duplikasi nama CCTV
            existing_cctv = CCTV.query.filter_by(name=data['name'].strip()).first()
            if existing_cctv:
                return jsonify({'error': 'Nama CCTV sudah digunakan'}), 400
            
            # Buat CCTV baru
            cctv = CCTV(
                name=data['name'].strip(),
                location_name=data['location_name'].strip(),
                latitude=lat,
                longitude=lng,
                status=data.get('status', 'active'),
                description=data.get('description', '').strip()
            )
            
            db.session.add(cctv)
            db.session.commit()
            
            logger.info(f"New CCTV created: ID {cctv.id}")
            return jsonify({
                'message': 'CCTV berhasil ditambahkan',
                'cctv': cctv.to_dict()
            }), 201
            
        except Exception as e:
            db.session.rollback()
            logger.error(f"Error creating CCTV: {e}")
            return jsonify({'error': 'Gagal menyimpan data CCTV'}), 500
    
    else:  # GET
        try:
            cctvs = CCTV.query.order_by(CCTV.created_at.desc()).all()
            return jsonify([cctv.to_dict() for cctv in cctvs])
        except Exception as e:
            logger.error(f"Error fetching CCTVs: {e}")
            return jsonify({'error': 'Gagal mengambil data CCTV'}), 500

@app.route('/api/heatmap-data')
def heatmap_data():
    """API untuk data heatmap"""
    try:
        # Ambil semua incident dengan koordinat
        incidents = Incident.query.with_entities(
            Incident.latitude, 
            Incident.longitude, 
            Incident.criteria
        ).all()
        
        # Group berdasarkan koordinat dan hitung weight
        location_weights = {}
        for incident in incidents:
            coord_key = f"{float(incident.latitude):.4f},{float(incident.longitude):.4f}"
            if coord_key not in location_weights:
                location_weights[coord_key] = {
                    'lat': float(incident.latitude),
                    'lng': float(incident.longitude),
                    'weight': 0
                }
            location_weights[coord_key]['weight'] += 1
        
        # Format untuk leaflet heatmap [lat, lng, weight]
        heatmap_points = []
        for location_data in location_weights.values():
            heatmap_points.append([
                location_data['lat'],
                location_data['lng'],
                min(location_data['weight'] * 0.7, 1.0)  # Normalize weight
            ])
        
        return jsonify(heatmap_points)
        
    except Exception as e:
        logger.error(f"Error generating heatmap data: {e}")
        return jsonify([])

@app.route('/api/statistics')
def statistics_api():
    """API untuk statistik dashboard"""
    try:
        # Basic counts
        total_incidents = Incident.query.count()
        total_cctvs = CCTV.query.count()
        active_cctvs = CCTV.query.filter_by(status='active').count()
        
        # Incident statistics per criteria
        criteria_stats = {}
        criteria_list = ['kecelakaan', 'perkelahian', 'ledakan', 'penyerangan']
        for criteria in criteria_list:
            count = Incident.query.filter_by(criteria=criteria).count()
            criteria_stats[criteria] = count
        
        # Recent activity (last 7 days)
        from datetime import datetime, timedelta
        week_ago = datetime.utcnow() - timedelta(days=7)
        recent_incidents = Incident.query.filter(
            Incident.created_at >= week_ago
        ).count()
        
        return jsonify({
            'total_incidents': total_incidents,
            'total_cctvs': total_cctvs,
            'active_cctvs': active_cctvs,
            'criteria_stats': criteria_stats,
            'recent_incidents': recent_incidents
        })
        
    except Exception as e:
        logger.error(f"Error fetching statistics: {e}")
        return jsonify({'error': 'Gagal mengambil statistik'}), 500

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint tidak ditemukan'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Terjadi kesalahan server'}), 500

# Health check
@app.route('/health')
def health_check():
    try:
        db.session.execute(text('SELECT 1'))
        return jsonify({'status': 'healthy', 'database': 'connected'}), 200
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'database': 'disconnected', 'error': str(e)}), 500

@app.route('/map')
def map_page():
    """Halaman khusus untuk Map"""
    return render_template('map.html')

@app.route('/api/reports')
def api_reports():
    try:
        query = text("SELECT id, jenisKejadian, lokasiKejadian, latitude, longitude, waktuKejadian, deskripsiKejadian FROM reports WHERE latitude IS NOT NULL AND longitude IS NOT NULL")
        result = db.session.execute(query)
        reports = []
        for row in result:
            reports.append({
                'id': row.id,
                'criteria': row.jenisKejadian.lower(),
                'location_name': row.lokasiKejadian,
                'latitude': float(row.latitude),
                'longitude': float(row.longitude),
                'description': row.deskripsiKejadian,
                'occurred_at': row.waktuKejadian  # disesuaikan dengan frontend
            })
        return jsonify(reports)
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Starting Crime Monitoring System...")
    print(f"📊 Database: {Config.MYSQL_HOST}:{Config.MYSQL_PORT}/{Config.MYSQL_DATABASE}")
    
    # Create sample data jika belum ada
    # with app.app_context():
    #     create_sample_data()
    
    print("✅ System ready!")
    print("🌐 Access: http://localhost:5000")
    print("❤️  Health check: http://localhost:5000/health")
    
    app.run(debug=Config.DEBUG, host='localhost', port=5000, threaded=True)
