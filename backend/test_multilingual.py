import pytest
import os
from app import app, init_db, SessionLocal, ChatLog

@pytest.fixture
def client():
    # Use a temporary database for testing to avoid polluting the main one
    app.config['TESTING'] = True
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' # Use in-memory DB
    
    with app.test_client() as client:
        with app.app_context():
            init_db()
            yield client

def test_chat_sudi_mixed_lang(client):
    """Test Saudi Mixed (Arabizi) response"""
    payload = {
        "message": "Is the price good?", 
        "culture": "Saudi (Formal)"
    }
    rv = client.post('/api/chat', json=payload)
    json_data = rv.get_json()
    assert rv.status_code == 200
    assert "filus" in json_data['response']  # Expecting mixed AR/EN keyword

def test_chat_saudi_arabic_lang(client):
    """Test Saudi Pure Arabic response"""
    payload = {
        "message": "كم السعر؟", 
        "culture": "Saudi (Formal)"
    }
    rv = client.post('/api/chat', json=payload)
    json_data = rv.get_json()
    assert "بِالتَّكْلِفَةِ" in json_data['response'] # Expecting Arabic keyword

def test_chat_universal_arabic_fallback(client):
    """Test Universal model fallback with Arabic input"""
    payload = {
        "message": "سعر", # "Price"
        "culture": "Universal"
    }
    rv = client.post('/api/chat', json=payload)
    json_data = rv.get_json()
    # Expecting: "يتم تطبيق نموذج التسعير القياسي..."
    assert "التسعير القياسي" in json_data['response']

def test_language_detection_french(client):
    """Test Simple Language detection (French)"""
    payload = {
        "message": "Bonjour, le prix?", 
        "culture": "Universal"
    }
    rv = client.post('/api/chat', json=payload)
    json_data = rv.get_json()
    assert "tarification" in json_data['response'] # Expecting French response
