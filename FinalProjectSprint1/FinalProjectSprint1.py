#Resources used for project
#ChatGPT, Homework 2 and Exam 1

#Creating Flask Application
from flask import Flask, request, jsonify
from flask_restful import Resource, Api
from flask_mysqldb import MySQL
from flask_cors import CORS  # Add CORS support

app = Flask(__name__)
api = Api(app)
CORS(app)

#Created Connection with MySQL database
app.config['MYSQL_HOST'] = 'cis3368fall.c5nfalmzzodd.us-east-1.rds.amazonaws.com'
app.config['MYSQL_USER'] = 'admin'
app.config['MYSQL_PASSWORD'] = 'cisfall2023'
app.config['MYSQL_DATABASE'] = 'cis3368finalproject'

mysql = MySQL(app)

def handle_database_errors(f):
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except Exception as e:
            return {'message': 'Database error: ' + str(e)}, 500
    return wrapper

class Floor(Resource):
    def get(self, floor_id):
        # Implement the logic to retrieve a floor by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM floor WHERE id = %s", (floor_id,))
        floor = cur.fetchone()
        cur.close()

        if floor:
            # Return the floor as JSON if found
            return jsonify(floor)
        else:
            # Return a 404 Not Found response if the floor with the given ID doesn't exist
            return {'message': 'Floor not found'}, 404

    def post(self):
        # Implement the logic to create a new floor in the database.
        data = request.get_json()
        level = data['level']
        name = data['name']

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO floor (level, name) VALUES (%s, %s)", (level, name))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Floor created successfully'}, 201

    def put(self, floor_id):
        # Implement the logic to update a floor by ID in the database.
        data = request.get_json()
        level = data['level']
        name = data['name']

        cur = mysql.connection.cursor()
        cur.execute("UPDATE floor SET level = %s, name = %s WHERE id = %s", (level, name, floor_id))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Floor updated successfully'}

    def delete(self, floor_id):
        # Implement the logic to delete a floor by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM floor WHERE id = %s", (floor_id,))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Floor deleted successfully'}

class Room(Resource):
    def get(self, room_id):
        # Implement the logic to retrieve a room by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM room WHERE id = %s", (room_id,))
        room = cur.fetchone()
        cur.close()

        if room:
            # Return the room as JSON if found
            return jsonify(room)
        else:
            # Return a 404 Not Found response if the room with the given ID doesn't exist
            return {'message': 'Room not found'}, 404

    def post(self):
        # Implement the logic to create a new room in the database.
        data = request.get_json()
        capacity = data['capacity']
        number = data['number']
        floor = data['floor']  # Assuming you pass the floor ID when creating a room

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO room (capacity, number, floor) VALUES (%s, %s, %s)", (capacity, number, floor))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Room created successfully'}, 201

    def put(self, room_id):
        # Implement the logic to update a room by ID in the database.
        data = request.get_json()
        capacity = data['capacity']
        number = data['number']
        floor = data['floor']  # Assuming you pass the floor ID when updating a room

        cur = mysql.connection.cursor()
        cur.execute("UPDATE room SET capacity = %s, number = %s, floor = %s WHERE id = %s", (capacity, number, floor, room_id))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Room updated successfully'}

    def delete(self, room_id):
        # Implement the logic to delete a room by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM room WHERE id = %s", (room_id,))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Room deleted successfully'}

class Resident(Resource):
    def get(self, resident_id):
        # Implement the logic to retrieve a resident by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM resident WHERE id = %s", (resident_id,))
        resident = cur.fetchone()
        cur.close()

        if resident:
            # Return the resident as JSON if found
            return jsonify(resident)
        else:
            # Return a 404 Not Found response if the resident with the given ID doesn't exist
            return {'message': 'Resident not found'}, 404

    def post(self):
        # Implement the logic to create a new resident in the database.
        data = request.get_json()
        firstname = data['firstname']
        lastname = data['lastname']
        age = data['age']
        room = data['room']  # Assuming you pass the room ID when creating a resident

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO resident (firstname, lastname, age, room) VALUES (%s, %s, %s, %s)", (firstname, lastname, age, room))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Resident created successfully'}, 201

    def put(self, resident_id):
        # Implement the logic to update a resident by ID in the database.
        data = request.get_json()
        firstname = data['firstname']
        lastname = data['lastname']
        age = data['age']
        room = data['room']  # Assuming you pass the room ID when updating a resident

        cur = mysql.connection.cursor()
        cur.execute("UPDATE resident SET firstname = %s, lastname = %s, age = %s, room = %s WHERE id = %s", (firstname, lastname, age, room, resident_id))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Resident updated successfully'}

    def delete(self, resident_id):
        # Implement the logic to delete a resident by ID from the database.
        cur = mysql.connection.cursor()
        cur.execute("DELETE FROM resident WHERE id = %s", (resident_id,))
        mysql.connection.commit()
        cur.close()

        return {'message': 'Resident deleted successfully'}

class Login(Resource):
    def post(self):
        data = request.get_json()
        if data['username'] == 'your_username' and data['password'] == 'your_password':
            # Authentication successful, you can generate a token or session here.
            return {'message': 'Login successful'}, 200
        else:
            return {'message': 'Login failed'}, 401

api.add_resource(Floor, '/api/floor', '/api/floor/<int:floor_id>')
api.add_resource(Room, '/api/room', '/api/room/<int:room_id>')
api.add_resource(Resident, '/api/resident', '/api/resident/<int:resident_id>')
api.add_resource(Login, '/api/login')