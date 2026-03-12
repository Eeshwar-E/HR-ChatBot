import openai
import os

openai.api_key = os.getenv('OPENAI_API_KEY', 'your-api-key-here')

def is_api_key_valid():
    try:
        # Make a simple test request
        response = openai.Completion.create(
            engine="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "This is a test."}],
            max_tokens=5
        )
    except Exception as e:
        return e
    else:
        return True

api_key_valid = is_api_key_valid()
print("API key is valid:", api_key_valid)
