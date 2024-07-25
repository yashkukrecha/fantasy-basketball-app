# Routes
from flask import request, jsonify, session
from config import app, db, bcrypt, server_session
from models import User, Draft, Player
import pandas as pd
from kmeans import group1, group2, group3, group4, group5
import random, math

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # validation
    if not username or not password:
        return jsonify({'message': 'Username and password are required'}), 400
    if len(username) < 4 or len(username) > 20:
        return jsonify({'message': 'Username must be in between 4 and 20 characters'}), 400
    if len(password) < 8 or len(password) > 20:
        return jsonify({'message': 'Password must be in between 8 and 20 characters'}), 400
    # check pre-existing usernames
    existing_user_username = User.query.filter_by(username=username).first()
    if existing_user_username:
        return jsonify({'message': 'Username is already in use'}), 400
    # adding the user
    hashed_password = bcrypt.generate_password_hash(password)
    new_user = User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    session["user_id"] = new_user.id
    return jsonify({'user': new_user.to_json(), 'status': 201})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    # check pre-existing usernames
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password, password):
        session["user_id"] = user.id
        return jsonify({'message': 'Logged in successfully', 'user': user.to_json()}), 200
    return jsonify({'message': 'Incorrect username or password'}), 401

@app.route('/@me', methods=['GET'])
def get_current_user():
    user_id = session.get("user_id")
    if not user_id:
        return jsonify({'Error': 'Unauthorized'}), 401
    user = User.query.filter_by(id=user_id).first().to_json()
    return jsonify({'user': user}), 200

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id')
    return jsonify({'message': 'Successfully logged out'}), 200



# Validates whether or not the database worked
@app.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([player.to_json() for player in players])

@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_json() for user in users])

@app.route('/delete_users', methods=['POST'])
def delete_users():
    try:
        num_rows_deleted = db.session.query(User).delete()
        db.session.commit()
        return jsonify({'message': f'{num_rows_deleted} users deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while deleting users', 'error': str(e)}), 500

@app.route('/drafts', methods=['GET'])
def get_drafts():
    drafts = Draft.query.all()
    return jsonify(len(drafts))

@app.route('/delete_drafts', methods=['POST'])
def delete_drafts():
    try:
        num_rows_deleted = db.session.query(Draft).delete()
        db.session.commit()
        return jsonify({'message': f'{num_rows_deleted} drafts deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': 'An error occurred while deleting drafts', 'error': str(e)}), 500




@app.route('/provide_draft', methods=['GET'])
def provide_draft():
    players = []
    groups = [group1, group2, group3, group4, group5]
    for i in range(5):
        raw_list = random.sample(groups[i], 5)
        json_list = [Player.query.filter_by(player_name=player).first().to_json() for player in raw_list]
        players.append(json_list)
    return jsonify({'players': players})
        
@app.route('/create_draft', methods=['POST'])
def create_draft():
    data = request.get_json()
    player_ids = data.get('player_ids', [])
    user_id = session.get("user_id")
    sum = 0
    for player in player_ids:
        temp_player = Player.query.filter_by(id=player).first().to_json()
        games = int(math.round(temp_player['games_pred'])) if temp_player['games_pred'] > 82 else 82
        sum += ((temp_player['points_pred'] + temp_player['rebounds_pred'] + temp_player['assists_pred']) * games)
    
    new_draft = Draft(
        user_id=user_id,
        player1=player_ids[0],
        player2=player_ids[1],
        player3=player_ids[2],
        player4=player_ids[3],
        player5=player_ids[4],
        success=sum
    )
    db.session.add(new_draft)
    db.session.commit()
    return jsonify({'draft_id': new_draft.id}), 201

@app.route('/get_draft', methods=['POST'])
def get_draft():
    data = request.get_json()
    draft_id = data.get('draft_id')
    draft = Draft.query.filter_by(id=draft_id).first().to_json()
    return jsonify({'draft': draft}), 200

@app.route('/get_all_drafts', methods=['GET'])
def get_all_drafts():
    user_id = session.get("user_id")
    user = User.query.filter_by(id=user_id).first().to_json()
    draft_list = []
    for draft in user["drafts"]:
        draft_list.append(Draft.query.filter_by(id=draft).first().to_json())
    return jsonify({'drafts': draft_list, 'status': 200})
        



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