# Routes
from flask import request, jsonify
from config import app, db, bcrypt, login_manager
from models import User, Draft, Player
import pandas as pd
from flask_wtf import FlaskForm
from flask_login import login_user, logout_user, current_user, login_required
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError

# Validates whether or not the database worked
@app.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([player.to_json() for player in players])

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_json() for user in users])

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data['username']
    password = data['password']

    # validation
    if not username or not password:
        return jsonify({'message': 'Username and password are required', 'status': 400})
    if len(username) < 4 or len(username) > 20:
        return jsonify({'message': 'Username must be in between 4 and 20 characters', 'status': 400})
    if len(password) < 8 or len(password) > 20:
        return jsonify({'message': 'Password must be in between 8 and 20 characters', 'status': 400})
    
    # check pre-existing usernames
    existing_user_username = User.query.filter_by(username=username).first()
    if existing_user_username:
        return jsonify({'message': 'Username is already in use', 'status': 400})
    
    # adding the user
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'user': new_user.to_json(), 'status': 201})

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    
    # check pre-existing usernames
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        login_user(user)
        return jsonify({'message': 'Logged in successfully', 'user': user.to_json(), 'status': 200})
        
    return jsonify({'message': 'Incorrect username or password', 'status': 401})

@app.route('/logout', methods=['POST'])
# @login_required
def logout():
    # print(current_user)
    logout_user()
    return jsonify({'message': 'Logged out successfully', 'status': 200})
 

if __name__ == "__main__":
    # Creating the databases and adding the player information
    with app.app_context(): 
        db.create_all()
        if Player.query.first() is None:
            df = pd.read_csv('ml/player_database.csv')
            for _, row in df.iterrows():
                player = Player(
                    player_name=row['player_name'],
                    team_name=row['team_abbreviation'],
                    player_age=row['age'],
                    player_height=row['player_height'],
                    player_weight=row['player_weight'],
                    games_played=row['gp'],
                    points=row['pts'],
                    rebounds=row['reb'],
                    assists=row['ast'],
                    net_rating=row['net_rating'],
                    shooting_percent=row['ts_pct'],
                    games_pred=row['gp_pred'],
                    points_pred=row['pts_pred'],
                    rebounds_pred=row['reb_pred'],
                    assists_pred=row['ast_pred']
                )
                db.session.add(player)
            db.session.commit()
    # Running the app
    app.run(debug=True)