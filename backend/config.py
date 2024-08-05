from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
import redis
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
import firebase_admin
from firebase_admin import credentials, storage

app = Flask(__name__)
load_dotenv()

CORS(app, supports_credentials=True)
app.config['CORS_HEADERS'] = 'application/json'

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://127.0.0.1:6379')

# Path to your service account key file
cred = credentials.Certificate('fantasy-basketball-cfb4d-firebase-adminsdk-gtoe5-12d7e1d53a.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'fantasy-basketball-cfb4d.appspot.com'
})

bucket = storage.bucket()
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
server_session = Session(app)
migrate = Migrate(app, db)