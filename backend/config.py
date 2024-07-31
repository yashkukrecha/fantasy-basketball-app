from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_session import Session
import redis
import os
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

CORS(app, supports_credentials=True, resources={r"/*": {"origins": os.getenv('FRONTEND_URL')}})
app.config['CORS_HEADERS'] = 'application/json'

app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('DATABASE_URL')
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.getenv('SECRET_KEY')
app.config['SESSION_TYPE'] = "redis"
app.config['SESSION_PERMANENT'] = False
app.config['SESSION_USE_SIGNER'] = True
app.config['SESSION_REDIS'] = redis.from_url('redis://127.0.0.1:6379')

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
server_session = Session(app)