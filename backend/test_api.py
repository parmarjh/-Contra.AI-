import pytest
import os
from app import app, init_db, SessionLocal, ChatLog

@pytest.fixture
def client():
    # Configure app for testing
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Use in-memory DB for tests
    
    with app.test_client() as client:
        with app.app_context():
            init_db()
        yield client

def test_status_endpoint(client):
    """Ensure the API is running and reachable."""
    rv = client.get('/api/status')
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert json_data['status'] == 'ok'

def test_chat_valid_response(client):
    """Test a standard chat interaction."""
    payload = {
        "message": "hello",
        "culture": "Universal"
    }
    rv = client.post('/api/chat', json=payload)
    assert rv.status_code == 200
    json_data = rv.get_json()
    assert "response" in json_data
    # Check if the fallback response logic works
    assert "Understood" in json_data['response'] or "processed" in json_data['response']

def test_chat_culture_specific(client):
    """Test culture-specific logic (Japanese)."""
    payload = {
        "message": "I hate this price",
        "culture": "Japanese (Keigo)"
    }
    rv = client.post('/api/chat', json=payload)
    assert rv.status_code == 200
    json_data = rv.get_json()
    # Should trigger the specific Japanese logic for 'price' or 'hate'
    # "We deeply apologize..."
    assert "apologize" in json_data['response'] or "honored" in json_data['response']

def test_chat_missing_input(client):
    """Test error handling for missing input."""
    rv = client.post('/api/chat', json={})
    assert rv.status_code == 400
    assert "error" in rv.get_json()

def test_database_logging(client):
    """Verify that interactions are logged to the database."""
    payload = {"message": "Test Message", "culture": "Test Culture"}
    client.post('/api/chat', json=payload)
    
    # Check DB
    session = SessionLocal()
    log = session.query(ChatLog).order_by(ChatLog.id.desc()).first()
    assert log is not None
    assert log.user_input == "Test Message"
    session.close()
