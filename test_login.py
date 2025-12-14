# Test admin login
import requests
import json

API = "http://localhost:4000/api"

print("\n" + "="*50)
print("TESTING ADMIN LOGIN")
print("="*50 + "\n")

try:
    data = {"email": "admin@example.com", "password": "admin123"}
    print("Sending login request...")
    print(f"Email: {data['email']}")
    print(f"Password: {data['password']}\n")
    
    response = requests.post(f"{API}/auth/login", json=data)
    result = response.json()
    
    print(f"Response Status: {response.status_code}\n")
    
    if "token" in result:
        print("[SUCCESS] Admin login working!")
        print(f"\nToken: {result['token'][:50]}...")
        print(f"\nUser Info:")
        print(f"  Email: {result['user']['email']}")
        print(f"  Role: {result['user']['role']}")
        print(f"\n[READY] You can now login at http://localhost:3000/login")
    else:
        print("[ERROR] Login failed!")
        print(json.dumps(result, indent=2))
        
except Exception as e:
    print(f"[ERROR] {str(e)}")

print("\n" + "="*50 + "\n")
