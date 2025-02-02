# api/symptom-analyzer/medical-results.py
import json
import datetime
import sys
import os
import traceback
import time

try:
    from mira_sdk import MiraClient, Flow
except ImportError:
    print("Error: mira_sdk not found. Please install it using: pip install mira_sdk", file=sys.stderr)
    sys.exit(1)

try:
    from pymongo import MongoClient
    from bson.objectid import ObjectId
except ImportError:
    print("Error: pymongo not found. Please install it using: pip install pymongo", file=sys.stderr)
    sys.exit(1)

def evaluate_response(response):
    try:
        score = 0
        if response and len(str(response)) > 50:
            score += 50
        if "recommended" in str(response).lower():
            score += 25
        if "treatment" in str(response).lower():
            score += 25
        return min(score, 100)
    except Exception as e:
        print(f"Error in evaluate_response: {str(e)}", file=sys.stderr)
        return 0

def get_user_info_from_mongodb(user_id):
    # MongoDB connection string from environment variable or use the default
    MONGODB_URI = os.getenv('MONGODB_URI', "mongodb+srv://Naish:neutrons123@dotslash8.7ifhs.mongodb.net/?retryWrites=true&w=majority&appName=DotSlash8")
    client = None
    start_time = time.time()
    
    try:
        print(f"Connecting to MongoDB with URI: {MONGODB_URI}")
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)  # 5 second timeout for server selection
        
        # Test the connection
        client.admin.command('ping')
        print(f"Successfully connected to MongoDB in {time.time() - start_time:.2f} seconds")
        
        db = client['test']
        user_info_collection = db['userinfos']
        
        # Print debug information
        print(f"Searching for user with ID: {user_id}")
        
        # Convert string ID to ObjectId
        user_info = user_info_collection.find_one({
            "_id": ObjectId(user_id)
        })
        
        if not user_info:
            print(f"User info not found for ID: {user_id}", file=sys.stderr)
            raise Exception("User info not found")
            
        print(f"Found user info in {time.time() - start_time:.2f} seconds")
        
        # Map MongoDB fields to input data format
        input_data = {
            "age": str(user_info.get('age', '')),
            "gender": user_info.get('gender', ''),
            "purpose": user_info.get('purpose', ''),
            "language": user_info.get('language', ''),
            "location": user_info.get('location', ''),
            "severity": user_info.get('severity', ''),
            "symptoms": user_info.get('symptoms', ''),
            "allergies": user_info.get('allergies', ''),
            "medical_history": user_info.get('medical_history', ''),
            "emergency_contact": user_info.get('emergency_contact', '')
        }
        
        return input_data
    except Exception as e:
        print(f"Error in get_user_info_from_mongodb after {time.time() - start_time:.2f} seconds: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        raise
    finally:
        if client:
            client.close()
            print(f"MongoDB connection closed after {time.time() - start_time:.2f} seconds")

def save_results(data, is_error=False):
    try:
        script_dir = os.path.dirname(os.path.abspath(__file__))
        results_path = os.path.join(script_dir, 'medical_results.json')
        
        print(f"Saving {'error' if is_error else 'results'} to: {results_path}")
        with open(results_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            
        print(f"Successfully saved {'error' if is_error else 'results'} to file")
    except Exception as e:
        print(f"Error saving results: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        raise

def main():
    start_time = time.time()
    try:
        if len(sys.argv) != 2:
            raise Exception("Error: User ID required")
            
        user_id = sys.argv[1]
        print(f"Processing data for user ID: {user_id}")
        
        # Initialize Mira client
        print("Initializing Mira client...")
        client = MiraClient(config={"API_KEY": "sb-f9b53bd9a74ee43710e1efbfd3fbbaaa"})
        version = "0.1.1"
        print(f"Mira client initialized successfully in {time.time() - start_time:.2f} seconds")
        
        # Get user data from MongoDB
        print("Fetching user data from MongoDB...")
        input_data = get_user_info_from_mongodb(user_id)
        print(f"Retrieved input data in {time.time() - start_time:.2f} seconds")
        
        # Execute Mira flow
        flow_name = f"@shivam/medical-assistance-ai-flow/{version}"
        print(f"Executing Mira flow: {flow_name}")
        
        mira_start_time = time.time()
        result = client.flow.execute(flow_name, input_data)
        print(f"Mira flow completed in {time.time() - mira_start_time:.2f} seconds")
        print(f"Mira flow result: {result}")
        
        if not result:
            raise Exception("Empty response from Mira AI")
        
        # Evaluate response
        evaluation_score = evaluate_response(result)
        
        # Prepare output
        enhanced_result = {
            "response": result,
            "metadata": {
                "evaluation_score": evaluation_score,
                "version": version,
                "timestamp": datetime.datetime.now().isoformat(),
                "user_id": str(user_id),
                "processing_time": f"{time.time() - start_time:.2f} seconds"
            }
        }
        
        # Save results
        save_results(enhanced_result)
        print(f"Processing completed successfully in {time.time() - start_time:.2f} seconds")
            
    except Exception as e:
        print(f"Error in main after {time.time() - start_time:.2f} seconds: {str(e)}", file=sys.stderr)
        print(f"Traceback: {traceback.format_exc()}", file=sys.stderr)
        
        error_data = {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "timestamp": datetime.datetime.now().isoformat(),
            "user_id": str(user_id) if 'user_id' in locals() else None,
            "processing_time": f"{time.time() - start_time:.2f} seconds"
        }
        
        # Save error data
        save_results(error_data, is_error=True)
        sys.exit(1)

if __name__ == "__main__":
    main()