# Databases
from config import db
from sqlalchemy import LargeBinary
from flask_login import UserMixin

# Creates a database of the users for authentication
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    password = db.Column(db.String(100), unique=False, nullable=False)
    profile_pic = db.Column(db.String(256), nullable=True)
    drafts = db.relationship('Draft', backref='user', lazy=True)

    def to_json(self):
        return {
            "id": self.id,
            "username": self.username,
            "profile_pic": self.profile_pic,
            "drafts": [draft.id for draft in self.drafts]
        }
    
# Creates a database for the drafts
class Draft(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    player1 = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player2 = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player3 = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player4 = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    player5 = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    success = db.Column(db.Integer, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "player1": Player.query.filter_by(id=self.player1).first().to_json(),
            "player2": Player.query.filter_by(id=self.player2).first().to_json(),
            "player3": Player.query.filter_by(id=self.player3).first().to_json(),
            "player4": Player.query.filter_by(id=self.player4).first().to_json(),
            "player5": Player.query.filter_by(id=self.player5).first().to_json(),
            "success": self.success
        }

# Creates a database for the 2023 players
class Player(db.Model):
    # information of the player
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(50), nullable=False)
    team_name = db.Column(db.String(3), nullable=False)
    player_age = db.Column(db.Integer, nullable=False)
    player_height = db.Column(db.Float, nullable=False)
    player_weight = db.Column(db.Float, nullable=False)
    # last season stats
    games_played = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Float, nullable=False)
    rebounds = db.Column(db.Float, nullable=False)
    assists = db.Column(db.Float, nullable=False)
    net_rating = db.Column(db.Float, nullable=False)
    shooting_percent = db.Column(db.Float, nullable=False)
    # predicted by model for next season
    games_pred = db.Column(db.Integer, nullable=False)
    points_pred = db.Column(db.Float, nullable=False)
    rebounds_pred = db.Column(db.Float, nullable=False)
    assists_pred = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "player_name": self.player_name,
            "team_name": self.team_name,
            "player_age": self.player_age,
            "player_height": self.player_height,
            "player_weight": self.player_weight,
            "games_played": self.games_played,
            "points": self.points,
            "rebounds": self.rebounds,
            "assists": self.assists,
            "net_rating": self.net_rating,
            "shooting_percent": self.shooting_percent,
            "games_pred": self.games_pred,
            "points_pred": self.points_pred,
            "rebounds_pred": self.rebounds_pred,
            "assists_pred": self.assists_pred
        }

